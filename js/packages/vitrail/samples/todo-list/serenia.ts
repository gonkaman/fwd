export type Filter<TArg,TResult> = (arg: TArg) => TResult;
export type Task<T> = Filter<T,T>;
export type Connector<TTarget, TArg, TChild> = <T extends TTarget>(filter: Filter<TArg,TChild>, deriveArg: Filter<TTarget, TArg>) => Task<T>;
export type Branch<TArg, TTarget, TParent> = (connector: Connector<TParent, TArg, TTarget>, deriveArg: Filter<TParent, TArg>) => Task<TParent>;
export type Adapter<TArg, TTarget, TCompat> = <TParent>(...args: (Task<TTarget> | TCompat)[]) => Branch<TArg, TTarget, TParent>;
export type Lookup<T> = Filter<void,T|null|undefined>;
export type Curator<T> = (lookup: Lookup<T>) => void;
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
    if(arg == null) return { element: document.createElement(tagName), document: document, scope: htmlScope } as DOMTaskData<T>;
    return { element: arg.document.createElement(tagName), document: arg.document, scope: htmlScope } as DOMTaskData<T>;
}
export const nodeFactory = <T>(tagName: string, scope?: string): Filter<DOMTaskArg, DOMTaskData<T>> => {
    if(scope == null) return defaultNodeFactory(tagName);
    switch(scope){
        case htmlScope: return defaultNodeFactory(tagName);
        case svgScope: return (arg: DOMTaskArg): DOMTaskData<T> => {
            if(arg == null) return { element: document.createElementNS(svgScope, tagName), document: document, scope: svgScope } as DOMTaskData<T>;
            return { element: arg.document.createElementNS(svgScope, tagName), document: arg.document, scope: svgScope } as DOMTaskData<T>;
        };
        case mathmlScope: return (arg: DOMTaskArg): DOMTaskData<T> => {
            if(arg == null) return { element: document.createElementNS(mathmlScope, tagName), document: document, scope: mathmlScope } as DOMTaskData<T>;
            return { element: arg.document.createElementNS(mathmlScope, tagName), document: arg.document, scope: mathmlScope } as DOMTaskData<T>;
        };
        case textScope: return (arg: DOMTaskArg): DOMTaskData<T> => {
            if(arg == null) return { element: document.createTextNode(tagName), document: document, scope: textScope } as DOMTaskData<T>;
            return { element: arg.document.createTextNode(tagName), document: arg.document, scope: textScope } as DOMTaskData<T>;
        };
        case contextualScope: return (arg: DOMTaskArg): DOMTaskData<T> => {
            if(arg == null) return defaultNodeFactory<T>(tagName)(arg);
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
export const appendConnector = <T extends DOMTaskData<Node>>(filter: Filter<DOMTaskArg,DOMTaskData<Node>>): Task<T> =>
    (data: T): T => {
        data.element.appendChild(filter(data).element);
        return data;
    }
export const append = <T extends Element>(branch: Branch<DOMTaskArg, DOMTaskData<Node>, DOMTaskData<T> | unknown>): Task<DOMTaskData<T>> => 
(branch as Branch<DOMTaskArg, DOMTaskData<Node>, DOMTaskData<T>>)(appendConnector, deriveDOMTaskArg);
export const appendAll = <T extends Element>(...branches: Branch<DOMTaskArg, DOMTaskData<Node>, DOMTaskData<T> | unknown>[]): Task<DOMTaskData<T>> => 
    (data: DOMTaskData<T>) => branches.reduce((current, branch) => 
        (branch as Branch<DOMTaskArg, DOMTaskData<Node>, DOMTaskData<T>>)(appendConnector, deriveDOMTaskArg)(current), data);
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
export const prepend = <T extends Element>(branch: Branch<DOMTaskArg, DOMTaskData<Node>, DOMTaskData<T> | unknown>): Task<DOMTaskData<T>> =>
(branch as Branch<DOMTaskArg, DOMTaskData<Node>, DOMTaskData<T>>)(prependConnector, deriveDOMTaskArg);
export const prependAll = <T extends Element>(...branches: Branch<DOMTaskArg, DOMTaskData<Node>, DOMTaskData<T> | unknown>[]): Task<DOMTaskData<T>> =>
    (data: DOMTaskData<T>) => branches.reduce((current, branch) => 
        (branch as Branch<DOMTaskArg, DOMTaskData<Node>, DOMTaskData<T>>)(prependConnector, deriveDOMTaskArg)(current), data);
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

export const detach = <T extends Node>(): Task<DOMTaskData<T>> => (data: DOMTaskData<T>) => {
    data.element.parentNode?.removeChild(data.element);
    return data;
}
export const createRef = <T extends Node>(): [Curator<DOMTaskData<T>>, Lookup<DOMTaskData<T>>] => {
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
export const createQuery = (): [Filter<[string, Lookup<unknown>],void>, Filter<string | undefined | null, unknown>] => {
    const queryMap: Map<string, Lookup<unknown>> = new Map<string, Lookup<unknown>>();
    return [
        (lookup: [string, Lookup<unknown>]) => { queryMap.set(...lookup); },
        (key?: string | null) => {
            if(key == null) return new Map<string, unknown>(Array.from(queryMap.entries()).map(entry => [entry[0], entry[1]()]));
            const valueLookup = queryMap.get(key);
            return valueLookup == null ? valueLookup+"" : valueLookup();
        }
    ]
}
export const ref = <T extends Node>(curator: Curator<DOMTaskData<T>>): Task<DOMTaskData<T>> => 
    (data: DOMTaskData<T>) => {
        curator(() => data);
        return data;
    }
export const query = <T extends Node>(curator: Filter<[string, Lookup<unknown>],void>, ...queryFilters: Filter<DOMTaskData<T>, [string, Lookup<unknown>]>[]): Task<DOMTaskData<T>> =>
    (data: DOMTaskData<T>) => {
        queryFilters.forEach(filter => curator(filter(data)));
        return data;
    }
export const domBranch = <T>(args: (
        Task<DOMTaskData<Node>> 
        | DOMTaskCompatible 
        | Branch<DOMTaskArg, DOMTaskData<Node>, DOMTaskData<Node>>
    )[], 
    tagName: string, isEmpty: boolean, scope?: string) => 
    (tConnect: Connector<T, DOMTaskArg, DOMTaskData<Node>>, tDerive: Filter<T, DOMTaskArg>): Task<T> => 
        tConnect(
            args.reduce((filter: Filter<DOMTaskArg, DOMTaskData<Node>>, arg) => typeof arg === "function" ?
                (arg.length == 1 ? 
                    (ctx: DOMTaskArg) => (arg as Task<DOMTaskData<Node>>)(filter(ctx)) :
                    (ctx: DOMTaskArg) => (arg as Branch<DOMTaskArg, DOMTaskData<Node>, DOMTaskData<Node>>)(isEmpty ? noConnector : appendConnector, deriveDOMTaskArg)(filter(ctx))) :
                (ctx: DOMTaskArg) => defaultConvert(arg)(filter(ctx)), nodeFactory<Node>(tagName, scope)), 
            tDerive
        );
export const domAdapter = (tagName: string, isEmpty: boolean, scope?: string) => <T>(...args: (
        Task<DOMTaskData<Node>> 
        | DOMTaskCompatible 
        | Branch<DOMTaskArg, DOMTaskData<Node>, DOMTaskData<Node>>
    )[]
) => domBranch<T>(args, tagName, isEmpty, scope);
export const tag = <T extends Element>(
    tagName: string | [string, string], 
    ...tasks: (Task<DOMTaskData<T>> | Branch<DOMTaskArg, DOMTaskData<Element>, DOMTaskData<T>> | DOMTaskCompatible)[]
): Branch<DOMTaskArg, DOMTaskData<T>, DOMTaskData<Element>> => domBranch<T>(
    tasks as (Task<DOMTaskData<Node>> | DOMTaskCompatible | Branch<DOMTaskArg, DOMTaskData<Node>, DOMTaskData<Node>>)[], 
    typeof tagName === "string" ? tagName : tagName[0],
    false, typeof tagName === "string" ? htmlScope : tagName[1]
) as unknown as Branch<DOMTaskArg, DOMTaskData<T>, DOMTaskData<Element>>;
export type DOMPropertyValue = string | ((previous?: string) => string) | undefined;
export type DOMPropertyTask = <T extends Node>(value: DOMPropertyValue) => Task<DOMTaskData<T>>;
export const prop = <T extends Node>(key: string, value: DOMPropertyValue): Task<DOMTaskData<T>> =>
    value === undefined ?
        (data: DOMTaskData<T>) => { data.element[key] = null; return data; } :
        typeof value === "function" ?
            (data: DOMTaskData<T>) => { data.element[key] = value(data.element[key]); return data; } :
            (data: DOMTaskData<T>) => { data.element[key] = value; return data; }
export const getProp = <T extends Node>(key: string, alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> =>
    (data: DOMTaskData<T>) => [alias || key, () => data.element[key]];
export const removeProp = <T extends Node>(key: string): Task<DOMTaskData<T>> => prop<T>(key, undefined);
export const attr = <T extends Element>(key: string, value: DOMPropertyValue): Task<DOMTaskData<T>> =>
    value === undefined ?
        (data: DOMTaskData<T>) => { data.element.removeAttribute(key); return data; } :
        typeof value === "function" ?
            (data: DOMTaskData<T>) => { data.element.setAttribute(key, value(data.element.getAttribute(key) ?? undefined)); return data; } :
            (data: DOMTaskData<T>) => { data.element.setAttribute(key, value); return data; }
export const getAttr = <T extends Element>(key: string, alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> =>
    (data: DOMTaskData<T>) => [alias || key, () => data.element.getAttribute(key)];
export const removeAttr = <T extends Element>(key: string): Task<DOMTaskData<T>> => attr<T>(key, undefined);
const ariaPreffix = "aria-";
export const aria = <T extends Element>(key: string, value: DOMPropertyValue): Task<DOMTaskData<T>> => attr<T>(ariaPreffix+key, value);
export const getAria = <T extends Element>(key: string, alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>(ariaPreffix+key, alias);
export const removeAria = <T extends Element>(key: string): Task<DOMTaskData<T>> => aria<T>(ariaPreffix+key, undefined);
export type SpecializedElement = HTMLElement | SVGElement | MathMLElement;
export const dataAttr = <T extends SpecializedElement>(key: string, value: DOMPropertyValue): Task<DOMTaskData<T>> =>
    value === undefined ?
        (data: DOMTaskData<T>) => { delete data.element.dataset[key]; return data; } :
        typeof value === "function" ?
            (data: DOMTaskData<T>) => { data.element.dataset[key] = value(data.element.dataset[key] ?? undefined); return data; } :
            (data: DOMTaskData<T>) => { data.element.dataset[key] = value; return data; }
export const getDataAttr = <T extends SpecializedElement>(key: string, alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> =>
    (data: DOMTaskData<T>) => [alias || key, () => data.element.dataset[key]];
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
export const getStyle = <T extends SpecializedElement>(key: string, alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> =>
    (data: DOMTaskData<T>) => [alias || key, () => data.element.style[key]];
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
export type HTMLProxyTarget = Record<string, Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, string | Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>>>>;
export type SVGProxyTarget = Record<string, Adapter<DOMTaskArg, DOMTaskData<SVGElement>, string | Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGElement>>>>;
export type MathMLProxyTarget = Record<string, Adapter<DOMTaskArg, DOMTaskData<MathMLElement>, string | Branch<DOMTaskArg, DOMTaskData<Text | MathMLElement>, DOMTaskData<MathMLElement>>>>;
export type DOMPropertyProxyTarget = Record<string, DOMPropertyTask>;
export type DOMAttributeProxyTarget = Record<string, (value: DOMPropertyValue) => Task<DOMTaskData<Element>>>;
export type DOMStylePropertyProxyTarget = Record<string, (value: DOMPropertyValue) => Task<DOMTaskData<SpecializedElement>>>;
export type DOMEventProxyTarget = Record<string, (listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => Task<DOMTaskData<EventTarget>>>;
export const adapters = {
html: new Proxy<HTMLProxyTarget>({}, {
        get(target, key, receiver) {
            if(typeof key === "string") return domAdapter(key, ["area","base","br","col","embed","hr","img","input","link","meta","para","source","track","wbr"].indexOf(key) >= 0, htmlScope);
            return Reflect.get(target, key, receiver);
        }
    }),
svg: new Proxy<SVGProxyTarget>({}, {
        get(target, key, receiver) {
            if(typeof key === "string") return domAdapter(key, false, svgScope);
            return Reflect.get(target, key, receiver);
        }
    }),
math: new Proxy<MathMLProxyTarget>({}, {
        get(target, key, receiver) {
            if(typeof key === "string") return domAdapter(key, false, mathmlScope);
            return Reflect.get(target, key, receiver);
        }
    }),
props: new Proxy<DOMPropertyProxyTarget>({}, {
        get(target, key, receiver) {
            if(typeof key === "string") return (value: DOMPropertyValue): Task<DOMTaskData<Node>> => prop(key, value);
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
export type DOMPropertyQueryProxyTarget = Record<string, (key: string, alias?: string) => Filter<DOMTaskData<Node>,[string, Lookup<unknown>]>>;
export type DOMStylePropertyQueryProxyTarget = Record<string, (key: string, alias?: string) => Filter<DOMTaskData<SpecializedElement>,[string, Lookup<unknown>]>>;
export const queries = {
props: new Proxy<DOMPropertyQueryProxyTarget>({},{
        get(target, key, receiver) {
            if(typeof key === "string") return (key: string, alias?: string): Filter<DOMTaskData<Node>,[string, Lookup<unknown>]> => 
                getProp(key, alias);
            return Reflect.get(target, key, receiver);
        }
    }),
style: new Proxy<DOMStylePropertyQueryProxyTarget>({},{
        get(target, key, receiver) {
            if(typeof key === "string") return (key: string, alias?: string): Filter<DOMTaskData<SpecializedElement>,[string, Lookup<unknown>]> => 
                getStyle(key, alias);
            return Reflect.get(target, key, receiver);
        }
    })
}
export const textNode = domAdapter("", true, textScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<Text>, DOMTaskCompatible>;
export const scriptTag = domAdapter("script", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement | SVGScriptElement>, Branch<DOMTaskArg, DOMTaskData<HTMLElement | SVGElement | Text>, DOMTaskData<HTMLElement | SVGScriptElement>> | DOMTaskCompatible>;
export const styleTag = domAdapter("style", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement | SVGStyleElement>, Branch<DOMTaskArg, DOMTaskData<Text>, DOMTaskData<HTMLElement | SVGStyleElement>> | DOMTaskCompatible>;
export const htmlA = domAdapter("htmlA", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLAnchorElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLAnchorElement>> | DOMTaskCompatible>;
export const abbr = domAdapter("abbr", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const address = domAdapter("address", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const area = domAdapter("area", true, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLAreaElement>, DOMTaskCompatible>;
export const article = domAdapter("article", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const aside = domAdapter("aside", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const audio = domAdapter("audio", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLAudioElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLAudioElement>> | DOMTaskCompatible>;
export const b = domAdapter("b", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const base = domAdapter("base", true, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLBaseElement>, DOMTaskCompatible>;
export const bdi = domAdapter("bdi", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const bdo = domAdapter("bdo", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const blockquote = domAdapter("blockquote", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLQuoteElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLQuoteElement>> | DOMTaskCompatible>;
export const body = domAdapter("body", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const br = domAdapter("br", true, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLBRElement>, DOMTaskCompatible>;
export const button = domAdapter("button", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLButtonElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLButtonElement>> | DOMTaskCompatible>;
export const canvas = domAdapter("canvas", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLCanvasElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLCanvasElement>> | DOMTaskCompatible>;
export const caption = domAdapter("caption", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLTableCaptionElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLTableCaptionElement>> | DOMTaskCompatible>;
export const cite = domAdapter("cite", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLQuoteElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLQuoteElement>> | DOMTaskCompatible>;
export const code = domAdapter("code", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const col = domAdapter("col", true, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLTableColElement>, DOMTaskCompatible>;
export const colgroup = domAdapter("colgroup", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLTableColElement>, Branch<DOMTaskArg, DOMTaskData<HTMLTableColElement>, DOMTaskData<HTMLTableColElement>> | DOMTaskCompatible>;
export const data = domAdapter("data", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLDataElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLDataElement>> | DOMTaskCompatible>;
export const datalist = domAdapter("datalist", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLDataListElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLDataListElement>> | DOMTaskCompatible>;
export const dd = domAdapter("dd", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const del = domAdapter("del", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLModElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLModElement>> | DOMTaskCompatible>;
export const details = domAdapter("details", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const dfn = domAdapter("dfn", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const dialog = domAdapter("dialog", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLDialogElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLDialogElement>> | DOMTaskCompatible>;
export const div = domAdapter("div", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLDivElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLDivElement>> | DOMTaskCompatible>;
export const dl = domAdapter("dl", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const dt = domAdapter("dt", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const em = domAdapter("em", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const embed = domAdapter("embed", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLEmbedElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLEmbedElement>> | DOMTaskCompatible>;
export const fieldset = domAdapter("fieldset", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLFieldSetElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLFieldSetElement>> | DOMTaskCompatible>;
export const figcaption = domAdapter("figcaption", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const figure = domAdapter("figure", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const footer = domAdapter("footer", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const form = domAdapter("form", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLFormElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLFormElement>> | DOMTaskCompatible>;
export const h1 = domAdapter("h1", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLHeadingElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLHeadingElement>> | DOMTaskCompatible>;
export const h2 = domAdapter("h2", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLHeadingElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLHeadingElement>> | DOMTaskCompatible>;
export const h3 = domAdapter("h3", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLHeadingElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLHeadingElement>> | DOMTaskCompatible>;
export const h4 = domAdapter("h4", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLHeadingElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLHeadingElement>> | DOMTaskCompatible>;
export const h5 = domAdapter("h5", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLHeadingElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLHeadingElement>> | DOMTaskCompatible>;
export const h6 = domAdapter("h6", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLHeadingElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLHeadingElement>> | DOMTaskCompatible>;
export const head = domAdapter("head", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLHeadElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLHeadElement>> | DOMTaskCompatible>;
export const header = domAdapter("header", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const hgroup = domAdapter("hgroup", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const hr = domAdapter("hr", true, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLHRElement>, DOMTaskCompatible>;
export const html = domAdapter("html", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const i = domAdapter("i", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const iframe = domAdapter("iframe", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLIFrameElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLIFrameElement>> | DOMTaskCompatible>;
export const img = domAdapter("img", true, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLImageElement>, DOMTaskCompatible>;
export const input = domAdapter("input", true, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLInputElement>, DOMTaskCompatible>;
export const ins = domAdapter("ins", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLModElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLModElement>> | DOMTaskCompatible>;
export const kbd = domAdapter("kbd", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const label = domAdapter("label", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLLabelElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLLabelElement>> | DOMTaskCompatible>;
export const legend = domAdapter("legend", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLLegendElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLLegendElement>> | DOMTaskCompatible>;
export const li = domAdapter("li", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLLIElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLLIElement>> | DOMTaskCompatible>;
export const link = domAdapter("link", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLLinkElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLLinkElement>> | DOMTaskCompatible>;
export const main = domAdapter("main", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const mark = domAdapter("mark", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const menu = domAdapter("menu", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLMenuElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLMenuElement>> | DOMTaskCompatible>;
export const meta = domAdapter("meta", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const meter = domAdapter("meter", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLMeterElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLMeterElement>> | DOMTaskCompatible>;
export const nav = domAdapter("nav", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const noscript = domAdapter("noscript", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const object = domAdapter("object", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLObjectElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLObjectElement>> | DOMTaskCompatible>;
export const ol = domAdapter("ol", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLOListElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLOListElement>> | DOMTaskCompatible>;
export const optgroup = domAdapter("optgroup", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLOptGroupElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLOptGroupElement>> | DOMTaskCompatible>;
export const option = domAdapter("option", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLOptionElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLOptionElement>> | DOMTaskCompatible>;
export const output = domAdapter("output", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLOutputElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLOutputElement>> | DOMTaskCompatible>;
export const p = domAdapter("p", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLParagraphElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLParagraphElement>> | DOMTaskCompatible>;
export const param = domAdapter("param", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLParamElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLParamElement>> | DOMTaskCompatible>;
export const picture = domAdapter("picture", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLPictureElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLPictureElement>> | DOMTaskCompatible>;
export const pre = domAdapter("pre", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLPreElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLPreElement>> | DOMTaskCompatible>;
export const progress = domAdapter("progress", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLProgressElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLProgressElement>> | DOMTaskCompatible>;
export const q = domAdapter("q", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLQuoteElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLQuoteElement>> | DOMTaskCompatible>;
export const rp = domAdapter("rp", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const rt = domAdapter("rt", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const ruby = domAdapter("ruby", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const s = domAdapter("s", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const samp = domAdapter("samp", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const htmlScriptTag = domAdapter("script", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const search = domAdapter("search", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const section = domAdapter("section", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const select = domAdapter("select", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLSelectElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLSelectElement>> | DOMTaskCompatible>;
export const slotTag = domAdapter("slot", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLSlotElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLSlotElement>> | DOMTaskCompatible>;
export const small = domAdapter("small", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const source = domAdapter("source", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLSourceElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLSourceElement>> | DOMTaskCompatible>;
export const span = domAdapter("span", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const strong = domAdapter("strong", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const htmlStyleTag = domAdapter("style", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const sub = domAdapter("sub", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const summary = domAdapter("summary", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const sup = domAdapter("sup", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const table = domAdapter("table", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLTableElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLTableElement>> | DOMTaskCompatible>;
export const tbody = domAdapter("tbody", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLTableSectionElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLTableSectionElement>> | DOMTaskCompatible>;
export const td = domAdapter("td", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLTableCellElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLTableCellElement>> | DOMTaskCompatible>;
export const template = domAdapter("template", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLTemplateElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLTemplateElement>> | DOMTaskCompatible>;
export const textarea = domAdapter("textarea", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLTextAreaElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLTextAreaElement>> | DOMTaskCompatible>;
export const tfoot = domAdapter("tfoot", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLTableSectionElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLTableSectionElement>> | DOMTaskCompatible>;
export const th = domAdapter("th", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLTableCellElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLTableCellElement>> | DOMTaskCompatible>;
export const thead = domAdapter("thead", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLTableSectionElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLTableSectionElement>> | DOMTaskCompatible>;
export const tile = domAdapter("tile", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLTimeElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLTimeElement>> | DOMTaskCompatible>;
export const htmlTitleTag = domAdapter("title", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLTitleElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLTitleElement>> | DOMTaskCompatible>;
export const tr = domAdapter("tr", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLTableRowElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLTableRowElement>> | DOMTaskCompatible>;
export const track = domAdapter("track", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLTrackElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLTrackElement>> | DOMTaskCompatible>;
export const u = domAdapter("u", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const ul = domAdapter("ul", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLUListElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLUListElement>> | DOMTaskCompatible>;
export const varTag = domAdapter("var", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const video = domAdapter("video", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLVideoElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLVideoElement>> | DOMTaskCompatible>;
export const wbr = domAdapter("wbr", false, htmlScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>> | DOMTaskCompatible>;
export const animate = domAdapter("animate", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGAnimateElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGAnimateElement>> | DOMTaskCompatible>;
export const animateMotion = domAdapter("animateMotion", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGAnimateMotionElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGAnimateMotionElement>> | DOMTaskCompatible>;
export const animateTransform = domAdapter("animateTransform", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGAnimateTransformElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGAnimateTransformElement>> | DOMTaskCompatible>;
export const circle = domAdapter("circle", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGCircleElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGCircleElement>> | DOMTaskCompatible>;
export const clipPath = domAdapter("clipPath", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGClipPathElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGClipPathElement>> | DOMTaskCompatible>;
export const defs = domAdapter("defs", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGDefsElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGDefsElement>> | DOMTaskCompatible>;
export const desc = domAdapter("desc", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGDescElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGDescElement>> | DOMTaskCompatible>;
export const ellipse = domAdapter("ellipse", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGEllipseElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGEllipseElement>> | DOMTaskCompatible>;
export const feBlend = domAdapter("feBlend", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFEBlendElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFEBlendElement>> | DOMTaskCompatible>;
export const feColorMatrix = domAdapter("feColorMatrix", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFEColorMatrixElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFEColorMatrixElement>> | DOMTaskCompatible>;
export const feComponentTransfer = domAdapter("feComponentTransfer", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFEComponentTransferElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFEComponentTransferElement>> | DOMTaskCompatible>;
export const feComposite = domAdapter("feComposite", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFECompositeElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFECompositeElement>> | DOMTaskCompatible>;
export const feConvolveMatrix = domAdapter("feConvolveMatrix", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFEConvolveMatrixElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFEConvolveMatrixElement>> | DOMTaskCompatible>;
export const feDiffuseLighting = domAdapter("feDiffuseLighting", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFEDiffuseLightingElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFEDiffuseLightingElement>> | DOMTaskCompatible>;
export const feDisplacementMap = domAdapter("feDisplacementMap", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFEDisplacementMapElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFEDisplacementMapElement>> | DOMTaskCompatible>;
export const feDistantLight = domAdapter("feDistantLight", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFEDistantLightElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFEDistantLightElement>> | DOMTaskCompatible>;
export const feDropShadow = domAdapter("feDropShadow", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFEDropShadowElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFEDropShadowElement>> | DOMTaskCompatible>;
export const feFlood = domAdapter("feFlood", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFEFloodElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFEFloodElement>> | DOMTaskCompatible>;
export const feFuncA = domAdapter("feFuncA", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFEFuncAElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFEFuncAElement>> | DOMTaskCompatible>;
export const feFuncB = domAdapter("feFuncB", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFEFuncBElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFEFuncBElement>> | DOMTaskCompatible>;
export const feFuncG = domAdapter("feFuncG", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFEFuncGElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFEFuncGElement>> | DOMTaskCompatible>;
export const feFuncR = domAdapter("feFuncR", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFEFuncRElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFEFuncRElement>> | DOMTaskCompatible>;
export const feGaussianBlur = domAdapter("feGaussianBlur", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFEGaussianBlurElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFEGaussianBlurElement>> | DOMTaskCompatible>;
export const feImage = domAdapter("feImage", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFEImageElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFEImageElement>> | DOMTaskCompatible>;
export const feMerge = domAdapter("feMerge", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFEMergeElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFEMergeElement>> | DOMTaskCompatible>;
export const feMergeNode = domAdapter("feMergeNode", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFEMergeNodeElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFEMergeNodeElement>> | DOMTaskCompatible>;
export const feMorphology = domAdapter("feMorphology", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFEMorphologyElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFEMorphologyElement>> | DOMTaskCompatible>;
export const feOffset = domAdapter("feOffset", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFEOffsetElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFEOffsetElement>> | DOMTaskCompatible>;
export const fePointLight = domAdapter("fePointLight", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFEPointLightElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFEPointLightElement>> | DOMTaskCompatible>;
export const feSpecularLighting = domAdapter("feSpecularLighting", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFESpecularLightingElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFESpecularLightingElement>> | DOMTaskCompatible>;
export const feSpotLight = domAdapter("feSpotLight", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFESpotLightElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFESpotLightElement>> | DOMTaskCompatible>;
export const feTile = domAdapter("feTile", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFETileElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFETileElement>> | DOMTaskCompatible>;
export const feTurbulence = domAdapter("feTurbulence", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFETurbulenceElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFETurbulenceElement>> | DOMTaskCompatible>;
export const filter = domAdapter("filter", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGFilterElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGFilterElement>> | DOMTaskCompatible>;
export const g = domAdapter("g", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGGElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGGElement>> | DOMTaskCompatible>;
export const image = domAdapter("image", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGImageElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGImageElement>> | DOMTaskCompatible>;
export const line = domAdapter("line", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGLineElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGLineElement>> | DOMTaskCompatible>;
export const linearGradient = domAdapter("linearGradient", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGLinearGradientElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGLinearGradientElement>> | DOMTaskCompatible>;
export const marker = domAdapter("marker", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGMarkerElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGMarkerElement>> | DOMTaskCompatible>;
export const mask = domAdapter("mask", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGMaskElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGMaskElement>> | DOMTaskCompatible>;
export const metadata = domAdapter("metadata", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGMetadataElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGMetadataElement>> | DOMTaskCompatible>;
export const mpath = domAdapter("mpath", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGMPathElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGMPathElement>> | DOMTaskCompatible>;
export const path = domAdapter("path", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGPathElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGPathElement>> | DOMTaskCompatible>;
export const polygon = domAdapter("polygon", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGPolygonElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGPolygonElement>> | DOMTaskCompatible>;
export const polyline = domAdapter("polyline", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGPolylineElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGPolylineElement>> | DOMTaskCompatible>;
export const radialGradient = domAdapter("radialGradient", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGRadialGradientElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGRadialGradientElement>> | DOMTaskCompatible>;
export const rect = domAdapter("rect", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGRectElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGRectElement>> | DOMTaskCompatible>;
export const stop = domAdapter("stop", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGStopElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGStopElement>> | DOMTaskCompatible>;
export const svg = domAdapter("svg", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGSVGElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGSVGElement>> | DOMTaskCompatible>;
export const set = domAdapter("set", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGSetElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGSetElement>> | DOMTaskCompatible>;
export const svgA = domAdapter("a", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGAElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGAElement>> | DOMTaskCompatible>;
export const patternTag = domAdapter("pattern", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGPatternElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGPatternElement>> | DOMTaskCompatible>;
export const switchTag = domAdapter("switch", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGSwitchElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGSwitchElement>> | DOMTaskCompatible>;
export const symbolTag = domAdapter("symbol", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGSymbolElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGSymbolElement>> | DOMTaskCompatible>;
export const svgTitleTag = domAdapter("title", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGTitleElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGTitleElement>> | DOMTaskCompatible>;
export const svgScriptTag = domAdapter("script", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGScriptElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGScriptElement>> | DOMTaskCompatible>;
export const svgStyleTag = domAdapter("style", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGStyleElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGStyleElement>> | DOMTaskCompatible>;
export const text = domAdapter("text", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGTextElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGTextElement>> | DOMTaskCompatible>;
export const textPath = domAdapter("textPath", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGTextPathElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGTextPathElement>> | DOMTaskCompatible>;
export const tspan = domAdapter("tspan", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGTSpanElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGTSpanElement>> | DOMTaskCompatible>;
export const use = domAdapter("use", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGUseElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGUseElement>> | DOMTaskCompatible>;
export const view = domAdapter("view", false, svgScope) as unknown as Adapter<DOMTaskArg, DOMTaskData<SVGViewElement>, Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGViewElement>> | DOMTaskCompatible>;
export const a = <T>(...args: (
        (T extends DOMTaskData<HTMLElement> ? Task<DOMTaskData<HTMLAnchorElement>> : Task<DOMTaskData<SVGAElement>>)
        | (T extends DOMTaskData<HTMLElement> ? (Branch<DOMTaskArg, DOMTaskData<HTMLElement | Text>, DOMTaskData<HTMLAnchorElement>> | DOMTaskCompatible) : (Branch<DOMTaskArg, DOMTaskData<SVGElement | Text>, DOMTaskData<SVGAElement>> | DOMTaskCompatible)) 
    )[]
) => domBranch<T>(args as (Task<DOMTaskData<Node>> | DOMTaskCompatible | Branch<DOMTaskArg, DOMTaskData<Node>, DOMTaskData<Node>>)[], "a", false, contextualScope) as unknown as Branch<
    DOMTaskArg, (T extends DOMTaskData<HTMLElement> ? DOMTaskData<HTMLAnchorElement> : DOMTaskData<SVGAElement>), T
>;
export const titleTag = <T>(...args: (
        (T extends DOMTaskData<HTMLElement> ? Task<DOMTaskData<HTMLTitleElement>> : Task<DOMTaskData<SVGTitleElement>>)
        | (T extends DOMTaskData<HTMLElement> ? (Branch<DOMTaskArg, DOMTaskData<Text>, DOMTaskData<HTMLTitleElement>> | DOMTaskCompatible) : (Branch<DOMTaskArg, DOMTaskData<SVGElement>, DOMTaskData<SVGTitleElement>> | DOMTaskCompatible)) 
    )[]
) => domBranch<T>(args as (Task<DOMTaskData<Node>> | DOMTaskCompatible | Branch<DOMTaskArg, DOMTaskData<Node>, DOMTaskData<Node>>)[], "title", false, contextualScope) as unknown as Branch<
    DOMTaskArg, (T extends DOMTaskData<HTMLElement> ? DOMTaskData<HTMLTitleElement> : DOMTaskData<SVGTitleElement>), T
>;
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
export const value = <T extends HTMLInputElement | HTMLOptionElement | HTMLMeterElement | HTMLTextAreaElement | HTMLLIElement | HTMLProgressElement | HTMLButtonElement | HTMLParamElement>(value: DOMPropertyValue): Task<DOMTaskData<T>> => prop('value', value);
export const getId = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('id', alias);
export const getAccesskey = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('accesskey', alias);
export const getAutocapitalize = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('autocapitalize', alias);
export const getAutofocus = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('autofocus', alias);
export const getEnterkeyhint = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('enterkeyhint', alias);
export const getExportparts = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('exportparts', alias);
export const getHidden = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('hidden', alias);
export const getInert = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('inert', alias);
export const getInputmode = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('inputmode', alias);
export const getIs = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('is', alias);
export const getNonce = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('nonce', alias);
export const getPart = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('part', alias);
export const getPopover = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('popover', alias);
export const getSlot = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('slot', alias);
export const getSpellcheck = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('spellcheck', alias);
export const getTranslate = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('translate', alias);
export const getClassName = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('class', alias);
export const getNodeValue = <T extends Node>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getProp<T>('nodeValue', alias);
export const getTextContent = <T extends Node>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getProp<T>('textContent', alias);
export const getInnerHTML = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getProp<T>('innerHTML', alias);
export const getOuterHTML = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getProp<T>('outerHTML', alias);
export const nodeName = <T extends Node>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getProp<T>('nodeName', alias);
export const nodeType = <T extends Node>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getProp<T>('nodeType', alias);
export const clientHeight = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getProp<T>('clientHeight', alias);
export const clientLeft = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getProp<T>('clientLeft', alias);
export const clientTop = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getProp<T>('clientTop', alias);
export const clientWidth = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getProp<T>('clientWidth', alias);
export const tagName = <T extends Element>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getProp<T>('tagName', alias);
export const getTitle = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('title', alias);
export const getTabIndex = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('tabIndex', alias);
export const getLang = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('lang', alias);
export const getDir = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('dir', alias);
export const getDraggable = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('draggable', alias);
export const getItemid = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('itemid', alias);
export const getItemprop = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('itemprop', alias);
export const getItemref = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('itemref', alias);
export const getItemscope = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('itemscope', alias);
export const getItemtype = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('itemtype', alias);
export const getCrossorigin = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('crossorigin', alias);
export const getDisabled = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('disabled', alias);
export const getElementtiming = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('elementtiming', alias);
export const getMax = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('max', alias);
export const getMin = <T extends HTMLElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('min', alias);
export const getStep = <T extends HTMLInputElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('step', alias);
export const getType = <T extends HTMLInputElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('type', alias);
export const getAccept = <T extends HTMLInputElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('accept', alias);
export const getCapture = <T extends HTMLInputElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('capture', alias);
export const getPattern = <T extends HTMLInputElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('pattern', alias);
export const getPlaceholder = <T extends HTMLInputElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('placeholder', alias);
export const getForAttr = <T extends HTMLLabelElement | HTMLOutputElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('forAttr', alias);
export const getSize = <T extends HTMLInputElement | HTMLSelectElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('size', alias);
export const getDirname = <T extends HTMLInputElement | HTMLTextAreaElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('dirname', alias);
export const getMultiple = <T extends HTMLInputElement | HTMLTextAreaElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('multiple', alias);
export const getReadonly = <T extends HTMLInputElement | HTMLTextAreaElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('readonly', alias);
export const getMaxlength = <T extends HTMLInputElement | HTMLTextAreaElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('maxlength', alias);
export const getMinlength = <T extends HTMLInputElement | HTMLTextAreaElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('minlength', alias);
export const getRequired = <T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('required', alias);
export const getRel = <T extends HTMLAnchorElement | HTMLAreaElement | HTMLLinkElement | HTMLFormElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('rel', alias);
export const getAutocomplete = <T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLFormElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getAttr<T>('autocomplete', alias);
export const getValue = <T extends HTMLInputElement | HTMLOptionElement | HTMLMeterElement | HTMLTextAreaElement | HTMLLIElement | HTMLProgressElement | HTMLButtonElement | HTMLParamElement>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => getProp<T>('value', alias);
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
export const onClick = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    subscribe('click', listener, options);
export const offClick = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    unsubscribe('click', listener, options);
export const onDbClick = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    subscribe('dbclick', listener, options);
export const offDbClick = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    unsubscribe('dbclick', listener, options);
export const onBlur = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    subscribe('blur', listener, options);
export const offBlur = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    unsubscribe('blur', listener, options);
export const onFocus = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    subscribe('focus', listener, options);
export const offFocus = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    unsubscribe('focus', listener, options);
export const onChange = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    subscribe('change', listener, options);
export const offChange = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    unsubscribe('change', listener, options);
export const onMouseDown = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    subscribe('mousedown', listener, options);
export const offMouseDown = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    unsubscribe('mousedown', listener, options);
export const onMouseEnter = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    subscribe('mouseenter', listener, options);
export const offMouseEnter = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    unsubscribe('mouseenter', listener, options);
export const onMouseLeave = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    subscribe('mouseleave', listener, options);
export const offMouseLeave = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    unsubscribe('mouseleave', listener, options);
export const onMouseMove = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    subscribe('mousemove', listener, options);
export const offMouseMove = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    unsubscribe('mousemove', listener, options);
export const onMouseOut = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    subscribe('mouseout', listener, options);
export const offMouseOut = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    unsubscribe('mouseout', listener, options);
export const onMouseOver = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    subscribe('mouseover', listener, options);
export const offMouseOver = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    unsubscribe('mouseover', listener, options);
export const onMouseUp = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    subscribe('mouseup', listener, options);
export const offMouseUp = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    unsubscribe('mouseup', listener, options);
export const onWheel = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    subscribe('wheel', listener, options);
export const offWheel = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    unsubscribe('wheel', listener, options);
export const onScroll = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    subscribe('scroll', listener, options);
export const offScroll = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    unsubscribe('scroll', listener, options);
export const onKeyDown = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    subscribe('keydown', listener, options);
export const offKeyDown = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    unsubscribe('keydown', listener, options);
export const onKeyPress = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    subscribe('keypress', listener, options);
export const offKeyPress = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    unsubscribe('keypress', listener, options);
export const onKeyUp = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    subscribe('keyup', listener, options);
export const offKeyUp = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    unsubscribe('keyup', listener, options);
export const onCopy = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    subscribe('copy', listener, options);
export const offCopy = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    unsubscribe('copy', listener, options);
export const onCut = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    subscribe('cut', listener, options);
export const offCut = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    unsubscribe('cut', listener, options);
export const onPaste = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    subscribe('paste', listener, options);
export const offPaste = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    unsubscribe('paste', listener, options);
export const onSelect = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    subscribe('select', listener, options);
export const offSelect = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    unsubscribe('select', listener, options);
export const onFocusIn = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    subscribe('focusin', listener, options);
export const offFocusIn = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    unsubscribe('focusin', listener, options);
export const onFocusOut = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    subscribe('focusout', listener, options);
export const offFocusOut = <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    unsubscribe('focusout', listener, options);