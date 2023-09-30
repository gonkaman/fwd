import { PipeEntry, fork, pipe, resolve } from "fwd-pipe";

export type Builder<T extends Element> = <TParent extends Element>(...args: (PipeEntry<T,T> | string)[]) => PipeEntry<TParent,TParent>


export const nodeValue = <T extends Node>(
    value: string | ((currentValue: string | null) => string) | null
): PipeEntry<T,T> => 
    typeof value === 'function' ?
        fork(node => { node.nodeValue = value(node.nodeValue); }) :
        fork(node => { node.nodeValue = value; });

export const text = <TParent extends Element>(...entries: (string | PipeEntry<Text,Text>)[]) => {
    return fork((parent: TParent) => resolve(
        entries.reduce((p, entry) => p(typeof entry === 'string' ? nodeValue(entry) : entry), pipe(
            () => document.createTextNode("")
        ))(fork(elt => parent.append(elt)))
    )(undefined));
}

export const createBuilder = <T extends HTMLElement>(tagName: string): Builder<T> => {
    return <TParent extends Element>(...entries: (PipeEntry<T,T> | string)[]) => {
        return fork((parent: TParent) => resolve(
            entries.reduce((p, entry) => p(typeof entry === 'string' ? text(entry) : entry), pipe(
                () => document.createElement(tagName) as T
            ))(fork(elt => parent.append(elt)))
        )(undefined));
    }
}

export const customElement = (name: string, ...entries: (PipeEntry<HTMLElement,HTMLElement> | string)[]) => 
    createBuilder<HTMLElement>(name)(...entries);

export const address = createBuilder<HTMLElement>('address');
export const article = createBuilder<HTMLElement>('article');
export const aside = createBuilder<HTMLElement>('aside');
export const b = createBuilder<HTMLElement>('b');
export const em = createBuilder<HTMLElement>('em');
export const footer = createBuilder<HTMLElement>('footer');
export const header = createBuilder<HTMLElement>('header');
export const hgroup = createBuilder<HTMLElement>('hgroup');
export const i = createBuilder<HTMLElement>('i');
export const nav = createBuilder<HTMLElement>('nav');
export const s = createBuilder<HTMLElement>('s');
export const section = createBuilder<HTMLElement>('section');
export const a = createBuilder<HTMLAnchorElement>('a');
export const area = createBuilder<HTMLAreaElement>('area');
export const audio = createBuilder<HTMLAudioElement>('audio');
export const br = createBuilder<HTMLBRElement>('br');
export const base = createBuilder<HTMLBaseElement>('base');
export const button = createBuilder<HTMLButtonElement>('button');
export const canvas = createBuilder<HTMLCanvasElement>('canvas');
export const data = createBuilder<HTMLDataElement>('data');
export const datalist = createBuilder<HTMLDataListElement>('datalist');
export const dialog = createBuilder<HTMLDialogElement>('dialog');
export const div = createBuilder<HTMLDivElement>('div');
export const dl = createBuilder<HTMLDListElement>('dl');
export const embed = createBuilder<HTMLEmbedElement>('embed');
export const fieldset = createBuilder<HTMLFieldSetElement>('fieldset');
export const form = createBuilder<HTMLFormElement>('form');
export const hr = createBuilder<HTMLHRElement>('hr');
export const head = createBuilder<HTMLHeadElement>('head');
export const h1 = createBuilder<HTMLHeadingElement>('h1');
export const h2 = createBuilder<HTMLHeadingElement>('h2');
export const h3 = createBuilder<HTMLHeadingElement>('h3');
export const h4 = createBuilder<HTMLHeadingElement>('h4');
export const h5 = createBuilder<HTMLHeadingElement>('h5');
export const h6 = createBuilder<HTMLHeadingElement>('h6');
export const iframe = createBuilder<HTMLIFrameElement>('iframe');
export const img = createBuilder<HTMLImageElement>('img');
export const input = createBuilder<HTMLInputElement>('input');
export const li = createBuilder<HTMLLIElement>('li');
export const label = createBuilder<HTMLLabelElement>('label');
export const legend = createBuilder<HTMLLegendElement>('legend');
export const link = createBuilder<HTMLLinkElement>('link');
export const map = createBuilder<HTMLMapElement>('map');
export const menu = createBuilder<HTMLMenuElement>('menu');
export const meter = createBuilder<HTMLMeterElement>('meter');
export const del = createBuilder<HTMLModElement>('del');
export const ins = createBuilder<HTMLModElement>('ins');
export const ol = createBuilder<HTMLOListElement>('ol');
export const object = createBuilder<HTMLObjectElement>('object');
export const optgroup = createBuilder<HTMLOptGroupElement>('optgroup');
export const option = createBuilder<HTMLOptionElement>('option');
export const output = createBuilder<HTMLOutputElement>('output');
export const p = createBuilder<HTMLParagraphElement>('p');
export const picture = createBuilder<HTMLPictureElement>('picture');
export const pre = createBuilder<HTMLPreElement>('pre');
export const progress = createBuilder<HTMLProgressElement>('progress');
export const q = createBuilder<HTMLQuoteElement>('q');
export const blockquote = createBuilder<HTMLQuoteElement>('blockquote');
export const cite = createBuilder<HTMLQuoteElement>('cite');
export const select = createBuilder<HTMLSelectElement>('select');
export const slot = createBuilder<HTMLSlotElement>('slot');
export const source = createBuilder<HTMLSourceElement>('source');
export const span = createBuilder<HTMLSpanElement>('span');
export const caption = createBuilder<HTMLTableCaptionElement>('caption');
export const th = createBuilder<HTMLTableCellElement>('th');
export const td = createBuilder<HTMLTableCellElement>('td');
export const col = createBuilder<HTMLTableColElement>('col');
export const colgroup = createBuilder<HTMLTableColElement>('colgroup');
export const table = createBuilder<HTMLTableElement>('table');
export const tr = createBuilder<HTMLTableRowElement>('tr');
export const thead = createBuilder<HTMLTableSectionElement>('thead');
export const tfoot = createBuilder<HTMLTableSectionElement>('tfoot');
export const tbody = createBuilder<HTMLTableSectionElement>('tbody');
export const template = createBuilder<HTMLTemplateElement>('template');
export const textarea = createBuilder<HTMLTextAreaElement>('textarea');
export const time = createBuilder<HTMLTimeElement>('time');
export const title = createBuilder<HTMLTitleElement>('title');
export const track = createBuilder<HTMLTrackElement>('track');
export const ul = createBuilder<HTMLUListElement>('ul');
export const video = createBuilder<HTMLVideoElement>('video');
