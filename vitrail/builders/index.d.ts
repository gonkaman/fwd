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

import { RPipeEntry } from "fwd-result-pipe";
export type ElementBuilder<T extends Element, E> = <TParent extends Element>(...args: RPipeEntry<T, E, T, E>[]) => RPipeEntry<TParent, E, TParent, E>;
export declare const custom: <T extends HTMLElement, E>(tagName: string) => ElementBuilder<T, E>;
export declare const address: ElementBuilder<HTMLElement, any>;
export declare const article: ElementBuilder<HTMLElement, any>;
export declare const aside: ElementBuilder<HTMLElement, any>;
export declare const b: ElementBuilder<HTMLElement, any>;
export declare const em: ElementBuilder<HTMLElement, any>;
export declare const footer: ElementBuilder<HTMLElement, any>;
export declare const header: ElementBuilder<HTMLElement, any>;
export declare const hgroup: ElementBuilder<HTMLElement, any>;
export declare const i: ElementBuilder<HTMLElement, any>;
export declare const nav: ElementBuilder<HTMLElement, any>;
export declare const s: ElementBuilder<HTMLElement, any>;
export declare const section: ElementBuilder<HTMLElement, any>;
export declare const a: ElementBuilder<HTMLAnchorElement, any>;
export declare const area: ElementBuilder<HTMLAreaElement, any>;
export declare const audio: ElementBuilder<HTMLAudioElement, any>;
export declare const br: ElementBuilder<HTMLBRElement, any>;
export declare const base: ElementBuilder<HTMLBaseElement, any>;
export declare const button: ElementBuilder<HTMLButtonElement, any>;
export declare const canvas: ElementBuilder<HTMLCanvasElement, any>;
export declare const data: ElementBuilder<HTMLDataElement, any>;
export declare const datalist: ElementBuilder<HTMLDataListElement, any>;
export declare const dialog: ElementBuilder<HTMLDialogElement, any>;
export declare const div: ElementBuilder<HTMLDivElement, any>;
export declare const dl: ElementBuilder<HTMLDListElement, any>;
export declare const embed: ElementBuilder<HTMLEmbedElement, any>;
export declare const fieldset: ElementBuilder<HTMLFieldSetElement, any>;
export declare const form: ElementBuilder<HTMLFormElement, any>;
export declare const hr: ElementBuilder<HTMLHRElement, any>;
export declare const head: ElementBuilder<HTMLHeadElement, any>;
export declare const h1: ElementBuilder<HTMLHeadingElement, any>;
export declare const h2: ElementBuilder<HTMLHeadingElement, any>;
export declare const h3: ElementBuilder<HTMLHeadingElement, any>;
export declare const h4: ElementBuilder<HTMLHeadingElement, any>;
export declare const h5: ElementBuilder<HTMLHeadingElement, any>;
export declare const h6: ElementBuilder<HTMLHeadingElement, any>;
export declare const iframe: ElementBuilder<HTMLIFrameElement, any>;
export declare const img: ElementBuilder<HTMLImageElement, any>;
export declare const input: ElementBuilder<HTMLInputElement, any>;
export declare const li: ElementBuilder<HTMLLIElement, any>;
export declare const label: ElementBuilder<HTMLLabelElement, any>;
export declare const legend: ElementBuilder<HTMLLegendElement, any>;
export declare const link: ElementBuilder<HTMLLinkElement, any>;
export declare const map: ElementBuilder<HTMLMapElement, any>;
export declare const menu: ElementBuilder<HTMLMenuElement, any>;
export declare const meter: ElementBuilder<HTMLMeterElement, any>;
export declare const del: ElementBuilder<HTMLModElement, any>;
export declare const ins: ElementBuilder<HTMLModElement, any>;
export declare const ol: ElementBuilder<HTMLOListElement, any>;
export declare const object: ElementBuilder<HTMLObjectElement, any>;
export declare const optgroup: ElementBuilder<HTMLOptGroupElement, any>;
export declare const option: ElementBuilder<HTMLOptionElement, any>;
export declare const output: ElementBuilder<HTMLOutputElement, any>;
export declare const p: ElementBuilder<HTMLParagraphElement, any>;
export declare const picture: ElementBuilder<HTMLPictureElement, any>;
export declare const pre: ElementBuilder<HTMLPreElement, any>;
export declare const progress: ElementBuilder<HTMLProgressElement, any>;
export declare const q: ElementBuilder<HTMLQuoteElement, any>;
export declare const blockquote: ElementBuilder<HTMLQuoteElement, any>;
export declare const cite: ElementBuilder<HTMLQuoteElement, any>;
export declare const select: ElementBuilder<HTMLSelectElement, any>;
export declare const slot: ElementBuilder<HTMLSlotElement, any>;
export declare const source: ElementBuilder<HTMLSourceElement, any>;
export declare const span: ElementBuilder<HTMLSpanElement, any>;
export declare const caption: ElementBuilder<HTMLTableCaptionElement, any>;
export declare const th: ElementBuilder<HTMLTableCellElement, any>;
export declare const td: ElementBuilder<HTMLTableCellElement, any>;
export declare const col: ElementBuilder<HTMLTableColElement, any>;
export declare const colgroup: ElementBuilder<HTMLTableColElement, any>;
export declare const table: ElementBuilder<HTMLTableElement, any>;
export declare const tr: ElementBuilder<HTMLTableRowElement, any>;
export declare const thead: ElementBuilder<HTMLTableSectionElement, any>;
export declare const tfoot: ElementBuilder<HTMLTableSectionElement, any>;
export declare const tbody: ElementBuilder<HTMLTableSectionElement, any>;
export declare const template: ElementBuilder<HTMLTemplateElement, any>;
export declare const textarea: ElementBuilder<HTMLTextAreaElement, any>;
export declare const time: ElementBuilder<HTMLTimeElement, any>;
export declare const title: ElementBuilder<HTMLTitleElement, any>;
export declare const track: ElementBuilder<HTMLTrackElement, any>;
export declare const ul: ElementBuilder<HTMLUListElement, any>;
export declare const video: ElementBuilder<HTMLVideoElement, any>;
