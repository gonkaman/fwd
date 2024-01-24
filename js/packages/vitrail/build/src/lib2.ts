
/**
 * Core concepts
 */

export type Filter<U,V> = (arg: U) => V;
export type Task<T> = [Filter<T,T>, ...string[]];
export type Connector<TParent,TArg,TChild> = <T extends TParent, U extends TArg, V extends TChild>(filter: Filter<U,V>) => Task<T>
export type Branch<TParent,U,V> = <T extends TParent>(connect: ((filter: Filter<U,V>) => Task<T>)) => Task<T>; //Filter<U,V>; //() => [Filter<U,V>, ...Task<V>[]]
export type Adapter<TParent, U, T, TConvert> = <K extends TConvert>(...args: (Task<T> | K)[]) => Branch<TParent,U,T>;

export type Lookup<T> = Filter<void,T|null|undefined>;
export type Curator<T> = (lookup: Lookup<T>) => void; 
export type Store<T> = [Curator<T>, Lookup<T>];
export type Query = Store<[string, unknown][]>;


/**
 * DOM Manipulation
 */

export type NodeTask<T,U> = Task<[T,U]>;
export type NodeFactory<PDoc,TNode,TDoc> = <TArg extends PDoc, T extends TNode, U extends TDoc>(doc: TArg, tag: string) => [T,U];
export type NodeConnector<T,TDoc,V,VDoc> = Connector<[T,TDoc],TDoc,[V,VDoc]>; //<T extends TNode, U extends TDoc, V extends TChild>(filter: Filter<U,[V,U]>) => NodeTask<T,U>
export type NodeBranch<TNode,TDoc,TChild,VDoc> = Branch<[TNode,TDoc],TDoc,[TChild,VDoc]>; //<T extends TNode>(connect: ((filter: Filter<U,[V,U]>) => NodeTask<T,U>)) => NodeTask<T,U>;
export type NodeAdapterArg<T,TDoc,V,VDoc,TConvert> = (NodeTask<T,TDoc> | TConvert | NodeBranch<T,TDoc,V,VDoc>)[];
export type NodeAdapterArgsFormater<TNode,TDoc,TChild, VDoc, TConvert> = 
    <T extends TNode, V extends TChild>(connector: NodeConnector<T,TDoc,V,VDoc>) => (args: NodeAdapterArg<T,TDoc,V,VDoc,TConvert>) => NodeTask<T,TDoc>[];
export type NodeAdapter<P,PDoc,T,TDoc,V,VDoc,TConvert> = Adapter<[P,PDoc],PDoc,[T,TDoc],TConvert | NodeBranch<T,TDoc,V,VDoc>>; 

export type NodePicker<T,U> = Lookup<[T,U]>; // () => [T,U] | null;
export type NodeRenderer<TNode,TDoc> = <T extends TNode, U extends TDoc>(lookup: NodePicker<T,U>, ...tasks: NodeTask<T,U>[]) => NodePicker<T,U>;

const createDOMAdapter = <P,PDoc,T,TDoc,V,VDoc,TConvert>(
    tagName: string,
    factory: NodeFactory<PDoc,T,TDoc>, 
    connector: NodeConnector<T,TDoc,V,VDoc>,
    format: NodeAdapterArgsFormater<T,TDoc,V,VDoc,TConvert>
): NodeAdapter<P,PDoc,T,TDoc,V,VDoc,TConvert> => 
    (...args: NodeAdapterArg<T,TDoc,V,VDoc,TConvert>): NodeBranch<P,PDoc,T,TDoc> => {
        const tasks = format(connector)(args).map(entry => entry[0]);
        const build: Filter<PDoc,[T,TDoc]> = (doc: PDoc) => tasks.reduce((node, task) => task(node), factory(doc, tagName));
        return <TParent extends [P,PDoc]>(connect: ((filter: Filter<PDoc,[T,TDoc]>) => Task<TParent>)):Task<TParent> => connect(build);
    }
    

const textFactory: NodeFactory<Document | XMLDocument, Text, Document> = <T extends Text, U extends Document>(doc: Document, _: string) => 
    [doc.createTextNode('') as T, doc as U];

const htmlElementFactory: NodeFactory<Document, HTMLElement, Document> = <T extends HTMLElement, U extends Document>(doc: Document, tagName: string) => 
    [doc.createElement(tagName) as T, doc as U];

const svgElementFactory: NodeFactory<Document, SVGElement, XMLDocument> = <T extends SVGElement, U extends XMLDocument>(doc: XMLDocument, tagName: string) => 
    [doc.createElementNS("http://www.w3.org/2000/svg", tagName) as T, doc as U];

const mathElementFactory: NodeFactory<Document, MathMLElement, XMLDocument> = <T extends MathMLElement, U extends XMLDocument>(doc: XMLDocument, tagName: string) => 
    [doc.createElementNS("http://www.w3.org/1998/Math/MathML", tagName) as T, doc as U];

const appendConnector: NodeConnector<Node, Document, Node, Document> = 
    <T extends [Node, Document], TArg extends Document, V extends [Node,Document]>(filter: Filter<TArg,V>): Task<T> => [
        (entry: T) => {
            entry[0].appendChild(filter(entry[1] as TArg)[0]);
            return entry;
        }
    ];

const prependConnector: NodeConnector<Element, Document, Node, Document> = 
    <T extends [Element, Document], TArg extends Document, V extends [Node,Document]>(filter: Filter<TArg,V>): Task<T> => [
        (entry: T) => {
            entry[0].prepend(filter(entry[1] as TArg)[0]);
            return entry;
        }
    ];

const noConnector: NodeConnector<Node, Document, Node | undefined, Document> = 
    <T extends [Node, Document], U extends Document, V extends [Node | undefined, Document]>(_: Filter<U,V>): Task<T> => [
        (entry: T) => entry
    ];

const formatAdapterArgs: NodeAdapterArgsFormater<Node, Document, Node | undefined, Document, string> = 
    <T extends Node, V extends Node | undefined>(connector: NodeConnector<T,Document,V,Document>) => 
    (args: NodeAdapterArg<T,Document,V,Document,string>): NodeTask<T,Document>[] => 
        args.map(arg => {
            if(typeof arg === 'function') return arg(connector);
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

export const text = createDOMAdapter<
    Element, Document, 
    Text, Document, 
    undefined, Document, 
    string
>('', textFactory, noConnector, formatAdapterArgs);

// export const div = createDOMAdapter<
//     HTMLElement, Document, 
//     HTMLDivElement, Document, 
//     HTMLElement | Text, Document, 
//     string
// >('div', htmlElementFactory, appendConnector, formatAdapterArgs);

// export const svg = createDOMAdapter<
//     HTMLElement | SVGElement, Document, 
//     SVGSVGElement, XMLDocument, 
//     SVGElement | Text, XMLDocument, 
//     string
// >('svg', svgElementFactory, appendConnector, formatAdapterArgs);

// export const math = createDOMAdapter<
//     HTMLElement, Document, 
//     MathMLElement, XMLDocument, 
//     MathMLElement | Text, XMLDocument, 
//     string
// >('math', mathElementFactory, appendConnector, formatAdapterArgs);

export const append = <T extends Node, U extends Document>(branch: NodeBranch<T,U,Node,Document>): NodeTask<T,U> => branch(appendConnector);

export const appendTo = <T extends Node, V extends Node, U extends Document>(lookup: NodePicker<V,U>): NodeTask<T,U> => [
    (entry: [T,U]) => {
        lookup()?.[0].appendChild(entry[0]);
        return entry;
    }
]

export const prepend = <T extends Element, U extends Document>(branch: NodeBranch<T,U,Node,Document>): NodeTask<T,U> => branch(prependConnector);

export const prependTo = <T extends Node, V extends Element, U extends Document>(lookup: NodePicker<V,U>): NodeTask<T,U> => [
    (entry: [T,U]) => {
        lookup()?.[0].prepend(entry[0]);
        return entry;
    }
]

export type PropertyValueType = string | ((previousValue: string | null) => string) | undefined;
export type PropertyAdapter = <T extends Element, U extends Document>(value: PropertyValueType) => NodeTask<T,U>;

export type DataPropertyValueType = string | ((previousValue?: string) => string) | undefined;
export type CssValueType = string | ((previousValue: string) => string);

export const setProp = <T extends Element, U extends Document>(key: string, value: PropertyValueType): NodeTask<T, U> => [
    value === undefined ?
        (entry: [T,U]) => { entry[0][key] = null; return entry; } :
        typeof value === 'function' ?
            (entry: [T,U]) => { entry[0][key] = value(entry[0][key]); return entry; } :
            (entry: [T,U]) => { entry[0][key] = value; return entry; }
];
export const removeProp = <T extends Element, U extends Document>(adapter: PropertyAdapter): NodeTask<T,U> => adapter(undefined);

export const getProp = <T extends Element, U extends Document>(name: string, key?: string): Filter<[T,U],[string, unknown][]> =>
    (entry: [T,U]) => ([[key || name, entry[0][name]]] as [string, unknown][]);


export const setAttr = <T extends Element, U extends Document>(key: string, value: PropertyValueType): NodeTask<T, U> => [
    value === undefined ?
        (entry: [T,U]) => { entry[0].removeAttribute(key); return entry; } :
        typeof value === 'function' ?
            (entry: [T,U]) => { entry[0].setAttribute(key, value(entry[0].getAttribute(key))); return entry; } :
            (entry: [T,U]) => { entry[0].setAttribute(key, value); return entry; }
];

//general attributes (includes micordata attributes)
export const removeAttr = <T extends Element, U extends Document>(key: string): NodeTask<T,U> =>
    [(entry: [T,U]) => { entry[0].removeAttribute(key); return entry; }];

export const getAttr = <T extends Element, U extends Document>(name: string, key?: string): Filter<[T,U],[string, unknown][]> =>
    (entry: [T,U]) => ([[key || name, entry[0].getAttribute(name)]] as [string, unknown][]);

//aria attributes
export const setAria = <T extends Element, U extends Document>(key: string, value: PropertyValueType): NodeTask<T, U> => attr('aria-'+key, value);
export const removeAria = <T extends Element, U extends Document>(key: string): NodeTask<T,U> => removeAttr('aria-'+key);
export const getAria = <T extends Element, U extends Document>(name: string, key?: string): Filter<[T,U],[string, unknown][]> => getAttr('aria-'+name, key);


//data attributes
export const setData = <T extends HTMLElement, U extends Document>(key: string, value: DataPropertyValueType): NodeTask<T, U> => [
    value === undefined ?
        (entry: [T,U]) => { delete entry[0].dataset[key]; return entry; } :
        typeof value === 'function' ?
            (entry: [T,U]) => { entry[0].dataset[key] = value(entry[0].dataset[key]); return entry; } :
            (entry: [T,U]) => { entry[0].dataset[key] = value; return entry; }
];

export const removeData = <T extends HTMLElement, U extends Document>(key: string): NodeTask<T,U> => setData(key, undefined);

export const getData = <T extends HTMLElement, U extends Document>(name: string, key?: string): Filter<[T,U],[string, unknown][]> =>
    (entry: [T,U]) => ([[key || name, entry[0].dataset[name]]] as [string, unknown][]);

//style attributes
export const setStyle = <T extends HTMLElement, U extends Document>(key: string, value: DataPropertyValueType): NodeTask<T, U> => [
    value === undefined ?
        (entry: [T,U]) => { entry[0].style[key] = null; return entry; } :
        typeof value === 'function' ?
            (entry: [T,U]) => { entry[0].style[key] = value(entry[0].style[key]); return entry; } :
            (entry: [T,U]) => { entry[0].style[key] = value; return entry; }
];

export const setCss = <T extends HTMLElement, U extends Document>(value: CssValueType): NodeTask<T, U> => [
    typeof value === 'function' ?
            (entry: [T,U]) => { entry[0].style.cssText = value(entry[0].style.cssText); return entry; } :
            (entry: [T,U]) => { entry[0].style.cssText = value; return entry; }
];

export const removeStyle = <T extends HTMLElement, U extends Document>(key: string): NodeTask<T,U> => setStyle(key, undefined);

export const getStyle = <T extends HTMLElement, U extends Document>(name: string, key?: string): Filter<[T,U],[string, unknown][]> =>
    (entry: [T,U]) => ([[key || name, entry[0].style[name]]] as [string, unknown][]);


//events
export const subscribe = <T extends EventTarget, U extends Document>(
    eventType: string, 
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => [
    (entry: [T,U]) => { entry[0].addEventListener(eventType, listener, options); return entry; }
]

export const unsubscribe = <T extends EventTarget, U extends Document>(
    eventType: string, 
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => [
    (entry: [T,U]) => { entry[0].removeEventListener(eventType, listener, options); return entry; }
]


//__GENERATED_ADAPTERS__//


//__GENERATED_TASKS__//

