//@@ Filter @@//
export type Filter<U,V> = (arg: U) => V;

//@@ Task > Filter @@//
export type Task<T> = [Filter<T,T>, ...string[]];

//@@ Connector > Task @@//
export type Connector<TParent,TArg,TChild> = <T extends TParent, U extends TArg, V extends TChild>(filter: Filter<U,V>) => Task<T>

//@@ Branch > Task @@//
export type Branch<TParent,U,V> = <T extends TParent>(connect: ((filter: Filter<U,V>) => Task<T>)) => Task<T>; 

//@@ Adapter > Task, Branch @@//
export type Adapter<TParent, U, T, TConvert> = <K extends TConvert>(...args: (Task<T> | K)[]) => Branch<TParent,U,T>;

//@@ NodeTask > Task @@//
export type NodeTask<T,U> = Task<[T,U]>;

//@@ NodeFactory @@//
export type NodeFactory<PDoc,TNode,TDoc> = <TArg extends PDoc, T extends TNode, U extends TDoc>(doc: TArg, tag: string) => [T,U];

//@@ NodeConnector > Connector @@//
export type NodeConnector<T,TDoc,V,VDoc> = Connector<[T,TDoc],TDoc,[V,VDoc]>; 

//@@ NodeBranch > Branch @@//
export type NodeBranch<TNode,TDoc,TChild,VDoc> = Branch<[TNode,TDoc],TDoc,[TChild,VDoc]>; 

//@@ NodeAdapterArg > NodeTask, NodeBranch @@//
export type NodeAdapterArg<T,TDoc,V,VDoc,TConvert> = (NodeTask<T,TDoc> | TConvert | NodeBranch<T,TDoc,V,VDoc>)[];

//@@ NodeAdapterArgsFormater > NodeConnector, NodeAdapterArg, NodeTask @@//
export type NodeAdapterArgsFormater<TNode,TDoc,TChild, VDoc, TConvert> = 
    <T extends TNode, V extends TChild>(connector: NodeConnector<T,TDoc,V,VDoc>) => (args: NodeAdapterArg<T,TDoc,V,VDoc,TConvert>) => NodeTask<T,TDoc>[];

//@@ NodeAdapter > Adapter, NodeBranch @@//
export type NodeAdapter<P,PDoc,T,TDoc,V,VDoc,TConvert> = Adapter<[P,PDoc],PDoc,[T,TDoc],TConvert | NodeBranch<T,TDoc,V,VDoc>>; 

//@@ createDOMAdapter > NodeFactory, NodeConnector, NodeAdapterArgsFormater, NodeAdapter, NodeAdapterArg, NodeBranch @@//
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

//@@ Lookup > Filter @@//
export type Lookup<T> = Filter<void,T|null|undefined>;

//@@ Curator > Lookup @@//
export type Curator<T> = (lookup: Lookup<T>) => void; 

//@@ Store > Curator, Lookup @@//
export type Store<T> = [Curator<T>, Lookup<T>];

//@@ Query > Store @@//
export type Query = Store<[string, unknown][]>;


//@@ NodePicker > Lookup @@//
export type NodePicker<T,U> = Lookup<[T,U]>;

//@@ NodeRenderer > NodePicker, NodeTask @@//
export type NodeRenderer<TNode,TDoc> = <T extends TNode, U extends TDoc>(lookup: NodePicker<T,U>, ...tasks: NodeTask<T,U>[]) => NodePicker<T,U>;

//@@ textNodeFactory > NodeFactory @@//
const textNodeFactory: NodeFactory<Document | XMLDocument, Text, Document> = <T extends Text, U extends Document>(doc: Document, _: string) => 
    [doc.createTextNode('') as T, doc as U];

//@@ htmlNodeFactory > NodeFactory @@//
const htmlNodeFactory: NodeFactory<Document, HTMLElement, Document> = <T extends HTMLElement, U extends Document>(doc: Document, tagName: string) => 
    [doc.createElement(tagName) as T, doc as U];

//@@ svgNodeFactory > NodeFactory @@//
const svgNodeFactory: NodeFactory<Document, SVGElement, XMLDocument> = <T extends SVGElement, U extends XMLDocument>(doc: XMLDocument, tagName: string) => 
    [doc.createElementNS("http://www.w3.org/2000/svg", tagName) as T, doc as U];

//@@ mathmlNodeFactory > NodeFactory @@//
const mathmlNodeFactory: NodeFactory<Document, MathMLElement, XMLDocument> = <T extends MathMLElement, U extends XMLDocument>(doc: XMLDocument, tagName: string) => 
    [doc.createElementNS("http://www.w3.org/1998/Math/MathML", tagName) as T, doc as U];


//@@ appendNodeConnector > NodeConnector  @@//
const appendNodeConnector: NodeConnector<Node, Document, Node, Document> = 
    <T extends [Node, Document], TArg extends Document, V extends [Node,Document]>(filter: Filter<TArg,V>): Task<T> => [
        (entry: T) => {
            entry[0].appendChild(filter(entry[1] as TArg)[0]);
            return entry;
        }
    ];

//@@ prependNodeConnector > NodeConnector  @@//
const prependNodeConnector: NodeConnector<Element, Document, Node, Document> = 
    <T extends [Element, Document], TArg extends Document, V extends [Node,Document]>(filter: Filter<TArg,V>): Task<T> => [
        (entry: T) => {
            entry[0].prepend(filter(entry[1] as TArg)[0]);
            return entry;
        }
    ];

//@@ noNodeConnector > NodeConnector  @@//
const noNodeConnector: NodeConnector<Node, Document, Node | undefined, Document> = 
    <T extends [Node, Document], U extends Document, V extends [Node | undefined, Document]>(_: Filter<U,V>): Task<T> => [
        (entry: T) => entry
    ];

//@@ formatAdapterArgs > NodeAdapterArgsFormater @@//
const formatAdapterArgs: NodeAdapterArgsFormater<Node | undefined, Document, Node | undefined, Document, string | undefined> = 
    <T extends Node | undefined, V extends Node | undefined>(connector: NodeConnector<T,Document,V,Document>) => 
    (args: NodeAdapterArg<T,Document,V,Document,string | undefined>): NodeTask<T,Document>[] => 
        (args.filter(arg => arg != null) as NodeAdapterArg<T,Document,V,Document,string>).map(arg => {
            if(typeof arg === 'function') return arg(connector);
            if(typeof arg === 'string') return [
                (entry: [T,Document]) => {
                    if(entry[0] != null){
                        try{
                            entry[0].appendChild(entry[1].createTextNode(arg));
                        }catch(e){
                            entry[0].nodeValue = arg; 
                        }
                    }
                    return entry;
                }
            ];
            return arg;
        });

//@@ getElement > NodePicker @@//
export const getElement = <T extends Element, U extends Document>(query: string, container: Document | Element): NodePicker<T,U> => () => {
    const node = container.querySelector(query);
    return node == null ? null : [node as T, node.ownerDocument as U];
} 

//@@ fromElement > NodePicker @@//
export const fromElement = <T extends Element, U extends Document>(node: Element): NodePicker<T,U> => () => [node as T,node.ownerDocument as U];

//@@ render > NodeRenderer @@//
export const render : NodeRenderer<Element,Document> = <T extends Element, U extends Document>( lookup: NodePicker<T,U>, ...tasks: NodeTask<T,U>[]): NodePicker<T,U> => () => {
    const target = lookup();
    return target == null ? target : tasks.map(task => task[0]).reduce((node, task) => task(node), target);
}

//@@ createRef > Store @@//
export const createRef = <T extends Node,U extends Document>(): Store<[T,U]> => {
    let innerLookup: Lookup<[T,U]> = () => null;
    return [
        (lookup: Lookup<[T,U]>) => { innerLookup = lookup; },
        () => innerLookup()
    ];
}

//@@ createQuery > Query @@//
export const createQuery = (): Query => {
    const registeredLookups: Lookup<[string, unknown][]>[] = [];
    return [
        (lookup: Lookup<[string, unknown][]>) => { registeredLookups.push(lookup); },
        () => registeredLookups.reduce((entries: [string, unknown][], lookup) => entries.concat(lookup() ?? []), [])
    ]
}

//@@ store > Curator, NodeTask @@//
export const store = <T extends Node,U extends Document>(curator: Curator<[T,U]>): NodeTask<T,U> => [
    (entry: [T,U]) => {
        curator(() => entry);
        return entry;
    }
]

//@@ query > Curator, NodeTask @@//
export const query = <T extends Node,U extends Document>(curator: Curator<[string, unknown][]>, ...queries: Filter<[T,U],[string, unknown][]>[]): NodeTask<T,U> => [
    (entry: [T,U]) => {
        curator(() => queries.reduce((entries: [string, unknown][], query) => entries.concat(query(entry)), []));
        return entry;
    }
]

//@@ apply > NodeTask @@//
export const apply = <T extends Node, U extends Document>(action: ((tnode: T, udoc: U) => [T,U])): NodeTask<T,U> => [
    (entry: [T,U]) => action(...entry)
]

//@@ elementFactory > htmlNodeFactory, svgNodeFactory, mathmlNodeFactory @@//
const elementFactory = <T extends Element, U extends Document>(doc: Document, tagName: string | [string,string]) => {
    if(typeof tagName === 'string') return htmlNodeFactory(doc, tagName) as unknown as [T,U];
    switch(tagName[1]){
        case 'svg': return svgNodeFactory(doc, tagName[0]) as unknown as [T,U];
        case 'mathml': return mathmlNodeFactory(doc, tagName[0]) as unknown as [T,U];
        default: return htmlNodeFactory(doc, tagName[0]) as unknown as [T,U];
    }
} 

//@@ element > NodeAdapterArg, elementFactory, formatAdapterArgs, appendNodeConnector @@//
export const element = <T extends Element>(
    tagName: string | [string,string], 
    ...args: NodeAdapterArg<T,Document,Node,Document,string | undefined>
): NodeBranch<Element,Document,Element,Document> => {
    const tasks = formatAdapterArgs<T,Node>(appendNodeConnector)(args).map(entry => entry[0]);
    const build: Filter<Document,[T,Document]> = (doc: Document) => tasks.reduce((node, task) => task(node), elementFactory<T,Document>(doc, tagName));
    return <TParent extends [Element,Document]>(connect: ((filter: Filter<Document,[T,Document]>) => Task<TParent>)):Task<TParent> => connect(build);
}

//@@ append > NodeBranch, appendNodeConnector @@//
export const append = <T extends Node, U extends Document>(branch: NodeBranch<T,U,Node,Document>): NodeTask<T,U> => branch(appendNodeConnector);

//@@ prepend > NodeBranch, prependNodeConnector @@//
export const prepend = <T extends Element, U extends Document>(branch: NodeBranch<T,U,Node,Document>): NodeTask<T,U> => branch(prependNodeConnector);

//@@ appendTo > NodePicker, NodeTask @@//
export const appendTo = <T extends Node, V extends Node, U extends Document>(lookup: NodePicker<V,U>): NodeTask<T,U> => [
    (entry: [T,U]) => {
        lookup()?.[0].appendChild(entry[0]);
        return entry;
    }
]

//@@ prependTo > NodePicker, NodeTask @@//
export const prependTo = <T extends Node, V extends Element, U extends Document>(lookup: NodePicker<V,U>): NodeTask<T,U> => [
    (entry: [T,U]) => {
        lookup()?.[0].prepend(entry[0]);
        return entry;
    }
]

//@@ PropertyValueType @@//
export type PropertyValueType = string | ((previousValue: string | null) => string) | undefined;

//@@ PropertyAdapter > PropertyValueType, NodeTask @@//
export type PropertyAdapter = <T extends Node, U extends Document>(value: PropertyValueType) => NodeTask<T,U>;

//@@ DataPropertyValueType @@//
export type DataPropertyValueType = string | ((previousValue?: string) => string) | undefined;

//@@ CssValueType @@//
export type CssValueType = string | ((previousValue: string) => string);

//@@ setProp > PropertyValueType, NodeTask @@//
export const setProp = <T extends Node, U extends Document>(key: string, value: PropertyValueType): NodeTask<T, U> => [
    value === undefined ?
        (entry: [T,U]) => { entry[0][key] = null; return entry; } :
        typeof value === 'function' ?
            (entry: [T,U]) => { entry[0][key] = value(entry[0][key]); return entry; } :
            (entry: [T,U]) => { entry[0][key] = value; return entry; }
];

//@@ removeProp > PropertyAdapter, NodeTask @@//
export const removeProp = <T extends Node, U extends Document>(adapter: PropertyAdapter): NodeTask<T,U> => adapter(undefined);

//@@ getProp > Filter @@//
export const getProp = <T extends Node, U extends Document>(name: string, key?: string): Filter<[T,U],[string, unknown][]> =>
    (entry: [T,U]) => ([[key || name, entry[0][name]]] as [string, unknown][]);


//@@ setAttr > PropertyValueType, NodeTask @@//
export const setAttr = <T extends Element, U extends Document>(key: string, value: PropertyValueType): NodeTask<T, U> => [
    value === undefined ?
        (entry: [T,U]) => { entry[0].removeAttribute(key); return entry; } :
        typeof value === 'function' ?
            (entry: [T,U]) => { entry[0].setAttribute(key, value(entry[0].getAttribute(key))); return entry; } :
            (entry: [T,U]) => { entry[0].setAttribute(key, value); return entry; }
];

//@@ removeAttr > setAttr @@//
export const removeAttr = <T extends Element, U extends Document>(key: string): NodeTask<T,U> => setAttr(key, undefined);

//@@ getAttr > Filter @@//
export const getAttr = <T extends Element, U extends Document>(name: string, key?: string): Filter<[T,U],[string, unknown][]> =>
    (entry: [T,U]) => ([[key || name, entry[0].getAttribute(name)]] as [string, unknown][]);

//@@ setAria > setAttr @@//
export const setAria = <T extends Element, U extends Document>(key: string, value: PropertyValueType): NodeTask<T, U> => setAttr('aria-'+key, value);

//@@ removeAria > removeAttr @@//
export const removeAria = <T extends Element, U extends Document>(key: string): NodeTask<T,U> => removeAttr('aria-'+key);

//@@ getAria > getAttr @@//
export const getAria = <T extends Element, U extends Document>(name: string, key?: string): Filter<[T,U],[string, unknown][]> => getAttr('aria-'+name, key);

//@@ setData > DataPropertyValueType, NodeTask @@//
export const setData = <T extends HTMLElement, U extends Document>(key: string, value: DataPropertyValueType): NodeTask<T, U> => [
    value === undefined ?
        (entry: [T,U]) => { delete entry[0].dataset[key]; return entry; } :
        typeof value === 'function' ?
            (entry: [T,U]) => { entry[0].dataset[key] = value(entry[0].dataset[key]); return entry; } :
            (entry: [T,U]) => { entry[0].dataset[key] = value; return entry; }
];

//@@ removeData > setData @@//
export const removeData = <T extends HTMLElement, U extends Document>(key: string): NodeTask<T,U> => setData(key, undefined);

//@@ getData > Filter @@//
export const getData = <T extends HTMLElement, U extends Document>(name: string, key?: string): Filter<[T,U],[string, unknown][]> =>
    (entry: [T,U]) => ([[key || name, entry[0].dataset[name]]] as [string, unknown][]);

//@@ setStyle > DataPropertyValueType, NodeTask @@//
export const setStyle = <T extends HTMLElement, U extends Document>(key: string, value: DataPropertyValueType): NodeTask<T, U> => [
    value === undefined ?
        (entry: [T,U]) => { entry[0].style[key] = null; return entry; } :
        typeof value === 'function' ?
            (entry: [T,U]) => { entry[0].style[key] = value(entry[0].style[key]); return entry; } :
            (entry: [T,U]) => { entry[0].style[key] = value; return entry; }
];

//@@ setCss > CssValueType, NodeTask @@//
export const setCss = <T extends HTMLElement, U extends Document>(value: CssValueType): NodeTask<T, U> => [
    typeof value === 'function' ?
            (entry: [T,U]) => { entry[0].style.cssText = value(entry[0].style.cssText); return entry; } :
            (entry: [T,U]) => { entry[0].style.cssText = value; return entry; }
];

//@@ removeStyle > setStyle @@//
export const removeStyle = <T extends HTMLElement, U extends Document>(key: string): NodeTask<T,U> => setStyle(key, undefined);

//@@ getStyle > Filter @@//
export const getStyle = <T extends HTMLElement, U extends Document>(name: string, key?: string): Filter<[T,U],[string, unknown][]> =>
    (entry: [T,U]) => ([[key || name, entry[0].style[name]]] as [string, unknown][]);


//@@ subscribe > NodeTask @@//
export const subscribe = <T extends EventTarget, U extends Document>(
    eventType: string, 
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => [
    (entry: [T,U]) => { entry[0].addEventListener(eventType, listener, options); return entry; }
]

//@@ unsubscribe > NodeTask @@//
export const unsubscribe = <T extends EventTarget, U extends Document>(
    eventType: string, 
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => [
    (entry: [T,U]) => { entry[0].removeEventListener(eventType, listener, options); return entry; }
]







//@@ createAdapter > Filter, Connector, Branch, Adapter @@//
// export const createAdapter = <TArg, TTarget, TChild, K>(
//     factory: Filter<TArg, TTarget>,
//     connect: Connector<TTarget, TArg, TChild>,
//     deriveArg: Filter<TTarget, TArg>,
//     convert: Filter<K, Task<TTarget>>
// ): Adapter<TArg, TTarget, K | Branch<TArg, TChild, TTarget>> => 
// <T>(...args: (Task<TTarget> | K | Branch<TArg, TChild, TTarget>)[]): Branch<TArg, TTarget, T> => 
//         (tConnect: Connector<T, TArg, TTarget>, tDerive: Filter<T, TArg>): Task<T> => 
//             tConnect(
//                 args.reduce((filter, arg) => typeof arg === "function" ?
//                     (arg.length == 1 ? 
//                         (ctx: TArg) => (arg as Task<TTarget>)(filter(ctx)) :
//                         (ctx: TArg) => (arg as Branch<TArg, TChild, TTarget>)(connect, deriveArg)(filter(ctx))) :
//                     (ctx: TArg) => convert(arg)(filter(ctx)), factory), 
//                 tDerive
//             );
