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

const pipeEnd = (arg) => arg;
const pipe = (init) => {
    if (init === pipeEnd)
        return init;
    return (entry) => entry === pipeEnd ?
        init :
        pipe((arg) => entry(init(arg)));
};
const pipeAsync = (init) => {
    if (init === pipeEnd)
        return init;
    return (entry, onRejected) => entry === pipeEnd ?
        init :
        pipeAsync((arg) => Promise.resolve(init(arg)).then(value => entry(value), onRejected));
};
const resolve = (builder) => builder(pipeEnd);
const flow = (init, ...entries) => resolve(entries.reduce((p, entry) => p(entry), pipe(init)));
// const flowAsync = <T,R>(init: AsyncPipeEntry<T,R>, ...entries: AsyncPipeEntry<R,R>[]): AsyncPipeEntry<T,R> => 
//     resolve(entries.reduce((p, entry) => p(entry), pipeAsync(init)));
const fork = (handle) => (arg) => { handle(arg); return arg; };
const forkAsync = (handle) => (arg) => { handle(arg); return arg; };
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

const nodeValue = (value) => typeof value === 'function' ?
    fork(node => { node.nodeValue = value(node.nodeValue); }) :
    fork(node => { node.nodeValue = value; });
const text = (...entries) => {
    return fork((parent) => resolve(entries.reduce((p, entry) => p(typeof entry === 'string' ? nodeValue(entry) : entry), pipe(() => document.createTextNode("")))(fork(elt => parent.append(elt))))(undefined));
};
const createBuilder = (tagName) => {
    return (...entries) => {
        return fork((parent) => resolve(entries.reduce((p, entry) => p(typeof entry === 'string' ? text(entry) : entry), pipe(() => document.createElement(tagName)))(fork(elt => parent.append(elt))))(undefined));
    };
};
const address = createBuilder('address');
const article = createBuilder('article');
const aside = createBuilder('aside');
const b = createBuilder('b');
const em = createBuilder('em');
const footer = createBuilder('footer');
const header = createBuilder('header');
const hgroup = createBuilder('hgroup');
const i = createBuilder('i');
const nav = createBuilder('nav');
const s = createBuilder('s');
const section = createBuilder('section');
const a = createBuilder('a');
const area = createBuilder('area');
const audio = createBuilder('audio');
const br = createBuilder('br');
const base = createBuilder('base');
const button = createBuilder('button');
const canvas = createBuilder('canvas');
const data = createBuilder('data');
const datalist = createBuilder('datalist');
const dialog = createBuilder('dialog');
const div = createBuilder('div');
const dl = createBuilder('dl');
const embed = createBuilder('embed');
const fieldset = createBuilder('fieldset');
const form = createBuilder('form');
const hr = createBuilder('hr');
const head = createBuilder('head');
const h1 = createBuilder('h1');
const h2 = createBuilder('h2');
const h3 = createBuilder('h3');
const h4 = createBuilder('h4');
const h5 = createBuilder('h5');
const h6 = createBuilder('h6');
const iframe = createBuilder('iframe');
const img = createBuilder('img');
const input = createBuilder('input');
const li = createBuilder('li');
const label = createBuilder('label');
const legend = createBuilder('legend');
const link = createBuilder('link');
const map = createBuilder('map');
const menu = createBuilder('menu');
const meter = createBuilder('meter');
const del = createBuilder('del');
const ins = createBuilder('ins');
const ol = createBuilder('ol');
const object = createBuilder('object');
const optgroup = createBuilder('optgroup');
const option = createBuilder('option');
const output = createBuilder('output');
const p = createBuilder('p');
const picture = createBuilder('picture');
const pre = createBuilder('pre');
const progress = createBuilder('progress');
const q = createBuilder('q');
const blockquote = createBuilder('blockquote');
const cite = createBuilder('cite');
const select = createBuilder('select');
const slot = createBuilder('slot');
const source = createBuilder('source');
const span = createBuilder('span');
const caption = createBuilder('caption');
const th = createBuilder('th');
const td = createBuilder('td');
const col = createBuilder('col');
const colgroup = createBuilder('colgroup');
const table = createBuilder('table');
const tr = createBuilder('tr');
const thead = createBuilder('thead');
const tfoot = createBuilder('tfoot');
const tbody = createBuilder('tbody');
const template = createBuilder('template');
const textarea = createBuilder('textarea');
const time = createBuilder('time');
const title = createBuilder('title');
const track = createBuilder('track');
const ul = createBuilder('ul');
const video = createBuilder('video');
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

const id = (value) => attr('id', value);
const getId = (key) => getAttr('id', key);
const className = (value) => attr('class', value);
const addClass = (name) => fork(elt => elt.classList.add(name));
const removeClass = (name) => fork(elt => elt.classList.remove(name));
const toggleClass = (name) => fork(elt => elt.classList.toggle(name));
const getClass = (key) => getAttr('class', key);
const titleAttr = (value) => attr('title', value);
const getTitleAttr = (key) => getAttr('title', key);
const tabIndex = (value) => attr('tabIndex', value);
const getTabIndex = (key) => getAttr('tabIndex', key);
const lang = (value) => attr('lang', value);
const getLang = (key) => getAttr('lang', key);
const dir = (value) => attr('dir', value);
const sync = (handle) => fork(target => handle((() => target)));
const createSync = () => {
    let innerEffect = () => undefined;
    return [
        (handle) => { innerEffect = handle; },
        () => innerEffect()
    ];
};
const createQuery = () => {
    const queries = [];
    return [
        query => queries.push(query),
        () => queries.reduce((entries, query) => entries.concat(query()), [])
    ];
};
const query = (handle, ...components) => fork(target => handle(() => components.reduce((entries, query) => entries.concat(query(target)), [])));
const exec = (command, ...args) => fork(target => target[command](...args));
const invoke = (query, key, ...args) => (target) => [[key || query, target[query](...args)]];
const render = (target, ...updates) => typeof target === 'string' ?
    () => updates.forEach(update => update(document.querySelector(target))) :
    () => updates.forEach(update => update(target));
const attach = (target) => typeof target === 'string' ?
    fork(elt => document.querySelector(target)?.append(elt)) :
    fork(elt => target.append(elt));
const dettach = () => fork(elt => elt.remove());
//https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes#content_versus_idl_attributes
const attr = (name, value) => value === undefined ? fork(elt => elt.removeAttribute(name)) :
    (typeof value === 'function' ?
        fork(elt => elt.setAttribute(name, value(elt.getAttribute(name)))) :
        fork(elt => elt.setAttribute(name, value)));
const removeAttr = (attribute) => typeof attribute === 'string' ? attr(attribute, undefined) : attribute(undefined);
const getAttr = (name, key) => (target) => [[key || name, target.getAttribute(name)]];
const prop = (name, value) => value === undefined ? fork(elt => { elt[name] = null; }) :
    (typeof value === 'function' ?
        fork(elt => { elt[name] = value(elt[name]); }) :
        fork(elt => { elt[name] = value; }));
const removeProp = (attribute) => typeof attribute === 'string' ? prop(attribute, undefined) : attribute(undefined);
const getProp = (name, key) => (target) => [[key || name, target[name]]];
const aria = (name, value) => attr('aria-' + name, value);
const removeAria = (ariaRole) => removeAttr(typeof ariaRole === 'string' ? 'aria-' + ariaRole : ariaRole);
const getAria = (role, key) => (target) => [[key || 'aria_' + role, target.getAttribute('aria-' + role)]];
//https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
const dataAttr = (name, value) => value === undefined ? fork(elt => { delete elt.dataset[name]; }) :
    (typeof value === 'function' ?
        fork(elt => { elt.dataset[name] = value(elt.dataset[name]); }) :
        fork(elt => { elt.dataset[name] = value; }));
const removeDataAttr = (attribute) => typeof attribute === 'string' ? dataAttr(attribute, undefined) : attribute(undefined);
const getDataAttr = (name, key) => (target) => [[key || 'data_' + name, target.dataset[name]]];
const style = (name, value) => value === undefined ? fork(elt => { elt.style[name] = null; }) :
    (typeof value === 'function' ?
        fork(elt => { elt.style[name] = value(elt.style[name]); }) :
        fork(elt => { elt.style[name] = value; }));
const removeStyle = (attribute) => typeof attribute === 'string' ? style(attribute, undefined) : attribute(undefined);
const getStyle = (name, key) => (target) => [[key || 'style_' + name, target.style[name]]];
const subscribe = (eventType, listener, options) => fork(elt => elt.addEventListener(eventType, listener, options));
const unsubscribe = (eventType, listener, options) => fork(elt => elt.removeEventListener(eventType, listener, options));
const dispatch = (event) => // exec('dispatchEvent', event);
 fork(elt => elt.dispatchEvent(event));
const onClick = (listener, options) => subscribe('click', listener, options);
const onDbClick = (listener, options) => subscribe('dbclick', listener, options);
const onBlur = (listener, options) => subscribe('blur', listener, options);
const onFocus = (listener, options) => subscribe('focus', listener, options);
const onChange = (listener, options) => subscribe('change', listener, options);
const onMouseDown = (listener, options) => subscribe('mousedown', listener, options);
const onMouseEnter = (listener, options) => subscribe('mouseenter', listener, options);
const onMouseLeave = (listener, options) => subscribe('mouseleave', listener, options);
const onMouseMove = (listener, options) => subscribe('mousemove', listener, options);
const onMouseOut = (listener, options) => subscribe('mouseout', listener, options);
const onMouseOver = (listener, options) => subscribe('mouseover', listener, options);
const onMouseUp = (listener, options) => subscribe('mouseup', listener, options);
const onMouseWheel = (listener, options) => subscribe('mousewheel', listener, options);
const onScroll = (listener, options) => subscribe('scroll', listener, options);
const onKeyDown = (listener, options) => subscribe('keydown', listener, options);
const onKeyPress = (listener, options) => subscribe('keypress', listener, options);
const onKeyUp = (listener, options) => subscribe('keyup', listener, options);
const onCopy = (listener, options) => subscribe('copy', listener, options);
const onCut = (listener, options) => subscribe('cut', listener, options);
const onPaste = (listener, options) => subscribe('paste', listener, options);
const onSelect = (listener, options) => subscribe('select', listener, options);
const onFocusIn = (listener, options) => subscribe('focusin', listener, options);
const onFocusOut = (listener, options) => subscribe('focusout', listener, options);
const textContent = (value) => prop('textContent', value);
const cssText = (value) => style('cssText', value);
const getCssText = (key) => getStyle('cssText', key);
const [loginData, getLoginData] = createQuery();
const [loginResultSync, loginResult] = createSync();
const onLoginSuccess = resolve(pipe(loginResult)(style("display", "block"))(style("color", "green"))(style("border", "1px solid green"))(textContent("Authentication OK")));
const onLoginFailure = resolve(pipe(loginResult)(style("display", "block"))(style("color", "red"))(style("border", "1px solid red"))(textContent("Authentication failed!")));
const handleLogin = resolve(pipe(getLoginData)(entries => Object.fromEntries(entries))(data => (data['username'] == 'admin' && data['password'] == 'admin') ?
    onLoginSuccess(undefined) :
    onLoginFailure(undefined)));
const showApp = render('#app-root', section(className('ftco-section'), div(className('container'), div(className('row justify-content-center'), div(className('col-md-6 text-center mb-5'), h2(className('heading-section'), "Login #08")))), div(className('row justify-content-center'), div(className("col-md-6 col-lg-5"), div(className("login-wrap p-4 p-md-5"), div(className("icon d-flex align-items-center justify-content-center"), span(className("fa fa-user-o"))), h3("Have an account?"), form(className("login-form"), attr("action", "#"), div(className("form-group"), input(className("form-control rounded-left"), attr("type", "text"), attr("required", "true"), attr("placeholder", "Username"), query(loginData, getProp("value", "username")))), div(className("form-group d-flex"), input(className("form-control rounded-left"), attr("type", "password"), attr("required", "true"), attr("placeholder", "Password"), query(loginData, getProp("value", "password")))), div(className("form-group d-md-flex"), div(className("w-50"), label(className("checkbox-wrap checkbox-primary"), span("Remember Me"), input(attr("type", "checkbox"), attr("checked", "true"), span(className("checkmark"))))), div(className("w-50 text-md-right"), a("Forgot Password", attr("href", "#")))), div(className("form-group d-md-flex"), div(className("text-md-center"), a(style("display", "none"), sync(loginResultSync)))), div(className("form-group"), button("Get Started", className("btn btn-primary rounded submit p-3 px-5"), attr("type", "submit"), onClick(() => handleLogin(undefined))))))))));
showApp();
