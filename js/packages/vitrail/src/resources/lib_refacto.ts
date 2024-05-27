/** Core Building blocks */

//@@ Filter @@//
export type Filter<TArg,TResult> = (arg: TArg) => TResult;

//@@ Task > Filter @@//
export type Task<T> = Filter<T,T>;

//@@ Connector > Task @@//
export type Connector<TTarget, TArg, TChild> = <T extends TTarget>(filter: Filter<TArg,TChild>, deriveArg: Filter<TTarget, TArg>) => Task<T>;

//@@ Branch > Task @@//
export type Branch<TArg, TTarget> = <TParent>(connector: Connector<TParent, TArg, TTarget>, deriveArg: Filter<TParent, TArg>) => Task<TParent>;

//@@ Adapter > Task, Branch @@//
export type Adapter<TArg, TTarget, TCompat> = (...args: (Task<TTarget> | TCompat)[]) => Branch<TArg, TTarget>;

//@@ Lookup > Filter @@//
export type Lookup<T> = Filter<void,T|null|undefined>;

//@@ Curator > Lookup @@//
export type Curator<T> = (lookup: Lookup<T>) => void; 

//@@ Store > Curator, Lookup @@//
export type Delegate<T> = [Curator<T>, Lookup<T>];

//@@ createTreeNodeAdapter > Filter, Connector, Branch, Adapter @@//
export const createTreeNodeAdapter = <TArg, TTarget, TChild, K>(
    factory: Filter<TArg, TTarget>,
    connect: Connector<TTarget, TArg, TChild>,
    deriveArg: Filter<TTarget, TArg>,
    convert: Filter<K, Task<TTarget>>
): Adapter<TArg, TTarget, K | Branch<TArg, TChild>> => 
    (...args: (Task<TTarget> | K | Branch<TArg, TChild>)[]): Branch<TArg, TTarget> => 
        <T>(tConnect: Connector<T, TArg, TTarget>, tDerive: Filter<T, TArg>): Task<T> => tConnect( 
            args.reduce((filter, arg) => {
                if(typeof arg === "function"){
                    return arg.length == 1 ? 
                        (ctx: TArg) => (arg as Task<TTarget>)(filter(ctx)) :
                        (ctx: TArg) => (arg as Branch<TArg, TChild>)<TTarget>(connect, deriveArg)(filter(ctx))
                }
                return (ctx: TArg) => convert(arg)(filter(ctx));
            }, factory),
            tDerive
        );

export const noConnector = <TArg, T>(_: Filter<TArg, any>): Task<T> => (target: T) => target;

/** DOM implementation */

//@@ DOMTaskContext @@//
export type DOMTaskContext = { document: Document, scope: string }

//@@ DOMTaskData @@//
export type DOMTaskData<T> = { element: T, document: Document, scope: string }

//@@ DOMTaskArg > DOMTaskContext @@//
export type DOMTaskArg = DOMTaskContext | null | undefined;

//@@ DOMTaskCompatible @@//
export type DOMTaskCompatible = string | number; // | Date | string[] | number[] | Element;

//@@ nodeFactory > Filter, DOMTaskArg, DOMTaskData @@//
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

//@@ deriveDOMTaskArg > DOMTaskData, DOMTaskArg @@//
export const deriveDOMTaskArg = <T>(data: DOMTaskData<T>): DOMTaskArg => data;

//@@ defaultConvert > Task, DOMTaskData, DOMTaskCompatible @@//
export const defaultConvert = <T extends Node>(arg: DOMTaskCompatible): Task<DOMTaskData<T>> => 
    (data: DOMTaskData<T>): DOMTaskData<T> => {
        if(data.scope === textScope){
            data.element.nodeValue = arg+"";
        }else{
            data.element.appendChild(data.document.createTextNode(arg+""));
        }
        return data;
    }

//@@ appendConnector > Task, DOMTaskData, DOMTaskArg @@//
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

//@@ prependConnector > Task, DOMTaskData, DOMTaskArg @@//
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

export const domElement = <T extends Element>(
    tag: string | [string, string], 
    ...tasks: (Task<DOMTaskData<T>> | Branch<DOMTaskArg, DOMTaskData<Element>> | DOMTaskCompatible)[]
): Branch<DOMTaskArg, DOMTaskData<T>> => 
<TParent>(pConnect: Connector<TParent, DOMTaskArg, DOMTaskData<T>>, pDerive: Filter<TParent, DOMTaskArg>): Task<TParent> => 
    pConnect( 
        tasks.reduce((filter: Filter<DOMTaskArg, DOMTaskData<T>>, task) => {
            if(typeof task === "function"){
                return task.length == 1 ? 
                    (ctx: DOMTaskArg) => (task as Task<DOMTaskData<T>>)(filter(ctx)) :
                    (ctx: DOMTaskArg) => (task as Branch<DOMTaskArg, DOMTaskData<Element>>)<DOMTaskData<T>>(
                        appendConnector, deriveDOMTaskArg
                    )(filter(ctx))
            }
            return (ctx: DOMTaskArg) => defaultConvert<T>(task)(filter(ctx));
        }, typeof tag === 'string' ? nodeFactory<T>(tag) : nodeFactory<T>(tag[0], tag[1])),
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
export const getAria = <T extends Element>(key: string, alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>(ariaPreffix+key)
export const removeAria = <T extends Element>(key: string): Task<DOMTaskData<T>> => aria<T>(key, undefined);

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


// export const text = createTreeNodeAdapter<
//     DOMTaskArg, DOMTaskData<Text>, 
//     undefined, string
// >(nodeFactory<Text>("",textScope), noConnector, deriveDOMTaskArg, defaultConvert);

// export const a = createTreeNodeAdapter<
//     DOMTaskArg, DOMTaskData<HTMLAnchorElement>, 
//     DOMTaskData<Text | HTMLElement>, string
// >(nodeFactory<HTMLAnchorElement>("a", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);

// export const id = <T extends Element>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr("id", value);
// export const nodeValue = <T extends Node>(value: DOMPropertyValue): Task<DOMTaskData<T>> => prop("id", value);

// export const addClass = <T extends Element>(name: string): Task<DOMTaskData<T>> => (data: DOMTaskData<T>): DOMTaskData<T> => { 
//     data.element.classList.add(name); 
//     return data; 
// }



