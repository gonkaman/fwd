type NodeFactory<PDoc,TNode,TDoc> = <TArg extends PDoc, T extends TNode, U extends TDoc>(doc: TArg, tag: string) => [T,U];
type Filter<U,V> = (arg: U) => V;
type Task<T> = [Filter<T,T>, ...string[]];
type Connector<TParent,TArg,TChild> = <T extends TParent, U extends TArg, V extends TChild>(filter: Filter<U,V>) => Task<T>
type NodeConnector<T,TDoc,V,VDoc> = Connector<[T,TDoc],TDoc,[V,VDoc]>;
type NodeTask<T,U> = Task<[T,U]>;
type Branch<TParent,U,V> = <T extends TParent>(connect: ((filter: Filter<U,V>) => Task<T>)) => Task<T>;
type NodeBranch<TNode,TDoc,TChild,VDoc> = Branch<[TNode,TDoc],TDoc,[TChild,VDoc]>;
type NodeAdapterArg<T,TDoc,V,VDoc,TConvert> = (NodeTask<T,TDoc> | TConvert | NodeBranch<T,TDoc,V,VDoc>)[];
type NodeAdapterArgsFormater<TNode,TDoc,TChild, VDoc, TConvert> = 
    <T extends TNode, V extends TChild>(connector: NodeConnector<T,TDoc,V,VDoc>) => (args: NodeAdapterArg<T,TDoc,V,VDoc,TConvert>) => NodeTask<T,TDoc>[];
type Adapter<TParent, U, T, TConvert> = <K extends TConvert>(...args: (Task<T> | K)[]) => Branch<TParent,U,T>;
type NodeAdapter<P,PDoc,T,TDoc,V,VDoc,TConvert> = Adapter<[P,PDoc],PDoc,[T,TDoc],TConvert | NodeBranch<T,TDoc,V,VDoc>>;
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
const htmlNodeFactory: NodeFactory<Document, HTMLElement, Document> = <T extends HTMLElement, U extends Document>(doc: Document, tagName: string) => 
    [doc.createElement(tagName) as T, doc as U];
const appendNodeConnector: NodeConnector<Node, Document, Node, Document> = 
    <T extends [Node, Document], TArg extends Document, V extends [Node,Document]>(filter: Filter<TArg,V>): Task<T> => [
        (entry: T) => {
            entry[0].appendChild(filter(entry[1] as TArg)[0]);
            return entry;
        }
    ];
const formatAdapterArgs: NodeAdapterArgsFormater<Node | undefined, Document, Node | undefined, Document, string | undefined> = 
    <T extends Node | undefined, V extends Node | undefined>(connector: NodeConnector<T,Document,V,Document>) => 
    (args: NodeAdapterArg<T,Document,V,Document,string | undefined>): NodeTask<T,Document>[] => 
        (args.filter(arg => arg != null) as NodeAdapterArg<T,Document,V,Document,string>).map(arg => {
            if(typeof arg === 'function') return arg(connector);
            if(typeof arg === 'string') return [
                (entry: [T,Document]) => {
                    entry[0]?.appendChild(entry[1].createTextNode(arg));
                    return entry;
                }
            ];
            return arg;
        });
const noNodeConnector: NodeConnector<Node, Document, Node | undefined, Document> = 
    <T extends [Node, Document], U extends Document, V extends [Node | undefined, Document]>(_: Filter<U,V>): Task<T> => [
        (entry: T) => entry
    ];
type PropertyValueType = string | ((previousValue: string | null) => string) | undefined;
type Lookup<T> = Filter<void,T|null|undefined>;
type Curator<T> = (lookup: Lookup<T>) => void;
type Store<T> = [Curator<T>, Lookup<T>];
type Query = Store<[string, unknown][]>;
type NodePicker<T,U> = Lookup<[T,U]>;
type NodeRenderer<TNode,TDoc> = <T extends TNode, U extends TDoc>(lookup: NodePicker<T,U>, ...tasks: NodeTask<T,U>[]) => NodePicker<T,U>;
const subscribe = <T extends EventTarget, U extends Document>(
    eventType: string, 
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => [
    (entry: [T,U]) => { entry[0].addEventListener(eventType, listener, options); return entry; }
]
type DataPropertyValueType = string | ((previousValue?: string) => string) | undefined;
const setProp = <T extends Node, U extends Document>(key: string, value: PropertyValueType): NodeTask<T, U> => [
    value === undefined ?
        (entry: [T,U]) => { entry[0][key] = null; return entry; } :
        typeof value === 'function' ?
            (entry: [T,U]) => { entry[0][key] = value(entry[0][key]); return entry; } :
            (entry: [T,U]) => { entry[0][key] = value; return entry; }
];
export const section = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('section', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const div = createDOMAdapter<
    HTMLElement, Document, 
    HTMLDivElement, Document, 
    HTMLElement | Text, Document, 
    string
>('div', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const h2 = createDOMAdapter<
    HTMLElement, Document, 
    HTMLHeadingElement, Document, 
    HTMLElement | Text, Document, 
    string
>('h2', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const span = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('span', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const h3 = createDOMAdapter<
    HTMLElement, Document, 
    HTMLHeadingElement, Document, 
    HTMLElement | Text, Document, 
    string
>('h3', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const form = createDOMAdapter<
    HTMLElement, Document, 
    HTMLFormElement, Document, 
    HTMLElement | Text, Document, 
    string
>('form', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const input = createDOMAdapter<
    HTMLElement, Document, 
    HTMLInputElement, Document, 
    undefined, Document, 
    string
>('input', htmlNodeFactory, noNodeConnector, formatAdapterArgs);
export const label = createDOMAdapter<
    HTMLElement, Document, 
    HTMLLabelElement, Document, 
    HTMLElement | Text, Document, 
    string
>('label', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const a = createDOMAdapter<
    HTMLElement, Document, 
    HTMLAnchorElement, Document, 
    HTMLElement | Text, Document, 
    string
>('a', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const button = createDOMAdapter<
    HTMLElement, Document, 
    HTMLButtonElement, Document, 
    HTMLElement | Text, Document, 
    string
>('button', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const setAttr = <T extends Element, U extends Document>(key: string, value: PropertyValueType): NodeTask<T, U> => [
    value === undefined ?
        (entry: [T,U]) => { entry[0].removeAttribute(key); return entry; } :
        typeof value === 'function' ?
            (entry: [T,U]) => { entry[0].setAttribute(key, value(entry[0].getAttribute(key))); return entry; } :
            (entry: [T,U]) => { entry[0].setAttribute(key, value); return entry; }
];
export const className = <T extends Element, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('class', value);
export const createQuery = (): Query => {
    const registeredLookups: Lookup<[string, unknown][]>[] = [];
    return [
        (lookup: Lookup<[string, unknown][]>) => { registeredLookups.push(lookup); },
        () => registeredLookups.reduce((entries: [string, unknown][], lookup) => entries.concat(lookup() ?? []), [])
    ]
}
export const render : NodeRenderer<Element,Document> = <T extends Element, U extends Document>( lookup: NodePicker<T,U>, ...tasks: NodeTask<T,U>[]): NodePicker<T,U> => () => {
    const target = lookup();
    return target == null ? target : tasks.map(task => task[0]).reduce((node, task) => task(node), target);
}
export const onClick = <T extends EventTarget, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('click', listener, options);
export const getProp = <T extends Node, U extends Document>(name: string, key?: string): Filter<[T,U],[string, unknown][]> =>
    (entry: [T,U]) => ([[key || name, entry[0][name]]] as [string, unknown][]);
export const createRef = <T extends Node,U extends Document>(): Store<[T,U]> => {
    let innerLookup: Lookup<[T,U]> = () => null;
    return [
        (lookup: Lookup<[T,U]>) => { innerLookup = lookup; },
        () => innerLookup()
    ];
}
export const query = <T extends Node,U extends Document>(curator: Curator<[string, unknown][]>, ...queries: Filter<[T,U],[string, unknown][]>[]): NodeTask<T,U> => [
    (entry: [T,U]) => {
        curator(() => queries.reduce((entries: [string, unknown][], query) => entries.concat(query(entry)), []));
        return entry;
    }
]
export const setStyle = <T extends HTMLElement, U extends Document>(key: string, value: DataPropertyValueType): NodeTask<T, U> => [
    value === undefined ?
        (entry: [T,U]) => { entry[0].style[key] = null; return entry; } :
        typeof value === 'function' ?
            (entry: [T,U]) => { entry[0].style[key] = value(entry[0].style[key]); return entry; } :
            (entry: [T,U]) => { entry[0].style[key] = value; return entry; }
];
export const store = <T extends Node,U extends Document>(curator: Curator<[T,U]>): NodeTask<T,U> => [
    (entry: [T,U]) => {
        curator(() => entry);
        return entry;
    }
]
export const textContent = <T extends Node, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setProp('textContent', value);
