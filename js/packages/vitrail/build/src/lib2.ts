
/**
 * Core concepts
 */

export type Filter<U,V> = (arg: U) => V;
export type Task<T> = [Filter<T,T>, ...string[]];
export type Branch<U,V> = Filter<U,V>; //() => [Filter<U,V>, ...Task<V>[]]
export type Adapter<T, U, TConvert> = <K extends TConvert>(...args: (Task<T> | K)[]) => Branch<U,T>;

export type Lookup<T> = Filter<void,T|null|undefined>;
export type Curator<T> = (lookup: Lookup<T>) => void; 
export type Store<T> = [Curator<T>, Lookup<T>];
export type Query = Store<[string, unknown][]>;


/**
 * DOM Manipulation
 */

export type NodeFactory<TNode, TDoc> = <T extends TNode, U extends TDoc>(doc: U, tag: string) => [T,U];
export type NodeBranch<T,U> = Branch<U, [T,U]>;
export type NodeTask<T,U> = Task<[T,U]>;
export type NodeConnector<TNode,TChild,U> = <T extends TNode, V extends TChild>(branch: NodeBranch<V,U>) => NodeTask<T,U>;
export type NodeAdapterArg<T,TChild,TConvert,U> = (NodeTask<T,U> | TConvert | NodeBranch<TChild,U>)[];
export type NodeAdapterArgsFormater<TNode,TChild,TConvert,U> = <T extends TNode, V extends TChild>(connector: NodeConnector<T,V,U>) => (args: NodeAdapterArg<T,V,TConvert,U>) => NodeTask<T,U>[];
export type NodeAdapter<T,TChild,TConvert,U> = Adapter<[T,U], U, TConvert | NodeBranch<TChild,U>>; 

export type NodePicker<T,U> = Lookup<[T,U]>; // () => [T,U] | null;
export type NodeRenderer<TNode,TDoc> = <T extends TNode, U extends TDoc>(lookup: NodePicker<T,U>, ...tasks: NodeTask<T,U>[]) => NodePicker<T,U>;

const createDOMAdapter = <TDoc extends Document, TNode extends Node, TChild extends Node | undefined, TConvert>(
    tagName: string,
    factory: NodeFactory<TNode,TDoc>, 
    connector: NodeConnector<TNode,TChild,TDoc>,
    format: NodeAdapterArgsFormater<TNode,TChild,TConvert,TDoc>
): NodeAdapter<TNode,TChild,TConvert,TDoc> => 
    (...args: NodeAdapterArg<TNode,TChild,TConvert,TDoc>): NodeBranch<TNode,TDoc> => {
        const tasks = format(connector)(args).map(entry => entry[0]);
        return (doc: TDoc) => tasks.reduce((node, task) => task(node), factory(doc, tagName));
    }
    

const textFactory: NodeFactory<Text, Document> = <T extends Text, U extends Document>(doc: Document, _: string) => 
    [doc.createTextNode('') as T, doc as U];

const htmlElementFactory: NodeFactory<HTMLElement, Document> = <T extends HTMLElement, U extends Document>(doc: Document, tagName: string) => 
    [doc.createElement(tagName) as T, doc as U];

const svgElementFactory: NodeFactory<SVGElement, XMLDocument> = <T extends SVGElement, U extends XMLDocument>(doc: XMLDocument, tagName: string) => 
    [doc.createElementNS("http://www.w3.org/2000/svg", tagName) as T, doc as U];

const mathElementFactory: NodeFactory<MathMLElement, XMLDocument> = <T extends MathMLElement, U extends XMLDocument>(doc: XMLDocument, tagName: string) => 
    [doc.createElementNS("http://www.w3.org/1998/Math/MathML", tagName) as T, doc as U];

const appendConnector: NodeConnector<Node, Node, Document> = <U extends Node, V extends Node>(branch: NodeBranch<V, Document>): NodeTask<U, Document> => [
        (entry: [U,Document]) => {
            entry[0].appendChild(branch(entry[1])[0]);
            return entry;
        }
    ];

const noConnector: NodeConnector<Node, Node | undefined, Document> = <U extends Node, V extends Node | undefined>(_: NodeBranch<V, Document>): NodeTask<U, Document> => [
        (entry: [U,Document]) => entry
    ];

const formatAdapterArgs: NodeAdapterArgsFormater<Node, Node | undefined, string, Document> = <T extends Node, V extends Node | undefined>(connector: NodeConnector<T,V,Document>) => 
(args: NodeAdapterArg<T,V,string,Document>): NodeTask<T,Document>[] => 
    args.map(arg => {
        if(typeof arg === 'function') return connector(arg);
        if(typeof arg === 'string') return [
            (entry: [T,Document]) => {
                entry[0].appendChild(entry[1].createTextNode(arg));
                return entry;
            }
        ];
        return arg;
    });

export const getElement = <T extends Element, U extends Document>(query: string, container: Document | Element): NodePicker<T,U> => () => {
    const node = container.querySelector(query);
    return node == null ? node : [node as T, node.ownerDocument as U];
} 

export const fromElement = <T extends Element, U extends Document>(node: Element): NodePicker<T,U> => () => [node as T,node.ownerDocument as U];

export const render : NodeRenderer<Element,Document> = <T extends Element, U extends Document>( lookup: NodePicker<T,U>, ...tasks: NodeTask<T,U>[]): NodePicker<T,U> => () => {
    const target = lookup();
    return target == null ? target : tasks.map(task => task[0]).reduce((node, task) => task(node), target);
}

export const createRef = <T extends Node,U extends Document>(): Store<[T,U]> => {
    let innerLookup: Lookup<[T,U]> = () => null;
    return [
        (lookup: Lookup<[T,U]>) => { innerLookup = lookup; },
        () => innerLookup()
    ];
}

export const createQuery = (): Query => {
    const registeredLookups: Lookup<[string, unknown][]>[] = [];
    return [
        (lookup: Lookup<[string, unknown][]>) => { registeredLookups.push(lookup); },
        () => registeredLookups.reduce((entries: [string, unknown][], lookup) => entries.concat(lookup() ?? []), [])
    ]
}

export const store = <T extends Node,U extends Document>(curator: Curator<[T,U]>): NodeTask<T,U> => [
    (entry: [T,U]) => {
        curator(() => entry);
        return entry;
    }
]

export const query = <T extends Node,U extends Document>(curator: Curator<[string, unknown][]>, ...queries: Filter<[T,U],[string, unknown][]>[]): NodeTask<T,U> => [
    (entry: [T,U]) => {
        curator(() => queries.reduce((entries: [string, unknown][], query) => entries.concat(query(entry)), []));
        return entry;
    }
]

export const text = createDOMAdapter<Document, Text, undefined, string>('', textFactory, noConnector, formatAdapterArgs);

// export const div = createDOMAdapter<Document, HTMLDivElement, HTMLElement | Text, string>('div', htmlElementFactory, appendNode, formatAdapterArgs);
// export const svg = createDOMAdapter<XMLDocument, SVGElement, SVGElement | Text, string>('svg', svgElementFactory, appendNode, formatAdapterArgs);
// export const math = createDOMAdapter<XMLDocument, MathMLElement, MathMLElement | Text, string>('math', svgElementFactory, appendNode, formatAdapterArgs);

export const append = <T extends Node, V extends Node, U extends Document>(branch: NodeBranch<V,U>): NodeTask<T,U> => [
    (entry: [T,U]) => {
        entry[0].appendChild(branch(entry[1])[0]);
        return entry;
    }
]

export const appendTo = <T extends Node, V extends Node, U extends Document>(lookup: NodePicker<V,U>): NodeTask<T,U> => [
    (entry: [T,U]) => {
        lookup()?.[0].appendChild(entry[0]);
        return entry;
    }
]

export const prepend = <T extends Element, V extends Node, U extends Document>(branch: NodeBranch<V,U>): NodeTask<T,U> => [
    (entry: [T,U]) => {
        entry[0].prepend(branch(entry[1])[0]);
        return entry;
    }
]

export const prependTo = <T extends Node, V extends Element, U extends Document>(lookup: NodePicker<V,U>): NodeTask<T,U> => [
    (entry: [T,U]) => {
        lookup()?.[0].prepend(entry[0]);
        return entry;
    }
]


//__GENERATED_ADAPTERS__//



export type AttributeValueType = string | ((previousValue: string | null) => string) | undefined;
export type AttributeAdapter = <T extends Element, U extends Document>(value: AttributeValueType) => NodeTask<T,U>;
export const attr = <T extends Element, U extends Document>(key: string, value: AttributeValueType): NodeTask<T, U> => [
    value === undefined ?
        (entry: [T,U]) => { entry[0].removeAttribute(key); return entry; } :
        typeof value === 'function' ?
            (entry: [T,U]) => { entry[0].setAttribute(key, value(entry[0].getAttribute(key))); return entry; } :
            (entry: [T,U]) => { entry[0].setAttribute(key, value); return entry; }
];

export const removeAttr = <T extends Element, U extends Document>(key: string | AttributeAdapter): NodeTask<T,U> => typeof key === 'string' ? 
    [(entry: [T,U]) => { entry[0].removeAttribute(key); return entry; }] : key(undefined);

export const getAttr = <T extends Element, U extends Document>(name: string, key?: string): Filter<[T,U],[string, unknown][]> =>
    (entry: [T,U]) => ([[key || name, entry[0].getAttribute(name)]] as [string, unknown][]);

//__GENERATED_TASKS__//

