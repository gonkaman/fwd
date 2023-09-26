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

import { fork, pipe, resolve } from "fwd-pipe";
export const nodeValue = (value) => typeof value === 'function' ?
    fork(node => { node.nodeValue = value(node.nodeValue); }) :
    fork(node => { node.nodeValue = value; });
export const text = (...entries) => {
    return fork((parent) => resolve(entries.reduce((p, entry) => p(typeof entry === 'string' ? nodeValue(entry) : entry), pipe(() => document.createTextNode("")))(fork(elt => parent.append(elt))))(undefined));
};
export const createBuilder = (tagName) => {
    return (...entries) => {
        return fork((parent) => resolve(entries.reduce((p, entry) => p(typeof entry === 'string' ? text(entry) : entry), pipe(() => document.createElement(tagName)))(fork(elt => parent.append(elt))))(undefined));
    };
};
export const address = createBuilder('address');
export const article = createBuilder('article');
export const aside = createBuilder('aside');
export const b = createBuilder('b');
export const em = createBuilder('em');
export const footer = createBuilder('footer');
export const header = createBuilder('header');
export const hgroup = createBuilder('hgroup');
export const i = createBuilder('i');
export const nav = createBuilder('nav');
export const s = createBuilder('s');
export const section = createBuilder('section');
export const a = createBuilder('a');
export const area = createBuilder('area');
export const audio = createBuilder('audio');
export const br = createBuilder('br');
export const base = createBuilder('base');
export const button = createBuilder('button');
export const canvas = createBuilder('canvas');
export const data = createBuilder('data');
export const datalist = createBuilder('datalist');
export const dialog = createBuilder('dialog');
export const div = createBuilder('div');
export const dl = createBuilder('dl');
export const embed = createBuilder('embed');
export const fieldset = createBuilder('fieldset');
export const form = createBuilder('form');
export const hr = createBuilder('hr');
export const head = createBuilder('head');
export const h1 = createBuilder('h1');
export const h2 = createBuilder('h2');
export const h3 = createBuilder('h3');
export const h4 = createBuilder('h4');
export const h5 = createBuilder('h5');
export const h6 = createBuilder('h6');
export const iframe = createBuilder('iframe');
export const img = createBuilder('img');
export const input = createBuilder('input');
export const li = createBuilder('li');
export const label = createBuilder('label');
export const legend = createBuilder('legend');
export const link = createBuilder('link');
export const map = createBuilder('map');
export const menu = createBuilder('menu');
export const meter = createBuilder('meter');
export const del = createBuilder('del');
export const ins = createBuilder('ins');
export const ol = createBuilder('ol');
export const object = createBuilder('object');
export const optgroup = createBuilder('optgroup');
export const option = createBuilder('option');
export const output = createBuilder('output');
export const p = createBuilder('p');
export const picture = createBuilder('picture');
export const pre = createBuilder('pre');
export const progress = createBuilder('progress');
export const q = createBuilder('q');
export const blockquote = createBuilder('blockquote');
export const cite = createBuilder('cite');
export const select = createBuilder('select');
export const slot = createBuilder('slot');
export const source = createBuilder('source');
export const span = createBuilder('span');
export const caption = createBuilder('caption');
export const th = createBuilder('th');
export const td = createBuilder('td');
export const col = createBuilder('col');
export const colgroup = createBuilder('colgroup');
export const table = createBuilder('table');
export const tr = createBuilder('tr');
export const thead = createBuilder('thead');
export const tfoot = createBuilder('tfoot');
export const tbody = createBuilder('tbody');
export const template = createBuilder('template');
export const textarea = createBuilder('textarea');
export const time = createBuilder('time');
export const title = createBuilder('title');
export const track = createBuilder('track');
export const ul = createBuilder('ul');
export const video = createBuilder('video');
