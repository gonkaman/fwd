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

import { PipeEntry, fork, pipe, resolve } from "fwd-pipe";


export const id = <T extends Element>(value: AttributeAdapterValue): PipeEntry<T,T> => attr('id', value);
export const getId = (key?: string) => getAttr('id', key);

export const className = <T extends Element>(value: AttributeAdapterValue): PipeEntry<T,T> => attr('class', value);
export const addClass = <T extends Element>(name: string): PipeEntry<T,T> => fork(elt => elt.classList.add(name));
export const removeClass = <T extends Element>(name: string): PipeEntry<T,T> => fork(elt => elt.classList.remove(name));
export const toggleClass = <T extends Element>(name: string): PipeEntry<T,T> => fork(elt => elt.classList.toggle(name));
export const getClass = (key?: string) => getAttr('class', key);

export const titleAttr = <T extends HTMLElement>(value: AttributeAdapterValue): PipeEntry<T,T> => attr('title', value);
export const getTitleAttr = (key?: string) => getAttr('title', key);

export const tabIndex = <T extends HTMLElement>(value: AttributeAdapterValue): PipeEntry<T,T> => attr('tabIndex', value);
export const getTabIndex = (key?: string) => getAttr('tabIndex', key);

export const lang = <T extends HTMLElement>(value: AttributeAdapterValue): PipeEntry<T,T> => attr('lang', value);
export const getLang = (key?: string) => getAttr('lang', key);

export const dir = <T extends HTMLElement>(value: AttributeAdapterValue): PipeEntry<T,T> => attr('dir', value);

export type Effect = <T>() => T;
export type EffectHandler = (handle: Effect) => any;

export const sync = <T>(
    handle: (nodeSelector: Effect) => any
): PipeEntry<T,T> => fork(target => handle((() => target) as Effect));

export const createSync = (): [EffectHandler, Effect] => {
    let innerEffect: Effect = <T>() => (undefined as T);
    return [
        (handle: Effect) => { innerEffect = handle; },
        () => innerEffect()
    ]
}

export type Query = () => [string, unknown][]
export type QueryMap = () => [string, [string, unknown][]][]

// export type QueryComponent<TBase> = <T extends TBase>(target: T) => [string, unknown][]

export type QueryHandler = (query: Query) => any

export const createQuery = (): [QueryHandler, Query] => {
    const queries: Query[] = [];
    return [
        query => queries.push(query), 
        () => queries.reduce((entries: [string, unknown][], query) => entries.concat(query()), [])
    ] 
}

export const query = <T>(
    handle: (resultingQuery: Query) => any,
    ...components: ((target: T) => [string, unknown][])[]
): PipeEntry<T,T> => fork(
    target => handle(() => components.reduce(
        (entries: [string, unknown][], query) => entries.concat(query(target)), []
    ))
)

export const exec = <T>(
    command: string,
    ...args: any
): PipeEntry<T,T> => 
    fork(target => target[command](...args));

export const invoke = <T>(
    query: string, 
    key?: string,
    ...args: any
) =>
    (target: T) => [[key || query, target[query](...args)]];


export const render = <T extends Element>(target: T | string, ...updates: PipeEntry<T,T>[]) => typeof target === 'string' ?
    () => updates.forEach(update => update(document.querySelector(target) as T)) :
    () => updates.forEach(update => update(target as T));

export const attach = <T extends Element>(
    target: T | string
): PipeEntry<T,T> => 
    typeof target === 'string' ?
        fork(elt => document.querySelector(target)?.append(elt)) :
        fork(elt => target.append(elt));

export const dettach = <T extends Element,E>(): PipeEntry<T,T> => fork(elt => elt.remove());

export type AttributeAdapterValue = string | ((previousValue: string | null) => string) | undefined;
export type AttributeAdapter = <T extends Element>(value: AttributeAdapterValue) => PipeEntry<T,T>;
export type PropertyAdapterValue = string | ((previousValue?: string) => string) | undefined;
export type PropertyAdapter = <T>(value: PropertyAdapterValue) => PipeEntry<T,T>;


//https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes#content_versus_idl_attributes
export const attr = <T extends Element>(
    name: string,
    value: AttributeAdapterValue
): PipeEntry<T,T> => 
    value === undefined ? fork(elt => elt.removeAttribute(name)) :
    (typeof value === 'function' ?
        fork(elt => elt.setAttribute(name, value(elt.getAttribute(name)))) :
        fork(elt => elt.setAttribute(name, value)));

export const removeAttr = <T extends Element>(attribute: string | AttributeAdapter): PipeEntry<T,T> => 
    typeof attribute === 'string' ? attr(attribute, undefined) : attribute(undefined);

export const getAttr = <T extends Element>(name: string, key?: string) =>
    (target: T) => ([[key || name, target.getAttribute(name)]] as [string, unknown][]);

export const prop = <T>(
    name: string,
    value: PropertyAdapterValue
): PipeEntry<T,T> => 
    value === undefined ? fork(elt => { elt[name] = null; }) :
    (typeof value === 'function' ?
        fork(elt => { elt[name] = value(elt[name]); }) :
        fork(elt => { elt[name] = value; }));

export const removeProp = <T>(attribute: string | PropertyAdapter): PipeEntry<T,T> => 
    typeof attribute === 'string' ? prop(attribute, undefined) : attribute(undefined);

export const getProp = <T>(name: string, key?: string) =>
    (target: T) => ([[key || name, target[name]]] as [string, unknown][]);

export const aria = <T extends Element>(
    name: string,
    value: string | ((previousValue: string | null) => string) | undefined
): PipeEntry<T,T> => attr('aria-'+name, value);

export const removeAria = <T extends Element>(ariaRole: string | AttributeAdapter): PipeEntry<T,T> => 
    removeAttr(typeof ariaRole === 'string' ? 'aria-'+ariaRole : ariaRole);

export const getAria = <T extends Element>(role: string, key?: string) =>
    (target: T) => [[key || 'aria_'+role, target.getAttribute('aria-'+role)]];

//https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
export const dataAttr = <T extends HTMLElement>(
    name: string,
    value: PropertyAdapterValue
): PipeEntry<T,T> => 
    value === undefined ? fork(elt => { delete elt.dataset[name]; }) :
    (typeof value === 'function' ?
        fork(elt => { elt.dataset[name] = value(elt.dataset[name]); }) :
        fork(elt => { elt.dataset[name] = value; }));

export const removeDataAttr = <T extends HTMLElement>(attribute: string | PropertyAdapter): PipeEntry<T,T> => 
    typeof attribute === 'string' ? dataAttr(attribute, undefined) : attribute(undefined);

export const getDataAttr = <T extends HTMLElement>(name: string, key?: string) =>
    (target: T) => [[key || 'data_'+name, target.dataset[name]]];

export const style = <T extends HTMLElement>(
    name: string,
    value: PropertyAdapterValue
): PipeEntry<T,T> => 
    value === undefined ? fork(elt => { elt.style[name] = null; }) :
    (typeof value === 'function' ?
        fork(elt => { elt.style[name] = value(elt.style[name]); }) :
        fork(elt => { elt.style[name] = value; }));

export const removeStyle = <T extends HTMLElement>(attribute: string | PropertyAdapter): PipeEntry<T,T> => 
    typeof attribute === 'string' ? style(attribute, undefined) : attribute(undefined);

export const getStyle = <T extends HTMLElement>(name: string, key?: string) =>
    (target: T) => [[key || 'style_'+name, target.style[name]]];

export const subscribe = <T extends EventTarget>(
    eventType: string, 
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> =>
    fork(elt => elt.addEventListener(eventType, listener, options));

export const unsubscribe = <T extends EventTarget>(
    eventType: string, 
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> =>
    fork(elt => elt.removeEventListener(eventType, listener, options));

export const dispatch = <T extends EventTarget>(event: Event): PipeEntry<T,T> => // exec('dispatchEvent', event);
    fork(elt => elt.dispatchEvent(event));



export const onClick = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('click', listener, options);

export const onDbClick = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('dbclick', listener, options);

export const onBlur = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('blur', listener, options);

export const onFocus = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('focus', listener, options);

export const onChange = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('change', listener, options);

export const onMouseDown = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('mousedown', listener, options);

export const onMouseEnter = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('mouseenter', listener, options);

export const onMouseLeave = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('mouseleave', listener, options);

export const onMouseMove = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('mousemove', listener, options);

export const onMouseOut = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('mouseout', listener, options);

export const onMouseOver = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('mouseover', listener, options);

export const onMouseUp = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('mouseup', listener, options);

export const onMouseWheel = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('mousewheel', listener, options);

export const onScroll = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('scroll', listener, options);

export const onKeyDown = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('keydown', listener, options);

export const onKeyPress = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('keypress', listener, options);

export const onKeyUp = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('keyup', listener, options);

export const onCopy = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('copy', listener, options);

export const onCut = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('cut', listener, options);

export const onPaste = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('paste', listener, options);

export const onSelect = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('select', listener, options);

export const onFocusIn = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('focusin', listener, options);

export const onFocusOut = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('focusout', listener, options);

export const textContent = <T extends Node>(value: PropertyAdapterValue): PipeEntry<T,T> => prop('textContent', value);

export const cssText = <T extends HTMLElement>(value: PropertyAdapterValue): PipeEntry<T,T> => style('cssText', value);
export const getCssText = (key?: string) => getStyle('cssText', key);