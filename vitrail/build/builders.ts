import { Result, success } from "fwd-result";
import { pipe, resolve } from "fwd-pipe";
import { RPipeEntry, forkSuccess } from "fwd-result-pipe";

export type ElementBuilder<T extends Element, E> = <TParent extends Element>(...args: RPipeEntry<T,E,T,E>[]) => RPipeEntry<TParent, E, TParent, E>

const createBuilder = <T extends HTMLElement, E>(tagName: string): ElementBuilder<T,E> => {
    return <TParent extends Element>(...entries: RPipeEntry<T,E,T,E>[]) => {
        return (arg: Result<TParent, E>) => arg.forkSuccess(
            parent => resolve(
                entries.reduce((p, entry) => p(entry), pipe(
                    () => success<T,E>(document.createElement(tagName) as T)
                ))(forkSuccess(elt => parent.append(elt)))
            )
        );
    }
}

export const custom = createBuilder;

export const address = createBuilder<HTMLElement,any>('address');
export const article = createBuilder<HTMLElement,any>('article');
export const aside = createBuilder<HTMLElement,any>('aside');
export const b = createBuilder<HTMLElement,any>('b');
export const em = createBuilder<HTMLElement,any>('em');
export const footer = createBuilder<HTMLElement,any>('footer');
export const header = createBuilder<HTMLElement,any>('header');
export const hgroup = createBuilder<HTMLElement,any>('hgroup');
export const i = createBuilder<HTMLElement,any>('i');
export const nav = createBuilder<HTMLElement,any>('nav');
export const s = createBuilder<HTMLElement,any>('s');
export const section = createBuilder<HTMLElement,any>('section');
export const a = createBuilder<HTMLAnchorElement,any>('a');
export const area = createBuilder<HTMLAreaElement,any>('area');
export const audio = createBuilder<HTMLAudioElement,any>('audio');
export const br = createBuilder<HTMLBRElement,any>('br');
export const base = createBuilder<HTMLBaseElement,any>('base');
export const button = createBuilder<HTMLButtonElement,any>('button');
export const canvas = createBuilder<HTMLCanvasElement,any>('canvas');
export const data = createBuilder<HTMLDataElement,any>('data');
export const datalist = createBuilder<HTMLDataListElement,any>('datalist');
export const dialog = createBuilder<HTMLDialogElement,any>('dialog');
export const div = createBuilder<HTMLDivElement,any>('div');
export const dl = createBuilder<HTMLDListElement,any>('dl');
export const embed = createBuilder<HTMLEmbedElement,any>('embed');
export const fieldset = createBuilder<HTMLFieldSetElement,any>('fieldset');
export const form = createBuilder<HTMLFormElement,any>('form');
export const hr = createBuilder<HTMLHRElement,any>('hr');
export const head = createBuilder<HTMLHeadElement,any>('head');
export const h1 = createBuilder<HTMLHeadingElement,any>('h1');
export const h2 = createBuilder<HTMLHeadingElement,any>('h2');
export const h3 = createBuilder<HTMLHeadingElement,any>('h3');
export const h4 = createBuilder<HTMLHeadingElement,any>('h4');
export const h5 = createBuilder<HTMLHeadingElement,any>('h5');
export const h6 = createBuilder<HTMLHeadingElement,any>('h6');
export const iframe = createBuilder<HTMLIFrameElement,any>('iframe');
export const img = createBuilder<HTMLImageElement,any>('img');
export const input = createBuilder<HTMLInputElement,any>('input');
export const li = createBuilder<HTMLLIElement,any>('li');
export const label = createBuilder<HTMLLabelElement,any>('label');
export const legend = createBuilder<HTMLLegendElement,any>('legend');
export const link = createBuilder<HTMLLinkElement,any>('link');
export const map = createBuilder<HTMLMapElement,any>('map');
export const menu = createBuilder<HTMLMenuElement,any>('menu');
export const meter = createBuilder<HTMLMeterElement,any>('meter');
export const del = createBuilder<HTMLModElement,any>('del');
export const ins = createBuilder<HTMLModElement,any>('ins');
export const ol = createBuilder<HTMLOListElement,any>('ol');
export const object = createBuilder<HTMLObjectElement,any>('object');
export const optgroup = createBuilder<HTMLOptGroupElement,any>('optgroup');
export const option = createBuilder<HTMLOptionElement,any>('option');
export const output = createBuilder<HTMLOutputElement,any>('output');
export const p = createBuilder<HTMLParagraphElement,any>('p');
export const picture = createBuilder<HTMLPictureElement,any>('picture');
export const pre = createBuilder<HTMLPreElement,any>('pre');
export const progress = createBuilder<HTMLProgressElement,any>('progress');
export const q = createBuilder<HTMLQuoteElement,any>('q');
export const blockquote = createBuilder<HTMLQuoteElement,any>('blockquote');
export const cite = createBuilder<HTMLQuoteElement,any>('cite');
export const select = createBuilder<HTMLSelectElement,any>('select');
export const slot = createBuilder<HTMLSlotElement,any>('slot');
export const source = createBuilder<HTMLSourceElement,any>('source');
export const span = createBuilder<HTMLSpanElement,any>('span');
export const caption = createBuilder<HTMLTableCaptionElement,any>('caption');
export const th = createBuilder<HTMLTableCellElement,any>('th');
export const td = createBuilder<HTMLTableCellElement,any>('td');
export const col = createBuilder<HTMLTableColElement,any>('col');
export const colgroup = createBuilder<HTMLTableColElement,any>('colgroup');
export const table = createBuilder<HTMLTableElement,any>('table');
export const tr = createBuilder<HTMLTableRowElement,any>('tr');
export const thead = createBuilder<HTMLTableSectionElement,any>('thead');
export const tfoot = createBuilder<HTMLTableSectionElement,any>('tfoot');
export const tbody = createBuilder<HTMLTableSectionElement,any>('tbody');
export const template = createBuilder<HTMLTemplateElement,any>('template');
export const textarea = createBuilder<HTMLTextAreaElement,any>('textarea');
export const time = createBuilder<HTMLTimeElement,any>('time');
export const title = createBuilder<HTMLTitleElement,any>('title');
export const track = createBuilder<HTMLTrackElement,any>('track');
export const ul = createBuilder<HTMLUListElement,any>('ul');
export const video = createBuilder<HTMLVideoElement,any>('video');




