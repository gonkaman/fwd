//@@ Filter @@//
export type Filter<TArg,TResult> = (arg: TArg) => TResult;

//@@ Task > Filter @@//
export type Task<T> = Filter<T,T>;

//@@ Connector > Filter, Task @@//
export type Connector<TTarget, TArg, TChild> = <T extends TTarget>(filter: Filter<TArg,TChild>, deriveArg: Filter<TTarget, TArg>) => Task<T>;

//@@ Branch > Filter, Task, Connector @@//
export type Branch<TArg, TTarget, TParent> = (connector: Connector<TParent, TArg, TTarget>, deriveArg: Filter<TParent, TArg>) => Task<TParent>;

//@@ Adapter > Task, Branch @@//
export type Adapter<TArg, TTarget, TCompat> = <TParent>(...args: (Task<TTarget> | TCompat)[]) => Branch<TArg, TTarget, TParent>;

//@@ Lookup > Filter @@//
export type Lookup<T> = Filter<void,T|null|undefined>;

//@@ Curator > Lookup @@//
export type Curator<T> = (lookup: Lookup<T>) => void; 

//@@ Store > Curator, Lookup @@//
export type Delegate<T> = [Curator<T>, Lookup<T>];

//@@ noConnector > Filter, Task @@//
export const noConnector = <TArg, T>(_: Filter<TArg, any>): Task<T> => (target: T) => target;

//@@ DOMTaskContext @@//
export type DOMTaskContext = { document: Document, scope: string }

//@@ DOMTaskData @@//
export type DOMTaskData<T> = { element: T, document: Document, scope: string }

//@@ DOMTaskArg > DOMTaskContext @@//
export type DOMTaskArg = DOMTaskContext | null | undefined;

//@@ DOMTaskCompatible @@//
export type DOMTaskCompatible = string | number; // | Date | string[] | number[] | Element;

//@@ htmlScope @@//
const htmlScope = "http://www.w3.org/1999/xhtml";

//@@ svgScope @@//
const svgScope = "http://www.w3.org/2000/svg";

//@@ mathmlScope @@//
const mathmlScope = "http://www.w3.org/1998/Math/MathML";

//@@ textScope @@//
const textScope = "text";

//@@ contextualScope @@//
const contextualScope = "ctx";

//@@ defaultNodeFactory > Filter, DOMTaskArg, DOMTaskData, htmlScope @@//
const defaultNodeFactory = <T>(tagName: string): Filter<DOMTaskArg, DOMTaskData<T>> => (arg: DOMTaskArg): DOMTaskData<T> => {
    if(arg == null) return { element: document.createElement(tagName), document: document, scope: htmlScope } as DOMTaskData<T>;
    return { element: arg.document.createElement(tagName), document: arg.document, scope: htmlScope } as DOMTaskData<T>;
}

//@@ nodeFactory > Filter, DOMTaskArg, DOMTaskData, defaultNodeFactory, htmlScope, svgScope, mathmlScope, textScope, contextualScope @@//
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

//@@ deriveDOMTaskArg > DOMTaskData, DOMTaskArg @@//
export const deriveDOMTaskArg = <T>(data: DOMTaskData<T>): DOMTaskArg => data;

//@@ defaultConvert > Task, DOMTaskData, DOMTaskCompatible, textScope @@//
export const defaultConvert = <T extends Node>(arg: DOMTaskCompatible): Task<DOMTaskData<T>> => 
    (data: DOMTaskData<T>): DOMTaskData<T> => {
        if(data.scope === textScope){
            data.element.nodeValue = arg+"";
        }else{
            data.element.appendChild(data.document.createTextNode(arg+""));
        }
        return data;
    }

//@@ appendConnector > Filter, Task, DOMTaskData, DOMTaskArg @@//
export const appendConnector = <T extends DOMTaskData<Node>>(filter: Filter<DOMTaskArg,DOMTaskData<Node>>): Task<T> =>
    (data: T): T => {
        data.element.appendChild(filter(data).element);
        return data;
    }

//@@ append > Task, Branch, DOMTaskData, DOMTaskArg, appendConnector, deriveDOMTaskArg @@//
export const append = <T extends Element>(branch: Branch<DOMTaskArg, DOMTaskData<Node>, DOMTaskData<T> | unknown>): Task<DOMTaskData<T>> => 
(branch as Branch<DOMTaskArg, DOMTaskData<Node>, DOMTaskData<T>>)(appendConnector, deriveDOMTaskArg);

//@@ appendTo > Task, Lookup, DOMTaskData, DOMTaskArg @@//
export const appendTo = <T extends Node>(lookup: Lookup<DOMTaskData<Element>>): Task<DOMTaskData<T>> => 
    (node: DOMTaskData<T>): DOMTaskData<T> => {
        lookup()?.element.appendChild(node.element);
        return node; 
    }

//@@ prependConnector > Filter, Task, DOMTaskData, DOMTaskArg @@//
export const prependConnector = <T extends DOMTaskData<Element>>(filter: Filter<DOMTaskArg,DOMTaskData<Node>>): Task<T> =>
    (data: T): T => {
        data.element.prepend(filter(data).element);
        return data;
    }

//@@ prepend > Task, Branch, DOMTaskData, DOMTaskArg, prependConnector, deriveDOMTaskArg @@//
export const prepend = <T extends Element>(branch: Branch<DOMTaskArg, DOMTaskData<Node>, DOMTaskData<T> | unknown>): Task<DOMTaskData<T>> =>
(branch as Branch<DOMTaskArg, DOMTaskData<Node>, DOMTaskData<T>>)(prependConnector, deriveDOMTaskArg);

//@@ prependTo > Task, Lookup, DOMTaskData, DOMTaskArg @@//
export const prependTo = <T extends Node>(lookup: Lookup<DOMTaskData<Element>>): Task<DOMTaskData<T>> =>
    (node: DOMTaskData<T>): DOMTaskData<T> => {
        lookup()?.element.prepend(node.element);
        return node;
    }
 
//@@ getElement > Lookup, DOMTaskData, htmlScope @@//
export const getElement = <T extends Element>(query: string, container: Element | Document): Lookup<DOMTaskData<T>> => () => {
    const elt = container.querySelector(query);
    return elt == null ? null : { 
        element: elt as T, 
        document: elt.ownerDocument, 
        scope: elt.namespaceURI ?? htmlScope
    };
}

//@@ fromElement > Lookup, DOMTaskData, htmlScope @@//
export const fromElement = <T extends Element>(element: T): Lookup<DOMTaskData<T>> => () => {
    return {
        element: element,
        document: element.ownerDocument,
        scope: element.namespaceURI ?? htmlScope
    }
}

//@@ render > Task, Lookup, DOMTaskData @@//
export const render = <T extends Element>(lookup: Lookup<DOMTaskData<T>>, ...tasks: Task<DOMTaskData<T>>[]): Lookup<DOMTaskData<T>> => () => {
    const target = lookup();
    return target == null ? null : tasks.reduce((data, task) => task(data), target);
}

//@@ renderAll > Task, Lookup, DOMTaskData @@//
export const renderAll = <T extends Element>(lookup: Lookup<DOMTaskData<T>[]>, ...tasks: Task<DOMTaskData<T>>[]): Lookup<DOMTaskData<T>[]> => () => {
    const targets = lookup();
    return targets == null ? null : targets.map(target => tasks.reduce((data, task) => task(data), target));
}

//@@ handleNode > Task, DOMTaskData @@//
export const handleNode = <T extends Node>(task: Task<T>): Task<DOMTaskData<T>> => (data: DOMTaskData<T>) => {
    data.element = task(data.element);
    return data;
}

//@@ createRef > Lookup, Delegate, DOMTaskData @@//
export const createRef = <T extends Node>(): Delegate<DOMTaskData<T>> => {
    let getData: Lookup<DOMTaskData<T>> = () => null;
    return [
        (lookup: Lookup<DOMTaskData<T>>) => { getData = lookup; },
        () => getData()
    ]
}

//@@ createMultiRef > Curator, Lookup, DOMTaskData @@//
export const createMultiRef = <T extends Node>(): [Curator<DOMTaskData<T>>, Lookup<DOMTaskData<T>[]>] => {
    let getters: Lookup<DOMTaskData<T>>[] = [];
    return [
        (lookup: Lookup<DOMTaskData<T>>) => { getters.push(lookup); },
        () => getters.map(getData => getData()).filter(data => data != null) as DOMTaskData<T>[]
    ]
}

//@@ createQuery > Lookup, Delegate, DOMTaskData @@//
export const createQuery = (): Delegate<[string, unknown][]> => {
    const getters: Lookup<[string, unknown][]>[] = [];
    return [
        (lookup: Lookup<[string, unknown][]>) => { getters.push(lookup); },
        () => getters.reduce((entries: [string, unknown][], getData) => entries.concat(getData() ?? []), [])
    ]
}

//@@ ref > Task, Curator, DOMTaskData @@//
export const ref = <T extends Node>(curator: Curator<DOMTaskData<T>>): Task<DOMTaskData<T>> => 
    (data: DOMTaskData<T>) => {
        curator(() => data);
        return data;
    }

//@@ query > Filter, Task, Curator, DOMTaskData @@//
export const query = <T extends Node>(curator: Curator<[string, unknown][]>, ...queries: Filter<DOMTaskData<T>, [string, unknown][]>[]): Task<DOMTaskData<T>> =>
    (data: DOMTaskData<T>) => {
        curator(() => queries.reduce((entries: [string, unknown][], query) => entries.concat(query(data)), []));
        return data;
    }


//@@ domBranch > Filter, Task, Connector, Branch, DOMTaskArg, DOMTaskData, DOMTaskCompatible, nodeFactory, defaultConvert, noConnector, appendConnector, deriveDOMTaskArg @@//
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

//@@ domAdapter > Task, Branch, DOMTaskArg, DOMTaskData, DOMTaskCompatible @@//
export const domAdapter = (tagName: string, isEmpty: boolean, scope?: string) => <T>(...args: (
        Task<DOMTaskData<Node>> 
        | DOMTaskCompatible 
        | Branch<DOMTaskArg, DOMTaskData<Node>, DOMTaskData<Node>>
    )[]
) => domBranch<T>(args, tagName, isEmpty, scope);

//@@ tag > Filter, Task, Connector, Branch, DOMTaskArg, DOMTaskData, DOMTaskCompatible, nodeFactory, defaultConvert, appendConnector, deriveDOMTaskArg @@//
export const tag = <T extends Element>(
    tagName: string | [string, string], 
    ...tasks: (Task<DOMTaskData<T>> | Branch<DOMTaskArg, DOMTaskData<Element>, DOMTaskData<T>> | DOMTaskCompatible)[]
): Branch<DOMTaskArg, DOMTaskData<T>, DOMTaskData<Element>> => domBranch<T>(
    tasks as (Task<DOMTaskData<Node>> | DOMTaskCompatible | Branch<DOMTaskArg, DOMTaskData<Node>, DOMTaskData<Node>>)[], 
    typeof tagName === "string" ? tagName : tagName[0],
    false, typeof tagName === "string" ? htmlScope : tagName[1]
) as unknown as Branch<DOMTaskArg, DOMTaskData<T>, DOMTaskData<Element>>;

//@@ DOMPropertyValue @@//
export type DOMPropertyValue = string | ((previous?: string) => string) | undefined;

//@@ DOMPropertyTask > DOMPropertyValue, Task, DOMTaskData @@//
export type DOMPropertyTask = <T extends Node>(value: DOMPropertyValue) => Task<DOMTaskData<T>>;

//@@ prop > Task, DOMTaskData, DOMPropertyValue @@//
export const prop = <T extends Node>(key: string, value: DOMPropertyValue): Task<DOMTaskData<T>> =>
    value === undefined ?
        (data: DOMTaskData<T>) => { data.element[key] = null; return data; } :
        typeof value === "function" ?
            (data: DOMTaskData<T>) => { data.element[key] = value(data.element[key]); return data; } :
            (data: DOMTaskData<T>) => { data.element[key] = value; return data; }

//@@ getProp > Filter, DOMTaskData @@//
export const getProp = <T extends Node>(key: string, alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> =>
    (data: DOMTaskData<T>) => [[alias || key, data.element[key]]];

//@@ removeProp > Task, DOMTaskData @@//
export const removeProp = <T extends Node>(key: string): Task<DOMTaskData<T>> => prop<T>(key, undefined);


//@@ attr > Task, DOMTaskData, DOMPropertyValue @@//
export const attr = <T extends Element>(key: string, value: DOMPropertyValue): Task<DOMTaskData<T>> =>
    value === undefined ?
        (data: DOMTaskData<T>) => { data.element.removeAttribute(key); return data; } :
        typeof value === "function" ?
            (data: DOMTaskData<T>) => { data.element.setAttribute(key, value(data.element.getAttribute(key) ?? undefined)); return data; } :
            (data: DOMTaskData<T>) => { data.element.setAttribute(key, value); return data; }

//@@ getAttr > Filter, DOMTaskData @@//
export const getAttr = <T extends Element>(key: string, alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> =>
    (data: DOMTaskData<T>) => [[alias || key, data.element.getAttribute(key)]];

//@@ removeAttr > Task, DOMTaskData @@//
export const removeAttr = <T extends Element>(key: string): Task<DOMTaskData<T>> => attr<T>(key, undefined);

//@@ ariaPreffix @@//
const ariaPreffix = "aria-";

//@@ aria > Task, DOMTaskData, DOMPropertyValue, ariaPreffix @@//
export const aria = <T extends Element>(key: string, value: DOMPropertyValue): Task<DOMTaskData<T>> => attr<T>(ariaPreffix+key, value);

//@@ getAria > Filter, DOMTaskData, ariaPreffix @@//
export const getAria = <T extends Element>(key: string, alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>(ariaPreffix+key, alias);

//@@ removeAria > Task, DOMTaskData, ariaPreffix @@//
export const removeAria = <T extends Element>(key: string): Task<DOMTaskData<T>> => aria<T>(ariaPreffix+key, undefined);

//@@ SpecializedElement @@//
export type SpecializedElement = HTMLElement | SVGElement | MathMLElement;

//@@ dataAttr > Task, DOMTaskData, DOMPropertyValue, SpecializedElement @@//
export const dataAttr = <T extends SpecializedElement>(key: string, value: DOMPropertyValue): Task<DOMTaskData<T>> =>
    value === undefined ?
        (data: DOMTaskData<T>) => { delete data.element.dataset[key]; return data; } :
        typeof value === "function" ?
            (data: DOMTaskData<T>) => { data.element.dataset[key] = value(data.element.dataset[key] ?? undefined); return data; } :
            (data: DOMTaskData<T>) => { data.element.dataset[key] = value; return data; }

//@@ getDataAttr > Filter, DOMTaskData, SpecializedElement @@//
export const getDataAttr = <T extends SpecializedElement>(key: string, alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> =>
    (data: DOMTaskData<T>) => [[alias || key, data.element.dataset[key]]];

//@@ removeDataAttr > Task, DOMTaskData, SpecializedElement @@//
export const removeDataAttr = <T extends SpecializedElement>(key: string): Task<DOMTaskData<T>> => dataAttr<T>(key, undefined);

//@@ style > Task, DOMTaskData, DOMPropertyValue, SpecializedElement @@//
export const style = <T extends SpecializedElement>(key: string, value: DOMPropertyValue): Task<DOMTaskData<T>> =>
    value === undefined ?
        (data: DOMTaskData<T>) => { data.element.style[key] = null; return data; } :
        typeof value === "function" ?
            (data: DOMTaskData<T>) => { data.element.style[key] = value(data.element.style[key] ?? undefined); return data; } :
            (data: DOMTaskData<T>) => { data.element.style[key] = value; return data; }

//@@ css > Task, DOMTaskData, SpecializedElement @@//
export const css = <T extends SpecializedElement>(value: string | ((previous: string) => string)): Task<DOMTaskData<T>> =>
    typeof value === "function" ?
        (data: DOMTaskData<T>) => { data.element.style.cssText = value(data.element.style.cssText); return data; } :
        (data: DOMTaskData<T>) => { data.element.style.cssText = value; return data; }

//@@ getStyle > Filter, DOMTaskData, SpecializedElement @@//
export const getStyle = <T extends SpecializedElement>(key: string, alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> =>
    (data: DOMTaskData<T>) => [[alias || key, data.element.style[key]]];

//@@ removeStyle > Task, DOMTaskData, SpecializedElement @@//
export const removeStyle = <T extends SpecializedElement>(key: string): Task<DOMTaskData<T>> => style<T>(key, undefined);

//@@ remove > Task, DOMTaskData, DOMPropertyTask @@//
export const remove = <T extends Node>(property: DOMPropertyTask): Task<DOMTaskData<T>> => property(undefined);

//@@ subscribe > Task, DOMTaskData @@//
export const subscribe = <T extends EventTarget>(
    eventType: string,
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => (data: DOMTaskData<T>) => { 
    data.element.addEventListener(eventType, listener, options); 
    return data; 
}

//@@ unsubscribe > Task, DOMTaskData @@//
export const unsubscribe = <T extends EventTarget>(
    eventType: string,
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => (data: DOMTaskData<T>) => { 
    data.element.removeEventListener(eventType, listener, options); 
    return data; 
}

//@@ HTMLProxyTarget > Adapter, Branch, DOMTaskArg, DOMTaskData @@//
export type HTMLProxyTarget = Record<string, Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, string | Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>, DOMTaskData<HTMLElement>>>>;

//@@ SVGProxyTarget > Adapter, Branch, DOMTaskArg, DOMTaskData @@//
export type SVGProxyTarget = Record<string, Adapter<DOMTaskArg, DOMTaskData<SVGElement>, string | Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>, DOMTaskData<SVGElement>>>>;

//@@ MathMLProxyTarget > Adapter, Branch, DOMTaskArg, DOMTaskData @@//
export type MathMLProxyTarget = Record<string, Adapter<DOMTaskArg, DOMTaskData<MathMLElement>, string | Branch<DOMTaskArg, DOMTaskData<Text | MathMLElement>, DOMTaskData<MathMLElement>>>>;

//@@ DOMPropertyProxyTarget > DOMPropertyTask @@//
export type DOMPropertyProxyTarget = Record<string, DOMPropertyTask>;

//@@ DOMAttributeProxyTarget > Task, DOMTaskData, DOMPropertyValue @@//
export type DOMAttributeProxyTarget = Record<string, (value: DOMPropertyValue) => Task<DOMTaskData<Element>>>;

//@@ DOMStylePropertyProxyTarget > Task, DOMTaskData, DOMPropertyValue, SpecializedElement @@//
export type DOMStylePropertyProxyTarget = Record<string, (value: DOMPropertyValue) => Task<DOMTaskData<SpecializedElement>>>;

//@@ DOMEventProxyTarget > Task, DOMTaskData @@//
export type DOMEventProxyTarget = Record<string, (listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => Task<DOMTaskData<EventTarget>>>;

//@@ adapters_start > HTMLProxyTarget, SVGProxyTarget, MathMLProxyTarget, DOMTaskArg, DOMTaskData, createTreeNodeAdapter, nodeFactory, appendConnector, deriveDOMTaskArg, defaultConvert, htmlScope, svgScope, mathmlScope @@//
export const adapters = {
//@@ adapters.html > adapters_start, HTMLProxyTarget, domAdapter @@//
    html: new Proxy<HTMLProxyTarget>({}, {
        get(target, key, receiver) {
            if(typeof key === "string") return domAdapter(key, ["area","base","br","col","embed","hr","img","input","link","meta","para","source","track","wbr"].indexOf(key) >= 0, htmlScope);
            return Reflect.get(target, key, receiver);
        }
    }),
//@@ adapters.svg > adapters_start, SVGProxyTarget, domAdapter @@//
    svg: new Proxy<SVGProxyTarget>({}, {
        get(target, key, receiver) {
            if(typeof key === "string") return domAdapter(key, false, svgScope);
            return Reflect.get(target, key, receiver);
        }
    }),
//@@ adapters.math > adapters_start, MathMLProxyTarget, domAdapter @@//
    math: new Proxy<MathMLProxyTarget>({}, {
        get(target, key, receiver) {
            if(typeof key === "string") return domAdapter(key, false, mathmlScope);
            return Reflect.get(target, key, receiver);
        }
    }),
//@@ adapters.props > adapters_start, DOMPropertyProxyTarget, DOMPropertyValue, Task, DOMTaskData, prop @@//
    props: new Proxy<DOMPropertyProxyTarget>({}, {
        get(target, key, receiver) {
            if(typeof key === "string") return (value: DOMPropertyValue): Task<DOMTaskData<Node>> => prop(key, value);
            return Reflect.get(target, key, receiver);
        }
    }),
//@@ adapters.attrs > adapters_start, DOMAttributeProxyTarget, DOMPropertyValue, Task, DOMTaskData, attr @@//
    attrs: new Proxy<DOMAttributeProxyTarget>({}, {
        get(target, key, receiver) {
            if(typeof key === "string") return (value: DOMPropertyValue): Task<DOMTaskData<Element>> => 
                attr(/^aria[A-Z].*$/g.test(key) ? key.replace('aria', ariaPreffix) : key, value);
            return Reflect.get(target, key, receiver);
        }
    }),
//@@ adapters.attrs > adapters_start, DOMStylePropertyProxyTarget, DOMPropertyValue, SpecializedElement, Task, DOMTaskData, style @@//
    style: new Proxy<DOMStylePropertyProxyTarget>({}, {
        get(target, key, receiver) {
            if(typeof key === "string") return (value: DOMPropertyValue): Task<DOMTaskData<SpecializedElement>> => style(key, value);
            return Reflect.get(target, key, receiver);
        }
    }),
//@@ adapters.attrs > adapters_start, DOMEventProxyTarget, Task, DOMTaskData, subscribe, unsubscribe @@//
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

//@@ adapters > adapters_start  @@//
};

//@@ DOMPropertyQueryProxyTarget > Filter, DOMTaskData @@//
export type DOMPropertyQueryProxyTarget = Record<string, (key: string, alias?: string) => Filter<DOMTaskData<Node>,[string, unknown][]>>;

//@@ DOMStylePropertyQueryProxyTarget > Filter, DOMTaskData, SpecializedElement @@//
export type DOMStylePropertyQueryProxyTarget = Record<string, (key: string, alias?: string) => Filter<DOMTaskData<SpecializedElement>,[string, unknown][]>>;

//@@ queries_start > DOMPropertyQueryProxyTarget, DOMStylePropertyQueryProxyTarget, Filter, DOMTaskData, SpecializedElement @@//
export const queries = {
//@@ queries.props > queries_start, DOMPropertyQueryProxyTarget, Filter, DOMTaskData, getProp @@//
    props: new Proxy<DOMPropertyQueryProxyTarget>({},{
        get(target, key, receiver) {
            if(typeof key === "string") return (key: string, alias?: string): Filter<DOMTaskData<Node>,[string, unknown][]> => 
                getProp(key, alias);
            return Reflect.get(target, key, receiver);
        }
    }),
//@@ queries.style > queries_start, DOMStylePropertyQueryProxyTarget, Filter, DOMTaskData, getStyle @@//
    style: new Proxy<DOMStylePropertyQueryProxyTarget>({},{
        get(target, key, receiver) {
            if(typeof key === "string") return (key: string, alias?: string): Filter<DOMTaskData<SpecializedElement>,[string, unknown][]> => 
                getStyle(key, alias);
            return Reflect.get(target, key, receiver);
        }
    })
//@@ queries > queries_start  @@//
}


