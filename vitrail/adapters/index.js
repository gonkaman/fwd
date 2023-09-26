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
exports.onMouseMove = exports.onMouseLeave = exports.onMouseEnter = exports.onMouseDown = exports.onChange = exports.onFocus = exports.onBlur = exports.onDbClick = exports.onClick = exports.dispatch = exports.unsubscribe = exports.subscribe = exports.getStyle = exports.removeStyle = exports.style = exports.getDataAttr = exports.removeDataAttr = exports.dataAttr = exports.getAria = exports.removeAria = exports.aria = exports.getProp = exports.removeProp = exports.prop = exports.getAttr = exports.removeAttr = exports.attr = exports.dettach = exports.attach = exports.render = exports.invoke = exports.exec = exports.query = exports.createQuery = exports.createSync = exports.sync = exports.dir = exports.getLang = exports.lang = exports.getTabIndex = exports.tabIndex = exports.getTitleAttr = exports.titleAttr = exports.getClass = exports.toggleClass = exports.removeClass = exports.addClass = exports.className = exports.getId = exports.id = void 0;
exports.getCssText = exports.cssText = exports.textContent = exports.onFocusOut = exports.onFocusIn = exports.onSelect = exports.onPaste = exports.onCut = exports.onCopy = exports.onKeyUp = exports.onKeyPress = exports.onKeyDown = exports.onScroll = exports.onMouseWheel = exports.onMouseUp = exports.onMouseOver = exports.onMouseOut = void 0;
const fwd_pipe_1 = require("fwd-pipe");
const id = (value) => (0, exports.attr)('id', value);
exports.id = id;
const getId = (key) => (0, exports.getAttr)('id', key);
exports.getId = getId;
const className = (value) => (0, exports.attr)('class', value);
exports.className = className;
const addClass = (name) => (0, fwd_pipe_1.fork)(elt => elt.classList.add(name));
exports.addClass = addClass;
const removeClass = (name) => (0, fwd_pipe_1.fork)(elt => elt.classList.remove(name));
exports.removeClass = removeClass;
const toggleClass = (name) => (0, fwd_pipe_1.fork)(elt => elt.classList.toggle(name));
exports.toggleClass = toggleClass;
const getClass = (key) => (0, exports.getAttr)('class', key);
exports.getClass = getClass;
const titleAttr = (value) => (0, exports.attr)('title', value);
exports.titleAttr = titleAttr;
const getTitleAttr = (key) => (0, exports.getAttr)('title', key);
exports.getTitleAttr = getTitleAttr;
const tabIndex = (value) => (0, exports.attr)('tabIndex', value);
exports.tabIndex = tabIndex;
const getTabIndex = (key) => (0, exports.getAttr)('tabIndex', key);
exports.getTabIndex = getTabIndex;
const lang = (value) => (0, exports.attr)('lang', value);
exports.lang = lang;
const getLang = (key) => (0, exports.getAttr)('lang', key);
exports.getLang = getLang;
const dir = (value) => (0, exports.attr)('dir', value);
exports.dir = dir;
const sync = (handle) => (0, fwd_pipe_1.fork)(target => handle((() => target)));
exports.sync = sync;
const createSync = () => {
    let innerEffect = () => undefined;
    return [
        (handle) => { innerEffect = handle; },
        () => innerEffect()
    ];
};
exports.createSync = createSync;
const createQuery = () => {
    const queries = [];
    return [
        query => queries.push(query),
        () => queries.reduce((entries, query) => entries.concat(query()), [])
    ];
};
exports.createQuery = createQuery;
const query = (handle, ...components) => (0, fwd_pipe_1.fork)(target => handle(() => components.reduce((entries, query) => entries.concat(query(target)), [])));
exports.query = query;
const exec = (command, ...args) => (0, fwd_pipe_1.fork)(target => target[command](...args));
exports.exec = exec;
const invoke = (query, key, ...args) => (target) => [[key || query, target[query](...args)]];
exports.invoke = invoke;
const render = (target, update) => typeof target === 'string' ?
    () => update(document.querySelector(target)) :
    () => update(target);
exports.render = render;
const attach = (target) => typeof target === 'string' ?
    (0, fwd_pipe_1.fork)(elt => document.querySelector(target)?.append(elt)) :
    (0, fwd_pipe_1.fork)(elt => target.append(elt));
exports.attach = attach;
const dettach = () => (0, fwd_pipe_1.fork)(elt => elt.remove());
exports.dettach = dettach;
//https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes#content_versus_idl_attributes
const attr = (name, value) => value === undefined ? (0, fwd_pipe_1.fork)(elt => elt.removeAttribute(name)) :
    (typeof value === 'function' ?
        (0, fwd_pipe_1.fork)(elt => elt.setAttribute(name, value(elt.getAttribute(name)))) :
        (0, fwd_pipe_1.fork)(elt => elt.setAttribute(name, value)));
exports.attr = attr;
const removeAttr = (attribute) => typeof attribute === 'string' ? (0, exports.attr)(attribute, undefined) : attribute(undefined);
exports.removeAttr = removeAttr;
const getAttr = (name, key) => (target) => [[key || name, target.getAttribute(name)]];
exports.getAttr = getAttr;
const prop = (name, value) => value === undefined ? (0, fwd_pipe_1.fork)(elt => { elt[name] = null; }) :
    (typeof value === 'function' ?
        (0, fwd_pipe_1.fork)(elt => { elt[name] = value(elt[name]); }) :
        (0, fwd_pipe_1.fork)(elt => { elt[name] = value; }));
exports.prop = prop;
const removeProp = (attribute) => typeof attribute === 'string' ? (0, exports.prop)(attribute, undefined) : attribute(undefined);
exports.removeProp = removeProp;
const getProp = (name, key) => (target) => [[key || name, target[name]]];
exports.getProp = getProp;
const aria = (name, value) => (0, exports.attr)('aria-' + name, value);
exports.aria = aria;
const removeAria = (ariaRole) => (0, exports.removeAttr)(typeof ariaRole === 'string' ? 'aria-' + ariaRole : ariaRole);
exports.removeAria = removeAria;
const getAria = (role, key) => (target) => [[key || 'aria_' + role, target.getAttribute('aria-' + role)]];
exports.getAria = getAria;
//https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
const dataAttr = (name, value) => value === undefined ? (0, fwd_pipe_1.fork)(elt => { delete elt.dataset[name]; }) :
    (typeof value === 'function' ?
        (0, fwd_pipe_1.fork)(elt => { elt.dataset[name] = value(elt.dataset[name]); }) :
        (0, fwd_pipe_1.fork)(elt => { elt.dataset[name] = value; }));
exports.dataAttr = dataAttr;
const removeDataAttr = (attribute) => typeof attribute === 'string' ? (0, exports.dataAttr)(attribute, undefined) : attribute(undefined);
exports.removeDataAttr = removeDataAttr;
const getDataAttr = (name, key) => (target) => [[key || 'data_' + name, target.dataset[name]]];
exports.getDataAttr = getDataAttr;
const style = (name, value) => value === undefined ? (0, fwd_pipe_1.fork)(elt => { elt.style[name] = null; }) :
    (typeof value === 'function' ?
        (0, fwd_pipe_1.fork)(elt => { elt.style[name] = value(elt.style[name]); }) :
        (0, fwd_pipe_1.fork)(elt => { elt.style[name] = value; }));
exports.style = style;
const removeStyle = (attribute) => typeof attribute === 'string' ? (0, exports.style)(attribute, undefined) : attribute(undefined);
exports.removeStyle = removeStyle;
const getStyle = (name, key) => (target) => [[key || 'style_' + name, target.style[name]]];
exports.getStyle = getStyle;
const subscribe = (eventType, listener, options) => (0, fwd_pipe_1.fork)(elt => elt.addEventListener(eventType, listener, options));
exports.subscribe = subscribe;
const unsubscribe = (eventType, listener, options) => (0, fwd_pipe_1.fork)(elt => elt.removeEventListener(eventType, listener, options));
exports.unsubscribe = unsubscribe;
const dispatch = (event) => // exec('dispatchEvent', event);
 (0, fwd_pipe_1.fork)(elt => elt.dispatchEvent(event));
exports.dispatch = dispatch;
const onClick = (listener, options) => (0, exports.subscribe)('click', listener, options);
exports.onClick = onClick;
const onDbClick = (listener, options) => (0, exports.subscribe)('dbclick', listener, options);
exports.onDbClick = onDbClick;
const onBlur = (listener, options) => (0, exports.subscribe)('blur', listener, options);
exports.onBlur = onBlur;
const onFocus = (listener, options) => (0, exports.subscribe)('focus', listener, options);
exports.onFocus = onFocus;
const onChange = (listener, options) => (0, exports.subscribe)('change', listener, options);
exports.onChange = onChange;
const onMouseDown = (listener, options) => (0, exports.subscribe)('mousedown', listener, options);
exports.onMouseDown = onMouseDown;
const onMouseEnter = (listener, options) => (0, exports.subscribe)('mouseenter', listener, options);
exports.onMouseEnter = onMouseEnter;
const onMouseLeave = (listener, options) => (0, exports.subscribe)('mouseleave', listener, options);
exports.onMouseLeave = onMouseLeave;
const onMouseMove = (listener, options) => (0, exports.subscribe)('mousemove', listener, options);
exports.onMouseMove = onMouseMove;
const onMouseOut = (listener, options) => (0, exports.subscribe)('mouseout', listener, options);
exports.onMouseOut = onMouseOut;
const onMouseOver = (listener, options) => (0, exports.subscribe)('mouseover', listener, options);
exports.onMouseOver = onMouseOver;
const onMouseUp = (listener, options) => (0, exports.subscribe)('mouseup', listener, options);
exports.onMouseUp = onMouseUp;
const onMouseWheel = (listener, options) => (0, exports.subscribe)('mousewheel', listener, options);
exports.onMouseWheel = onMouseWheel;
const onScroll = (listener, options) => (0, exports.subscribe)('scroll', listener, options);
exports.onScroll = onScroll;
const onKeyDown = (listener, options) => (0, exports.subscribe)('keydown', listener, options);
exports.onKeyDown = onKeyDown;
const onKeyPress = (listener, options) => (0, exports.subscribe)('keypress', listener, options);
exports.onKeyPress = onKeyPress;
const onKeyUp = (listener, options) => (0, exports.subscribe)('keyup', listener, options);
exports.onKeyUp = onKeyUp;
const onCopy = (listener, options) => (0, exports.subscribe)('copy', listener, options);
exports.onCopy = onCopy;
const onCut = (listener, options) => (0, exports.subscribe)('cut', listener, options);
exports.onCut = onCut;
const onPaste = (listener, options) => (0, exports.subscribe)('paste', listener, options);
exports.onPaste = onPaste;
const onSelect = (listener, options) => (0, exports.subscribe)('select', listener, options);
exports.onSelect = onSelect;
const onFocusIn = (listener, options) => (0, exports.subscribe)('focusin', listener, options);
exports.onFocusIn = onFocusIn;
const onFocusOut = (listener, options) => (0, exports.subscribe)('focusout', listener, options);
exports.onFocusOut = onFocusOut;
const textContent = (value) => (0, exports.prop)('textContent', value);
exports.textContent = textContent;
const cssText = (value) => (0, exports.style)('cssText', value);
exports.cssText = cssText;
const getCssText = (key) => (0, exports.getStyle)('cssText', key);
exports.getCssText = getCssText;
