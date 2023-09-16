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

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeStyleMap = exports.removeStyleAttr = exports.styleMap = exports.cssText = exports.styleAttr = exports.removeDataMap = exports.removeDataAttr = exports.dataMap = exports.dataAttr = exports.removeAriaMap = exports.removeAria = exports.ariaMap = exports.aria = exports.removeAttrMap = exports.removeAttr = exports.attrMap = exports.attr = exports.dettach = exports.attach = exports.dispatch = exports.unsubscribeMap = exports.unsubscribe = exports.subscribeMap = exports.subscribe = exports.createEffect = exports.useEffect = exports.render = void 0;
const fwd_pipe_1 = require("fwd-pipe");
const fwd_result_1 = require("fwd-result");
const fwd_result_pipe_1 = require("fwd-result-pipe");
// export type EffectComponent<TBase> = <T extends TBase, E>(...args: any) => RPipeEntry<T,E,T,E>;
const render = (target, update) => typeof target === 'string' ?
    () => update((0, fwd_result_1.success)(document.querySelector(target))) :
    () => update((0, fwd_result_1.success)(target));
exports.render = render;
const useEffect = () => {
    let innerEffect = () => (0, fwd_result_1.failure)(undefined);
    return [
        (handle) => { innerEffect = handle; },
        () => innerEffect()
    ];
};
exports.useEffect = useEffect;
//Adapter<T>
const createEffect = (handle, ...components) => (0, fwd_result_pipe_1.forkSuccess)(target => handle(((0, fwd_pipe_1.resolve)(components.reduce((p, effect) => p(effect), (0, fwd_pipe_1.pipe)(() => (0, fwd_result_1.success)(target)))))));
exports.createEffect = createEffect;
//Effect<EventTarget>
const subscribe = (eventType, listener, options) => (0, fwd_result_pipe_1.forkSuccess)(elt => elt.addEventListener(eventType, listener, options));
exports.subscribe = subscribe;
//Effect<EventTarget>
const subscribeMap = (listenerMap) => {
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
exports.subscribeMap = subscribeMap;
//Effect<EventTarget>
const unsubscribe = (eventType, listener, options) => (0, fwd_result_pipe_1.forkSuccess)(elt => elt.removeEventListener(eventType, listener, options));
exports.unsubscribe = unsubscribe;
//Effect<EventTarget>
const unsubscribeMap = (listenerMap) => {
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
exports.unsubscribeMap = unsubscribeMap;
//Effect<EventTarget>
const dispatch = (event) => (0, fwd_result_pipe_1.forkSuccess)(elt => elt.dispatchEvent(event));
exports.dispatch = dispatch;
//Effect<Element>
const attach = (target) => typeof target === 'string' ?
    (0, fwd_result_pipe_1.forkSuccess)(elt => document.querySelector(target)?.append(elt)) :
    (0, fwd_result_pipe_1.forkSuccess)(elt => target.append(elt));
exports.attach = attach;
//Effect<Element>
const dettach = () => (0, fwd_result_pipe_1.forkSuccess)(elt => elt.remove());
exports.dettach = dettach;
//Effect<Element>
const attr = (name, value) => typeof value === 'function' ?
    (0, fwd_result_pipe_1.forkSuccess)(elt => elt.setAttribute(name, value(elt.getAttribute(name)))) :
    (0, fwd_result_pipe_1.forkSuccess)(elt => elt.setAttribute(name, value));
exports.attr = attr;
//Effect<Element>
const attrMap = (attributes) => {
    const updaters = Object.entries(attributes).map(entry => typeof entry[1] === 'function' ?
        (elt) => elt.setAttribute(entry[0], entry[1](elt.getAttribute(entry[0]))) :
        (elt) => elt.setAttribute(entry[0], entry[1] + ""));
    return (res) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    };
};
exports.attrMap = attrMap;
//Effect<Element>
const removeAttr = (name) => (0, fwd_result_pipe_1.forkSuccess)(elt => elt.removeAttribute(name));
exports.removeAttr = removeAttr;
//Effect<Element>
const removeAttrMap = (attributes) => {
    const updaters = attributes.map(attr => (elt) => elt.removeAttribute(attr));
    return (res) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    };
};
exports.removeAttrMap = removeAttrMap;
//Effect<Element>
const aria = (name, value) => typeof value === 'function' ?
    (0, fwd_result_pipe_1.forkSuccess)(elt => elt.setAttribute('aria-' + name, value(elt.getAttribute('aria-' + name)))) :
    (0, fwd_result_pipe_1.forkSuccess)(elt => elt.setAttribute('aria-' + name, value));
exports.aria = aria;
//Effect<Element>
const ariaMap = (attributes) => {
    const updaters = Object.entries(attributes).map(entry => typeof entry[1] === 'function' ?
        (elt) => elt.setAttribute('aria-' + entry[0], entry[1](elt.getAttribute('aria-' + entry[0]))) :
        (elt) => elt.setAttribute('aria-' + entry[0], entry[1] + ""));
    return (res) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    };
};
exports.ariaMap = ariaMap;
//Effect<Element>
const removeAria = (name) => (0, fwd_result_pipe_1.forkSuccess)(elt => elt.removeAttribute('aria-' + name));
exports.removeAria = removeAria;
//Effect<Element>
const removeAriaMap = (attributes) => {
    const updaters = attributes.map(attr => (elt) => elt.removeAttribute('aria-' + attr));
    return (res) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    };
};
exports.removeAriaMap = removeAriaMap;
//Effect<HTMLElement>
const dataAttr = (name, value) => typeof value === 'function' ?
    (0, fwd_result_pipe_1.forkSuccess)(elt => { elt.dataset[name] = value(elt.dataset[name]); }) :
    (0, fwd_result_pipe_1.forkSuccess)(elt => { elt.dataset[name] = value; });
exports.dataAttr = dataAttr;
//Effect<HTMLElement>
const dataMap = (attributes) => {
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
exports.dataMap = dataMap;
//Effect<HTMLElement>
const removeDataAttr = (name) => (0, fwd_result_pipe_1.forkSuccess)(elt => { delete elt.dataset[name]; });
exports.removeDataAttr = removeDataAttr;
const removeDataMap = (attributes) => {
    const updaters = attributes.map(name => (elt) => { delete elt.dataset[name]; });
    return (res) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    };
};
exports.removeDataMap = removeDataMap;
//Effect<HTMLElement>
const styleAttr = (name, value) => typeof value === 'function' ?
    (0, fwd_result_pipe_1.forkSuccess)(elt => { elt.style[name] = value(elt.getAttribute(name)); }) :
    (0, fwd_result_pipe_1.forkSuccess)(elt => elt.setAttribute(name, value));
exports.styleAttr = styleAttr;
//Effect<HTMLElement>
const cssText = (css) => (0, fwd_result_pipe_1.forkSuccess)(elt => { elt.style.cssText = css; });
exports.cssText = cssText;
//Effect<HTMLElement>
const styleMap = (attributes) => {
    const updaters = Object.entries(attributes).map(entry => typeof entry[1] === 'function' ?
        (elt) => elt.style[entry[0]] =
            entry[1](elt.style[entry[0]]) :
        (elt) => elt.style[entry[0]] = entry[1] + "");
    return (res) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    };
};
exports.styleMap = styleMap;
//Effect<HTMLElement>
const removeStyleAttr = (name) => (0, fwd_result_pipe_1.forkSuccess)(elt => { elt.style[name] = null; });
exports.removeStyleAttr = removeStyleAttr;
//Effect<HTMLElement>
const removeStyleMap = (attributes) => {
    const updaters = attributes.map(name => (elt) => { elt.style[name] = null; });
    return (res) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    };
};
exports.removeStyleMap = removeStyleMap;
