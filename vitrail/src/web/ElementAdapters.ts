import { Result } from "fwd-result";
import { forkSuccess, RPipeEntry } from "fwd-result-pipe";


export type ElementAdapter = <TError>(...args: any) => RPipeEntry<Element,TError, Element,TError>;

export const attr: ElementAdapter = <TError>(
    name: string,
    value: string | ((previousValue: string | null) => string)
): RPipeEntry<Element,TError, Element,TError> => 
    typeof value === 'function' ?
        forkSuccess<Element,TError>(elt => elt.setAttribute(name, value(elt.getAttribute(name)))) :
        forkSuccess<Element,TError>(elt => elt.setAttribute(name, value));

export const attrMap: ElementAdapter = <TError>(
    attributes: Record<string, TError>
): RPipeEntry<Element,TError, Element,TError> => {
    const updaters = Object.entries(attributes).map(
        entry => typeof entry[1] === 'function' ?
            (elt: Element) => elt.setAttribute(
                entry[0], 
                (entry[1] as ((currentValue: string | null) => string))(elt.getAttribute(entry[0]))
            ) :
            (elt: Element) => elt.setAttribute(entry[0], entry[1]+"")
    );
    return (res: Result<Element,TError>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

export const removeAttr: ElementAdapter = <TError>(name: string): RPipeEntry<Element,TError, Element,TError> => 
    forkSuccess<Element,TError>(elt => elt.removeAttribute(name));

export const removeAttrMap: ElementAdapter = <TError>(
    attributes: string[]
): RPipeEntry<Element,TError, Element,TError> => {
    const updaters = attributes.map(attr => (elt: Element) => elt.removeAttribute(attr));
    return (res: Result<Element,TError>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}
    
export const aria: ElementAdapter = <TError>(
    name: string,
    value: string | ((previousValue: string | null) => string)
): RPipeEntry<Element,TError, Element,TError> => 
    typeof value === 'function' ?
        forkSuccess<Element,TError>(elt => elt.setAttribute('aria-'+name, value(elt.getAttribute('aria-'+name)))) :
        forkSuccess<Element,TError>(elt => elt.setAttribute('aria-'+name, value));

export const ariaMap: ElementAdapter = <TError>(
    attributes: Record<string, TError>
): RPipeEntry<Element,TError, Element,TError> => {
    const updaters = Object.entries(attributes).map(
        entry => typeof entry[1] === 'function' ?
            (elt: Element) => elt.setAttribute(
                'aria-'+entry[0], 
                (entry[1] as ((currentValue: string | null) => string))(elt.getAttribute('aria-'+entry[0]))
            ) :
            (elt: Element) => elt.setAttribute('aria-'+entry[0], entry[1]+"")
    );
    return (res: Result<Element,TError>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

export const removeAria: ElementAdapter = <TError>(name: string): RPipeEntry<Element,TError, Element,TError> => 
    forkSuccess<Element,TError>(elt => elt.removeAttribute('aria-'+name));

export const removeAriaMap: ElementAdapter = <TError>(
    attributes: string[]
): RPipeEntry<Element,TError, Element,TError> => {
    const updaters = attributes.map(attr => (elt: Element) => elt.removeAttribute('aria-'+attr));
    return (res: Result<Element,TError>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

