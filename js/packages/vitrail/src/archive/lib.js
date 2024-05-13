/**
 * Core concepts
 */
const createDOMAdapter = (tagName, factory, connector, format) => (...args) => {
    const tasks = format(connector)(args).map(entry => entry[0]);
    const build = (doc) => tasks.reduce((node, task) => task(node), factory(doc, tagName));
    return (connect) => connect(build);
};
const textFactory = (doc, _) => [doc.createTextNode(''), doc];
const htmlElementFactory = (doc, tagName) => [doc.createElement(tagName), doc];
const svgElementFactory = (doc, tagName) => [doc.createElementNS("http://www.w3.org/2000/svg", tagName), doc];
const mathElementFactory = (doc, tagName) => [doc.createElementNS("http://www.w3.org/1998/Math/MathML", tagName), doc];
const appendConnector = (filter) => [
    (entry) => {
        entry[0].appendChild(filter(entry[1])[0]);
        return entry;
    }
];
const prependConnector = (filter) => [
    (entry) => {
        entry[0].prepend(filter(entry[1])[0]);
        return entry;
    }
];
const noConnector = (_) => [
    (entry) => entry
];
const formatAdapterArgs = (connector) => (args) => args.filter(arg => arg != null).map(arg => {
    if (typeof arg === 'function')
        return arg(connector);
    if (typeof arg === 'string')
        return [
            (entry) => {
                var _a;
                (_a = entry[0]) === null || _a === void 0 ? void 0 : _a.appendChild(entry[1].createTextNode(arg));
                return entry;
            }
        ];
    return arg;
});
export const getElement = (query, container) => () => {
    const node = container.querySelector(query);
    return node == null ? node : [node, node.ownerDocument];
};
export const fromElement = (node) => () => [node, node.ownerDocument];
export const render = (lookup, ...tasks) => () => {
    const target = lookup();
    return target == null ? target : tasks.map(task => task[0]).reduce((node, task) => task(node), target);
};
export const createRef = () => {
    let innerLookup = () => null;
    return [
        (lookup) => { innerLookup = lookup; },
        () => innerLookup()
    ];
};
export const createQuery = () => {
    const registeredLookups = [];
    return [
        (lookup) => { registeredLookups.push(lookup); },
        () => registeredLookups.reduce((entries, lookup) => { var _a; return entries.concat((_a = lookup()) !== null && _a !== void 0 ? _a : []); }, [])
    ];
};
export const store = (curator) => [
    (entry) => {
        curator(() => entry);
        return entry;
    }
];
export const query = (curator, ...queries) => [
    (entry) => {
        curator(() => queries.reduce((entries, query) => entries.concat(query(entry)), []));
        return entry;
    }
];
export const text = createDOMAdapter('', textFactory, noConnector, formatAdapterArgs);
export const append = (branch) => branch(appendConnector);
export const appendTo = (lookup) => [
    (entry) => {
        var _a;
        (_a = lookup()) === null || _a === void 0 ? void 0 : _a[0].appendChild(entry[0]);
        return entry;
    }
];
export const prepend = (branch) => branch(prependConnector);
export const prependTo = (lookup) => [
    (entry) => {
        var _a;
        (_a = lookup()) === null || _a === void 0 ? void 0 : _a[0].prepend(entry[0]);
        return entry;
    }
];
export const setProp = (key, value) => [
    value === undefined ?
        (entry) => { entry[0][key] = null; return entry; } :
        typeof value === 'function' ?
            (entry) => { entry[0][key] = value(entry[0][key]); return entry; } :
            (entry) => { entry[0][key] = value; return entry; }
];
export const removeProp = (adapter) => adapter(undefined);
export const getProp = (name, key) => (entry) => [[key || name, entry[0][name]]];
export const setAttr = (key, value) => [
    value === undefined ?
        (entry) => { entry[0].removeAttribute(key); return entry; } :
        typeof value === 'function' ?
            (entry) => { entry[0].setAttribute(key, value(entry[0].getAttribute(key))); return entry; } :
            (entry) => { entry[0].setAttribute(key, value); return entry; }
];
//general attributes (includes micordata attributes)
export const removeAttr = (key) => [(entry) => { entry[0].removeAttribute(key); return entry; }];
export const getAttr = (name, key) => (entry) => [[key || name, entry[0].getAttribute(name)]];
//aria attributes
export const setAria = (key, value) => setAttr('aria-' + key, value);
export const removeAria = (key) => removeAttr('aria-' + key);
export const getAria = (name, key) => getAttr('aria-' + name, key);
//data attributes
export const setData = (key, value) => [
    value === undefined ?
        (entry) => { delete entry[0].dataset[key]; return entry; } :
        typeof value === 'function' ?
            (entry) => { entry[0].dataset[key] = value(entry[0].dataset[key]); return entry; } :
            (entry) => { entry[0].dataset[key] = value; return entry; }
];
export const removeData = (key) => setData(key, undefined);
export const getData = (name, key) => (entry) => [[key || name, entry[0].dataset[name]]];
//style attributes
export const setStyle = (key, value) => [
    value === undefined ?
        (entry) => { entry[0].style[key] = null; return entry; } :
        typeof value === 'function' ?
            (entry) => { entry[0].style[key] = value(entry[0].style[key]); return entry; } :
            (entry) => { entry[0].style[key] = value; return entry; }
];
export const setCss = (value) => [
    typeof value === 'function' ?
        (entry) => { entry[0].style.cssText = value(entry[0].style.cssText); return entry; } :
        (entry) => { entry[0].style.cssText = value; return entry; }
];
export const removeStyle = (key) => setStyle(key, undefined);
export const getStyle = (name, key) => (entry) => [[key || name, entry[0].style[name]]];
//events
export const subscribe = (eventType, listener, options) => [
    (entry) => { entry[0].addEventListener(eventType, listener, options); return entry; }
];
export const unsubscribe = (eventType, listener, options) => [
    (entry) => { entry[0].removeEventListener(eventType, listener, options); return entry; }
];
//__GENERATED_TASKS_AND_ADAPTERS__//
export const a = createDOMAdapter('a', htmlElementFactory, appendConnector, formatAdapterArgs);
export const abbr = createDOMAdapter('abbr', htmlElementFactory, appendConnector, formatAdapterArgs);
export const address = createDOMAdapter('address', htmlElementFactory, appendConnector, formatAdapterArgs);
export const area = createDOMAdapter('area', htmlElementFactory, noConnector, formatAdapterArgs);
export const article = createDOMAdapter('article', htmlElementFactory, appendConnector, formatAdapterArgs);
export const aside = createDOMAdapter('aside', htmlElementFactory, appendConnector, formatAdapterArgs);
export const audio = createDOMAdapter('audio', htmlElementFactory, appendConnector, formatAdapterArgs);
export const b = createDOMAdapter('b', htmlElementFactory, appendConnector, formatAdapterArgs);
export const base = createDOMAdapter('base', htmlElementFactory, noConnector, formatAdapterArgs);
export const bdi = createDOMAdapter('bdi', htmlElementFactory, appendConnector, formatAdapterArgs);
export const bdo = createDOMAdapter('bdo', htmlElementFactory, appendConnector, formatAdapterArgs);
export const blockquote = createDOMAdapter('blockquote', htmlElementFactory, appendConnector, formatAdapterArgs);
export const body = createDOMAdapter('body', htmlElementFactory, appendConnector, formatAdapterArgs);
export const br = createDOMAdapter('br', htmlElementFactory, noConnector, formatAdapterArgs);
export const button = createDOMAdapter('button', htmlElementFactory, appendConnector, formatAdapterArgs);
export const canvas = createDOMAdapter('canvas', htmlElementFactory, appendConnector, formatAdapterArgs);
export const caption = createDOMAdapter('caption', htmlElementFactory, appendConnector, formatAdapterArgs);
export const cite = createDOMAdapter('cite', htmlElementFactory, appendConnector, formatAdapterArgs);
export const code = createDOMAdapter('code', htmlElementFactory, appendConnector, formatAdapterArgs);
export const col = createDOMAdapter('col', htmlElementFactory, noConnector, formatAdapterArgs);
export const colgroup = createDOMAdapter('colgroup', htmlElementFactory, appendConnector, formatAdapterArgs);
export const data = createDOMAdapter('data', htmlElementFactory, appendConnector, formatAdapterArgs);
export const datalist = createDOMAdapter('datalist', htmlElementFactory, appendConnector, formatAdapterArgs);
export const dd = createDOMAdapter('dd', htmlElementFactory, appendConnector, formatAdapterArgs);
export const del = createDOMAdapter('del', htmlElementFactory, appendConnector, formatAdapterArgs);
export const details = createDOMAdapter('details', htmlElementFactory, appendConnector, formatAdapterArgs);
export const dfn = createDOMAdapter('dfn', htmlElementFactory, appendConnector, formatAdapterArgs);
export const dialog = createDOMAdapter('dialog', htmlElementFactory, appendConnector, formatAdapterArgs);
export const div = createDOMAdapter('div', htmlElementFactory, appendConnector, formatAdapterArgs);
export const dl = createDOMAdapter('dl', htmlElementFactory, appendConnector, formatAdapterArgs);
export const dt = createDOMAdapter('dt', htmlElementFactory, appendConnector, formatAdapterArgs);
export const em = createDOMAdapter('em', htmlElementFactory, appendConnector, formatAdapterArgs);
export const embed = createDOMAdapter('embed', htmlElementFactory, appendConnector, formatAdapterArgs);
export const fieldset = createDOMAdapter('fieldset', htmlElementFactory, appendConnector, formatAdapterArgs);
export const figcaption = createDOMAdapter('figcaption', htmlElementFactory, appendConnector, formatAdapterArgs);
export const figure = createDOMAdapter('figure', htmlElementFactory, appendConnector, formatAdapterArgs);
export const footer = createDOMAdapter('footer', htmlElementFactory, appendConnector, formatAdapterArgs);
export const form = createDOMAdapter('form', htmlElementFactory, appendConnector, formatAdapterArgs);
export const h1 = createDOMAdapter('h1', htmlElementFactory, appendConnector, formatAdapterArgs);
export const h2 = createDOMAdapter('h2', htmlElementFactory, appendConnector, formatAdapterArgs);
export const h3 = createDOMAdapter('h3', htmlElementFactory, appendConnector, formatAdapterArgs);
export const h4 = createDOMAdapter('h4', htmlElementFactory, appendConnector, formatAdapterArgs);
export const h5 = createDOMAdapter('h5', htmlElementFactory, appendConnector, formatAdapterArgs);
export const h6 = createDOMAdapter('h6', htmlElementFactory, appendConnector, formatAdapterArgs);
export const head = createDOMAdapter('head', htmlElementFactory, appendConnector, formatAdapterArgs);
export const header = createDOMAdapter('header', htmlElementFactory, appendConnector, formatAdapterArgs);
export const hgroup = createDOMAdapter('hgroup', htmlElementFactory, appendConnector, formatAdapterArgs);
export const hr = createDOMAdapter('hr', htmlElementFactory, appendConnector, formatAdapterArgs);
export const html = createDOMAdapter('html', htmlElementFactory, appendConnector, formatAdapterArgs);
export const i = createDOMAdapter('i', htmlElementFactory, appendConnector, formatAdapterArgs);
export const iframe = createDOMAdapter('iframe', htmlElementFactory, appendConnector, formatAdapterArgs);
export const img = createDOMAdapter('img', htmlElementFactory, noConnector, formatAdapterArgs);
export const input = createDOMAdapter('input', htmlElementFactory, noConnector, formatAdapterArgs);
export const ins = createDOMAdapter('ins', htmlElementFactory, appendConnector, formatAdapterArgs);
export const kbd = createDOMAdapter('kbd', htmlElementFactory, appendConnector, formatAdapterArgs);
export const label = createDOMAdapter('label', htmlElementFactory, appendConnector, formatAdapterArgs);
export const legend = createDOMAdapter('legend', htmlElementFactory, appendConnector, formatAdapterArgs);
export const li = createDOMAdapter('li', htmlElementFactory, appendConnector, formatAdapterArgs);
export const link = createDOMAdapter('link', htmlElementFactory, appendConnector, formatAdapterArgs);
export const main = createDOMAdapter('main', htmlElementFactory, appendConnector, formatAdapterArgs);
export const mark = createDOMAdapter('mark', htmlElementFactory, appendConnector, formatAdapterArgs);
export const menu = createDOMAdapter('menu', htmlElementFactory, appendConnector, formatAdapterArgs);
export const meta = createDOMAdapter('meta', htmlElementFactory, appendConnector, formatAdapterArgs);
export const meter = createDOMAdapter('meter', htmlElementFactory, appendConnector, formatAdapterArgs);
export const nav = createDOMAdapter('nav', htmlElementFactory, appendConnector, formatAdapterArgs);
export const noscript = createDOMAdapter('noscript', htmlElementFactory, appendConnector, formatAdapterArgs);
export const object = createDOMAdapter('object', htmlElementFactory, appendConnector, formatAdapterArgs);
export const ol = createDOMAdapter('ol', htmlElementFactory, appendConnector, formatAdapterArgs);
export const optgroup = createDOMAdapter('optgroup', htmlElementFactory, appendConnector, formatAdapterArgs);
export const option = createDOMAdapter('option', htmlElementFactory, appendConnector, formatAdapterArgs);
export const output = createDOMAdapter('output', htmlElementFactory, appendConnector, formatAdapterArgs);
export const p = createDOMAdapter('p', htmlElementFactory, appendConnector, formatAdapterArgs);
export const param = createDOMAdapter('param', htmlElementFactory, appendConnector, formatAdapterArgs);
export const picture = createDOMAdapter('picture', htmlElementFactory, appendConnector, formatAdapterArgs);
export const pre = createDOMAdapter('pre', htmlElementFactory, appendConnector, formatAdapterArgs);
export const progress = createDOMAdapter('progress', htmlElementFactory, appendConnector, formatAdapterArgs);
export const q = createDOMAdapter('q', htmlElementFactory, appendConnector, formatAdapterArgs);
export const rp = createDOMAdapter('rp', htmlElementFactory, appendConnector, formatAdapterArgs);
export const rt = createDOMAdapter('rt', htmlElementFactory, appendConnector, formatAdapterArgs);
export const ruby = createDOMAdapter('ruby', htmlElementFactory, appendConnector, formatAdapterArgs);
export const s = createDOMAdapter('s', htmlElementFactory, appendConnector, formatAdapterArgs);
export const samp = createDOMAdapter('samp', htmlElementFactory, appendConnector, formatAdapterArgs);
export const script = createDOMAdapter('script', htmlElementFactory, appendConnector, formatAdapterArgs);
export const search = createDOMAdapter('search', htmlElementFactory, appendConnector, formatAdapterArgs);
export const section = createDOMAdapter('section', htmlElementFactory, appendConnector, formatAdapterArgs);
export const select = createDOMAdapter('select', htmlElementFactory, appendConnector, formatAdapterArgs);
export const slot = createDOMAdapter('slot', htmlElementFactory, appendConnector, formatAdapterArgs);
export const small = createDOMAdapter('small', htmlElementFactory, appendConnector, formatAdapterArgs);
export const source = createDOMAdapter('source', htmlElementFactory, appendConnector, formatAdapterArgs);
export const span = createDOMAdapter('span', htmlElementFactory, appendConnector, formatAdapterArgs);
export const strong = createDOMAdapter('strong', htmlElementFactory, appendConnector, formatAdapterArgs);
export const style = createDOMAdapter('style', htmlElementFactory, appendConnector, formatAdapterArgs);
export const sub = createDOMAdapter('sub', htmlElementFactory, appendConnector, formatAdapterArgs);
export const summary = createDOMAdapter('summary', htmlElementFactory, appendConnector, formatAdapterArgs);
export const sup = createDOMAdapter('sup', htmlElementFactory, appendConnector, formatAdapterArgs);
export const table = createDOMAdapter('table', htmlElementFactory, appendConnector, formatAdapterArgs);
export const tbody = createDOMAdapter('tbody', htmlElementFactory, appendConnector, formatAdapterArgs);
export const td = createDOMAdapter('td', htmlElementFactory, appendConnector, formatAdapterArgs);
export const template = createDOMAdapter('template', htmlElementFactory, appendConnector, formatAdapterArgs);
export const textarea = createDOMAdapter('textarea', htmlElementFactory, appendConnector, formatAdapterArgs);
export const tfoot = createDOMAdapter('tfoot', htmlElementFactory, appendConnector, formatAdapterArgs);
export const th = createDOMAdapter('th', htmlElementFactory, appendConnector, formatAdapterArgs);
export const thead = createDOMAdapter('thead', htmlElementFactory, appendConnector, formatAdapterArgs);
export const time = createDOMAdapter('time', htmlElementFactory, appendConnector, formatAdapterArgs);
export const title = createDOMAdapter('title', htmlElementFactory, appendConnector, formatAdapterArgs);
export const tr = createDOMAdapter('tr', htmlElementFactory, appendConnector, formatAdapterArgs);
export const track = createDOMAdapter('track', htmlElementFactory, appendConnector, formatAdapterArgs);
export const u = createDOMAdapter('u', htmlElementFactory, appendConnector, formatAdapterArgs);
export const ul = createDOMAdapter('ul', htmlElementFactory, appendConnector, formatAdapterArgs);
export const htmlvar = createDOMAdapter('var', htmlElementFactory, appendConnector, formatAdapterArgs);
export const video = createDOMAdapter('video', htmlElementFactory, appendConnector, formatAdapterArgs);
export const wbr = createDOMAdapter('wbr', htmlElementFactory, appendConnector, formatAdapterArgs);
