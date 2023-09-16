/*

MIT License

Copyright (c) 2023 Joël GONKAMAN

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

import { pipe, resolve } from "fwd-pipe";
import { failure, success } from "fwd-result";
import { forkSuccess } from "fwd-result-pipe";
// export type EffectComponent<TBase> = <T extends TBase, E>(...args: any) => RPipeEntry<T,E,T,E>;
export const render = (target, update) => typeof target === 'string' ?
    () => update(success(document.querySelector(target))) :
    () => update(success(target));
export const useEffect = () => {
    let innerEffect = () => failure(undefined);
    return [
        (handle) => { innerEffect = handle; },
        () => innerEffect()
    ];
};
//Adapter<T>
export const createEffect = (handle, ...components) => forkSuccess(target => handle((resolve(components.reduce((p, effect) => p(effect), pipe(() => success(target)))))));
//Effect<EventTarget>
export const subscribe = (eventType, listener, options) => forkSuccess(elt => elt.addEventListener(eventType, listener, options));
//Effect<EventTarget>
export const subscribeMap = (listenerMap) => {
    const updaters = Object.entries(listenerMap).map(entry => typeof entry[1] === 'function' ?
        (elt) => elt.addEventListener(entry[0], entry[1]) :
        (typeof entry[1]['handleEvent'] === 'function' ?
            (elt) => elt.addEventListener(entry[0], entry[1]) :
            (elt) => elt.addEventListener(entry[0], entry[1]['listener'], entry[1]['options'])));
    return (res) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    };
};
//Effect<EventTarget>
export const unsubscribe = (eventType, listener, options) => forkSuccess(elt => elt.removeEventListener(eventType, listener, options));
//Effect<EventTarget>
export const unsubscribeMap = (listenerMap) => {
    const updaters = Object.entries(listenerMap).map(entry => typeof entry[1] === 'function' ?
        (elt) => elt.removeEventListener(entry[0], entry[1]) :
        (typeof entry[1]['handleEvent'] === 'function' ?
            (elt) => elt.removeEventListener(entry[0], entry[1]) :
            (elt) => elt.removeEventListener(entry[0], entry[1]['listener'], entry[1]['options'])));
    return (res) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    };
};
//Effect<EventTarget>
export const dispatch = (event) => forkSuccess(elt => elt.dispatchEvent(event));
//Effect<Element>
export const attach = (target) => typeof target === 'string' ?
    forkSuccess(elt => document.querySelector(target)?.append(elt)) :
    forkSuccess(elt => target.append(elt));
//Effect<Element>
export const dettach = () => forkSuccess(elt => elt.remove());
//Effect<Element>
export const attr = (name, value) => typeof value === 'function' ?
    forkSuccess(elt => elt.setAttribute(name, value(elt.getAttribute(name)))) :
    forkSuccess(elt => elt.setAttribute(name, value));
//Effect<Element>
export const attrMap = (attributes) => {
    const updaters = Object.entries(attributes).map(entry => typeof entry[1] === 'function' ?
        (elt) => elt.setAttribute(entry[0], entry[1](elt.getAttribute(entry[0]))) :
        (elt) => elt.setAttribute(entry[0], entry[1] + ""));
    return (res) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    };
};
//Effect<Element>
export const removeAttr = (name) => forkSuccess(elt => elt.removeAttribute(name));
//Effect<Element>
export const removeAttrMap = (attributes) => {
    const updaters = attributes.map(attr => (elt) => elt.removeAttribute(attr));
    return (res) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    };
};
//Effect<Element>
export const aria = (name, value) => typeof value === 'function' ?
    forkSuccess(elt => elt.setAttribute('aria-' + name, value(elt.getAttribute('aria-' + name)))) :
    forkSuccess(elt => elt.setAttribute('aria-' + name, value));
//Effect<Element>
export const ariaMap = (attributes) => {
    const updaters = Object.entries(attributes).map(entry => typeof entry[1] === 'function' ?
        (elt) => elt.setAttribute('aria-' + entry[0], entry[1](elt.getAttribute('aria-' + entry[0]))) :
        (elt) => elt.setAttribute('aria-' + entry[0], entry[1] + ""));
    return (res) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    };
};
//Effect<Element>
export const removeAria = (name) => forkSuccess(elt => elt.removeAttribute('aria-' + name));
//Effect<Element>
export const removeAriaMap = (attributes) => {
    const updaters = attributes.map(attr => (elt) => elt.removeAttribute('aria-' + attr));
    return (res) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    };
};
//Effect<HTMLElement>
export const dataAttr = (name, value) => typeof value === 'function' ?
    forkSuccess(elt => { elt.dataset[name] = value(elt.dataset[name]); }) :
    forkSuccess(elt => { elt.dataset[name] = value; });
//Effect<HTMLElement>
export const dataMap = (attributes) => {
    const updaters = Object.entries(attributes).map(entry => typeof entry[1] === 'function' ?
        (elt) => {
            elt.dataset[entry[0]] = entry[1](elt.dataset[entry[0]]);
        } :
        (elt) => elt.setAttribute(entry[0], entry[1] + ""));
    return (res) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    };
};
//Effect<HTMLElement>
export const removeDataAttr = (name) => forkSuccess(elt => { delete elt.dataset[name]; });
export const removeDataMap = (attributes) => {
    const updaters = attributes.map(name => (elt) => { delete elt.dataset[name]; });
    return (res) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    };
};
//Effect<HTMLElement>
export const styleAttr = (name, value) => typeof value === 'function' ?
    forkSuccess(elt => { elt.style[name] = value(elt.getAttribute(name)); }) :
    forkSuccess(elt => elt.setAttribute(name, value));
//Effect<HTMLElement>
export const cssText = (css) => forkSuccess(elt => { elt.style.cssText = css; });
//Effect<HTMLElement>
export const styleMap = (attributes) => {
    const updaters = Object.entries(attributes).map(entry => typeof entry[1] === 'function' ?
        (elt) => elt.style[entry[0]] =
            entry[1](elt.style[entry[0]]) :
        (elt) => elt.style[entry[0]] = entry[1] + "");
    return (res) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    };
};
//Effect<HTMLElement>
export const removeStyleAttr = (name) => forkSuccess(elt => { elt.style[name] = null; });
//Effect<HTMLElement>
export const removeStyleMap = (attributes) => {
    const updaters = attributes.map(name => (elt) => { elt.style[name] = null; });
    return (res) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    };
};
