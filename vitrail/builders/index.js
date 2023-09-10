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
exports.object = exports.ol = exports.ins = exports.del = exports.meter = exports.menu = exports.map = exports.link = exports.legend = exports.label = exports.li = exports.input = exports.img = exports.iframe = exports.h6 = exports.h5 = exports.h4 = exports.h3 = exports.h2 = exports.h1 = exports.head = exports.hr = exports.form = exports.fieldset = exports.embed = exports.dl = exports.div = exports.dialog = exports.datalist = exports.data = exports.canvas = exports.button = exports.base = exports.br = exports.audio = exports.area = exports.a = exports.section = exports.s = exports.nav = exports.i = exports.hgroup = exports.header = exports.footer = exports.em = exports.b = exports.aside = exports.article = exports.address = exports.custom = void 0;
exports.video = exports.ul = exports.track = exports.title = exports.time = exports.textarea = exports.template = exports.tbody = exports.tfoot = exports.thead = exports.tr = exports.table = exports.colgroup = exports.col = exports.td = exports.th = exports.caption = exports.span = exports.source = exports.slot = exports.select = exports.cite = exports.blockquote = exports.q = exports.progress = exports.pre = exports.picture = exports.p = exports.output = exports.option = exports.optgroup = void 0;
const fwd_result_1 = require("fwd-result");
const fwd_pipe_1 = require("fwd-pipe");
const fwd_result_pipe_1 = require("fwd-result-pipe");
const createBuilder = (tagName) => {
    return (...entries) => {
        return (arg) => arg.forkSuccess(parent => (0, fwd_pipe_1.resolve)(entries.reduce((p, entry) => p(entry), (0, fwd_pipe_1.pipe)(() => (0, fwd_result_1.success)(document.createElement(tagName))))((0, fwd_result_pipe_1.forkSuccess)(elt => parent.append(elt)))));
    };
};
exports.custom = createBuilder;
exports.address = createBuilder('address');
exports.article = createBuilder('article');
exports.aside = createBuilder('aside');
exports.b = createBuilder('b');
exports.em = createBuilder('em');
exports.footer = createBuilder('footer');
exports.header = createBuilder('header');
exports.hgroup = createBuilder('hgroup');
exports.i = createBuilder('i');
exports.nav = createBuilder('nav');
exports.s = createBuilder('s');
exports.section = createBuilder('section');
exports.a = createBuilder('a');
exports.area = createBuilder('area');
exports.audio = createBuilder('audio');
exports.br = createBuilder('br');
exports.base = createBuilder('base');
exports.button = createBuilder('button');
exports.canvas = createBuilder('canvas');
exports.data = createBuilder('data');
exports.datalist = createBuilder('datalist');
exports.dialog = createBuilder('dialog');
exports.div = createBuilder('div');
exports.dl = createBuilder('dl');
exports.embed = createBuilder('embed');
exports.fieldset = createBuilder('fieldset');
exports.form = createBuilder('form');
exports.hr = createBuilder('hr');
exports.head = createBuilder('head');
exports.h1 = createBuilder('h1');
exports.h2 = createBuilder('h2');
exports.h3 = createBuilder('h3');
exports.h4 = createBuilder('h4');
exports.h5 = createBuilder('h5');
exports.h6 = createBuilder('h6');
exports.iframe = createBuilder('iframe');
exports.img = createBuilder('img');
exports.input = createBuilder('input');
exports.li = createBuilder('li');
exports.label = createBuilder('label');
exports.legend = createBuilder('legend');
exports.link = createBuilder('link');
exports.map = createBuilder('map');
exports.menu = createBuilder('menu');
exports.meter = createBuilder('meter');
exports.del = createBuilder('del');
exports.ins = createBuilder('ins');
exports.ol = createBuilder('ol');
exports.object = createBuilder('object');
exports.optgroup = createBuilder('optgroup');
exports.option = createBuilder('option');
exports.output = createBuilder('output');
exports.p = createBuilder('p');
exports.picture = createBuilder('picture');
exports.pre = createBuilder('pre');
exports.progress = createBuilder('progress');
exports.q = createBuilder('q');
exports.blockquote = createBuilder('blockquote');
exports.cite = createBuilder('cite');
exports.select = createBuilder('select');
exports.slot = createBuilder('slot');
exports.source = createBuilder('source');
exports.span = createBuilder('span');
exports.caption = createBuilder('caption');
exports.th = createBuilder('th');
exports.td = createBuilder('td');
exports.col = createBuilder('col');
exports.colgroup = createBuilder('colgroup');
exports.table = createBuilder('table');
exports.tr = createBuilder('tr');
exports.thead = createBuilder('thead');
exports.tfoot = createBuilder('tfoot');
exports.tbody = createBuilder('tbody');
exports.template = createBuilder('template');
exports.textarea = createBuilder('textarea');
exports.time = createBuilder('time');
exports.title = createBuilder('title');
exports.track = createBuilder('track');
exports.ul = createBuilder('ul');
exports.video = createBuilder('video');
