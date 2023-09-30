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
exports.del = exports.meter = exports.menu = exports.map = exports.link = exports.legend = exports.label = exports.li = exports.input = exports.img = exports.iframe = exports.h6 = exports.h5 = exports.h4 = exports.h3 = exports.h2 = exports.h1 = exports.head = exports.hr = exports.form = exports.fieldset = exports.embed = exports.dl = exports.div = exports.dialog = exports.datalist = exports.data = exports.canvas = exports.button = exports.base = exports.br = exports.audio = exports.area = exports.a = exports.section = exports.s = exports.nav = exports.i = exports.hgroup = exports.header = exports.footer = exports.em = exports.b = exports.aside = exports.article = exports.address = exports.customElement = exports.createBuilder = exports.text = exports.nodeValue = void 0;
exports.video = exports.ul = exports.track = exports.title = exports.time = exports.textarea = exports.template = exports.tbody = exports.tfoot = exports.thead = exports.tr = exports.table = exports.colgroup = exports.col = exports.td = exports.th = exports.caption = exports.span = exports.source = exports.slot = exports.select = exports.cite = exports.blockquote = exports.q = exports.progress = exports.pre = exports.picture = exports.p = exports.output = exports.option = exports.optgroup = exports.object = exports.ol = exports.ins = void 0;
const fwd_pipe_1 = require("fwd-pipe");
const nodeValue = (value) => typeof value === 'function' ?
    (0, fwd_pipe_1.fork)(node => { node.nodeValue = value(node.nodeValue); }) :
    (0, fwd_pipe_1.fork)(node => { node.nodeValue = value; });
exports.nodeValue = nodeValue;
const text = (...entries) => {
    return (0, fwd_pipe_1.fork)((parent) => (0, fwd_pipe_1.resolve)(entries.reduce((p, entry) => p(typeof entry === 'string' ? (0, exports.nodeValue)(entry) : entry), (0, fwd_pipe_1.pipe)(() => document.createTextNode("")))((0, fwd_pipe_1.fork)(elt => parent.append(elt))))(undefined));
};
exports.text = text;
const createBuilder = (tagName) => {
    return (...entries) => {
        return (0, fwd_pipe_1.fork)((parent) => (0, fwd_pipe_1.resolve)(entries.reduce((p, entry) => p(typeof entry === 'string' ? (0, exports.text)(entry) : entry), (0, fwd_pipe_1.pipe)(() => document.createElement(tagName)))((0, fwd_pipe_1.fork)(elt => parent.append(elt))))(undefined));
    };
};
exports.createBuilder = createBuilder;
const customElement = (name, ...entries) => (0, exports.createBuilder)(name)(...entries);
exports.customElement = customElement;
exports.address = (0, exports.createBuilder)('address');
exports.article = (0, exports.createBuilder)('article');
exports.aside = (0, exports.createBuilder)('aside');
exports.b = (0, exports.createBuilder)('b');
exports.em = (0, exports.createBuilder)('em');
exports.footer = (0, exports.createBuilder)('footer');
exports.header = (0, exports.createBuilder)('header');
exports.hgroup = (0, exports.createBuilder)('hgroup');
exports.i = (0, exports.createBuilder)('i');
exports.nav = (0, exports.createBuilder)('nav');
exports.s = (0, exports.createBuilder)('s');
exports.section = (0, exports.createBuilder)('section');
exports.a = (0, exports.createBuilder)('a');
exports.area = (0, exports.createBuilder)('area');
exports.audio = (0, exports.createBuilder)('audio');
exports.br = (0, exports.createBuilder)('br');
exports.base = (0, exports.createBuilder)('base');
exports.button = (0, exports.createBuilder)('button');
exports.canvas = (0, exports.createBuilder)('canvas');
exports.data = (0, exports.createBuilder)('data');
exports.datalist = (0, exports.createBuilder)('datalist');
exports.dialog = (0, exports.createBuilder)('dialog');
exports.div = (0, exports.createBuilder)('div');
exports.dl = (0, exports.createBuilder)('dl');
exports.embed = (0, exports.createBuilder)('embed');
exports.fieldset = (0, exports.createBuilder)('fieldset');
exports.form = (0, exports.createBuilder)('form');
exports.hr = (0, exports.createBuilder)('hr');
exports.head = (0, exports.createBuilder)('head');
exports.h1 = (0, exports.createBuilder)('h1');
exports.h2 = (0, exports.createBuilder)('h2');
exports.h3 = (0, exports.createBuilder)('h3');
exports.h4 = (0, exports.createBuilder)('h4');
exports.h5 = (0, exports.createBuilder)('h5');
exports.h6 = (0, exports.createBuilder)('h6');
exports.iframe = (0, exports.createBuilder)('iframe');
exports.img = (0, exports.createBuilder)('img');
exports.input = (0, exports.createBuilder)('input');
exports.li = (0, exports.createBuilder)('li');
exports.label = (0, exports.createBuilder)('label');
exports.legend = (0, exports.createBuilder)('legend');
exports.link = (0, exports.createBuilder)('link');
exports.map = (0, exports.createBuilder)('map');
exports.menu = (0, exports.createBuilder)('menu');
exports.meter = (0, exports.createBuilder)('meter');
exports.del = (0, exports.createBuilder)('del');
exports.ins = (0, exports.createBuilder)('ins');
exports.ol = (0, exports.createBuilder)('ol');
exports.object = (0, exports.createBuilder)('object');
exports.optgroup = (0, exports.createBuilder)('optgroup');
exports.option = (0, exports.createBuilder)('option');
exports.output = (0, exports.createBuilder)('output');
exports.p = (0, exports.createBuilder)('p');
exports.picture = (0, exports.createBuilder)('picture');
exports.pre = (0, exports.createBuilder)('pre');
exports.progress = (0, exports.createBuilder)('progress');
exports.q = (0, exports.createBuilder)('q');
exports.blockquote = (0, exports.createBuilder)('blockquote');
exports.cite = (0, exports.createBuilder)('cite');
exports.select = (0, exports.createBuilder)('select');
exports.slot = (0, exports.createBuilder)('slot');
exports.source = (0, exports.createBuilder)('source');
exports.span = (0, exports.createBuilder)('span');
exports.caption = (0, exports.createBuilder)('caption');
exports.th = (0, exports.createBuilder)('th');
exports.td = (0, exports.createBuilder)('td');
exports.col = (0, exports.createBuilder)('col');
exports.colgroup = (0, exports.createBuilder)('colgroup');
exports.table = (0, exports.createBuilder)('table');
exports.tr = (0, exports.createBuilder)('tr');
exports.thead = (0, exports.createBuilder)('thead');
exports.tfoot = (0, exports.createBuilder)('tfoot');
exports.tbody = (0, exports.createBuilder)('tbody');
exports.template = (0, exports.createBuilder)('template');
exports.textarea = (0, exports.createBuilder)('textarea');
exports.time = (0, exports.createBuilder)('time');
exports.title = (0, exports.createBuilder)('title');
exports.track = (0, exports.createBuilder)('track');
exports.ul = (0, exports.createBuilder)('ul');
exports.video = (0, exports.createBuilder)('video');
