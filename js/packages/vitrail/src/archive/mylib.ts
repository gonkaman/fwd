export type Filter<U,V> = (arg: U) => V;
export type Task<T> = [Filter<T,T>, ...string[]];
export type Connector<TParent,TArg,TChild> = <T extends TParent, U extends TArg, V extends TChild>(filter: Filter<U,V>) => Task<T>
export type Branch<TParent,U,V> = <T extends TParent>(connect: ((filter: Filter<U,V>) => Task<T>)) => Task<T>;
export type Adapter<TParent, U, T, TConvert> = <K extends TConvert>(...args: (Task<T> | K)[]) => Branch<TParent,U,T>;
export type NodeTask<T,U> = Task<[T,U]>;
export type NodeFactory<PDoc,TNode,TDoc> = <TArg extends PDoc, T extends TNode, U extends TDoc>(doc: TArg, tag: string) => [T,U];
export type NodeConnector<T,TDoc,V,VDoc> = Connector<[T,TDoc],TDoc,[V,VDoc]>;
export type NodeBranch<TNode,TDoc,TChild,VDoc> = Branch<[TNode,TDoc],TDoc,[TChild,VDoc]>;
export type NodeAdapterArg<T,TDoc,V,VDoc,TConvert> = (NodeTask<T,TDoc> | TConvert | NodeBranch<T,TDoc,V,VDoc>)[];
export type NodeAdapterArgsFormater<TNode,TDoc,TChild, VDoc, TConvert> = 
    <T extends TNode, V extends TChild>(connector: NodeConnector<T,TDoc,V,VDoc>) => (args: NodeAdapterArg<T,TDoc,V,VDoc,TConvert>) => NodeTask<T,TDoc>[];
export type NodeAdapter<P,PDoc,T,TDoc,V,VDoc,TConvert> = Adapter<[P,PDoc],PDoc,[T,TDoc],TConvert | NodeBranch<T,TDoc,V,VDoc>>;
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
export type Lookup<T> = Filter<void,T|null|undefined>;
export type Curator<T> = (lookup: Lookup<T>) => void;
export type Store<T> = [Curator<T>, Lookup<T>];
export type Query = Store<[string, unknown][]>;
export type NodePicker<T,U> = Lookup<[T,U]>;
export type NodeRenderer<TNode,TDoc> = <T extends TNode, U extends TDoc>(lookup: NodePicker<T,U>, ...tasks: NodeTask<T,U>[]) => NodePicker<T,U>;
const textNodeFactory: NodeFactory<Document | XMLDocument, Text, Document> = <T extends Text, U extends Document>(doc: Document, _: string) => 
    [doc.createTextNode('') as T, doc as U];
const htmlNodeFactory: NodeFactory<Document, HTMLElement, Document> = <T extends HTMLElement, U extends Document>(doc: Document, tagName: string) => 
    [doc.createElement(tagName) as T, doc as U];
const svgNodeFactory: NodeFactory<Document, SVGElement, XMLDocument> = <T extends SVGElement, U extends XMLDocument>(doc: XMLDocument, tagName: string) => 
    [doc.createElementNS("http://www.w3.org/2000/svg", tagName) as T, doc as U];
const mathmlNodeFactory: NodeFactory<Document, MathMLElement, XMLDocument> = <T extends MathMLElement, U extends XMLDocument>(doc: XMLDocument, tagName: string) => 
    [doc.createElementNS("http://www.w3.org/1998/Math/MathML", tagName) as T, doc as U];
const appendNodeConnector: NodeConnector<Node, Document, Node, Document> = 
    <T extends [Node, Document], TArg extends Document, V extends [Node,Document]>(filter: Filter<TArg,V>): Task<T> => [
        (entry: T) => {
            entry[0].appendChild(filter(entry[1] as TArg)[0]);
            return entry;
        }
    ];
const prependNodeConnector: NodeConnector<Element, Document, Node, Document> = 
    <T extends [Element, Document], TArg extends Document, V extends [Node,Document]>(filter: Filter<TArg,V>): Task<T> => [
        (entry: T) => {
            entry[0].prepend(filter(entry[1] as TArg)[0]);
            return entry;
        }
    ];
const noNodeConnector: NodeConnector<Node, Document, Node | undefined, Document> = 
    <T extends [Node, Document], U extends Document, V extends [Node | undefined, Document]>(_: Filter<U,V>): Task<T> => [
        (entry: T) => entry
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
export const apply = <T extends Node, U extends Document>(action: ((tnode: T, udoc: U) => [T,U])): NodeTask<T,U> => [
    (entry: [T,U]) => action(...entry)
]
const elementFactory = <T extends Element, U extends Document>(doc: Document, tagName: string | [string,string]) => {
    if(typeof tagName === 'string') return htmlNodeFactory(doc, tagName) as unknown as [T,U];
    switch(tagName[1]){
        case 'svg': return svgNodeFactory(doc, tagName[0]) as unknown as [T,U];
        case 'mathml': return mathmlNodeFactory(doc, tagName[0]) as unknown as [T,U];
        default: return htmlNodeFactory(doc, tagName[0]) as unknown as [T,U];
    }
}
export const element = <T extends Element>(
    tagName: string | [string,string], 
    ...args: NodeAdapterArg<T,Document,Node,Document,string | undefined>
): NodeBranch<Element,Document,Element,Document> => {
    const tasks = formatAdapterArgs<T,Node>(appendNodeConnector)(args).map(entry => entry[0]);
    const build: Filter<Document,[T,Document]> = (doc: Document) => tasks.reduce((node, task) => task(node), elementFactory<T,Document>(doc, tagName));
    return <TParent extends [Element,Document]>(connect: ((filter: Filter<Document,[T,Document]>) => Task<TParent>)):Task<TParent> => connect(build);
}
export const append = <T extends Node, U extends Document>(branch: NodeBranch<T,U,Node,Document>): NodeTask<T,U> => branch(appendNodeConnector);
export const prepend = <T extends Element, U extends Document>(branch: NodeBranch<T,U,Node,Document>): NodeTask<T,U> => branch(prependNodeConnector);
export const appendTo = <T extends Node, V extends Node, U extends Document>(lookup: NodePicker<V,U>): NodeTask<T,U> => [
    (entry: [T,U]) => {
        lookup()?.[0].appendChild(entry[0]);
        return entry;
    }
]
export const prependTo = <T extends Node, V extends Element, U extends Document>(lookup: NodePicker<V,U>): NodeTask<T,U> => [
    (entry: [T,U]) => {
        lookup()?.[0].prepend(entry[0]);
        return entry;
    }
]
export type PropertyValueType = string | ((previousValue: string | null) => string) | undefined;
export type PropertyAdapter = <T extends Node, U extends Document>(value: PropertyValueType) => NodeTask<T,U>;
export type DataPropertyValueType = string | ((previousValue?: string) => string) | undefined;
export type CssValueType = string | ((previousValue: string) => string);
export const setProp = <T extends Node, U extends Document>(key: string, value: PropertyValueType): NodeTask<T, U> => [
    value === undefined ?
        (entry: [T,U]) => { entry[0][key] = null; return entry; } :
        typeof value === 'function' ?
            (entry: [T,U]) => { entry[0][key] = value(entry[0][key]); return entry; } :
            (entry: [T,U]) => { entry[0][key] = value; return entry; }
];
export const removeProp = <T extends Node, U extends Document>(adapter: PropertyAdapter): NodeTask<T,U> => adapter(undefined);
export const getProp = <T extends Node, U extends Document>(name: string, key?: string): Filter<[T,U],[string, unknown][]> =>
    (entry: [T,U]) => ([[key || name, entry[0][name]]] as [string, unknown][]);
export const setAttr = <T extends Element, U extends Document>(key: string, value: PropertyValueType): NodeTask<T, U> => [
    value === undefined ?
        (entry: [T,U]) => { entry[0].removeAttribute(key); return entry; } :
        typeof value === 'function' ?
            (entry: [T,U]) => { entry[0].setAttribute(key, value(entry[0].getAttribute(key))); return entry; } :
            (entry: [T,U]) => { entry[0].setAttribute(key, value); return entry; }
];
export const removeAttr = <T extends Element, U extends Document>(key: string): NodeTask<T,U> => setAttr(key, undefined);
export const getAttr = <T extends Element, U extends Document>(name: string, key?: string): Filter<[T,U],[string, unknown][]> =>
    (entry: [T,U]) => ([[key || name, entry[0].getAttribute(name)]] as [string, unknown][]);
export const setAria = <T extends Element, U extends Document>(key: string, value: PropertyValueType): NodeTask<T, U> => setAttr('aria-'+key, value);
export const removeAria = <T extends Element, U extends Document>(key: string): NodeTask<T,U> => removeAttr('aria-'+key);
export const getAria = <T extends Element, U extends Document>(name: string, key?: string): Filter<[T,U],[string, unknown][]> => getAttr('aria-'+name, key);
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
export const text = createDOMAdapter<
    Element, Document, 
    Text, Document, 
    undefined, Document, 
    string
>('', textNodeFactory, noNodeConnector, formatAdapterArgs);
export const a = createDOMAdapter<
    HTMLElement, Document, 
    HTMLAnchorElement, Document, 
    HTMLElement | Text, Document, 
    string
>('a', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const abbr = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('abbr', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const address = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('address', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const area = createDOMAdapter<
    HTMLElement, Document, 
    HTMLAreaElement, Document, 
    undefined, Document, 
    string
>('area', htmlNodeFactory, noNodeConnector, formatAdapterArgs);
export const article = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('article', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const aside = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('aside', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const audio = createDOMAdapter<
    HTMLElement, Document, 
    HTMLAudioElement, Document, 
    HTMLElement | Text, Document, 
    string
>('audio', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const b = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('b', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const base = createDOMAdapter<
    HTMLElement, Document, 
    HTMLBaseElement, Document, 
    undefined, Document, 
    string
>('base', htmlNodeFactory, noNodeConnector, formatAdapterArgs);
export const bdi = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('bdi', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const bdo = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('bdo', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const blockquote = createDOMAdapter<
    HTMLElement, Document, 
    HTMLQuoteElement, Document, 
    HTMLElement | Text, Document, 
    string
>('blockquote', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const body = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('body', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const br = createDOMAdapter<
    HTMLElement, Document, 
    HTMLBRElement, Document, 
    undefined, Document, 
    string
>('br', htmlNodeFactory, noNodeConnector, formatAdapterArgs);
export const button = createDOMAdapter<
    HTMLElement, Document, 
    HTMLButtonElement, Document, 
    HTMLElement | Text, Document, 
    string
>('button', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const canvas = createDOMAdapter<
    HTMLElement, Document, 
    HTMLCanvasElement, Document, 
    HTMLElement | Text, Document, 
    string
>('canvas', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const caption = createDOMAdapter<
    HTMLElement, Document, 
    HTMLTableCaptionElement, Document, 
    HTMLElement | Text, Document, 
    string
>('caption', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const cite = createDOMAdapter<
    HTMLElement, Document, 
    HTMLQuoteElement, Document, 
    HTMLElement | Text, Document, 
    string
>('cite', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const code = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('code', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const col = createDOMAdapter<
    HTMLTableColElement, Document, 
    HTMLTableColElement, Document, 
    undefined, Document, 
    string
>('col', htmlNodeFactory, noNodeConnector, formatAdapterArgs);
export const colgroup = createDOMAdapter<
    HTMLTableElement, Document, 
    HTMLTableColElement, Document, 
    HTMLTableColElement, Document, 
    string
>('colgroup', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const data = createDOMAdapter<
    HTMLElement, Document, 
    HTMLDataElement, Document, 
    HTMLElement | Text, Document, 
    string
>('data', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const datalist = createDOMAdapter<
    HTMLElement, Document, 
    HTMLDataListElement, Document, 
    HTMLElement | Text, Document, 
    string
>('datalist', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const dd = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('dd', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const del = createDOMAdapter<
    HTMLElement, Document, 
    HTMLModElement, Document, 
    HTMLElement | Text, Document, 
    string
>('del', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const details = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('details', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const dfn = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('dfn', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const dialog = createDOMAdapter<
    HTMLElement, Document, 
    HTMLDialogElement, Document, 
    HTMLElement | Text, Document, 
    string
>('dialog', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const div = createDOMAdapter<
    HTMLElement, Document, 
    HTMLDivElement, Document, 
    HTMLElement | Text, Document, 
    string
>('div', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const dl = createDOMAdapter<
    HTMLElement, Document, 
    HTMLDListElement, Document, 
    HTMLElement | Text, Document, 
    string
>('dl', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const dt = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('dt', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const em = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('em', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const embed = createDOMAdapter<
    HTMLElement, Document, 
    HTMLEmbedElement, Document, 
    HTMLElement | Text, Document, 
    string
>('embed', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const fieldset = createDOMAdapter<
    HTMLElement, Document, 
    HTMLFieldSetElement, Document, 
    HTMLElement | Text, Document, 
    string
>('fieldset', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const figcaption = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('figcaption', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const figure = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('figure', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const footer = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('footer', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const form = createDOMAdapter<
    HTMLElement, Document, 
    HTMLFormElement, Document, 
    HTMLElement | Text, Document, 
    string
>('form', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const h1 = createDOMAdapter<
    HTMLElement, Document, 
    HTMLHeadingElement, Document, 
    HTMLElement | Text, Document, 
    string
>('h1', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const h2 = createDOMAdapter<
    HTMLElement, Document, 
    HTMLHeadingElement, Document, 
    HTMLElement | Text, Document, 
    string
>('h2', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const h3 = createDOMAdapter<
    HTMLElement, Document, 
    HTMLHeadingElement, Document, 
    HTMLElement | Text, Document, 
    string
>('h3', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const h4 = createDOMAdapter<
    HTMLElement, Document, 
    HTMLHeadingElement, Document, 
    HTMLElement | Text, Document, 
    string
>('h4', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const h5 = createDOMAdapter<
    HTMLElement, Document, 
    HTMLHeadingElement, Document, 
    HTMLElement | Text, Document, 
    string
>('h5', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const h6 = createDOMAdapter<
    HTMLElement, Document, 
    HTMLHeadingElement, Document, 
    HTMLElement | Text, Document, 
    string
>('h6', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const head = createDOMAdapter<
    HTMLElement, Document, 
    HTMLHeadElement, Document, 
    HTMLElement | Text, Document, 
    string
>('head', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const header = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('header', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const hgroup = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('hgroup', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const hr = createDOMAdapter<
    HTMLElement, Document, 
    HTMLHRElement, Document, 
    HTMLElement | Text, Document, 
    string
>('hr', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const html = createDOMAdapter<
    undefined, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('html', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const i = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('i', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const iframe = createDOMAdapter<
    HTMLElement, Document, 
    HTMLIFrameElement, Document, 
    HTMLElement | Text, Document, 
    string
>('iframe', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const img = createDOMAdapter<
    HTMLElement, Document, 
    HTMLImageElement, Document, 
    undefined, Document, 
    string
>('img', htmlNodeFactory, noNodeConnector, formatAdapterArgs);
export const input = createDOMAdapter<
    HTMLElement, Document, 
    HTMLInputElement, Document, 
    undefined, Document, 
    string
>('input', htmlNodeFactory, noNodeConnector, formatAdapterArgs);
export const ins = createDOMAdapter<
    HTMLElement, Document, 
    HTMLModElement, Document, 
    HTMLElement | Text, Document, 
    string
>('ins', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const kbd = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('kbd', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const label = createDOMAdapter<
    HTMLElement, Document, 
    HTMLLabelElement, Document, 
    HTMLElement | Text, Document, 
    string
>('label', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const legend = createDOMAdapter<
    HTMLElement, Document, 
    HTMLLegendElement, Document, 
    HTMLElement | Text, Document, 
    string
>('legend', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const li = createDOMAdapter<
    HTMLElement, Document, 
    HTMLLIElement, Document, 
    HTMLElement | Text, Document, 
    string
>('li', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const link = createDOMAdapter<
    HTMLElement, Document, 
    HTMLLinkElement, Document, 
    HTMLElement | Text, Document, 
    string
>('link', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const main = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('main', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const mark = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('mark', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const menu = createDOMAdapter<
    HTMLElement, Document, 
    HTMLMenuElement, Document, 
    HTMLElement | Text, Document, 
    string
>('menu', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const meta = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('meta', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const meter = createDOMAdapter<
    HTMLElement, Document, 
    HTMLMeterElement, Document, 
    HTMLElement | Text, Document, 
    string
>('meter', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const nav = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('nav', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const noscript = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('noscript', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const object = createDOMAdapter<
    HTMLElement, Document, 
    HTMLObjectElement, Document, 
    HTMLElement | Text, Document, 
    string
>('object', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const ol = createDOMAdapter<
    HTMLElement, Document, 
    HTMLOListElement, Document, 
    HTMLElement | Text, Document, 
    string
>('ol', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const optgroup = createDOMAdapter<
    HTMLElement, Document, 
    HTMLOptGroupElement, Document, 
    HTMLElement | Text, Document, 
    string
>('optgroup', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const option = createDOMAdapter<
    HTMLElement, Document, 
    HTMLOptionElement, Document, 
    HTMLElement | Text, Document, 
    string
>('option', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const output = createDOMAdapter<
    HTMLElement, Document, 
    HTMLOutputElement, Document, 
    HTMLElement | Text, Document, 
    string
>('output', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const p = createDOMAdapter<
    HTMLElement, Document, 
    HTMLParagraphElement, Document, 
    HTMLElement | Text, Document, 
    string
>('p', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const param = createDOMAdapter<
    HTMLElement, Document, 
    HTMLParagraphElement, Document, 
    HTMLElement | Text, Document, 
    string
>('param', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const picture = createDOMAdapter<
    HTMLElement, Document, 
    HTMLPictureElement, Document, 
    HTMLElement | Text, Document, 
    string
>('picture', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const pre = createDOMAdapter<
    HTMLElement, Document, 
    HTMLPreElement, Document, 
    HTMLElement | Text, Document, 
    string
>('pre', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const progress = createDOMAdapter<
    HTMLElement, Document, 
    HTMLProgressElement, Document, 
    HTMLElement | Text, Document, 
    string
>('progress', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const q = createDOMAdapter<
    HTMLElement, Document, 
    HTMLQuoteElement, Document, 
    HTMLElement | Text, Document, 
    string
>('q', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const rp = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('rp', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const rt = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('rt', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const ruby = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('ruby', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const s = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('s', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const samp = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('samp', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const script = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('script', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const search = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('search', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const section = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('section', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const select = createDOMAdapter<
    HTMLElement, Document, 
    HTMLSelectElement, Document, 
    HTMLElement | Text, Document, 
    string
>('select', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const htmlslot = createDOMAdapter<
    HTMLElement, Document, 
    HTMLSlotElement, Document, 
    HTMLElement | Text, Document, 
    string
>('slot', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const small = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('small', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const source = createDOMAdapter<
    HTMLElement, Document, 
    HTMLSourceElement, Document, 
    HTMLElement | Text, Document, 
    string
>('source', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const span = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('span', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const strong = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('strong', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const style = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('style', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const sub = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('sub', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const summary = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('summary', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const sup = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('sup', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const table = createDOMAdapter<
    HTMLElement, Document, 
    HTMLTableElement, Document, 
    HTMLElement | Text, Document, 
    string
>('table', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const tbody = createDOMAdapter<
    HTMLElement, Document, 
    HTMLTableSectionElement, Document, 
    HTMLElement | Text, Document, 
    string
>('tbody', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const td = createDOMAdapter<
    HTMLElement, Document, 
    HTMLTableCellElement, Document, 
    HTMLElement | Text, Document, 
    string
>('td', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const template = createDOMAdapter<
    HTMLElement, Document, 
    HTMLTemplateElement, Document, 
    HTMLElement | Text, Document, 
    string
>('template', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const textarea = createDOMAdapter<
    HTMLElement, Document, 
    HTMLTextAreaElement, Document, 
    HTMLElement | Text, Document, 
    string
>('textarea', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const tfoot = createDOMAdapter<
    HTMLElement, Document, 
    HTMLTableSectionElement, Document, 
    HTMLElement | Text, Document, 
    string
>('tfoot', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const th = createDOMAdapter<
    HTMLElement, Document, 
    HTMLTableCellElement, Document, 
    HTMLElement | Text, Document, 
    string
>('th', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const thead = createDOMAdapter<
    HTMLElement, Document, 
    HTMLTableSectionElement, Document, 
    HTMLElement | Text, Document, 
    string
>('thead', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const time = createDOMAdapter<
    HTMLElement, Document, 
    HTMLTimeElement, Document, 
    HTMLElement | Text, Document, 
    string
>('time', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const htmltitle = createDOMAdapter<
    HTMLElement, Document, 
    HTMLTitleElement, Document, 
    HTMLElement | Text, Document, 
    string
>('title', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const tr = createDOMAdapter<
    HTMLElement, Document, 
    HTMLTableRowElement, Document, 
    HTMLElement | Text, Document, 
    string
>('tr', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const track = createDOMAdapter<
    HTMLElement, Document, 
    HTMLTrackElement, Document, 
    HTMLElement | Text, Document, 
    string
>('track', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const u = createDOMAdapter<
    HTMLElement, Document, 
    HTMLTrackElement, Document, 
    HTMLElement | Text, Document, 
    string
>('u', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const ul = createDOMAdapter<
    HTMLElement, Document, 
    HTMLUListElement, Document, 
    HTMLElement | Text, Document, 
    string
>('ul', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const htmlvar = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('var', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const video = createDOMAdapter<
    HTMLElement, Document, 
    HTMLVideoElement, Document, 
    HTMLElement | Text, Document, 
    string
>('video', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const wbr = createDOMAdapter<
    HTMLElement, Document, 
    HTMLElement, Document, 
    HTMLElement | Text, Document, 
    string
>('wbr', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const id = <T extends Element, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('id', value);
export const getId = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('id', key);
export const title = <T extends HTMLElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('title', value);
export const getTitle = <T extends HTMLElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('title', key);
export const tabIndex = <T extends HTMLElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('tabIndex', value);
export const getTabIndex = <T extends HTMLElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('tabIndex', key);
export const lang = <T extends HTMLElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('lang', value);
export const getLang = <T extends HTMLElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('lang', key);
export const dir = <T extends HTMLElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('dir', value);
export const getDir = <T extends HTMLElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('dir', key);
export const accesskey = <T extends Element, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('accesskey', value);
export const getAccesskey = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('accesskey', key);
export const autocapitalize = <T extends Element, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('autocapitalize', value);
export const getAutocapitalize = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('autocapitalize', key);
export const autofocus = <T extends Element, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('autofocus', value);
export const getAutofocus = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('autofocus', key);
export const contenteditable = <T extends Element, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('contenteditable', value);
export const getContenteditable = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('contenteditable', key);
export const draggable = <T extends HTMLElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('draggable', value);
export const getDraggable = <T extends HTMLElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('draggable', key);
export const enterkeyhint = <T extends Element, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('enterkeyhint', value);
export const getEnterkeyhint = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('enterkeyhint', key);
export const exportparts = <T extends Element, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('exportparts', value);
export const getExportparts = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('exportparts', key);
export const hidden = <T extends Element, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('hidden', value);
export const getHidden = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('hidden', key);
export const inert = <T extends Element, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('inert', value);
export const getInert = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('inert', key);
export const inputmode = <T extends Element, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('inputmode', value);
export const getInputmode = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('inputmode', key);
export const is = <T extends Element, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('is', value);
export const getIs = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('is', key);
export const itemid = <T extends HTMLElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('itemid', value);
export const getItemid = <T extends HTMLElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('itemid', key);
export const itemprop = <T extends HTMLElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('itemprop', value);
export const getItemprop = <T extends HTMLElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('itemprop', key);
export const itemref = <T extends HTMLElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('itemref', value);
export const getItemref = <T extends HTMLElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('itemref', key);
export const itemscope = <T extends HTMLElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('itemscope', value);
export const getItemscope = <T extends HTMLElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('itemscope', key);
export const itemtype = <T extends HTMLElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('itemtype', value);
export const getItemtype = <T extends HTMLElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('itemtype', key);
export const nonce = <T extends Element, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('nonce', value);
export const getNonce = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('nonce', key);
export const part = <T extends Element, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('part', value);
export const getPart = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('part', key);
export const popover = <T extends Element, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('popover', value);
export const getPopover = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('popover', key);
export const slot = <T extends Element, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('slot', value);
export const getSlot = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('slot', key);
export const spellcheck = <T extends Element, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('spellcheck', value);
export const getSpellcheck = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('spellcheck', key);
export const translate = <T extends Element, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('translate', value);
export const getTranslate = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('translate', key);
export const accept = <T extends HTMLInputElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('accept', value);
export const getAccept = <T extends HTMLInputElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('accept', key);
export const autocomplete = <T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLFormElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('autocomplete', value);
export const getAutocomplete = <T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLFormElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('autocomplete', key);
export const capture = <T extends HTMLInputElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('capture', value);
export const getCapture = <T extends HTMLInputElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('capture', key);
export const crossorigin = <T extends HTMLElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('crossorigin', value);
export const getCrossorigin = <T extends HTMLElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('crossorigin', key);
export const dirname = <T extends HTMLInputElement | HTMLTextAreaElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('dirname', value);
export const getDirname = <T extends HTMLInputElement | HTMLTextAreaElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('dirname', key);
export const disabled = <T extends HTMLElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('disabled', value);
export const getDisabled = <T extends HTMLElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('disabled', key);
export const elementtiming = <T extends HTMLElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('elementtiming', value);
export const getElementtiming = <T extends HTMLElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('elementtiming', key);
export const $for = <T extends HTMLLabelElement | HTMLOutputElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('for', value);
export const getFor = <T extends HTMLLabelElement | HTMLOutputElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('for', key);
export const max = <T extends HTMLElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('max', value);
export const getMax = <T extends HTMLElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('max', key);
export const min = <T extends HTMLElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('min', value);
export const getMin = <T extends HTMLElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('min', key);
export const maxlength = <T extends HTMLInputElement | HTMLTextAreaElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('maxlength', value);
export const getMaxlength = <T extends HTMLInputElement | HTMLTextAreaElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('maxlength', key);
export const minlength = <T extends HTMLInputElement | HTMLTextAreaElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('minlength', value);
export const getMinlength = <T extends HTMLInputElement | HTMLTextAreaElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('minlength', key);
export const multiple = <T extends HTMLInputElement | HTMLSelectElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('multiple', value);
export const getMultiple = <T extends HTMLInputElement | HTMLSelectElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('multiple', key);
export const pattern = <T extends HTMLInputElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('pattern', value);
export const getPattern = <T extends HTMLInputElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('pattern', key);
export const placeholder = <T extends HTMLInputElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('placeholder', value);
export const getPlaceholder = <T extends HTMLInputElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('placeholder', key);
export const readonly = <T extends HTMLInputElement | HTMLTextAreaElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('readonly', value);
export const getReadonly = <T extends HTMLInputElement | HTMLTextAreaElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('readonly', key);
export const rel = <T extends HTMLAnchorElement | HTMLAreaElement | HTMLLinkElement | HTMLFormElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('rel', value);
export const getRel = <T extends HTMLAnchorElement | HTMLAreaElement | HTMLLinkElement | HTMLFormElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('rel', key);
export const required = <T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('required', value);
export const getRequired = <T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('required', key);
export const size = <T extends HTMLInputElement | HTMLSelectElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('size', value);
export const getSize = <T extends HTMLInputElement | HTMLSelectElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('size', key);
export const step = <T extends HTMLInputElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('step', value);
export const getStep = <T extends HTMLInputElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('step', key);
export const type = <T extends HTMLInputElement, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('type', value);
export const getType = <T extends HTMLInputElement, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('type', key);
export const className = <T extends Element, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('class', value);
export const getClassName = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getAttr('class', key);
export const nodeValue = <T extends Node, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setProp('nodeValue', value);
export const getNodeValue = <T extends Node, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getProp('nodeValue', key);
export const textContent = <T extends Node, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setProp('textContent', value);
export const getTextContent = <T extends Node, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getProp('textContent', key);
export const innerHTML = <T extends Element, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setProp('innerHTML', value);
export const getInnerHTML = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getProp('innerHTML', key);
export const outerHTML = <T extends Element, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setProp('outerHTML', value);
export const getOuterHTML = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getProp('outerHTML', key);
export const getNodeName = <T extends Node, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getProp('nodeName', key);
export const getNodeType = <T extends Node, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getProp('nodeType', key);
export const getClientHeight = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getProp('clientHeight', key);
export const getClientLeft = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getProp('clientLeft', key);
export const getClientTop = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getProp('clientTop', key);
export const getClientWidth = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getProp('clientWidth', key);
export const getTagName = <T extends Element, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => getProp('tagName', key);
export const addClass = <T extends Element, U extends Document>(name: string): NodeTask<T,U> => [
    (entry: [T,U]) => {
        entry[0].classList.add(name);
        return entry;
    }
];
export const removeClass = <T extends Element, U extends Document>(name: string): NodeTask<T,U> => [
    (entry: [T,U]) => {
        entry[0].classList.remove(name);
        return entry;
    }
];
export const toggleClass = <T extends Element, U extends Document>(name: string): NodeTask<T,U> => [
    (entry: [T,U]) => {
        entry[0].classList.toggle(name);
        return entry;
    }
];
export const dispatch = <T extends EventTarget, U extends Document>(event: Event): NodeTask<T,U> => [
    (entry: [T,U]) => {
        entry[0].dispatchEvent(event);
        return entry;
    }
];
export const onClick = <T extends EventTarget, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('click', listener, options);
export const onDbClick = <T extends EventTarget, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('dbclick', listener, options);
export const onBlur = <T extends EventTarget, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('blur', listener, options);
export const onFocus = <T extends EventTarget, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('focus', listener, options);
export const onChange = <T extends EventTarget, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('change', listener, options);
export const onMouseDown = <T extends EventTarget, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('mousedown', listener, options);
export const onMouseEnter = <T extends EventTarget, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('mouseenter', listener, options);
export const onMouseLeave = <T extends EventTarget, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('mouseleave', listener, options);
export const onMouseMove = <T extends EventTarget, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('mousemove', listener, options);
export const onMouseOut = <T extends EventTarget, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('mouseout', listener, options);
export const onMouseOver = <T extends EventTarget, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('mouseover', listener, options);
export const onMouseUp = <T extends EventTarget, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('mouseup', listener, options);
export const onWheel = <T extends EventTarget, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('wheel', listener, options);
export const onScroll = <T extends EventTarget, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('scroll', listener, options);
export const onKeyDown = <T extends EventTarget, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('keydown', listener, options);
export const onKeypress = <T extends EventTarget, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('keyPress', listener, options);
export const onKeyup = <T extends EventTarget, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('keyUp', listener, options);
export const onCopy = <T extends EventTarget, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('copy', listener, options);
export const onCut = <T extends EventTarget, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('cut', listener, options);
export const onPaste = <T extends EventTarget, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('paste', listener, options);
export const onSelect = <T extends EventTarget, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('select', listener, options);
export const onFocusIn = <T extends EventTarget, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('focusin', listener, options);
export const onFocusOut = <T extends EventTarget, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('focusout', listener, options);