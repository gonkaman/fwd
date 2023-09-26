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

import { PipeEntry } from "fwd-pipe";
export declare const id: <T extends Element>(value: AttributeAdapterValue) => PipeEntry<T, T>;
export declare const getId: (key?: string) => (target: Element) => [string, unknown][];
export declare const className: <T extends Element>(value: AttributeAdapterValue) => PipeEntry<T, T>;
export declare const addClass: <T extends Element>(name: string) => PipeEntry<T, T>;
export declare const removeClass: <T extends Element>(name: string) => PipeEntry<T, T>;
export declare const toggleClass: <T extends Element>(name: string) => PipeEntry<T, T>;
export declare const getClass: (key?: string) => (target: Element) => [string, unknown][];
export declare const titleAttr: <T extends HTMLElement>(value: AttributeAdapterValue) => PipeEntry<T, T>;
export declare const getTitleAttr: (key?: string) => (target: Element) => [string, unknown][];
export declare const tabIndex: <T extends HTMLElement>(value: AttributeAdapterValue) => PipeEntry<T, T>;
export declare const getTabIndex: (key?: string) => (target: Element) => [string, unknown][];
export declare const lang: <T extends HTMLElement>(value: AttributeAdapterValue) => PipeEntry<T, T>;
export declare const getLang: (key?: string) => (target: Element) => [string, unknown][];
export declare const dir: <T extends HTMLElement>(value: AttributeAdapterValue) => PipeEntry<T, T>;
export type Effect = <T>() => T;
export type EffectHandler = (handle: Effect) => any;
export declare const sync: <T>(handle: (nodeSelector: Effect) => any) => PipeEntry<T, T>;
export declare const createSync: () => [EffectHandler, Effect];
export type Query = () => [string, unknown][];
export type QueryMap = () => [string, [string, unknown][]][];
export type QueryHandler = (query: Query) => any;
export declare const createQuery: () => [QueryHandler, Query];
export declare const query: <T>(handle: (resultingQuery: Query) => any, ...components: ((target: T) => [string, unknown][])[]) => PipeEntry<T, T>;
export declare const exec: <T>(command: string, ...args: any) => PipeEntry<T, T>;
export declare const invoke: <T>(query: string, key?: string, ...args: any) => (target: T) => any[][];
export declare const render: <T extends Element>(target: string | T, update: PipeEntry<T, T>) => () => T;
export declare const attach: <T extends Element>(target: string | T) => PipeEntry<T, T>;
export declare const dettach: <T extends Element, E>() => PipeEntry<T, T>;
export type AttributeAdapterValue = string | ((previousValue: string | null) => string) | undefined;
export type AttributeAdapter = <T extends Element>(value: AttributeAdapterValue) => PipeEntry<T, T>;
export type PropertyAdapterValue = string | ((previousValue?: string) => string) | undefined;
export type PropertyAdapter = <T>(value: PropertyAdapterValue) => PipeEntry<T, T>;
export declare const attr: <T extends Element>(name: string, value: AttributeAdapterValue) => PipeEntry<T, T>;
export declare const removeAttr: <T extends Element>(attribute: string | AttributeAdapter) => PipeEntry<T, T>;
export declare const getAttr: <T extends Element>(name: string, key?: string) => (target: T) => [string, unknown][];
export declare const prop: <T>(name: string, value: PropertyAdapterValue) => PipeEntry<T, T>;
export declare const removeProp: <T>(attribute: string | PropertyAdapter) => PipeEntry<T, T>;
export declare const getProp: <T>(name: string, key?: string) => (target: T) => [string, unknown][];
export declare const aria: <T extends Element>(name: string, value: string | ((previousValue: string | null) => string)) => PipeEntry<T, T>;
export declare const removeAria: <T extends Element>(ariaRole: string | AttributeAdapter) => PipeEntry<T, T>;
export declare const getAria: <T extends Element>(role: string, key?: string) => (target: T) => string[][];
export declare const dataAttr: <T extends HTMLElement>(name: string, value: PropertyAdapterValue) => PipeEntry<T, T>;
export declare const removeDataAttr: <T extends HTMLElement>(attribute: string | PropertyAdapter) => PipeEntry<T, T>;
export declare const getDataAttr: <T extends HTMLElement>(name: string, key?: string) => (target: T) => string[][];
export declare const style: <T extends HTMLElement>(name: string, value: PropertyAdapterValue) => PipeEntry<T, T>;
export declare const removeStyle: <T extends HTMLElement>(attribute: string | PropertyAdapter) => PipeEntry<T, T>;
export declare const getStyle: <T extends HTMLElement>(name: string, key?: string) => (target: T) => any[][];
export declare const subscribe: <T extends EventTarget>(eventType: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const unsubscribe: <T extends EventTarget>(eventType: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const dispatch: <T extends EventTarget>(event: Event) => PipeEntry<T, T>;
export declare const onClick: <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const onDbClick: <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const onBlur: <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const onFocus: <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const onChange: <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const onMouseDown: <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const onMouseEnter: <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const onMouseLeave: <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const onMouseMove: <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const onMouseOut: <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const onMouseOver: <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const onMouseUp: <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const onMouseWheel: <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const onScroll: <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const onKeyDown: <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const onKeyPress: <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const onKeyUp: <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const onCopy: <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const onCut: <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const onPaste: <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const onSelect: <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const onFocusIn: <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const onFocusOut: <T extends EventTarget>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => PipeEntry<T, T>;
export declare const textContent: <T extends Node>(value: PropertyAdapterValue) => PipeEntry<T, T>;
export declare const cssText: <T extends HTMLElement>(value: PropertyAdapterValue) => PipeEntry<T, T>;
export declare const getCssText: (key?: string) => (target: HTMLElement) => any[][];
