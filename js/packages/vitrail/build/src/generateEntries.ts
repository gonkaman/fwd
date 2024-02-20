
type LibEntryData = [string, string, string, string, any];
type AdapterType = "HTML" | "SVG" | "MATHML" | "TEXT";
type templateKeyType = "adapter" | "property" | "query" | "event" | "action";
type PropertyType = "Attr" | "Prop";

type AdapterEntry = {
    template: templateKeyType,
    key: string,
    type: AdapterType,
    target: string,
    parent: string,
    childs?: string,
    rendered: boolean
}
type PropertyEntry = {
    template: templateKeyType,
    key: string,
    type: PropertyType,
    target: string,
    rendered: boolean
}
type QueryEntry = {
    template: templateKeyType,
    key: string,
    type: PropertyType,
    target: string,
    rendered: boolean
}
type ActionEntry = {
    template: templateKeyType,
    target: string,
    callPath: string,
    arguments: [string,string][],
    rendered: boolean
}
type EventEntry = {
    template: templateKeyType,
    key: string,
    target: string,
    rendered: boolean
}

type LibEntry = AdapterEntry | PropertyEntry | QueryEntry | ActionEntry | EventEntry;

type CoreEntry = {
    deps: string[],
    body: string,
    rendered: boolean
}

type EntryMap = Record<string, CoreEntry | LibEntry>

const isAdpaterEntry = function(obj: LibEntry): obj is AdapterEntry {
    return obj.template === "adapter";
}

const isPropertyEntry = function(obj: LibEntry): obj is PropertyEntry {
    return obj.template === "property";
}

const isQueryEntry = function(obj: LibEntry): obj is QueryEntry {
    return obj.template === "query";
}

const isActionEntry = function(obj: LibEntry): obj is ActionEntry {
    return obj.template === "action";
}

const isEventEntry = function(obj: LibEntry): obj is EventEntry {
    return obj.template === "event";
}

const isLibEntry = function(obj: LibEntry | CoreEntry): obj is LibEntry {
    return 'template' in obj;
}

const libData : LibEntryData[] = [
    //adapters (element/tag)
    //[template, name, key, target,[type, ParentElement, ChildElement]]

    
    ['adapter','text','','Text',['text','Element',undefined]],

    //html adapters
    ['adapter','a','a','HTMLAnchorElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','abbr','abbr','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','address','address','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','area','area','HTMLAreaElement',['html','HTMLElement',undefined]],
    ['adapter','article','article','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','aside','aside','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','audio','audio','HTMLAudioElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','b','b','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','base','base','HTMLBaseElement',['html','HTMLElement',undefined]],
    ['adapter','bdi','bdi','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','bdo','bdo','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','blockquote','blockquote','HTMLQuoteElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','body','body','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','br','br','HTMLBRElement',['html','HTMLElement',undefined]],
    ['adapter','button','button','HTMLButtonElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','canvas','canvas','HTMLCanvasElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','caption','caption','HTMLTableCaptionElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','cite','cite','HTMLQuoteElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','code','code','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','col','col','HTMLTableColElement',['html','HTMLTableColElement',undefined]],
    ['adapter','colgroup','colgroup','HTMLTableColElement',['html','HTMLTableElement','HTMLTableColElement']],
    ['adapter','data','data','HTMLDataElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','datalist','datalist','HTMLDataListElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','dd','dd','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','del','del','HTMLModElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','details','details','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','dfn','dfn','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','dialog','dialog','HTMLDialogElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','div','div','HTMLDivElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','dl','dl','HTMLDListElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','dt','dt','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','em','em','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','embed','embed','HTMLEmbedElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','fieldset','fieldset','HTMLFieldSetElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','figcaption','figcaption','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','figure','figure','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','footer','footer','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','form','form','HTMLFormElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','h1','h1','HTMLHeadingElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','h2','h2','HTMLHeadingElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','h3','h3','HTMLHeadingElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','h4','h4','HTMLHeadingElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','h5','h5','HTMLHeadingElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','h6','h6','HTMLHeadingElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','head','head','HTMLHeadElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','header','header','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','hgroup','hgroup','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','hr','hr','HTMLHRElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','html','html','HTMLElement',['html',undefined,'HTMLElement | Text']],
    ['adapter','i','i','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','iframe','iframe','HTMLIFrameElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','img','img','HTMLImageElement',['html','HTMLElement',undefined]],
    ['adapter','input','input','HTMLInputElement',['html','HTMLElement',undefined]],
    ['adapter','ins','ins','HTMLModElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','kbd','kbd','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','label','label','HTMLLabelElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','legend','legend','HTMLLegendElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','li','li','HTMLLIElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','link','link','HTMLLinkElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','main','main','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','mark','mark','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','menu','menu','HTMLMenuElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','meta','meta','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','meter','meter','HTMLMeterElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','nav','nav','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','noscript','noscript','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','object','object','HTMLObjectElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','ol','ol','HTMLOListElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','optgroup','optgroup','HTMLOptGroupElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','option','option','HTMLOptionElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','output','output','HTMLOutputElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','p','p','HTMLParagraphElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','param','param','HTMLParagraphElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','picture','picture','HTMLPictureElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','pre','pre','HTMLPreElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','progress','progress','HTMLProgressElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','q','q','HTMLQuoteElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','rp','rp','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','rt','rt','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','ruby','ruby','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','s','s','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','samp','samp','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','script','script','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','search','search','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','section','section','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','select','select','HTMLSelectElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','htmlslot','slot','HTMLSlotElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','small','small','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','source','source','HTMLSourceElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','span','span','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','strong','strong','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','style','style','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','sub','sub','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','summary','summary','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','sup','sup','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','table','table','HTMLTableElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','tbody','tbody','HTMLTableSectionElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','td','td','HTMLTableCellElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','template','template','HTMLTemplateElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','textarea','textarea','HTMLTextAreaElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','tfoot','tfoot','HTMLTableSectionElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','th','th','HTMLTableCellElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','thead','thead','HTMLTableSectionElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','time','time','HTMLTimeElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','htmltitle','title','HTMLTitleElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','tr','tr','HTMLTableRowElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','track','track','HTMLTrackElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','u','u','HTMLTrackElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','ul','ul','HTMLUListElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','htmlvar','var','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','video','video','HTMLVideoElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','wbr','wbr','HTMLElement',['html','HTMLElement','HTMLElement | Text']],

    //svg adapters

    //mathml adapters


    //properties
    //[template, name, key, target, writeAsProp]
    ['prop','id','id','Element', false],
    ['prop','title','title','HTMLElement', false],
    ['prop','tabIndex','tabIndex','HTMLElement', false],
    ['prop','lang','lang','HTMLElement', false],
    ['prop','dir','dir','HTMLElement', false],
    ['prop','accesskey','accesskey','Element', false],
    ['prop','autocapitalize','autocapitalize','Element', false],
    ['prop','autofocus','autofocus','Element', false],
    ['prop','contenteditable','contenteditable','Element', false],
    ['prop','draggable','draggable','HTMLElement', false],
    ['prop','enterkeyhint','enterkeyhint','Element', false],
    ['prop','exportparts','exportparts','Element', false],
    ['prop','hidden','hidden','Element', false],
    ['prop','inert','inert','Element', false],
    ['prop','inputmode','inputmode','Element', false],
    ['prop','is','is','Element', false],
    ['prop','itemid','itemid','HTMLElement', false],
    ['prop','itemprop','itemprop','HTMLElement', false],
    ['prop','itemref','itemref','HTMLElement', false],
    ['prop','itemscope','itemscope','HTMLElement', false],
    ['prop','itemtype','itemtype','HTMLElement', false],
    ['prop','nonce','nonce','Element', false],
    ['prop','part','part','Element', false],
    ['prop','popover','popover','Element', false],
    ['prop','slot','slot','Element', false],
    ['prop','spellcheck','spellcheck','Element', false],
    ['prop','translate','translate','Element', false],
    ['prop','accept','accept','HTMLInputElement', false],
    ['prop','autocomplete','autocomplete','HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLFormElement', false],
    ['prop','capture','capture','HTMLInputElement', false],
    ['prop','crossorigin','crossorigin','HTMLElement', false],
    ['prop','dirname','dirname','HTMLInputElement | HTMLTextAreaElement', false],
    ['prop','disabled','disabled','HTMLElement', false],
    ['prop','elementtiming','elementtiming','HTMLElement', false],
    ['prop','$for','$for','HTMLLabelElement | HTMLOutputElement', false],
    ['prop','max','max','HTMLElement', false],
    ['prop','min','min','HTMLElement', false],
    ['prop','maxlength','maxlength','HTMLInputElement | HTMLTextAreaElement', false],
    ['prop','minlength','minlength','HTMLInputElement | HTMLTextAreaElement', false],
    ['prop','multiple','multiple','HTMLInputElement | HTMLSelectElement', false],
    ['prop','pattern','pattern','HTMLInputElement', false],
    ['prop','placeholder','placeholder','HTMLInputElement', false],
    ['prop','readonly','readonly','HTMLInputElement | HTMLTextAreaElement', false],
    ['prop','rel','rel','HTMLAnchorElement | HTMLAreaElement | HTMLLinkElement | HTMLFormElement', false],
    ['prop','required','required','HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement', false],
    ['prop','size','size','HTMLInputElement | HTMLSelectElement', false],
    ['prop','step','step','HTMLInputElement', false],
    ['prop','type','type','HTMLInputElement', false],
    ['prop','className','class','Element', false],

    ['prop','nodeValue','nodeValue','Node', true],
    ['prop','textContent','textContent','Node', true],
    ['prop','innerHTML','innerHTML','Element', true],
    ['prop','outerHTML','outerHTML','Element', true],

    ['prop','nodeName','nodeName','Node', undefined],
    ['prop','nodeType','nodeType','Node', undefined],
    ['prop','clientHeight','clientHeight','Element', undefined],
    ['prop','clientLeft','clientLeft','Element', undefined],
    ['prop','clientTop','clientTop','Element', undefined],
    ['prop','clientWidth','clientWidth','Element', undefined],
    ['prop','tagName','tagName','Element', undefined],


    //actions
    //[template, name, callPath, target, [...[paramName, paramType][]]]
    ['action','addClass','classList.add','Element', [['name','string']]],
    ['action','removeClass','classList.remove','Element', [['name','string']]],
    ['action','toggleClass','classList.toggle','Element', [['name','string']]],
    ['action','dispatch','dispatchEvent','EventTarget', [['event','Event']]],


    //events
    ['event','onClick','click','EventTarget',undefined],
    ['event','onDbClick','dbclick','EventTarget',undefined],
    ['event','onBlur','blur','EventTarget',undefined],
    ['event','onFocus','focus','EventTarget',undefined],
    ['event','onChange','change','EventTarget',undefined],
    ['event','onMouseDown','mousedown','EventTarget',undefined],
    ['event','onMouseEnter','mouseenter','EventTarget',undefined],
    ['event','onMouseLeave','mouseleave','EventTarget',undefined],
    ['event','onMouseMove','mousemove','EventTarget',undefined],
    ['event','onMouseOut','mouseout','EventTarget',undefined],
    ['event','onMouseOver','mouseover','EventTarget',undefined],
    ['event','onMouseUp','mouseup','EventTarget',undefined],
    ['event','onWheel','wheel','EventTarget',undefined],
    ['event','onScroll','scroll','EventTarget',undefined],
    ['event','onKeyDown','keydown','EventTarget',undefined],
    ['event','onKeypress','keyPress','EventTarget',undefined],
    ['event','onKeyup','keyUp','EventTarget',undefined],
    ['event','onCopy','copy','EventTarget',undefined],
    ['event','onCut','cut','EventTarget',undefined],
    ['event','onPaste','paste','EventTarget',undefined],
    ['event','onSelect','select','EventTarget',undefined],
    ['event','onFocusIn','focusin','EventTarget',undefined],
    ['event','onFocusOut','focusout','EventTarget',undefined],

    //style


];

const sourceGenerators = {

    //adapters template
    adapter: (entry: [string, AdapterEntry]): [string, string[]] => {
        const connectorName = (entry[1].childs == null ? 'no' : 'append')+'NodeConnector';
        const nodeFactoryName = entry[1].type+'NodeFactory';

        return [
            `export const ${entry[0]} = createDOMAdapter<
    ${entry[1].parent}, Document, 
    ${entry[1].target}, Document, 
    ${entry[1].childs == null ? 'undefined' : entry[1].childs}, Document, 
    string
>('${entry[1].key}', ${nodeFactoryName}, ${connectorName}, formatAdapterArgs);`, 
            ['createDOMAdapter', nodeFactoryName, connectorName, 'formatAdapterArgs']
        ];
    },

    //property template
    property: (entry: [string, PropertyEntry]): [string, string[]] => {
        const setterName = 'set'+entry[1].type;
        return [
            `export const ${entry[0]} = <T extends ${entry[1].target}, U extends Document>(value: PropertyValueType): NodeTask<T,U> => ${setterName}('${entry[1].key}', value);`,
            ['PropertyValueType','NodeTask',setterName]
        ];
    },

    //query template
    query: (entry: [string, QueryEntry]): [string, string[]] => {
        const getterName = 'get'+entry[1].type;
        return [
            `export const ${entry[0]} = <T extends ${entry[1].target}, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => ${getterName}('${entry[1].key}', key);`, 
            ['Filter',getterName]
        ];
    },

    //action template
    action: (entry: [string, ActionEntry]): [string, string[]] => {
        const params = entry[1].arguments.map(arg => arg[0]+': '+arg[1]).join(', ');
        const inputs = entry[1].arguments.map(arg => arg[0]).join(', ');
        return [
            `export const ${entry[0]} = <T extends ${entry[1].target}, U extends Document>(${params}): NodeTask<T,U> => [
    (entry: [T,U]) => {
        entry[0].${entry[1].callPath}(${inputs});
        return entry;
    }
];`,
            ['NodeTask']
        ];
    },

    //event template
    event: (entry: [string, EventEntry]): [string, string[]] => {
        return [
            `export const ${entry[0]} = <T extends ${entry[1].target}, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('${entry[1].key}', listener, options);`,
            ['NodeTask','subscribe']
        ];
    }

}

const coreLibSource = `
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
                    entry[0]?.appendChild(entry[1].createTextNode(arg));
                    return entry;
                }
            ];
            return arg;
        });

//@@ getElement > NodePicker @@//
export const getElement = <T extends Element, U extends Document>(query: string, container: Document | Element): NodePicker<T,U> => () => {
    const node = container.querySelector(query);
    return node == null ? node : [node as T, node.ownerDocument as U];
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
`;

const getLibEntriesFromData = (data: LibEntryData): [string, LibEntry][] => {
    
    if(data[0] === "adapter") return [[data[1], {
        template:"adapter",
        key: data[2],
        type: (data[4][0]+'').toLowerCase(),
        target: data[3],
        parent: data[4][1],
        childs: data[4][2],
        rendered: false
    } as AdapterEntry]];

    if(data[0] === "prop"){
        const res: [string, any][] = [];
        const name = data[1][0] === "$" ? data[1].slice(1) : data[1];
        const key = data[2][0] === "$" ? data[2].slice(1) : data[2];
        if(data[4] != null){
            res.push([data[1], {
                template:"property",
                key: key,
                type: data[4] === false ? 'Attr' : 'Prop',
                target: data[3],
                rendered: false
            } as PropertyEntry]);
        }
        res.push(['get'+name[0].toUpperCase()+name.slice(1), {
            template:"query",
            key: key,
            type: data[4] === false ? 'Attr' : 'Prop',
            target: data[3],
            rendered: false
        } as PropertyEntry]);
        return res;
    }

    if(data[0] === "action") return [[data[1], {
        template:"action",
        target: data[3],
        callPath: data[2],
        arguments: data[4],
        rendered: false
    } as ActionEntry]];

    if(data[0] === "event") return [[data[1], {
        template:"event",
        key: data[2],
        target: data[3],
        rendered: false
    } as EventEntry]];

    return [];
}

const renderAll = (entryMap: EntryMap): string => Object.entries(entryMap).map(entry => {
        if(isLibEntry(entry[1])){
            if(isAdpaterEntry(entry[1])) return sourceGenerators.adapter(entry as [string, AdapterEntry])[0];
            if(isPropertyEntry(entry[1])) return sourceGenerators.property(entry as [string, PropertyEntry])[0];
            if(isQueryEntry(entry[1])) return sourceGenerators.query(entry as [string, QueryEntry])[0];
            if(isActionEntry(entry[1])) return sourceGenerators.action(entry as [string, ActionEntry])[0];
            if(isEventEntry(entry[1])) return sourceGenerators.event(entry as [string, EventEntry])[0];
        }
        return entry[1].body;
    }).join('\n');


const renderPublic = (entryMap: EntryMap, token: string, rendered: Set<string>): [string, string[]] => {
    rendered.add(token);
    const entry = entryMap[token];
    if(isLibEntry(entry)){
        if(isAdpaterEntry(entry)) return sourceGenerators.adapter([token, entry]);
        if(isPropertyEntry(entry)) return sourceGenerators.property([token, entry]);
        if(isQueryEntry(entry)) return sourceGenerators.query([token, entry]);
        if(isActionEntry(entry)) return sourceGenerators.action([token, entry]);
        if(isEventEntry(entry)) return sourceGenerators.event([token, entry]);
    }
    return [entry.body, entry.deps];
}

const makePrivate = (sourceEntry: string): string => sourceEntry.trim().replace(/^export/i, '').trim();

const renderPrivate = (entryMap: EntryMap, deps: Set<string>, rendered: Set<string>): string[] => {
    let result: string[] = [];
    deps.forEach(token => {
        if(!rendered.has(token)){
            rendered.add(token);
            const entry = entryMap[token];
            let generated: [string, string[]] = ['',[]];
            if(isLibEntry(entry)){
                if(isAdpaterEntry(entry)) generated = sourceGenerators.adapter([token, entry]);
                if(isPropertyEntry(entry)) generated = sourceGenerators.property([token, entry]);
                if(isQueryEntry(entry)) generated = sourceGenerators.query([token, entry]);
                if(isActionEntry(entry)) generated = sourceGenerators.action([token, entry]);
                if(isEventEntry(entry)) generated = sourceGenerators.event([token, entry]);
                result = result.concat(renderPrivate(entryMap, new Set<string>(generated[1]), rendered));
                result.push(makePrivate(generated[0]));
            }else{
                result = result.concat(renderPrivate(entryMap, new Set<string>(entry.deps), rendered));
                result.push(makePrivate(entry.body));
            }
        }
    })
    return result;
}


const renderTokens = (tokens: string[], entryMap: EntryMap): string => {
    const renderedTokens = new Set<string>();
    const [publicSources, deps] = tokens.filter(token => entryMap[token] != null)
        .map(token => renderPublic(entryMap, token, renderedTokens))
        .reduce((acc: [string[], string[]], current) => { 
            return [
                acc[0].concat([current[0]]), 
                acc[1].concat(current[1])
            ];
        }, [[],[]] );
    const privateSources = renderPrivate(entryMap, new Set<string>(deps), renderedTokens);
    return privateSources.concat(publicSources).join('\n');
}

const coreEntries: [string, CoreEntry][] = coreLibSource.split('//@@').slice(1).map(entry => {
    const parts = entry.split('@@//\n');
    const headers = parts[0].split('>');
    return [
        headers[0].trim(), {
            deps: headers.length > 1 ? headers[1].split(',').map(dep => dep.trim()) : [],
            body: parts[1].trim(),
            rendered: false
        }
    ];
});

const entries : EntryMap = Object.fromEntries(
    coreEntries.concat(libData.reduce((prev, curr) => prev.concat(getLibEntriesFromData(curr)), [] as [string, any][]))
);


// console.log(JSON.stringify(entries, null, 2));
// console.log(renderAll(entries));
console.log(renderTokens(
    [
        'section', 'div', 'h2', 'span', 'h3', 'form', 'input', 
        'label', 'a', 'button', 'setAttr', 'className', 'createQuery', 
        'render','onClick', 'getProp', 'createRef', 
        'query', 'setStyle', 'store', 'textContent'
    ], 
    entries
));
// await Deno.writeTextFile(Deno.args[0], JSON.stringify(entries,null, 2));


