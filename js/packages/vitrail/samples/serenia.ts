export type Filter<TArg,TResult> = (arg: TArg) => TResult;
export type Task<T> = Filter<T,T>;
export type Connector<TTarget, TArg, TChild> = <T extends TTarget>(filter: Filter<TArg,TChild>, deriveArg: Filter<TTarget, TArg>) => Task<T>;
export type Branch<TArg, TTarget> = <TParent>(connector: Connector<TParent, TArg, TTarget>, deriveArg: Filter<TParent, TArg>) => Task<TParent>;
export type Adapter<TArg, TTarget, TCompat> = (...args: (Task<TTarget> | TCompat)[]) => Branch<TArg, TTarget>;
export type Lookup<T> = Filter<void,T|null|undefined>;
export type Curator<T> = (lookup: Lookup<T>) => void;
export type Delegate<T> = [Curator<T>, Lookup<T>];
export const createTreeNodeAdapter = <TArg, TTarget, TChild, K>(
    factory: Filter<TArg, TTarget>,
    connect: Connector<TTarget, TArg, TChild>,
    deriveArg: Filter<TTarget, TArg>,
    convert: Filter<K, Task<TTarget>>
): Adapter<TArg, TTarget, K | Branch<TArg, TChild>> => 
    (...args: (Task<TTarget> | K | Branch<TArg, TChild>)[]): Branch<TArg, TTarget> => 
        <T>(tConnect: Connector<T, TArg, TTarget>, tDerive: Filter<T, TArg>): Task<T> => 
            tConnect(
                args.reduce((filter, arg) => typeof arg === "function" ?
                    (arg.length == 1 ? 
                        (ctx: TArg) => (arg as Task<TTarget>)(filter(ctx)) :
                        (ctx: TArg) => (arg as Branch<TArg, TChild>)<TTarget>(connect, deriveArg)(filter(ctx))) :
                    (ctx: TArg) => convert(arg)(filter(ctx)), factory), 
                tDerive
            );
export const noConnector = <TArg, T>(_: Filter<TArg, any>): Task<T> => (target: T) => target;
export type DOMTaskContext = { document: Document, scope: string }
export type DOMTaskData<T> = { element: T, document: Document, scope: string }
export type DOMTaskArg = DOMTaskContext | null | undefined;
export type DOMTaskCompatible = string | number; // | Date | string[] | number[] | Element;
const htmlScope = "http://www.w3.org/1999/xhtml";
const svgScope = "http://www.w3.org/2000/svg";
const mathmlScope = "http://www.w3.org/1998/Math/MathML";
const textScope = "text";
const contextualScope = "ctx";
const defaultNodeFactory = <T>(tagName: string): Filter<DOMTaskArg, DOMTaskData<T>> => (arg: DOMTaskArg): DOMTaskData<T> => {
    if(arg == null) arg = { document: document, scope: htmlScope };
    (arg as DOMTaskData<T>).element = arg.document.createElement(tagName) as T;
    return arg as DOMTaskData<T>;
}
export const nodeFactory = <T>(tagName: string, scope?: string): Filter<DOMTaskArg, DOMTaskData<T>> => {
    if(scope == null) return defaultNodeFactory(tagName);
    switch(scope){
        case htmlScope: return defaultNodeFactory(tagName);
        case svgScope: return (arg: DOMTaskArg): DOMTaskData<T> => {
            if(arg == null) arg = { document: document, scope: svgScope };
            (arg as DOMTaskData<T>).element = arg.document.createElementNS(svgScope, tagName) as T;
            return arg as DOMTaskData<T>;
        };
        case mathmlScope: return (arg: DOMTaskArg): DOMTaskData<T> => {
            if(arg == null) arg = { document: document, scope: mathmlScope };
            (arg as DOMTaskData<T>).element = arg.document.createElementNS(mathmlScope, tagName) as T;
            return arg as DOMTaskData<T>;
        };
        case textScope: return (arg: DOMTaskArg): DOMTaskData<T> => {
            if(arg == null) arg = { document: document, scope: textScope };
            (arg as DOMTaskData<T>).element = arg.document.createTextNode(tagName) as T;
            return arg as DOMTaskData<T>;
        };
        case contextualScope: return (arg: DOMTaskArg): DOMTaskData<T> => {
            if(arg == null) arg = { document: document, scope: htmlScope };
            return nodeFactory<T>(tagName, arg.scope)(arg);
        };
        default: return defaultNodeFactory(tagName);
    }
}
export const deriveDOMTaskArg = <T>(data: DOMTaskData<T>): DOMTaskArg => data;
export const defaultConvert = <T extends Node>(arg: DOMTaskCompatible): Task<DOMTaskData<T>> => 
    (data: DOMTaskData<T>): DOMTaskData<T> => {
        if(data.scope === textScope){
            data.element.nodeValue = arg+"";
        }else{
            data.element.appendChild(data.document.createTextNode(arg+""));
        }
        return data;
    }
export const appendConnector = <T extends DOMTaskData<Element>>(filter: Filter<DOMTaskArg,DOMTaskData<Node>>): Task<T> =>
    (data: T): T => {
        data.element.appendChild(filter(data).element);
        return data;
    }
export const append = <T extends Element>(branch: Branch<DOMTaskArg, DOMTaskData<Node>>): Task<DOMTaskData<T>> => 
    branch<DOMTaskData<T>>(appendConnector, deriveDOMTaskArg);
export const appendTo = <T extends Node>(lookup: Lookup<DOMTaskData<Element>>): Task<DOMTaskData<T>> => 
    (node: DOMTaskData<T>): DOMTaskData<T> => {
        lookup()?.element.appendChild(node.element);
        return node; 
    }
export const prependConnector = <T extends DOMTaskData<Element>>(filter: Filter<DOMTaskArg,DOMTaskData<Node>>): Task<T> =>
    (data: T): T => {
        data.element.prepend(filter(data).element);
        return data;
    }
export const prepend = <T extends Element>(branch: Branch<DOMTaskArg, DOMTaskData<Node>>): Task<DOMTaskData<T>> =>
    branch<DOMTaskData<T>>(prependConnector, deriveDOMTaskArg);
export const prependTo = <T extends Node>(lookup: Lookup<DOMTaskData<Element>>): Task<DOMTaskData<T>> =>
    (node: DOMTaskData<T>): DOMTaskData<T> => {
        lookup()?.element.prepend(node.element);
        return node;
    }
export const getElement = <T extends Element>(query: string, container: Element | Document): Lookup<DOMTaskData<T>> => () => {
    const elt = container.querySelector(query);
    return elt == null ? null : { 
        element: elt as T, 
        document: elt.ownerDocument, 
        scope: elt.namespaceURI ?? htmlScope
    };
}
export const fromElement = <T extends Element>(element: T): Lookup<DOMTaskData<T>> => () => {
    return {
        element: element,
        document: element.ownerDocument,
        scope: element.namespaceURI ?? htmlScope
    }
}
export const render = <T extends Element>(lookup: Lookup<DOMTaskData<T>>, ...tasks: Task<DOMTaskData<T>>[]): Lookup<DOMTaskData<T>> => () => {
    const target = lookup();
    return target == null ? null : tasks.reduce((data, task) => task(data), target);
}
export const renderAll = <T extends Element>(lookup: Lookup<DOMTaskData<T>[]>, ...tasks: Task<DOMTaskData<T>>[]): Lookup<DOMTaskData<T>[]> => () => {
    const targets = lookup();
    return targets == null ? null : targets.map(target => tasks.reduce((data, task) => task(data), target));
}
export const handleNode = <T extends Node>(task: Task<T>): Task<DOMTaskData<T>> => (data: DOMTaskData<T>) => {
    data.element = task(data.element);
    return data;
}
export const createRef = <T extends Node>(): Delegate<DOMTaskData<T>> => {
    let getData: Lookup<DOMTaskData<T>> = () => null;
    return [
        (lookup: Lookup<DOMTaskData<T>>) => { getData = lookup; },
        () => getData()
    ]
}
export const createMultiRef = <T extends Node>(): [Curator<DOMTaskData<T>>, Lookup<DOMTaskData<T>[]>] => {
    let getters: Lookup<DOMTaskData<T>>[] = [];
    return [
        (lookup: Lookup<DOMTaskData<T>>) => { getters.push(lookup); },
        () => getters.map(getData => getData()).filter(data => data != null) as DOMTaskData<T>[]
    ]
}
export const createQuery = (): Delegate<[string, unknown][]> => {
    const getters: Lookup<[string, unknown][]>[] = [];
    return [
        (lookup: Lookup<[string, unknown][]>) => { getters.push(lookup); },
        () => getters.reduce((entries: [string, unknown][], getData) => entries.concat(getData() ?? []), [])
    ]
}
export const ref = <T extends Node>(curator: Curator<DOMTaskData<T>>): Task<DOMTaskData<T>> => 
    (data: DOMTaskData<T>) => {
        curator(() => data);
        return data;
    }
export const query = <T extends Node>(curator: Curator<[string, unknown][]>, ...queries: Filter<DOMTaskData<T>, [string, unknown][]>[]): Task<DOMTaskData<T>> =>
    (data: DOMTaskData<T>) => {
        curator(() => queries.reduce((entries: [string, unknown][], query) => entries.concat(query(data)), []));
        return data;
    }
export const tag = <T extends Element>(
    tag: string | [string, string], 
    ...tasks: (Task<DOMTaskData<T>> | Branch<DOMTaskArg, DOMTaskData<Element>> | DOMTaskCompatible)[]
): Branch<DOMTaskArg, DOMTaskData<T>> => 
<TParent>(pConnect: Connector<TParent, DOMTaskArg, DOMTaskData<T>>, pDerive: Filter<TParent, DOMTaskArg>): Task<TParent> => 
    pConnect( 
        tasks.reduce(
            (filter: Filter<DOMTaskArg, DOMTaskData<T>>, task) => typeof task === "function" ?
                (task.length == 1 ? 
                    (ctx: DOMTaskArg) => (task as Task<DOMTaskData<T>>)(filter(ctx)) :
                    (ctx: DOMTaskArg) => (task as Branch<DOMTaskArg, DOMTaskData<Element>>)<DOMTaskData<T>>(
                        appendConnector, deriveDOMTaskArg
                    )(filter(ctx))) :
                (ctx: DOMTaskArg) => defaultConvert<T>(task)(filter(ctx)), 
            typeof tag === 'string' ? nodeFactory<T>(tag) : nodeFactory<T>(tag[0], tag[1])),
        pDerive
    );
export type DOMPropertyValue = string | ((previous?: string) => string) | undefined;
export type DOMPropertyTask = <T extends Node>(value: DOMPropertyValue) => Task<DOMTaskData<T>>;
export const prop = <T extends Node>(key: string, value: DOMPropertyValue): Task<DOMTaskData<T>> =>
    value === undefined ?
        (data: DOMTaskData<T>) => { data.element[key] = null; return data; } :
        typeof value === "function" ?
            (data: DOMTaskData<T>) => { data.element[key] = value(data.element[key]); return data; } :
            (data: DOMTaskData<T>) => { data.element[key] = value; return data; }
export const getProp = <T extends Node>(key: string, alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> =>
    (data: DOMTaskData<T>) => [[alias || key, data.element[key]]];
export const removeProp = <T extends Node>(key: string): Task<DOMTaskData<T>> => prop<T>(key, undefined);
export const attr = <T extends Element>(key: string, value: DOMPropertyValue): Task<DOMTaskData<T>> =>
    value === undefined ?
        (data: DOMTaskData<T>) => { data.element.removeAttribute(key); return data; } :
        typeof value === "function" ?
            (data: DOMTaskData<T>) => { data.element.setAttribute(key, value(data.element.getAttribute(key) ?? undefined)); return data; } :
            (data: DOMTaskData<T>) => { data.element.setAttribute(key, value); return data; }
export const getAttr = <T extends Element>(key: string, alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> =>
    (data: DOMTaskData<T>) => [[alias || key, data.element.getAttribute(key)]];
export const removeAttr = <T extends Element>(key: string): Task<DOMTaskData<T>> => attr<T>(key, undefined);
const ariaPreffix = "aria-";
export const aria = <T extends Element>(key: string, value: DOMPropertyValue): Task<DOMTaskData<T>> => attr<T>(ariaPreffix+key, value);
export const getAria = <T extends Element>(key: string, alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>(ariaPreffix+key, alias);
export const removeAria = <T extends Element>(key: string): Task<DOMTaskData<T>> => aria<T>(ariaPreffix+key, undefined);
export type SpecializedElement = HTMLElement | SVGElement | MathMLElement;
export const dataAttr = <T extends SpecializedElement>(key: string, value: DOMPropertyValue): Task<DOMTaskData<T>> =>
    value === undefined ?
        (data: DOMTaskData<T>) => { delete data.element.dataset[key]; return data; } :
        typeof value === "function" ?
            (data: DOMTaskData<T>) => { data.element.dataset[key] = value(data.element.dataset[key] ?? undefined); return data; } :
            (data: DOMTaskData<T>) => { data.element.dataset[key] = value; return data; }
export const getDataAttr = <T extends SpecializedElement>(key: string, alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> =>
    (data: DOMTaskData<T>) => [[alias || key, data.element.dataset[key]]];
export const removeDataAttr = <T extends SpecializedElement>(key: string): Task<DOMTaskData<T>> => dataAttr<T>(key, undefined);
export const style = <T extends SpecializedElement>(key: string, value: DOMPropertyValue): Task<DOMTaskData<T>> =>
    value === undefined ?
        (data: DOMTaskData<T>) => { data.element.style[key] = null; return data; } :
        typeof value === "function" ?
            (data: DOMTaskData<T>) => { data.element.style[key] = value(data.element.style[key] ?? undefined); return data; } :
            (data: DOMTaskData<T>) => { data.element.style[key] = value; return data; }
export const css = <T extends SpecializedElement>(value: string | ((previous: string) => string)): Task<DOMTaskData<T>> =>
    typeof value === "function" ?
        (data: DOMTaskData<T>) => { data.element.style.cssText = value(data.element.style.cssText); return data; } :
        (data: DOMTaskData<T>) => { data.element.style.cssText = value; return data; }
export const getStyle = <T extends SpecializedElement>(key: string, alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> =>
    (data: DOMTaskData<T>) => [[alias || key, data.element.style[key]]];
export const removeStyle = <T extends SpecializedElement>(key: string): Task<DOMTaskData<T>> => style<T>(key, undefined);
export const remove = <T extends Node>(property: DOMPropertyTask): Task<DOMTaskData<T>> => property(undefined);
export const subscribe = <T extends EventTarget>(
    eventType: string,
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => (data: DOMTaskData<T>) => { 
    data.element.addEventListener(eventType, listener, options); 
    return data; 
}
export const unsubscribe = <T extends EventTarget>(
    eventType: string,
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => (data: DOMTaskData<T>) => { 
    data.element.removeEventListener(eventType, listener, options); 
    return data; 
}
export type HTMLProxyTarget = Record<string, Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, string | Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>>>>;
export type SVGProxyTarget = Record<string, Adapter<DOMTaskArg, DOMTaskData<SVGElement>, string | Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>>>>;
export type MathMLProxyTarget = Record<string, Adapter<DOMTaskArg, DOMTaskData<MathMLElement>, string | Branch<DOMTaskArg, DOMTaskData<Text | MathMLElement>>>>;
export type DOMPropertyProxyTarget = Record<string, DOMPropertyTask>;
export type DOMAttributeProxyTarget = Record<string, (value: DOMPropertyValue) => Task<DOMTaskData<Element>>>;
export type DOMStylePropertyProxyTarget = Record<string, (value: DOMPropertyValue) => Task<DOMTaskData<SpecializedElement>>>;
export type DOMEventProxyTarget = Record<string, (listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => Task<DOMTaskData<EventTarget>>>;
export const adapters = {
    html: new Proxy<HTMLProxyTarget>({}, {
        get(target, key, receiver) {
            if(typeof key === "string") return createTreeNodeAdapter<
                DOMTaskArg, DOMTaskData<HTMLElement>, DOMTaskData<Text | HTMLElement>, string
            >(nodeFactory<HTMLElement>(key, htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
            return Reflect.get(target, key, receiver);
        }
    }),
    svg: new Proxy<SVGProxyTarget>({}, {
        get(target, key, receiver) {
            if(typeof key === "string") return createTreeNodeAdapter<
                DOMTaskArg, DOMTaskData<SVGElement>, DOMTaskData<Text | SVGElement>, string
            >(nodeFactory<SVGElement>(key, svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
            return Reflect.get(target, key, receiver);
        }
    }),
    math: new Proxy<MathMLProxyTarget>({}, {
        get(target, key, receiver) {
            if(typeof key === "string") return createTreeNodeAdapter<
                DOMTaskArg, DOMTaskData<MathMLElement>, DOMTaskData<Text | MathMLElement>, string
            >(nodeFactory<MathMLElement>(key, mathmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
            return Reflect.get(target, key, receiver);
        }
    }),
    props: new Proxy<DOMPropertyProxyTarget>({}, {
        get(target, key, receiver) {
            if(typeof key === "string") return (value: DOMPropertyValue): Task<DOMTaskData<Node>> => prop(key, value);
            return Reflect.get(target, key, receiver);
        }
    }),
    attrs: new Proxy<DOMAttributeProxyTarget>({}, {
        get(target, key, receiver) {
            if(typeof key === "string") return (value: DOMPropertyValue): Task<DOMTaskData<Element>> => 
                attr(/^aria[A-Z].*$/g.test(key) ? key.replace('aria', ariaPreffix) : key, value);
            return Reflect.get(target, key, receiver);
        }
    }),
    style: new Proxy<DOMStylePropertyProxyTarget>({}, {
        get(target, key, receiver) {
            if(typeof key === "string") return (value: DOMPropertyValue): Task<DOMTaskData<SpecializedElement>> => style(key, value);
            return Reflect.get(target, key, receiver);
        }
    }),
    events: new Proxy<DOMEventProxyTarget>({}, {
        get(target, key, receiver) {
            if(typeof key === "string") return (key.startsWith('on') && key.length > 2) ? 
                (listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<EventTarget>> => subscribe(key.slice(2).toLowerCase(), listener, options) :
                (key.startsWith('off') && key.length > 3) ?
                    (listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<EventTarget>> => unsubscribe(key.slice(3).toLowerCase(), listener, options) :
                    (listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<EventTarget>> => subscribe(key, listener, options);

            return Reflect.get(target, key, receiver);
        }
    })
};
export type DOMPropertyQueryProxyTarget = Record<string, (key: string, alias?: string) => Filter<DOMTaskData<Node>,[string, unknown][]>>;
export type DOMStylePropertyQueryProxyTarget = Record<string, (key: string, alias?: string) => Filter<DOMTaskData<SpecializedElement>,[string, unknown][]>>;
export const queries = {
    props: new Proxy<DOMPropertyQueryProxyTarget>({},{
        get(target, key, receiver) {
            if(typeof key === "string") return (key: string, alias?: string): Filter<DOMTaskData<Node>,[string, unknown][]> => 
                getProp(key, alias);
            return Reflect.get(target, key, receiver);
        }
    }),
    style: new Proxy<DOMStylePropertyQueryProxyTarget>({},{
        get(target, key, receiver) {
            if(typeof key === "string") return (key: string, alias?: string): Filter<DOMTaskData<SpecializedElement>,[string, unknown][]> => 
                getStyle(key, alias);
            return Reflect.get(target, key, receiver);
        }
    })
}
export const textNode = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<Text>, 
    undefined, string
>(nodeFactory<Text>("", textScope), noConnector, deriveDOMTaskArg, defaultConvert);
export const a = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLAnchorElement | SVGAElement>, 
    DOMTaskData<HTMLElement | SVGElement | Text>, string
>(nodeFactory<HTMLAnchorElement | SVGAElement>("a", contextualScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const titleTag = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLTitleElement | SVGTitleElement>, 
    DOMTaskData<HTMLElement | SVGElement | Text>, string
>(nodeFactory<HTMLTitleElement | SVGTitleElement>("title", contextualScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const scriptTag = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement | SVGScriptElement>, 
    DOMTaskData<HTMLElement | SVGElement | Text>, string
>(nodeFactory<HTMLElement | SVGScriptElement>("script", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const styleTag = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement | SVGStyleElement>, 
    DOMTaskData<Text>, string
>(nodeFactory<HTMLElement | SVGStyleElement>("style", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const htmlA = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLAnchorElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLAnchorElement>("htmlA", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const abbr = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("abbr", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const address = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("address", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const area = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLAreaElement>, 
    undefined, string
>(nodeFactory<HTMLAreaElement>("area", htmlScope), noConnector, deriveDOMTaskArg, defaultConvert);
export const article = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("article", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const aside = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("aside", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const audio = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLAudioElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLAudioElement>("audio", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const b = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("b", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const base = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLBaseElement>, 
    undefined, string
>(nodeFactory<HTMLBaseElement>("base", htmlScope), noConnector, deriveDOMTaskArg, defaultConvert);
export const bdi = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("bdi", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const bdo = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("bdo", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const blockquote = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLQuoteElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLQuoteElement>("blockquote", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const body = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("body", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const br = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLBRElement>, 
    undefined, string
>(nodeFactory<HTMLBRElement>("br", htmlScope), noConnector, deriveDOMTaskArg, defaultConvert);
export const button = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLButtonElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLButtonElement>("button", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const canvas = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLCanvasElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLCanvasElement>("canvas", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const caption = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLTableCaptionElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLTableCaptionElement>("caption", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const cite = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLQuoteElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLQuoteElement>("cite", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const code = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("code", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const col = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLTableColElement>, 
    undefined, string
>(nodeFactory<HTMLTableColElement>("col", htmlScope), noConnector, deriveDOMTaskArg, defaultConvert);
export const colgroup = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLTableColElement>, 
    DOMTaskData<HTMLTableColElement>, string
>(nodeFactory<HTMLTableColElement>("colgroup", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const data = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLDataElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLDataElement>("data", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const datalist = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLDataListElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLDataListElement>("datalist", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const dd = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("dd", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const del = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLModElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLModElement>("del", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const details = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("details", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const dfn = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("dfn", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const dialog = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLDialogElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLDialogElement>("dialog", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const div = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLDivElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLDivElement>("div", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const dl = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("dl", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const dt = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("dt", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const em = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("em", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const embed = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLEmbedElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLEmbedElement>("embed", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const fieldset = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLFieldSetElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLFieldSetElement>("fieldset", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const figcaption = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("figcaption", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const figure = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("figure", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const footer = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("footer", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const form = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLFormElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLFormElement>("form", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const h1 = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLHeadingElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLHeadingElement>("h1", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const h2 = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLHeadingElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLHeadingElement>("h2", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const h3 = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLHeadingElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLHeadingElement>("h3", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const h4 = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLHeadingElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLHeadingElement>("h4", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const h5 = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLHeadingElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLHeadingElement>("h5", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const h6 = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLHeadingElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLHeadingElement>("h6", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const head = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLHeadElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLHeadElement>("head", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const header = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("header", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const hgroup = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("hgroup", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const hr = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLHRElement>, 
    undefined, string
>(nodeFactory<HTMLHRElement>("hr", htmlScope), noConnector, deriveDOMTaskArg, defaultConvert);
export const html = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("html", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const i = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("i", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const iframe = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLIFrameElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLIFrameElement>("iframe", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const img = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLImageElement>, 
    undefined, string
>(nodeFactory<HTMLImageElement>("img", htmlScope), noConnector, deriveDOMTaskArg, defaultConvert);
export const input = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLInputElement>, 
    undefined, string
>(nodeFactory<HTMLInputElement>("input", htmlScope), noConnector, deriveDOMTaskArg, defaultConvert);
export const ins = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLModElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLModElement>("ins", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const kbd = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("kbd", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const label = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLLabelElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLLabelElement>("label", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const legend = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLLegendElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLLegendElement>("legend", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const li = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLLIElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLLIElement>("li", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const link = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLLinkElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLLinkElement>("link", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const main = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("main", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const mark = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("mark", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const menu = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLMenuElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLMenuElement>("menu", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const meta = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("meta", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const meter = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLMeterElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLMeterElement>("meter", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const nav = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("nav", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const noscript = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("noscript", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const object = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLObjectElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLObjectElement>("object", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const ol = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLOListElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLOListElement>("ol", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const optgroup = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLOptGroupElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLOptGroupElement>("optgroup", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const option = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLOptionElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLOptionElement>("option", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const output = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLOutputElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLOutputElement>("output", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const p = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLParagraphElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLParagraphElement>("p", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const param = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLParagraphElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLParagraphElement>("param", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const picture = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLPictureElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLPictureElement>("picture", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const pre = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLPreElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLPreElement>("pre", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const progress = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLProgressElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLProgressElement>("progress", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const q = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLQuoteElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLQuoteElement>("q", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const rp = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("rp", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const rt = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("rt", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const ruby = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("ruby", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const s = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("s", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const samp = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("samp", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const htmlScriptTag = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("script", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const search = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("search", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const section = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("section", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const select = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLSelectElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLSelectElement>("select", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const slotTag = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLSlotElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLSlotElement>("slot", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const small = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("small", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const source = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLSourceElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLSourceElement>("source", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const span = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("span", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const strong = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("strong", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const htmlStyleTag = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("style", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const sub = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("sub", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const summary = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("summary", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const sup = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("sup", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const table = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLTableElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLTableElement>("table", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const tbody = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLTableSectionElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLTableSectionElement>("tbody", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const td = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLTableCellElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLTableCellElement>("td", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const template = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLTemplateElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLTemplateElement>("template", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const textarea = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLTextAreaElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLTextAreaElement>("textarea", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const tfoot = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLTableSectionElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLTableSectionElement>("tfoot", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const th = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLTableCellElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLTableCellElement>("th", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const thead = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLTableSectionElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLTableSectionElement>("thead", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const tile = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLTimeElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLTimeElement>("tile", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const htmlTitleTag = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLTitleElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLTitleElement>("title", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const tr = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLTableRowElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLTableRowElement>("tr", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const track = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLTrackElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLTrackElement>("track", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const u = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("u", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const ul = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLUListElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLUListElement>("ul", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const varTag = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("var", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const video = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLVideoElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLVideoElement>("video", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const wbr = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<HTMLElement>, 
    DOMTaskData<Text | HTMLElement>, string
>(nodeFactory<HTMLElement>("wbr", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const animate = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGAnimateElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGAnimateElement>("animate", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const animateMotion = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGAnimateMotionElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGAnimateMotionElement>("animateMotion", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const animateTransform = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGAnimateTransformElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGAnimateTransformElement>("animateTransform", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const circle = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGCircleElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGCircleElement>("circle", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const clipPath = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGClipPathElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGClipPathElement>("clipPath", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const defs = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGDefsElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGDefsElement>("defs", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const desc = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGDescElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGDescElement>("desc", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const ellipse = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGEllipseElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGEllipseElement>("ellipse", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feBlend = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFEBlendElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFEBlendElement>("feBlend", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feColorMatrix = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFEColorMatrixElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFEColorMatrixElement>("feColorMatrix", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feComponentTransfer = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFEComponentTransferElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFEComponentTransferElement>("feComponentTransfer", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feComposite = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFECompositeElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFECompositeElement>("feComposite", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feConvolveMatrix = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFEConvolveMatrixElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFEConvolveMatrixElement>("feConvolveMatrix", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feDiffuseLighting = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFEDiffuseLightingElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFEDiffuseLightingElement>("feDiffuseLighting", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feDisplacementMap = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFEDisplacementMapElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFEDisplacementMapElement>("feDisplacementMap", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feDistantLight = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFEDistantLightElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFEDistantLightElement>("feDistantLight", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feDropShadow = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFEDropShadowElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFEDropShadowElement>("feDropShadow", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feFlood = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFEFloodElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFEFloodElement>("feFlood", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feFuncA = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFEFuncAElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFEFuncAElement>("feFuncA", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feFuncB = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFEFuncBElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFEFuncBElement>("feFuncB", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feFuncG = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFEFuncGElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFEFuncGElement>("feFuncG", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feFuncR = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFEFuncRElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFEFuncRElement>("feFuncR", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feGaussianBlur = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFEGaussianBlurElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFEGaussianBlurElement>("feGaussianBlur", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feImage = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFEImageElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFEImageElement>("feImage", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feMerge = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFEMergeElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFEMergeElement>("feMerge", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feMergeNode = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFEMergeNodeElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFEMergeNodeElement>("feMergeNode", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feMorphology = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFEMorphologyElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFEMorphologyElement>("feMorphology", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feOffset = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFEOffsetElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFEOffsetElement>("feOffset", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const fePointLight = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFEPointLightElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFEPointLightElement>("fePointLight", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feSpecularLighting = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFESpecularLightingElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFESpecularLightingElement>("feSpecularLighting", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feSpotLight = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFESpotLightElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFESpotLightElement>("feSpotLight", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feTile = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFETileElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFETileElement>("feTile", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feTurbulence = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFETurbulenceElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFETurbulenceElement>("feTurbulence", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const filter = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGFilterElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGFilterElement>("filter", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const g = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGGElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGGElement>("g", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const image = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGImageElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGImageElement>("image", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const line = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGLineElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGLineElement>("line", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const linearGradient = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGLinearGradientElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGLinearGradientElement>("linearGradient", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const marker = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGMarkerElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGMarkerElement>("marker", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const mask = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGMaskElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGMaskElement>("mask", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const metadata = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGMetadataElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGMetadataElement>("metadata", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const mpath = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGMPathElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGMPathElement>("mpath", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const path = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGPathElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGPathElement>("path", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const polygon = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGPolygonElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGPolygonElement>("polygon", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const polyline = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGPolylineElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGPolylineElement>("polyline", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const radialGradient = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGRadialGradientElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGRadialGradientElement>("radialGradient", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const rect = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGRectElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGRectElement>("rect", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const stop = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGStopElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGStopElement>("stop", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const svg = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGSVGElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGSVGElement>("svg", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const set = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGSetElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGSetElement>("set", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const svgA = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGAElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGAElement>("a", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const patternTag = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGPatternElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGPatternElement>("pattern", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const switchTag = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGSwitchElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGSwitchElement>("switch", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const symbolTag = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGSymbolElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGSymbolElement>("symbol", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const svgTitleTag = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGTitleElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGTitleElement>("title", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const svgScriptTag = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGScriptElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGScriptElement>("script", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const svgStyleTag = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGStyleElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGStyleElement>("style", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const text = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGTextElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGTextElement>("text", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const textPath = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGTextPathElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGTextPathElement>("textPath", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const tspan = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGTSpanElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGTSpanElement>("tspan", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const use = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGUseElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGUseElement>("use", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const view = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<SVGViewElement>, 
    DOMTaskData<Text | SVGElement>, string
>(nodeFactory<SVGViewElement>("view", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const id = <T extends Element>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('id', value);
export const accesskey = <T extends Element>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('accesskey', value);
export const autocapitalize = <T extends Element>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('autocapitalize', value);
export const autofocus = <T extends Element>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('autofocus', value);
export const enterkeyhint = <T extends Element>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('enterkeyhint', value);
export const exportparts = <T extends Element>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('exportparts', value);
export const hidden = <T extends Element>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('hidden', value);
export const inert = <T extends Element>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('inert', value);
export const inputmode = <T extends Element>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('inputmode', value);
export const is = <T extends Element>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('is', value);
export const nonce = <T extends Element>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('nonce', value);
export const part = <T extends Element>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('part', value);
export const popover = <T extends Element>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('popover', value);
export const slot = <T extends Element>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('slot', value);
export const spellcheck = <T extends Element>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('spellcheck', value);
export const translate = <T extends Element>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('translate', value);
export const className = <T extends Element>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('class', value);
export const title = <T extends HTMLElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('title', value);
export const tabIndex = <T extends HTMLElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('tabIndex', value);
export const lang = <T extends HTMLElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('lang', value);
export const dir = <T extends HTMLElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('dir', value);
export const draggable = <T extends HTMLElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('draggable', value);
export const itemid = <T extends HTMLElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('itemid', value);
export const itemprop = <T extends HTMLElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('itemprop', value);
export const itemref = <T extends HTMLElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('itemref', value);
export const itemscope = <T extends HTMLElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('itemscope', value);
export const itemtype = <T extends HTMLElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('itemtype', value);
export const crossorigin = <T extends HTMLElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('crossorigin', value);
export const disabled = <T extends HTMLElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('disabled', value);
export const elementtiming = <T extends HTMLElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('elementtiming', value);
export const max = <T extends HTMLElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('max', value);
export const min = <T extends HTMLElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('min', value);
export const step = <T extends HTMLInputElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('step', value);
export const type = <T extends HTMLInputElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('type', value);
export const accept = <T extends HTMLInputElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('accept', value);
export const capture = <T extends HTMLInputElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('capture', value);
export const pattern = <T extends HTMLInputElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('pattern', value);
export const placeholder = <T extends HTMLInputElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('placeholder', value);
export const forAttr = <T extends HTMLLabelElement | HTMLOutputElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('forAttr', value);
export const size = <T extends HTMLInputElement | HTMLSelectElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('size', value);
export const dirname = <T extends HTMLInputElement | HTMLTextAreaElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('dirname', value);
export const multiple = <T extends HTMLInputElement | HTMLTextAreaElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('multiple', value);
export const readonly = <T extends HTMLInputElement | HTMLTextAreaElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('readonly', value);
export const maxlength = <T extends HTMLInputElement | HTMLTextAreaElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('maxlength', value);
export const minlength = <T extends HTMLInputElement | HTMLTextAreaElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('minlength', value);
export const required = <T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('required', value);
export const rel = <T extends HTMLAnchorElement | HTMLAreaElement | HTMLLinkElement | HTMLFormElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('rel', value);
export const autocomplete = <T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLFormElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('autocomplete', value);
export const nodeValue = <T extends Node>(value: DOMPropertyValue): Task<DOMTaskData<T>> => prop('nodeValue', value);
export const textContent = <T extends Node>(value: DOMPropertyValue): Task<DOMTaskData<T>> => prop('textContent', value);
export const innerHTML = <T extends Element>(value: DOMPropertyValue): Task<DOMTaskData<T>> => prop('innerHTML', value);
export const outerHTML = <T extends Element>(value: DOMPropertyValue): Task<DOMTaskData<T>> => prop('outerHTML', value);
export const getId = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('id', alias);
export const getAccesskey = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('accesskey', alias);
export const getAutocapitalize = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('autocapitalize', alias);
export const getAutofocus = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('autofocus', alias);
export const getEnterkeyhint = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('enterkeyhint', alias);
export const getExportparts = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('exportparts', alias);
export const getHidden = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('hidden', alias);
export const getInert = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('inert', alias);
export const getInputmode = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('inputmode', alias);
export const getIs = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('is', alias);
export const getNonce = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('nonce', alias);
export const getPart = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('part', alias);
export const getPopover = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('popover', alias);
export const getSlot = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('slot', alias);
export const getSpellcheck = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('spellcheck', alias);
export const getTranslate = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('translate', alias);
export const getClassName = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('class', alias);
export const getNodeValue = <T extends Node>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getProp<T>('nodeValue', alias);
export const getTextContent = <T extends Node>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getProp<T>('textContent', alias);
export const getInnerHTML = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getProp<T>('innerHTML', alias);
export const getOuterHTML = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getProp<T>('outerHTML', alias);
export const nodeName = <T extends Node>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getProp<T>('nodeName', alias);
export const nodeType = <T extends Node>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getProp<T>('nodeType', alias);
export const clientHeight = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getProp<T>('clientHeight', alias);
export const clientLeft = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getProp<T>('clientLeft', alias);
export const clientTop = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getProp<T>('clientTop', alias);
export const clientWidth = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getProp<T>('clientWidth', alias);
export const tagName = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getProp<T>('tagName', alias);
export const getTitle = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('title', alias);
export const getTabIndex = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('tabIndex', alias);
export const getLang = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('lang', alias);
export const getDir = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('dir', alias);
export const getDraggable = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('draggable', alias);
export const getItemid = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('itemid', alias);
export const getItemprop = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('itemprop', alias);
export const getItemref = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('itemref', alias);
export const getItemscope = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('itemscope', alias);
export const getItemtype = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('itemtype', alias);
export const getCrossorigin = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('crossorigin', alias);
export const getDisabled = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('disabled', alias);
export const getElementtiming = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('elementtiming', alias);
export const getMax = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('max', alias);
export const getMin = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('min', alias);
export const getStep = <T extends HTMLInputElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('step', alias);
export const getType = <T extends HTMLInputElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('type', alias);
export const getAccept = <T extends HTMLInputElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('accept', alias);
export const getCapture = <T extends HTMLInputElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('capture', alias);
export const getPattern = <T extends HTMLInputElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('pattern', alias);
export const getPlaceholder = <T extends HTMLInputElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('placeholder', alias);
export const getForAttr = <T extends HTMLLabelElement | HTMLOutputElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('forAttr', alias);
export const getSize = <T extends HTMLInputElement | HTMLSelectElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('size', alias);
export const getDirname = <T extends HTMLInputElement | HTMLTextAreaElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('dirname', alias);
export const getMultiple = <T extends HTMLInputElement | HTMLTextAreaElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('multiple', alias);
export const getReadonly = <T extends HTMLInputElement | HTMLTextAreaElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('readonly', alias);
export const getMaxlength = <T extends HTMLInputElement | HTMLTextAreaElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('maxlength', alias);
export const getMinlength = <T extends HTMLInputElement | HTMLTextAreaElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('minlength', alias);
export const getRequired = <T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('required', alias);
export const getRel = <T extends HTMLAnchorElement | HTMLAreaElement | HTMLLinkElement | HTMLFormElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('rel', alias);
export const getAutocomplete = <T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLFormElement>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>('autocomplete', alias);
export const addClass = <T extends Element>(name: string): Task<DOMTaskData<T>> => (data: DOMTaskData<T>): DOMTaskData<T> => {
    data.element.classList.add(name);
    return data;
};
export const removeClass = <T extends Element>(name: string): Task<DOMTaskData<T>> => (data: DOMTaskData<T>): DOMTaskData<T> => {
    data.element.classList.remove(name);
    return data;
};
export const toggleClass = <T extends Element>(name: string): Task<DOMTaskData<T>> => (data: DOMTaskData<T>): DOMTaskData<T> => {
    data.element.classList.toggle(name);
    return data;
};
export const dispatch = <T extends EventTarget>(event: Event): Task<DOMTaskData<T>> => (data: DOMTaskData<T>): DOMTaskData<T> => {
    data.element.dispatchEvent(event);
    return data;
};
export const onClick = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => subscribe('click', listener, options);
export const onDbClick = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => subscribe('dbclick', listener, options);
export const onBlur = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => subscribe('blur', listener, options);
export const onFocus = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => subscribe('focus', listener, options);
export const onChange = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => subscribe('change', listener, options);
export const onMouseDown = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => subscribe('mousedown', listener, options);
export const onMouseEnter = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => subscribe('mouseenter', listener, options);
export const onMouseLeave = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => subscribe('mouseleave', listener, options);
export const onMouseMove = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => subscribe('mousemove', listener, options);
export const onMouseOut = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => subscribe('mouseout', listener, options);
export const onMouseOver = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => subscribe('mouseover', listener, options);
export const onMouseUp = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => subscribe('mouseup', listener, options);
export const onWheel = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => subscribe('wheel', listener, options);
export const onScroll = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => subscribe('scroll', listener, options);
export const onKeyDown = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => subscribe('keydown', listener, options);
export const onKeyPress = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => subscribe('keypress', listener, options);
export const onKeyUp = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => subscribe('keyup', listener, options);
export const onCopy = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => subscribe('copy', listener, options);
export const onCut = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => subscribe('cut', listener, options);
export const onPaste = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => subscribe('paste', listener, options);
export const onSelect = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => subscribe('select', listener, options);
export const onFocusIn = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => subscribe('focusin', listener, options);
export const onFocusOut = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => subscribe('focusout', listener, options);