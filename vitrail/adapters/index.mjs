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

import { fork } from "fwd-pipe";
export const id = (value) => attr('id', value);
export const getId = (key) => getAttr('id', key);
export const className = (value) => attr('class', value);
export const addClass = (name) => fork(elt => elt.classList.add(name));
export const removeClass = (name) => fork(elt => elt.classList.remove(name));
export const toggleClass = (name) => fork(elt => elt.classList.toggle(name));
export const getClass = (key) => getAttr('class', key);
export const titleAttr = (value) => attr('title', value);
export const getTitleAttr = (key) => getAttr('title', key);
export const tabIndex = (value) => attr('tabIndex', value);
export const getTabIndex = (key) => getAttr('tabIndex', key);
export const lang = (value) => attr('lang', value);
export const getLang = (key) => getAttr('lang', key);
export const dir = (value) => attr('dir', value);
export const sync = (handle) => fork(target => handle((() => target)));
export const createSync = () => {
    let innerEffect = () => undefined;
    return [
        (handle) => { innerEffect = handle; },
        () => innerEffect()
    ];
};
export const createQuery = () => {
    const queries = [];
    return [
        query => queries.push(query),
        () => queries.reduce((entries, query) => entries.concat(query()), [])
    ];
};
export const query = (handle, ...components) => fork(target => handle(() => components.reduce((entries, query) => entries.concat(query(target)), [])));
export const exec = (command, ...args) => fork(target => target[command](...args));
export const invoke = (query, key, ...args) => (target) => [[key || query, target[query](...args)]];
export const render = (target, update) => typeof target === 'string' ?
    () => update(document.querySelector(target)) :
    () => update(target);
export const attach = (target) => typeof target === 'string' ?
    fork(elt => document.querySelector(target)?.append(elt)) :
    fork(elt => target.append(elt));
export const dettach = () => fork(elt => elt.remove());
//https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes#content_versus_idl_attributes
export const attr = (name, value) => value === undefined ? fork(elt => elt.removeAttribute(name)) :
    (typeof value === 'function' ?
        fork(elt => elt.setAttribute(name, value(elt.getAttribute(name)))) :
        fork(elt => elt.setAttribute(name, value)));
export const removeAttr = (attribute) => typeof attribute === 'string' ? attr(attribute, undefined) : attribute(undefined);
export const getAttr = (name, key) => (target) => [[key || name, target.getAttribute(name)]];
export const prop = (name, value) => value === undefined ? fork(elt => { elt[name] = null; }) :
    (typeof value === 'function' ?
        fork(elt => { elt[name] = value(elt[name]); }) :
        fork(elt => { elt[name] = value; }));
export const removeProp = (attribute) => typeof attribute === 'string' ? prop(attribute, undefined) : attribute(undefined);
export const getProp = (name, key) => (target) => [[key || name, target[name]]];
export const aria = (name, value) => attr('aria-' + name, value);
export const removeAria = (ariaRole) => removeAttr(typeof ariaRole === 'string' ? 'aria-' + ariaRole : ariaRole);
export const getAria = (role, key) => (target) => [[key || 'aria_' + role, target.getAttribute('aria-' + role)]];
//https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
export const dataAttr = (name, value) => value === undefined ? fork(elt => { delete elt.dataset[name]; }) :
    (typeof value === 'function' ?
        fork(elt => { elt.dataset[name] = value(elt.dataset[name]); }) :
        fork(elt => { elt.dataset[name] = value; }));
export const removeDataAttr = (attribute) => typeof attribute === 'string' ? dataAttr(attribute, undefined) : attribute(undefined);
export const getDataAttr = (name, key) => (target) => [[key || 'data_' + name, target.dataset[name]]];
export const style = (name, value) => value === undefined ? fork(elt => { elt.style[name] = null; }) :
    (typeof value === 'function' ?
        fork(elt => { elt.style[name] = value(elt.style[name]); }) :
        fork(elt => { elt.style[name] = value; }));
export const removeStyle = (attribute) => typeof attribute === 'string' ? style(attribute, undefined) : attribute(undefined);
export const getStyle = (name, key) => (target) => [[key || 'style_' + name, target.style[name]]];
export const subscribe = (eventType, listener, options) => fork(elt => elt.addEventListener(eventType, listener, options));
export const unsubscribe = (eventType, listener, options) => fork(elt => elt.removeEventListener(eventType, listener, options));
export const dispatch = (event) => // exec('dispatchEvent', event);
 fork(elt => elt.dispatchEvent(event));
export const onClick = (listener, options) => subscribe('click', listener, options);
export const onDbClick = (listener, options) => subscribe('dbclick', listener, options);
export const onBlur = (listener, options) => subscribe('blur', listener, options);
export const onFocus = (listener, options) => subscribe('focus', listener, options);
export const onChange = (listener, options) => subscribe('change', listener, options);
export const onMouseDown = (listener, options) => subscribe('mousedown', listener, options);
export const onMouseEnter = (listener, options) => subscribe('mouseenter', listener, options);
export const onMouseLeave = (listener, options) => subscribe('mouseleave', listener, options);
export const onMouseMove = (listener, options) => subscribe('mousemove', listener, options);
export const onMouseOut = (listener, options) => subscribe('mouseout', listener, options);
export const onMouseOver = (listener, options) => subscribe('mouseover', listener, options);
export const onMouseUp = (listener, options) => subscribe('mouseup', listener, options);
export const onMouseWheel = (listener, options) => subscribe('mousewheel', listener, options);
export const onScroll = (listener, options) => subscribe('scroll', listener, options);
export const onKeyDown = (listener, options) => subscribe('keydown', listener, options);
export const onKeyPress = (listener, options) => subscribe('keypress', listener, options);
export const onKeyUp = (listener, options) => subscribe('keyup', listener, options);
export const onCopy = (listener, options) => subscribe('copy', listener, options);
export const onCut = (listener, options) => subscribe('cut', listener, options);
export const onPaste = (listener, options) => subscribe('paste', listener, options);
export const onSelect = (listener, options) => subscribe('select', listener, options);
export const onFocusIn = (listener, options) => subscribe('focusin', listener, options);
export const onFocusOut = (listener, options) => subscribe('focusout', listener, options);
export const textContent = (value) => prop('textContent', value);
export const cssText = (value) => style('cssText', value);
export const getCssText = (key) => getStyle('cssText', key);
