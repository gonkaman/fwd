"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeStyleMap = exports.removeStyleAttr = exports.styleMap = exports.cssText = exports.styleAttr = exports.removeDataMap = exports.removeDataAttr = exports.dataMap = exports.dataAttr = exports.removeAriaMap = exports.removeAria = exports.ariaMap = exports.aria = exports.removeAttrMap = exports.removeAttr = exports.attrMap = exports.attr = exports.attach = void 0;
const fwd_result_1 = require("fwd-result");
const fwd_result_pipe_1 = require("fwd-result-pipe");
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
const attach = (target, update) => typeof target === 'string' ?
    () => update((0, fwd_result_1.success)(document.querySelector(target))) :
    () => update((0, fwd_result_1.success)(target));
exports.attach = attach;
//Adapter<Element>
const attr = (name, value) => typeof value === 'function' ?
    (0, fwd_result_pipe_1.forkSuccess)(elt => elt.setAttribute(name, value(elt.getAttribute(name)))) :
    (0, fwd_result_pipe_1.forkSuccess)(elt => elt.setAttribute(name, value));
exports.attr = attr;
//Adapter<Element>
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
//Adapter<Element>
const removeAttr = (name) => (0, fwd_result_pipe_1.forkSuccess)(elt => elt.removeAttribute(name));
exports.removeAttr = removeAttr;
//Adapter<Element>
const removeAttrMap = (attributes) => {
    const updaters = attributes.map(attr => (elt) => elt.removeAttribute(attr));
    return (res) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    };
};
exports.removeAttrMap = removeAttrMap;
//Adapter<Element>
const aria = (name, value) => typeof value === 'function' ?
    (0, fwd_result_pipe_1.forkSuccess)(elt => elt.setAttribute('aria-' + name, value(elt.getAttribute('aria-' + name)))) :
    (0, fwd_result_pipe_1.forkSuccess)(elt => elt.setAttribute('aria-' + name, value));
exports.aria = aria;
//Adapter<Element>
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
//Adapter<Element>
const removeAria = (name) => (0, fwd_result_pipe_1.forkSuccess)(elt => elt.removeAttribute('aria-' + name));
exports.removeAria = removeAria;
//Adapter<Element>
const removeAriaMap = (attributes) => {
    const updaters = attributes.map(attr => (elt) => elt.removeAttribute('aria-' + attr));
    return (res) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    };
};
exports.removeAriaMap = removeAriaMap;
//Adapter<HTMLElement>
const dataAttr = (name, value) => typeof value === 'function' ?
    (0, fwd_result_pipe_1.forkSuccess)(elt => { elt.dataset[name] = value(elt.getAttribute(name)); }) :
    (0, fwd_result_pipe_1.forkSuccess)(elt => { elt.dataset[name] = value; });
exports.dataAttr = dataAttr;
//Adapter<HTMLElement>
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
//Adapter<HTMLElement>
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
//Adapter<HTMLElement>
const styleAttr = (name, value) => typeof value === 'function' ?
    (0, fwd_result_pipe_1.forkSuccess)(elt => { elt.style[name] = value(elt.getAttribute(name)); }) :
    (0, fwd_result_pipe_1.forkSuccess)(elt => elt.setAttribute(name, value));
exports.styleAttr = styleAttr;
//Adapter<HTMLElement>
const cssText = (css) => (0, fwd_result_pipe_1.forkSuccess)(elt => { elt.style.cssText = css; });
exports.cssText = cssText;
//Adapter<HTMLElement>
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
//Adapter<HTMLElement>
const removeStyleAttr = (name) => (0, fwd_result_pipe_1.forkSuccess)(elt => { elt.style[name] = null; });
exports.removeStyleAttr = removeStyleAttr;
//Adapter<HTMLElement>
const removeStyleMap = (attributes) => {
    const updaters = attributes.map(name => (elt) => { elt.style[name] = null; });
    return (res) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    };
};
exports.removeStyleMap = removeStyleMap;
