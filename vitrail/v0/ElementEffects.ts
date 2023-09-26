import { pipe, resolve } from "fwd-pipe";
import { Result, failure, success } from "fwd-result";
import { forkSuccess, RPipeEntry } from "fwd-result-pipe";


export type Effect<T, E> = () => Result<T,E>;
export type EffectHandler<T,E> = (handle: Effect<T,E>) => any;
// export type EffectComponent<TBase> = <T extends TBase, E>(...args: any) => RPipeEntry<T,E,T,E>;


export const render = <T extends Element,E>(target: T | string, update: RPipeEntry<T,E,T,E>) => typeof target === 'string' ?
    () => update(success(document.querySelector(target) as T)) :
    () => update(success(target as T));


export const useEffect = <T,E>(): [EffectHandler<T,E>, Effect<T,E>] => {
    let innerEffect: Effect<T,E> = () => failure<T,E>(undefined as E);
    return [
        (handle: Effect<T,E>) => { innerEffect = handle; },
        () => innerEffect()
    ]
}

//Adapter<T>
export const createEffect = <T,E>(
    handle: (resultingEffect: () => Result<T,E>) => any,
    ...components: RPipeEntry<T,E,T,E>[]
): RPipeEntry<T,E,T,E> => forkSuccess<T,E>(target => handle(
    (resolve(components.reduce(
        (p, effect) => p(effect), pipe(() => success<T,E>(target))
    ))) as (() => Result<T,E>)
));

//Effect<EventTarget>
export const subscribe = <T extends EventTarget,E>(
    eventType: string, 
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): RPipeEntry<T,E,T,E> =>
    forkSuccess<T,E>(elt => elt.addEventListener(eventType, listener, options));

//Effect<EventTarget>
export const subscribeMap = <T extends EventTarget,E>(
    listenerMap: Record<string, EventListenerOrEventListenerObject | {
                    listener: EventListenerOrEventListenerObject,
                    options?: boolean | AddEventListenerOptions
                }>
): RPipeEntry<T,E,T,E> => {
    const updaters = Object.entries(listenerMap).map(
        entry => typeof entry[1] === 'function' ?
            (elt: EventTarget) => elt.addEventListener(entry[0], entry[1] as EventListener) :
            (
                typeof entry[1]['handleEvent'] === 'function' ?
                (elt: EventTarget) => elt.addEventListener(entry[0], entry[1] as EventListenerObject) :
                (elt: EventTarget) => elt.addEventListener(
                    entry[0], 
                    entry[1]['listener'] as EventListenerOrEventListenerObject,
                    entry[1]['options'] as boolean | AddEventListenerOptions
                ) 
            )
    );
    return (res: Result<T,E>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

//Effect<EventTarget>
export const unsubscribe = <T extends EventTarget,E>(
    eventType: string, 
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): RPipeEntry<T,E,T,E> =>
    forkSuccess<T,E>(elt => elt.removeEventListener(eventType, listener, options));

//Effect<EventTarget>
export const unsubscribeMap = <T extends EventTarget,E>(
    listenerMap: Record<string, EventListenerOrEventListenerObject | {
                    listener: EventListenerOrEventListenerObject,
                    options?: boolean | AddEventListenerOptions
                }>
): RPipeEntry<T,E,T,E> => {
    const updaters = Object.entries(listenerMap).map(
        entry => typeof entry[1] === 'function' ?
            (elt: EventTarget) => elt.removeEventListener(entry[0], entry[1] as EventListener) :
            (
                typeof entry[1]['handleEvent'] === 'function' ?
                (elt: EventTarget) => elt.removeEventListener(entry[0], entry[1] as EventListenerObject) :
                (elt: EventTarget) => elt.removeEventListener(
                    entry[0], 
                    entry[1]['listener'] as EventListenerOrEventListenerObject,
                    entry[1]['options'] as boolean | AddEventListenerOptions
                ) 
            )
    );
    return (res: Result<T,E>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

//Effect<EventTarget>
export const dispatch = <T extends EventTarget,E>(event: Event): RPipeEntry<T,E,T,E> =>
    forkSuccess<T,E>(elt => elt.dispatchEvent(event));




//Effect<Element>
export const attach = <T extends Element,E>(
    target: T | string
): RPipeEntry<T,E,T,E> => 
    typeof target === 'string' ?
        forkSuccess<T,E>(elt => document.querySelector(target)?.append(elt)) :
        forkSuccess<T,E>(elt => target.append(elt));

//Effect<Element>
export const dettach = <T extends Element,E>(): RPipeEntry<T,E,T,E> => 
        forkSuccess<T,E>(elt => elt.remove());


//Effect<Element>
export const attr = <T extends Element,E>(
    name: string,
    value: string | ((previousValue: string | null) => string)
): RPipeEntry<T,E,T,E> => 
    typeof value === 'function' ?
        forkSuccess<T,E>(elt => elt.setAttribute(name, value(elt.getAttribute(name)))) :
        forkSuccess<T,E>(elt => elt.setAttribute(name, value));

//Effect<Element>
export const attrMap  = <T extends Element,E>(
    attributes: Record<string, E>
): RPipeEntry<T,E, T,E> => {
    const updaters = Object.entries(attributes).map(
        entry => typeof entry[1] === 'function' ?
            (elt: Element) => elt.setAttribute(
                entry[0], 
                (entry[1] as ((currentValue: string | null) => string))(elt.getAttribute(entry[0]))
            ) :
            (elt: Element) => elt.setAttribute(entry[0], entry[1]+"")
    );
    return (res: Result<T,E>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

//Effect<Element>
export const removeAttr = <T extends Element,E>(name: string): RPipeEntry<T,E, T,E> => 
    forkSuccess<T,E>(elt => elt.removeAttribute(name));

//Effect<Element>
export const removeAttrMap  = <T extends Element,E>(
    attributes: string[]
): RPipeEntry<T,E, T,E> => {
    const updaters = attributes.map(attr => (elt: Element) => elt.removeAttribute(attr));
    return (res: Result<T,E>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

//Effect<Element>
export const aria = <T extends Element,E>(
    name: string,
    value: string | ((previousValue: string | null) => string)
): RPipeEntry<T,E, T,E> => 
    typeof value === 'function' ?
        forkSuccess<T,E>(elt => elt.setAttribute('aria-'+name, value(elt.getAttribute('aria-'+name)))) :
        forkSuccess<T,E>(elt => elt.setAttribute('aria-'+name, value));

//Effect<Element>
export const ariaMap = <T extends Element,E>(
    attributes: Record<string, E>
): RPipeEntry<T,E, T,E> => {
    const updaters = Object.entries(attributes).map(
        entry => typeof entry[1] === 'function' ?
            (elt: Element) => elt.setAttribute(
                'aria-'+entry[0], 
                (entry[1] as ((currentValue: string | null) => string))(elt.getAttribute('aria-'+entry[0]))
            ) :
            (elt: Element) => elt.setAttribute('aria-'+entry[0], entry[1]+"")
    );
    return (res: Result<T,E>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

//Effect<Element>
export const removeAria = <T extends Element,E>(name: string): RPipeEntry<T,E, T,E> => 
    forkSuccess<T,E>(elt => elt.removeAttribute('aria-'+name));

//Effect<Element>
export const removeAriaMap = <T extends Element,E>(
    attributes: string[]
): RPipeEntry<T,E, T,E> => {
    const updaters = attributes.map(attr => (elt: Element) => elt.removeAttribute('aria-'+attr));
    return (res: Result<T,E>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}




//Effect<HTMLElement>
export const dataAttr = <T extends HTMLElement, E>(
    name: string,
    value: string | ((previousValue: string | undefined) => string)
): RPipeEntry<T,E, T,E> => 
    typeof value === 'function' ?
        forkSuccess<T,E>(elt => { elt.dataset[name] = value(elt.dataset[name]); }) :
        forkSuccess<T,E>(elt => { elt.dataset[name] = value; });

//Effect<HTMLElement>
export const dataMap = <T extends HTMLElement, E>(
    attributes: Record<string, E>
): RPipeEntry<T,E, T,E> => {
    const updaters = Object.entries(attributes).map(
        entry => typeof entry[1] === 'function' ?
            (elt: HTMLElement) => {
                elt.dataset[entry[0]] = (entry[1] as ((currentValue: string | undefined) => string))(elt.dataset[entry[0]]); 
            } :
            (elt: HTMLElement) => elt.setAttribute(entry[0], entry[1]+"")
    );
    return (res: Result<T,E>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

//Effect<HTMLElement>
export const removeDataAttr = <T extends HTMLElement, E>(name: string): RPipeEntry<T,E, T,E> => 
    forkSuccess<T,E>(elt => {delete elt.dataset[name];} );

export const removeDataMap = <T extends HTMLElement, E>(
    attributes: string[]
): RPipeEntry<T,E, T,E> => {
    const updaters = attributes.map(name => (elt: HTMLElement) => {delete elt.dataset[name];});
    return (res: Result<T,E>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

//Effect<HTMLElement>
export const styleAttr = <T extends HTMLElement, E>(
    name: string,
    value: string | ((previousValue: string | null) => string)
): RPipeEntry<T,E, T,E> => 
    typeof value === 'function' ?
        forkSuccess<T,E>(elt => { elt.style[name] = value(elt.getAttribute(name)); }) :
        forkSuccess<T,E>(elt => elt.setAttribute(name, value));

//Effect<HTMLElement>
export const cssText = <T extends HTMLElement, E>(
    css: string
): RPipeEntry<T,E, T,E> => 
    forkSuccess<T,E>(elt => {elt.style.cssText = css;})

//Effect<HTMLElement>
export const styleMap = <T extends HTMLElement, E>(
    attributes: Record<string, E>
): RPipeEntry<T,E, T,E> => {
    const updaters = Object.entries(attributes).map(
        entry => typeof entry[1] === 'function' ?
            (elt: HTMLElement) => elt.style[entry[0]] =
                (entry[1] as ((currentValue: string) => string))(elt.style[entry[0]]) :
            (elt: HTMLElement) => elt.style[entry[0]] = entry[1]+""
    );
    return (res: Result<T,E>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

//Effect<HTMLElement>
export const removeStyleAttr = <T extends HTMLElement, E>(name: string): RPipeEntry<T,E, T,E> => 
    forkSuccess<T,E>(elt => { elt.style[name] = null; });

//Effect<HTMLElement>
export const removeStyleMap = <T extends HTMLElement, E>(
    attributes: string[]
): RPipeEntry<T,E, T,E> => {
    const updaters = attributes.map(name => (elt: HTMLElement) => { elt.style[name] = null; });
    return (res: Result<T,E>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}


//'id','className','title','tabIndex','lang','dir','accessKey','slot','part'
//Element properties
export const id = <T extends Element, E>(value: string): RPipeEntry<T,E, T,E> => attr('id', value);
export const className = <T extends Element, E>(value: string): RPipeEntry<T,E, T,E> => attr('className', value);
export const title = <T extends Element, E>(value: string): RPipeEntry<T,E, T,E> => attr('title', value);
export const tabIndex = <T extends Element, E>(value: string): RPipeEntry<T,E, T,E> => attr('tabIndex', value);
export const lang = <T extends Element, E>(value: string): RPipeEntry<T,E, T,E> => attr('lang', value);
export const dir = <T extends Element, E>(value: string): RPipeEntry<T,E, T,E> => attr('dir', value);
export const accessKey = <T extends Element, E>(value: string): RPipeEntry<T,E, T,E> => attr('accessKey', value);
export const part = <T extends Element, E>(value: string): RPipeEntry<T,E, T,E> => attr('part', value);