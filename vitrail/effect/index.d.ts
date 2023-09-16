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

import { Result } from "fwd-result";
import { RPipeEntry } from "fwd-result-pipe";
export type Effect<T, E> = () => Result<T, E>;
export type EffectHandler<T, E> = (handle: Effect<T, E>) => any;
export declare const render: <T extends Element, E>(target: string | T, update: RPipeEntry<T, E, T, E>) => () => Result<T, E>;
export declare const useEffect: <T, E>() => [EffectHandler<T, E>, Effect<T, E>];
export declare const createEffect: <T, E>(handle: (resultingEffect: () => Result<T, E>) => any, ...components: RPipeEntry<T, E, T, E>[]) => RPipeEntry<T, E, T, E>;
export declare const subscribe: <T extends EventTarget, E>(eventType: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => RPipeEntry<T, E, T, E>;
export declare const subscribeMap: <T extends EventTarget, E>(listenerMap: Record<string, EventListenerOrEventListenerObject | {
    listener: EventListenerOrEventListenerObject;
    options?: boolean | AddEventListenerOptions;
}>) => RPipeEntry<T, E, T, E>;
export declare const unsubscribe: <T extends EventTarget, E>(eventType: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => RPipeEntry<T, E, T, E>;
export declare const unsubscribeMap: <T extends EventTarget, E>(listenerMap: Record<string, EventListenerOrEventListenerObject | {
    listener: EventListenerOrEventListenerObject;
    options?: boolean | AddEventListenerOptions;
}>) => RPipeEntry<T, E, T, E>;
export declare const dispatch: <T extends EventTarget, E>(event: Event) => RPipeEntry<T, E, T, E>;
export declare const attach: <T extends Element, E>(target: string | T) => RPipeEntry<T, E, T, E>;
export declare const dettach: <T extends Element, E>() => RPipeEntry<T, E, T, E>;
export declare const attr: <T extends Element, E>(name: string, value: string | ((previousValue: string | null) => string)) => RPipeEntry<T, E, T, E>;
export declare const attrMap: <T extends Element, E>(attributes: Record<string, E>) => RPipeEntry<T, E, T, E>;
export declare const removeAttr: <T extends Element, E>(name: string) => RPipeEntry<T, E, T, E>;
export declare const removeAttrMap: <T extends Element, E>(attributes: string[]) => RPipeEntry<T, E, T, E>;
export declare const aria: <T extends Element, E>(name: string, value: string | ((previousValue: string | null) => string)) => RPipeEntry<T, E, T, E>;
export declare const ariaMap: <T extends Element, E>(attributes: Record<string, E>) => RPipeEntry<T, E, T, E>;
export declare const removeAria: <T extends Element, E>(name: string) => RPipeEntry<T, E, T, E>;
export declare const removeAriaMap: <T extends Element, E>(attributes: string[]) => RPipeEntry<T, E, T, E>;
export declare const dataAttr: <T extends HTMLElement, E>(name: string, value: string | ((previousValue: string | undefined) => string)) => RPipeEntry<T, E, T, E>;
export declare const dataMap: <T extends HTMLElement, E>(attributes: Record<string, E>) => RPipeEntry<T, E, T, E>;
export declare const removeDataAttr: <T extends HTMLElement, E>(name: string) => RPipeEntry<T, E, T, E>;
export declare const removeDataMap: <T extends HTMLElement, E>(attributes: string[]) => RPipeEntry<T, E, T, E>;
export declare const styleAttr: <T extends HTMLElement, E>(name: string, value: string | ((previousValue: string | null) => string)) => RPipeEntry<T, E, T, E>;
export declare const cssText: <T extends HTMLElement, E>(css: string) => RPipeEntry<T, E, T, E>;
export declare const styleMap: <T extends HTMLElement, E>(attributes: Record<string, E>) => RPipeEntry<T, E, T, E>;
export declare const removeStyleAttr: <T extends HTMLElement, E>(name: string) => RPipeEntry<T, E, T, E>;
export declare const removeStyleMap: <T extends HTMLElement, E>(attributes: string[]) => RPipeEntry<T, E, T, E>;
