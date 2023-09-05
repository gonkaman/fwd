import { PipeEntry, Result, forkSuccess, pipe, success } from "fwd-result";


export type ElementAdapter = (...args: any) => PipeEntry<Element,unknown, Element,unknown>;

export const attr: ElementAdapter = (
    name: string,
    value: string | ((previousValue: string | null) => string)
): PipeEntry<Element,unknown, Element,unknown> => 
    typeof value === 'function' ?
        forkSuccess<Element,unknown>(elt => elt.setAttribute(name, value(elt.getAttribute(name)))) :
        forkSuccess<Element,unknown>(elt => elt.setAttribute(name, value));

export const attrMap: ElementAdapter = (
    attributes: Record<string, unknown>
): PipeEntry<Element,unknown, Element,unknown> => {
    const updaters = Object.entries(attributes).map(
        entry => typeof entry[1] === 'function' ?
            (elt: Element) => elt.setAttribute(
                entry[0], 
                (entry[1] as ((currentValue: string | null) => string))(elt.getAttribute(entry[0]))
            ) :
            (elt: Element) => elt.setAttribute(entry[0], entry[1]+"")
    );
    return (res: Result<Element,unknown>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

export const removeAttr: ElementAdapter = (name: string): PipeEntry<Element,unknown, Element,unknown> => 
    forkSuccess<Element,unknown>(elt => elt.removeAttribute(name));

export const removeAttrMap: ElementAdapter = (
    attributes: string[]
): PipeEntry<Element,unknown, Element,unknown> => {
    const updaters = attributes.map(attr => (elt: Element) => elt.removeAttribute(attr));
    return (res: Result<Element,unknown>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}
    
export const aria: ElementAdapter = (
    name: string,
    value: string | ((previousValue: string | null) => string)
): PipeEntry<Element,unknown, Element,unknown> => 
    typeof value === 'function' ?
        forkSuccess<Element,unknown>(elt => elt.setAttribute('aria-'+name, value(elt.getAttribute('aria-'+name)))) :
        forkSuccess<Element,unknown>(elt => elt.setAttribute('aria-'+name, value));

export const ariaMap: ElementAdapter = (
    attributes: Record<string, unknown>
): PipeEntry<Element,unknown, Element,unknown> => {
    const updaters = Object.entries(attributes).map(
        entry => typeof entry[1] === 'function' ?
            (elt: Element) => elt.setAttribute(
                'aria-'+entry[0], 
                (entry[1] as ((currentValue: string | null) => string))(elt.getAttribute('aria-'+entry[0]))
            ) :
            (elt: Element) => elt.setAttribute('aria-'+entry[0], entry[1]+"")
    );
    return (res: Result<Element,unknown>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

export const removeAria: ElementAdapter = (name: string): PipeEntry<Element,unknown, Element,unknown> => 
    forkSuccess<Element,unknown>(elt => elt.removeAttribute('aria-'+name));

export const removeAriaMap: ElementAdapter = (
    attributes: string[]
): PipeEntry<Element,unknown, Element,unknown> => {
    const updaters = attributes.map(attr => (elt: Element) => elt.removeAttribute('aria-'+attr));
    return (res: Result<Element,unknown>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

