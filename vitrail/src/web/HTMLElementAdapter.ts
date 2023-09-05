import { PipeEntry, Result, forkSuccess, pipe, success } from "fwd-result";

export type HTMLElementAdapter = (...args: any) => PipeEntry<HTMLElement,unknown, HTMLElement,unknown>;

export const data: HTMLElementAdapter = (
    name: string,
    value: string | ((previousValue: string | null) => string)
): PipeEntry<HTMLElement,unknown, HTMLElement,unknown> => 
    typeof value === 'function' ?
        forkSuccess<HTMLElement,unknown>(elt => { elt.dataset[name] = value(elt.getAttribute(name)); }) :
        forkSuccess<HTMLElement,unknown>(elt => { elt.dataset[name] = value; });

export const dataMap: HTMLElementAdapter = (
    attributes: Record<string, unknown>
): PipeEntry<HTMLElement,unknown, HTMLElement,unknown> => {
    const updaters = Object.entries(attributes).map(
        entry => typeof entry[1] === 'function' ?
            (elt: HTMLElement) => {
                elt.dataset[entry[0]] = (entry[1] as ((currentValue: string | undefined) => string))(elt.dataset[entry[0]]); 
            } :
            (elt: HTMLElement) => elt.setAttribute(entry[0], entry[1]+"")
    );
    return (res: Result<HTMLElement,unknown>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

export const removeData: HTMLElementAdapter = (name: string): PipeEntry<HTMLElement,unknown, HTMLElement,unknown> => 
    forkSuccess<HTMLElement,unknown>(elt => {delete elt.dataset[name];} );

export const removeDataMap: HTMLElementAdapter = (
    attributes: string[]
): PipeEntry<HTMLElement,unknown, HTMLElement,unknown> => {
    const updaters = attributes.map(name => (elt: HTMLElement) => {delete elt.dataset[name];});
    return (res: Result<HTMLElement,unknown>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}


export const style: HTMLElementAdapter = (
    name: string,
    value: string | ((previousValue: string | null) => string)
): PipeEntry<HTMLElement,unknown, HTMLElement,unknown> => 
    typeof value === 'function' ?
        forkSuccess<HTMLElement,unknown>(elt => { elt.style[name] = value(elt.getAttribute(name)); }) :
        forkSuccess<HTMLElement,unknown>(elt => elt.setAttribute(name, value));

export const cssText: HTMLElementAdapter = (
    css: string
): PipeEntry<HTMLElement,unknown, HTMLElement,unknown> => 
    forkSuccess<HTMLElement,unknown>(elt => {elt.style.cssText = css;})

export const styleMap: HTMLElementAdapter = (
    attributes: Record<string, unknown>
): PipeEntry<HTMLElement,unknown, HTMLElement,unknown> => {
    const updaters = Object.entries(attributes).map(
        entry => typeof entry[1] === 'function' ?
            (elt: HTMLElement) => elt.style[entry[0]] =
                (entry[1] as ((currentValue: string) => string))(elt.style[entry[0]]) :
            (elt: HTMLElement) => elt.style[entry[0]] = entry[1]+""
    );
    return (res: Result<HTMLElement,unknown>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

export const removeStyle: HTMLElementAdapter = (name: string): PipeEntry<HTMLElement,unknown, HTMLElement,unknown> => 
    forkSuccess<HTMLElement,unknown>(elt => { elt.style[name] = null; });

export const removeStyleMap: HTMLElementAdapter = (
    attributes: string[]
): PipeEntry<HTMLElement,unknown, HTMLElement,unknown> => {
    const updaters = attributes.map(name => (elt: HTMLElement) => { elt.style[name] = null; });
    return (res: Result<HTMLElement,unknown>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

    