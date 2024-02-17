const createDOMAdapter = (tagName, factory, connector, format) => (...args) => {
    const tasks = format(connector)(args).map(entry => entry[0]);
    const build = (doc) => tasks.reduce((node, task) => task(node), factory(doc, tagName));
    return (connect) => connect(build);
};
const htmlNodeFactory = (doc, tagName) => [doc.createElement(tagName), doc];
const appendNodeConnector = (filter) => [
    (entry) => {
        entry[0].appendChild(filter(entry[1])[0]);
        return entry;
    }
];
const formatAdapterArgs = (connector) => (args) => args.filter(arg => arg != null).map(arg => {
    if (typeof arg === 'function')
        return arg(connector);
    if (typeof arg === 'string')
        return [
            (entry) => {
                entry[0]?.appendChild(entry[1].createTextNode(arg));
                return entry;
            }
        ];
    return arg;
});
const noNodeConnector = (_) => [
    (entry) => entry
];
const subscribe = (eventType, listener, options) => [
    (entry) => { entry[0].addEventListener(eventType, listener, options); return entry; }
];
const setProp = (key, value) => [
    value === undefined ?
        (entry) => { entry[0][key] = null; return entry; } :
        typeof value === 'function' ?
            (entry) => { entry[0][key] = value(entry[0][key]); return entry; } :
            (entry) => { entry[0][key] = value; return entry; }
];
export const section = createDOMAdapter('section', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const div = createDOMAdapter('div', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const h2 = createDOMAdapter('h2', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const span = createDOMAdapter('span', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const h3 = createDOMAdapter('h3', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const form = createDOMAdapter('form', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const input = createDOMAdapter('input', htmlNodeFactory, noNodeConnector, formatAdapterArgs);
export const label = createDOMAdapter('label', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const a = createDOMAdapter('a', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const button = createDOMAdapter('button', htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
export const setAttr = (key, value) => [
    value === undefined ?
        (entry) => { entry[0].removeAttribute(key); return entry; } :
        typeof value === 'function' ?
            (entry) => { entry[0].setAttribute(key, value(entry[0].getAttribute(key))); return entry; } :
            (entry) => { entry[0].setAttribute(key, value); return entry; }
];
export const className = (value) => setAttr('class', value);
export const createQuery = () => {
    const registeredLookups = [];
    return [
        (lookup) => { registeredLookups.push(lookup); },
        () => registeredLookups.reduce((entries, lookup) => entries.concat(lookup() ?? []), [])
    ];
};
export const render = (lookup, ...tasks) => () => {
    const target = lookup();
    return target == null ? target : tasks.map(task => task[0]).reduce((node, task) => task(node), target);
};
export const onClick = (listener, options) => subscribe('click', listener, options);
export const getProp = (name, key) => (entry) => [[key || name, entry[0][name]]];
export const createRef = () => {
    let innerLookup = () => null;
    return [
        (lookup) => { innerLookup = lookup; },
        () => innerLookup()
    ];
};
export const query = (curator, ...queries) => [
    (entry) => {
        curator(() => queries.reduce((entries, query) => entries.concat(query(entry)), []));
        return entry;
    }
];
export const setStyle = (key, value) => [
    value === undefined ?
        (entry) => { entry[0].style[key] = null; return entry; } :
        typeof value === 'function' ?
            (entry) => { entry[0].style[key] = value(entry[0].style[key]); return entry; } :
            (entry) => { entry[0].style[key] = value; return entry; }
];
export const store = (curator) => [
    (entry) => {
        curator(() => entry);
        return entry;
    }
];
export const textContent = (value) => setProp('textContent', value);
