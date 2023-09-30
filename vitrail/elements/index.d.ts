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
export type Builder<T extends Element> = <TParent extends Element>(...args: (PipeEntry<T, T> | string)[]) => PipeEntry<TParent, TParent>;
export declare const nodeValue: <T extends Node>(value: string | ((currentValue: string | null) => string)) => PipeEntry<T, T>;
export declare const text: <TParent extends Element>(...entries: (string | PipeEntry<Text, Text>)[]) => PipeEntry<TParent, TParent>;
export declare const createBuilder: <T extends HTMLElement>(tagName: string) => Builder<T>;
export declare const customElement: (name: string, ...entries: (PipeEntry<HTMLElement, HTMLElement> | string)[]) => PipeEntry<Element, Element>;
export declare const address: Builder<HTMLElement>;
export declare const article: Builder<HTMLElement>;
export declare const aside: Builder<HTMLElement>;
export declare const b: Builder<HTMLElement>;
export declare const em: Builder<HTMLElement>;
export declare const footer: Builder<HTMLElement>;
export declare const header: Builder<HTMLElement>;
export declare const hgroup: Builder<HTMLElement>;
export declare const i: Builder<HTMLElement>;
export declare const nav: Builder<HTMLElement>;
export declare const s: Builder<HTMLElement>;
export declare const section: Builder<HTMLElement>;
export declare const a: Builder<HTMLAnchorElement>;
export declare const area: Builder<HTMLAreaElement>;
export declare const audio: Builder<HTMLAudioElement>;
export declare const br: Builder<HTMLBRElement>;
export declare const base: Builder<HTMLBaseElement>;
export declare const button: Builder<HTMLButtonElement>;
export declare const canvas: Builder<HTMLCanvasElement>;
export declare const data: Builder<HTMLDataElement>;
export declare const datalist: Builder<HTMLDataListElement>;
export declare const dialog: Builder<HTMLDialogElement>;
export declare const div: Builder<HTMLDivElement>;
export declare const dl: Builder<HTMLDListElement>;
export declare const embed: Builder<HTMLEmbedElement>;
export declare const fieldset: Builder<HTMLFieldSetElement>;
export declare const form: Builder<HTMLFormElement>;
export declare const hr: Builder<HTMLHRElement>;
export declare const head: Builder<HTMLHeadElement>;
export declare const h1: Builder<HTMLHeadingElement>;
export declare const h2: Builder<HTMLHeadingElement>;
export declare const h3: Builder<HTMLHeadingElement>;
export declare const h4: Builder<HTMLHeadingElement>;
export declare const h5: Builder<HTMLHeadingElement>;
export declare const h6: Builder<HTMLHeadingElement>;
export declare const iframe: Builder<HTMLIFrameElement>;
export declare const img: Builder<HTMLImageElement>;
export declare const input: Builder<HTMLInputElement>;
export declare const li: Builder<HTMLLIElement>;
export declare const label: Builder<HTMLLabelElement>;
export declare const legend: Builder<HTMLLegendElement>;
export declare const link: Builder<HTMLLinkElement>;
export declare const map: Builder<HTMLMapElement>;
export declare const menu: Builder<HTMLMenuElement>;
export declare const meter: Builder<HTMLMeterElement>;
export declare const del: Builder<HTMLModElement>;
export declare const ins: Builder<HTMLModElement>;
export declare const ol: Builder<HTMLOListElement>;
export declare const object: Builder<HTMLObjectElement>;
export declare const optgroup: Builder<HTMLOptGroupElement>;
export declare const option: Builder<HTMLOptionElement>;
export declare const output: Builder<HTMLOutputElement>;
export declare const p: Builder<HTMLParagraphElement>;
export declare const picture: Builder<HTMLPictureElement>;
export declare const pre: Builder<HTMLPreElement>;
export declare const progress: Builder<HTMLProgressElement>;
export declare const q: Builder<HTMLQuoteElement>;
export declare const blockquote: Builder<HTMLQuoteElement>;
export declare const cite: Builder<HTMLQuoteElement>;
export declare const select: Builder<HTMLSelectElement>;
export declare const slot: Builder<HTMLSlotElement>;
export declare const source: Builder<HTMLSourceElement>;
export declare const span: Builder<HTMLSpanElement>;
export declare const caption: Builder<HTMLTableCaptionElement>;
export declare const th: Builder<HTMLTableCellElement>;
export declare const td: Builder<HTMLTableCellElement>;
export declare const col: Builder<HTMLTableColElement>;
export declare const colgroup: Builder<HTMLTableColElement>;
export declare const table: Builder<HTMLTableElement>;
export declare const tr: Builder<HTMLTableRowElement>;
export declare const thead: Builder<HTMLTableSectionElement>;
export declare const tfoot: Builder<HTMLTableSectionElement>;
export declare const tbody: Builder<HTMLTableSectionElement>;
export declare const template: Builder<HTMLTemplateElement>;
export declare const textarea: Builder<HTMLTextAreaElement>;
export declare const time: Builder<HTMLTimeElement>;
export declare const title: Builder<HTMLTitleElement>;
export declare const track: Builder<HTMLTrackElement>;
export declare const ul: Builder<HTMLUListElement>;
export declare const video: Builder<HTMLVideoElement>;
