import { Result }  from "fwd-result";
import { forkSuccess, RPipeEntry } from "fwd-result-pipe";

export type HTMLElementAdapter = <TError>(...args: any) => RPipeEntry<HTMLElement,TError, HTMLElement,TError>;

export const data: HTMLElementAdapter = <TError>(
    name: string,
    value: string | ((previousValue: string | null) => string)
): RPipeEntry<HTMLElement,TError, HTMLElement,TError> => 
    typeof value === 'function' ?
        forkSuccess<HTMLElement,TError>(elt => { elt.dataset[name] = value(elt.getAttribute(name)); }) :
        forkSuccess<HTMLElement,TError>(elt => { elt.dataset[name] = value; });

export const dataMap: HTMLElementAdapter = <TError>(
    attributes: Record<string, TError>
): RPipeEntry<HTMLElement,TError, HTMLElement,TError> => {
    const updaters = Object.entries(attributes).map(
        entry => typeof entry[1] === 'function' ?
            (elt: HTMLElement) => {
                elt.dataset[entry[0]] = (entry[1] as ((currentValue: string | undefined) => string))(elt.dataset[entry[0]]); 
            } :
            (elt: HTMLElement) => elt.setAttribute(entry[0], entry[1]+"")
    );
    return (res: Result<HTMLElement,TError>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

export const removeData: HTMLElementAdapter = <TError>(name: string): RPipeEntry<HTMLElement,TError, HTMLElement,TError> => 
    forkSuccess<HTMLElement,TError>(elt => {delete elt.dataset[name];} );

export const removeDataMap: HTMLElementAdapter = <TError>(
    attributes: string[]
): RPipeEntry<HTMLElement,TError, HTMLElement,TError> => {
    const updaters = attributes.map(name => (elt: HTMLElement) => {delete elt.dataset[name];});
    return (res: Result<HTMLElement,TError>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}


export const style: HTMLElementAdapter = <TError>(
    name: string,
    value: string | ((previousValue: string | null) => string)
): RPipeEntry<HTMLElement,TError, HTMLElement,TError> => 
    typeof value === 'function' ?
        forkSuccess<HTMLElement,TError>(elt => { elt.style[name] = value(elt.getAttribute(name)); }) :
        forkSuccess<HTMLElement,TError>(elt => elt.setAttribute(name, value));

export const cssText: HTMLElementAdapter = <TError>(
    css: string
): RPipeEntry<HTMLElement,TError, HTMLElement,TError> => 
    forkSuccess<HTMLElement,TError>(elt => {elt.style.cssText = css;})

export const styleMap: HTMLElementAdapter = <TError>(
    attributes: Record<string, TError>
): RPipeEntry<HTMLElement,TError, HTMLElement,TError> => {
    const updaters = Object.entries(attributes).map(
        entry => typeof entry[1] === 'function' ?
            (elt: HTMLElement) => elt.style[entry[0]] =
                (entry[1] as ((currentValue: string) => string))(elt.style[entry[0]]) :
            (elt: HTMLElement) => elt.style[entry[0]] = entry[1]+""
    );
    return (res: Result<HTMLElement,TError>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

export const removeStyle: HTMLElementAdapter = <TError>(name: string): RPipeEntry<HTMLElement,TError, HTMLElement,TError> => 
    forkSuccess<HTMLElement,TError>(elt => { elt.style[name] = null; });

export const removeStyleMap: HTMLElementAdapter = <TError>(
    attributes: string[]
): RPipeEntry<HTMLElement,TError, HTMLElement,TError> => {
    const updaters = attributes.map(name => (elt: HTMLElement) => { elt.style[name] = null; });
    return (res: Result<HTMLElement,TError>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

    