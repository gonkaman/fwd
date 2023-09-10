import { Result, success } from "fwd-result";
import { forkSuccess, RPipeEntry } from "fwd-result-pipe";

//deriveEffect => adapter
//deriveQuery => adapter

// export interface EffectBuilder<T,E>{
//     pipe(): PipeBuilder<T,E>,
//     runner(): Runner<T,E>
// }

// export interface QueryBuilder<T,E>{
//     source(): T,
//     pipe(): PipeBuilder<[string, any][], E>,
//     runner(): Runner<[string, any][], E>
// }

// export interface DeriveEffect<TOrigin, TBuilder>{
//     handleEffect(
//         handler: (builder: TBuilder) => any
//     ): TOrigin
// }

// export interface DeriveQuery<TOrigin, TBuilder>{
//     handleQuery(
//         handler: (builder: TBuilder) => any
//     ): TOrigin
// }

export const attach = <T extends Element,E>(target: T | string, update: RPipeEntry<T,E,T,E>) => typeof target === 'string' ?
    () => update(success(document.querySelector(target) as T)) :
    () => update(success(target as T));



export type Adapter<TBase> = <T extends TBase, E>(...args: any[]) => RPipeEntry<T,E,T,E>;

//Adapter<Element>
export const attr = <T extends Element,E>(
    name: string,
    value: string | ((previousValue: string | null) => string)
): RPipeEntry<T,E,T,E> => 
    typeof value === 'function' ?
        forkSuccess<T,E>(elt => elt.setAttribute(name, value(elt.getAttribute(name)))) :
        forkSuccess<T,E>(elt => elt.setAttribute(name, value));

//Adapter<Element>
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

//Adapter<Element>
export const removeAttr = <T extends Element,E>(name: string): RPipeEntry<T,E, T,E> => 
    forkSuccess<T,E>(elt => elt.removeAttribute(name));

//Adapter<Element>
export const removeAttrMap  = <T extends Element,E>(
    attributes: string[]
): RPipeEntry<T,E, T,E> => {
    const updaters = attributes.map(attr => (elt: Element) => elt.removeAttribute(attr));
    return (res: Result<T,E>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

//Adapter<Element>
export const aria = <T extends Element,E>(
    name: string,
    value: string | ((previousValue: string | null) => string)
): RPipeEntry<T,E, T,E> => 
    typeof value === 'function' ?
        forkSuccess<T,E>(elt => elt.setAttribute('aria-'+name, value(elt.getAttribute('aria-'+name)))) :
        forkSuccess<T,E>(elt => elt.setAttribute('aria-'+name, value));

//Adapter<Element>
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

//Adapter<Element>
export const removeAria = <T extends Element,E>(name: string): RPipeEntry<T,E, T,E> => 
    forkSuccess<T,E>(elt => elt.removeAttribute('aria-'+name));

//Adapter<Element>
export const removeAriaMap = <T extends Element,E>(
    attributes: string[]
): RPipeEntry<T,E, T,E> => {
    const updaters = attributes.map(attr => (elt: Element) => elt.removeAttribute('aria-'+attr));
    return (res: Result<T,E>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

//Adapter<HTMLElement>
export const dataAttr = <T extends HTMLElement, E>(
    name: string,
    value: string | ((previousValue: string | null) => string)
): RPipeEntry<T,E, T,E> => 
    typeof value === 'function' ?
        forkSuccess<T,E>(elt => { elt.dataset[name] = value(elt.getAttribute(name)); }) :
        forkSuccess<T,E>(elt => { elt.dataset[name] = value; });

//Adapter<HTMLElement>
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

//Adapter<HTMLElement>
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

//Adapter<HTMLElement>
export const styleAttr = <T extends HTMLElement, E>(
    name: string,
    value: string | ((previousValue: string | null) => string)
): RPipeEntry<T,E, T,E> => 
    typeof value === 'function' ?
        forkSuccess<T,E>(elt => { elt.style[name] = value(elt.getAttribute(name)); }) :
        forkSuccess<T,E>(elt => elt.setAttribute(name, value));

//Adapter<HTMLElement>
export const cssText = <T extends HTMLElement, E>(
    css: string
): RPipeEntry<T,E, T,E> => 
    forkSuccess<T,E>(elt => {elt.style.cssText = css;})

//Adapter<HTMLElement>
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

//Adapter<HTMLElement>
export const removeStyleAttr = <T extends HTMLElement, E>(name: string): RPipeEntry<T,E, T,E> => 
    forkSuccess<T,E>(elt => { elt.style[name] = null; });

//Adapter<HTMLElement>
export const removeStyleMap = <T extends HTMLElement, E>(
    attributes: string[]
): RPipeEntry<T,E, T,E> => {
    const updaters = attributes.map(name => (elt: HTMLElement) => { elt.style[name] = null; });
    return (res: Result<T,E>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}
