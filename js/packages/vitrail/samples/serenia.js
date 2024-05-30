export const createTreeNodeAdapter = (factory, connect, deriveArg, convert) => (...args) => (tConnect, tDerive) => tConnect(
  args.reduce((filter2, arg) => typeof arg === "function" ? arg.length == 1 ? (ctx) => arg(filter2(ctx)) : (ctx) => arg(connect, deriveArg)(filter2(ctx)) : (ctx) => convert(arg)(filter2(ctx)), factory),
  tDerive
);
export const noConnector = (_) => (target) => target;
const htmlScope = "http://www.w3.org/1999/xhtml";
const svgScope = "http://www.w3.org/2000/svg";
const mathmlScope = "http://www.w3.org/1998/Math/MathML";
const textScope = "text";
const contextualScope = "ctx";
const defaultNodeFactory = (tagName2) => (arg) => {
  if (arg == null) arg = { document, scope: htmlScope };
  arg.element = arg.document.createElement(tagName2);
  return arg;
};
export const nodeFactory = (tagName2, scope) => {
  if (scope == null) return defaultNodeFactory(tagName2);
  switch (scope) {
    case htmlScope:
      return defaultNodeFactory(tagName2);
    case svgScope:
      return (arg) => {
        if (arg == null) arg = { document, scope: svgScope };
        arg.element = arg.document.createElementNS(svgScope, tagName2);
        return arg;
      };
    case mathmlScope:
      return (arg) => {
        if (arg == null) arg = { document, scope: mathmlScope };
        arg.element = arg.document.createElementNS(mathmlScope, tagName2);
        return arg;
      };
    case textScope:
      return (arg) => {
        if (arg == null) arg = { document, scope: textScope };
        arg.element = arg.document.createTextNode(tagName2);
        return arg;
      };
    case contextualScope:
      return (arg) => {
        if (arg == null) arg = { document, scope: htmlScope };
        return nodeFactory(tagName2, arg.scope)(arg);
      };
    default:
      return defaultNodeFactory(tagName2);
  }
};
export const deriveDOMTaskArg = (data2) => data2;
export const defaultConvert = (arg) => (data2) => {
  if (data2.scope === textScope) {
    data2.element.nodeValue = arg + "";
  } else {
    data2.element.appendChild(data2.document.createTextNode(arg + ""));
  }
  return data2;
};
export const appendConnector = (filter2) => (data2) => {
  data2.element.appendChild(filter2(data2).element);
  return data2;
};
export const append = (branch) => branch(appendConnector, deriveDOMTaskArg);
export const appendTo = (lookup) => (node) => {
  lookup()?.element.appendChild(node.element);
  return node;
};
export const prependConnector = (filter2) => (data2) => {
  data2.element.prepend(filter2(data2).element);
  return data2;
};
export const prepend = (branch) => branch(prependConnector, deriveDOMTaskArg);
export const prependTo = (lookup) => (node) => {
  lookup()?.element.prepend(node.element);
  return node;
};
export const getElement = (query2, container) => () => {
  const elt = container.querySelector(query2);
  return elt == null ? null : {
    element: elt,
    document: elt.ownerDocument,
    scope: elt.namespaceURI ?? htmlScope
  };
};
export const fromElement = (element) => () => {
  return {
    element,
    document: element.ownerDocument,
    scope: element.namespaceURI ?? htmlScope
  };
};
export const render = (lookup, ...tasks) => () => {
  const target = lookup();
  return target == null ? null : tasks.reduce((data2, task) => task(data2), target);
};
export const renderAll = (lookup, ...tasks) => () => {
  const targets = lookup();
  return targets == null ? null : targets.map((target) => tasks.reduce((data2, task) => task(data2), target));
};
export const handleNode = (task) => (data2) => {
  data2.element = task(data2.element);
  return data2;
};
export const createRef = () => {
  let getData = () => null;
  return [
    (lookup) => {
      getData = lookup;
    },
    () => getData()
  ];
};
export const createMultiRef = () => {
  let getters = [];
  return [
    (lookup) => {
      getters.push(lookup);
    },
    () => getters.map((getData) => getData()).filter((data2) => data2 != null)
  ];
};
export const createQuery = () => {
  const getters = [];
  return [
    (lookup) => {
      getters.push(lookup);
    },
    () => getters.reduce((entries, getData) => entries.concat(getData() ?? []), [])
  ];
};
export const ref = (curator) => (data2) => {
  curator(() => data2);
  return data2;
};
export const query = (curator, ...queries2) => (data2) => {
  curator(() => queries2.reduce((entries, query2) => entries.concat(query2(data2)), []));
  return data2;
};
export const tag = (tag2, ...tasks) => (pConnect, pDerive) => pConnect(
  tasks.reduce(
    (filter2, task) => typeof task === "function" ? task.length == 1 ? (ctx) => task(filter2(ctx)) : (ctx) => task(
      appendConnector,
      deriveDOMTaskArg
    )(filter2(ctx)) : (ctx) => defaultConvert(task)(filter2(ctx)),
    typeof tag2 === "string" ? nodeFactory(tag2) : nodeFactory(tag2[0], tag2[1])
  ),
  pDerive
);
export const prop = (key, value) => value === void 0 ? (data2) => {
  data2.element[key] = null;
  return data2;
} : typeof value === "function" ? (data2) => {
  data2.element[key] = value(data2.element[key]);
  return data2;
} : (data2) => {
  data2.element[key] = value;
  return data2;
};
export const getProp = (key, alias) => (data2) => [[alias || key, data2.element[key]]];
export const removeProp = (key) => prop(key, void 0);
export const attr = (key, value) => value === void 0 ? (data2) => {
  data2.element.removeAttribute(key);
  return data2;
} : typeof value === "function" ? (data2) => {
  data2.element.setAttribute(key, value(data2.element.getAttribute(key) ?? void 0));
  return data2;
} : (data2) => {
  data2.element.setAttribute(key, value);
  return data2;
};
export const getAttr = (key, alias) => (data2) => [[alias || key, data2.element.getAttribute(key)]];
export const removeAttr = (key) => attr(key, void 0);
const ariaPreffix = "aria-";
export const aria = (key, value) => attr(ariaPreffix + key, value);
export const getAria = (key, alias) => getAttr(ariaPreffix + key, alias);
export const removeAria = (key) => aria(ariaPreffix + key, void 0);
export const dataAttr = (key, value) => value === void 0 ? (data2) => {
  delete data2.element.dataset[key];
  return data2;
} : typeof value === "function" ? (data2) => {
  data2.element.dataset[key] = value(data2.element.dataset[key] ?? void 0);
  return data2;
} : (data2) => {
  data2.element.dataset[key] = value;
  return data2;
};
export const getDataAttr = (key, alias) => (data2) => [[alias || key, data2.element.dataset[key]]];
export const removeDataAttr = (key) => dataAttr(key, void 0);
export const style = (key, value) => value === void 0 ? (data2) => {
  data2.element.style[key] = null;
  return data2;
} : typeof value === "function" ? (data2) => {
  data2.element.style[key] = value(data2.element.style[key] ?? void 0);
  return data2;
} : (data2) => {
  data2.element.style[key] = value;
  return data2;
};
export const css = (value) => typeof value === "function" ? (data2) => {
  data2.element.style.cssText = value(data2.element.style.cssText);
  return data2;
} : (data2) => {
  data2.element.style.cssText = value;
  return data2;
};
export const getStyle = (key, alias) => (data2) => [[alias || key, data2.element.style[key]]];
export const removeStyle = (key) => style(key, void 0);
export const remove = (property) => property(void 0);
export const subscribe = (eventType, listener, options) => (data2) => {
  data2.element.addEventListener(eventType, listener, options);
  return data2;
};
export const unsubscribe = (eventType, listener, options) => (data2) => {
  data2.element.removeEventListener(eventType, listener, options);
  return data2;
};
export const adapters = {
  html: new Proxy({}, {
    get(target, key, receiver) {
      if (typeof key === "string") return createTreeNodeAdapter(nodeFactory(key, htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
      return Reflect.get(target, key, receiver);
    }
  }),
  svg: new Proxy({}, {
    get(target, key, receiver) {
      if (typeof key === "string") return createTreeNodeAdapter(nodeFactory(key, svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
      return Reflect.get(target, key, receiver);
    }
  }),
  math: new Proxy({}, {
    get(target, key, receiver) {
      if (typeof key === "string") return createTreeNodeAdapter(nodeFactory(key, mathmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
      return Reflect.get(target, key, receiver);
    }
  }),
  props: new Proxy({}, {
    get(target, key, receiver) {
      if (typeof key === "string") return (value) => prop(key, value);
      return Reflect.get(target, key, receiver);
    }
  }),
  attrs: new Proxy({}, {
    get(target, key, receiver) {
      if (typeof key === "string") return (value) => attr(/^aria[A-Z].*$/g.test(key) ? key.replace("aria", ariaPreffix) : key, value);
      return Reflect.get(target, key, receiver);
    }
  }),
  style: new Proxy({}, {
    get(target, key, receiver) {
      if (typeof key === "string") return (value) => style(key, value);
      return Reflect.get(target, key, receiver);
    }
  }),
  events: new Proxy({}, {
    get(target, key, receiver) {
      if (typeof key === "string") return key.startsWith("on") && key.length > 2 ? (listener, options) => subscribe(key.slice(2).toLowerCase(), listener, options) : key.startsWith("off") && key.length > 3 ? (listener, options) => unsubscribe(key.slice(3).toLowerCase(), listener, options) : (listener, options) => subscribe(key, listener, options);
      return Reflect.get(target, key, receiver);
    }
  })
};
export const queries = {
  props: new Proxy({}, {
    get(target, key, receiver) {
      if (typeof key === "string") return (key2, alias) => getProp(key2, alias);
      return Reflect.get(target, key, receiver);
    }
  }),
  style: new Proxy({}, {
    get(target, key, receiver) {
      if (typeof key === "string") return (key2, alias) => getStyle(key2, alias);
      return Reflect.get(target, key, receiver);
    }
  })
};
export const textNode = createTreeNodeAdapter(nodeFactory("", textScope), noConnector, deriveDOMTaskArg, defaultConvert);
export const a = createTreeNodeAdapter(nodeFactory("a", contextualScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const titleTag = createTreeNodeAdapter(nodeFactory("title", contextualScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const scriptTag = createTreeNodeAdapter(nodeFactory("script", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const styleTag = createTreeNodeAdapter(nodeFactory("style", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const htmlA = createTreeNodeAdapter(nodeFactory("htmlA", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const abbr = createTreeNodeAdapter(nodeFactory("abbr", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const address = createTreeNodeAdapter(nodeFactory("address", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const area = createTreeNodeAdapter(nodeFactory("area", htmlScope), noConnector, deriveDOMTaskArg, defaultConvert);
export const article = createTreeNodeAdapter(nodeFactory("article", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const aside = createTreeNodeAdapter(nodeFactory("aside", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const audio = createTreeNodeAdapter(nodeFactory("audio", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const b = createTreeNodeAdapter(nodeFactory("b", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const base = createTreeNodeAdapter(nodeFactory("base", htmlScope), noConnector, deriveDOMTaskArg, defaultConvert);
export const bdi = createTreeNodeAdapter(nodeFactory("bdi", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const bdo = createTreeNodeAdapter(nodeFactory("bdo", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const blockquote = createTreeNodeAdapter(nodeFactory("blockquote", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const body = createTreeNodeAdapter(nodeFactory("body", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const br = createTreeNodeAdapter(nodeFactory("br", htmlScope), noConnector, deriveDOMTaskArg, defaultConvert);
export const button = createTreeNodeAdapter(nodeFactory("button", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const canvas = createTreeNodeAdapter(nodeFactory("canvas", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const caption = createTreeNodeAdapter(nodeFactory("caption", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const cite = createTreeNodeAdapter(nodeFactory("cite", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const code = createTreeNodeAdapter(nodeFactory("code", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const col = createTreeNodeAdapter(nodeFactory("col", htmlScope), noConnector, deriveDOMTaskArg, defaultConvert);
export const colgroup = createTreeNodeAdapter(nodeFactory("colgroup", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const data = createTreeNodeAdapter(nodeFactory("data", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const datalist = createTreeNodeAdapter(nodeFactory("datalist", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const dd = createTreeNodeAdapter(nodeFactory("dd", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const del = createTreeNodeAdapter(nodeFactory("del", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const details = createTreeNodeAdapter(nodeFactory("details", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const dfn = createTreeNodeAdapter(nodeFactory("dfn", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const dialog = createTreeNodeAdapter(nodeFactory("dialog", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const div = createTreeNodeAdapter(nodeFactory("div", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const dl = createTreeNodeAdapter(nodeFactory("dl", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const dt = createTreeNodeAdapter(nodeFactory("dt", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const em = createTreeNodeAdapter(nodeFactory("em", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const embed = createTreeNodeAdapter(nodeFactory("embed", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const fieldset = createTreeNodeAdapter(nodeFactory("fieldset", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const figcaption = createTreeNodeAdapter(nodeFactory("figcaption", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const figure = createTreeNodeAdapter(nodeFactory("figure", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const footer = createTreeNodeAdapter(nodeFactory("footer", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const form = createTreeNodeAdapter(nodeFactory("form", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const h1 = createTreeNodeAdapter(nodeFactory("h1", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const h2 = createTreeNodeAdapter(nodeFactory("h2", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const h3 = createTreeNodeAdapter(nodeFactory("h3", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const h4 = createTreeNodeAdapter(nodeFactory("h4", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const h5 = createTreeNodeAdapter(nodeFactory("h5", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const h6 = createTreeNodeAdapter(nodeFactory("h6", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const head = createTreeNodeAdapter(nodeFactory("head", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const header = createTreeNodeAdapter(nodeFactory("header", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const hgroup = createTreeNodeAdapter(nodeFactory("hgroup", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const hr = createTreeNodeAdapter(nodeFactory("hr", htmlScope), noConnector, deriveDOMTaskArg, defaultConvert);
export const html = createTreeNodeAdapter(nodeFactory("html", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const i = createTreeNodeAdapter(nodeFactory("i", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const iframe = createTreeNodeAdapter(nodeFactory("iframe", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const img = createTreeNodeAdapter(nodeFactory("img", htmlScope), noConnector, deriveDOMTaskArg, defaultConvert);
export const input = createTreeNodeAdapter(nodeFactory("input", htmlScope), noConnector, deriveDOMTaskArg, defaultConvert);
export const ins = createTreeNodeAdapter(nodeFactory("ins", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const kbd = createTreeNodeAdapter(nodeFactory("kbd", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const label = createTreeNodeAdapter(nodeFactory("label", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const legend = createTreeNodeAdapter(nodeFactory("legend", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const li = createTreeNodeAdapter(nodeFactory("li", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const link = createTreeNodeAdapter(nodeFactory("link", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const main = createTreeNodeAdapter(nodeFactory("main", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const mark = createTreeNodeAdapter(nodeFactory("mark", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const menu = createTreeNodeAdapter(nodeFactory("menu", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const meta = createTreeNodeAdapter(nodeFactory("meta", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const meter = createTreeNodeAdapter(nodeFactory("meter", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const nav = createTreeNodeAdapter(nodeFactory("nav", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const noscript = createTreeNodeAdapter(nodeFactory("noscript", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const object = createTreeNodeAdapter(nodeFactory("object", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const ol = createTreeNodeAdapter(nodeFactory("ol", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const optgroup = createTreeNodeAdapter(nodeFactory("optgroup", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const option = createTreeNodeAdapter(nodeFactory("option", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const output = createTreeNodeAdapter(nodeFactory("output", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const p = createTreeNodeAdapter(nodeFactory("p", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const param = createTreeNodeAdapter(nodeFactory("param", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const picture = createTreeNodeAdapter(nodeFactory("picture", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const pre = createTreeNodeAdapter(nodeFactory("pre", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const progress = createTreeNodeAdapter(nodeFactory("progress", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const q = createTreeNodeAdapter(nodeFactory("q", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const rp = createTreeNodeAdapter(nodeFactory("rp", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const rt = createTreeNodeAdapter(nodeFactory("rt", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const ruby = createTreeNodeAdapter(nodeFactory("ruby", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const s = createTreeNodeAdapter(nodeFactory("s", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const samp = createTreeNodeAdapter(nodeFactory("samp", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const htmlScriptTag = createTreeNodeAdapter(nodeFactory("script", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const search = createTreeNodeAdapter(nodeFactory("search", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const section = createTreeNodeAdapter(nodeFactory("section", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const select = createTreeNodeAdapter(nodeFactory("select", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const slotTag = createTreeNodeAdapter(nodeFactory("slot", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const small = createTreeNodeAdapter(nodeFactory("small", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const source = createTreeNodeAdapter(nodeFactory("source", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const span = createTreeNodeAdapter(nodeFactory("span", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const strong = createTreeNodeAdapter(nodeFactory("strong", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const htmlStyleTag = createTreeNodeAdapter(nodeFactory("style", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const sub = createTreeNodeAdapter(nodeFactory("sub", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const summary = createTreeNodeAdapter(nodeFactory("summary", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const sup = createTreeNodeAdapter(nodeFactory("sup", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const table = createTreeNodeAdapter(nodeFactory("table", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const tbody = createTreeNodeAdapter(nodeFactory("tbody", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const td = createTreeNodeAdapter(nodeFactory("td", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const template = createTreeNodeAdapter(nodeFactory("template", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const textarea = createTreeNodeAdapter(nodeFactory("textarea", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const tfoot = createTreeNodeAdapter(nodeFactory("tfoot", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const th = createTreeNodeAdapter(nodeFactory("th", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const thead = createTreeNodeAdapter(nodeFactory("thead", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const tile = createTreeNodeAdapter(nodeFactory("tile", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const htmlTitleTag = createTreeNodeAdapter(nodeFactory("title", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const tr = createTreeNodeAdapter(nodeFactory("tr", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const track = createTreeNodeAdapter(nodeFactory("track", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const u = createTreeNodeAdapter(nodeFactory("u", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const ul = createTreeNodeAdapter(nodeFactory("ul", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const varTag = createTreeNodeAdapter(nodeFactory("var", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const video = createTreeNodeAdapter(nodeFactory("video", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const wbr = createTreeNodeAdapter(nodeFactory("wbr", htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const animate = createTreeNodeAdapter(nodeFactory("animate", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const animateMotion = createTreeNodeAdapter(nodeFactory("animateMotion", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const animateTransform = createTreeNodeAdapter(nodeFactory("animateTransform", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const circle = createTreeNodeAdapter(nodeFactory("circle", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const clipPath = createTreeNodeAdapter(nodeFactory("clipPath", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const defs = createTreeNodeAdapter(nodeFactory("defs", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const desc = createTreeNodeAdapter(nodeFactory("desc", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const ellipse = createTreeNodeAdapter(nodeFactory("ellipse", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feBlend = createTreeNodeAdapter(nodeFactory("feBlend", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feColorMatrix = createTreeNodeAdapter(nodeFactory("feColorMatrix", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feComponentTransfer = createTreeNodeAdapter(nodeFactory("feComponentTransfer", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feComposite = createTreeNodeAdapter(nodeFactory("feComposite", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feConvolveMatrix = createTreeNodeAdapter(nodeFactory("feConvolveMatrix", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feDiffuseLighting = createTreeNodeAdapter(nodeFactory("feDiffuseLighting", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feDisplacementMap = createTreeNodeAdapter(nodeFactory("feDisplacementMap", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feDistantLight = createTreeNodeAdapter(nodeFactory("feDistantLight", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feDropShadow = createTreeNodeAdapter(nodeFactory("feDropShadow", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feFlood = createTreeNodeAdapter(nodeFactory("feFlood", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feFuncA = createTreeNodeAdapter(nodeFactory("feFuncA", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feFuncB = createTreeNodeAdapter(nodeFactory("feFuncB", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feFuncG = createTreeNodeAdapter(nodeFactory("feFuncG", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feFuncR = createTreeNodeAdapter(nodeFactory("feFuncR", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feGaussianBlur = createTreeNodeAdapter(nodeFactory("feGaussianBlur", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feImage = createTreeNodeAdapter(nodeFactory("feImage", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feMerge = createTreeNodeAdapter(nodeFactory("feMerge", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feMergeNode = createTreeNodeAdapter(nodeFactory("feMergeNode", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feMorphology = createTreeNodeAdapter(nodeFactory("feMorphology", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feOffset = createTreeNodeAdapter(nodeFactory("feOffset", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const fePointLight = createTreeNodeAdapter(nodeFactory("fePointLight", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feSpecularLighting = createTreeNodeAdapter(nodeFactory("feSpecularLighting", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feSpotLight = createTreeNodeAdapter(nodeFactory("feSpotLight", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feTile = createTreeNodeAdapter(nodeFactory("feTile", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const feTurbulence = createTreeNodeAdapter(nodeFactory("feTurbulence", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const filter = createTreeNodeAdapter(nodeFactory("filter", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const g = createTreeNodeAdapter(nodeFactory("g", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const image = createTreeNodeAdapter(nodeFactory("image", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const line = createTreeNodeAdapter(nodeFactory("line", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const linearGradient = createTreeNodeAdapter(nodeFactory("linearGradient", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const marker = createTreeNodeAdapter(nodeFactory("marker", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const mask = createTreeNodeAdapter(nodeFactory("mask", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const metadata = createTreeNodeAdapter(nodeFactory("metadata", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const mpath = createTreeNodeAdapter(nodeFactory("mpath", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const path = createTreeNodeAdapter(nodeFactory("path", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const polygon = createTreeNodeAdapter(nodeFactory("polygon", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const polyline = createTreeNodeAdapter(nodeFactory("polyline", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const radialGradient = createTreeNodeAdapter(nodeFactory("radialGradient", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const rect = createTreeNodeAdapter(nodeFactory("rect", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const stop = createTreeNodeAdapter(nodeFactory("stop", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const svg = createTreeNodeAdapter(nodeFactory("svg", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const set = createTreeNodeAdapter(nodeFactory("set", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const svgA = createTreeNodeAdapter(nodeFactory("a", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const patternTag = createTreeNodeAdapter(nodeFactory("pattern", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const switchTag = createTreeNodeAdapter(nodeFactory("switch", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const symbolTag = createTreeNodeAdapter(nodeFactory("symbol", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const svgTitleTag = createTreeNodeAdapter(nodeFactory("title", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const svgScriptTag = createTreeNodeAdapter(nodeFactory("script", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const svgStyleTag = createTreeNodeAdapter(nodeFactory("style", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const text = createTreeNodeAdapter(nodeFactory("text", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const textPath = createTreeNodeAdapter(nodeFactory("textPath", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const tspan = createTreeNodeAdapter(nodeFactory("tspan", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const use = createTreeNodeAdapter(nodeFactory("use", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const view = createTreeNodeAdapter(nodeFactory("view", svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);
export const id = (value) => attr("id", value);
export const accesskey = (value) => attr("accesskey", value);
export const autocapitalize = (value) => attr("autocapitalize", value);
export const autofocus = (value) => attr("autofocus", value);
export const enterkeyhint = (value) => attr("enterkeyhint", value);
export const exportparts = (value) => attr("exportparts", value);
export const hidden = (value) => attr("hidden", value);
export const inert = (value) => attr("inert", value);
export const inputmode = (value) => attr("inputmode", value);
export const is = (value) => attr("is", value);
export const nonce = (value) => attr("nonce", value);
export const part = (value) => attr("part", value);
export const popover = (value) => attr("popover", value);
export const slot = (value) => attr("slot", value);
export const spellcheck = (value) => attr("spellcheck", value);
export const translate = (value) => attr("translate", value);
export const className = (value) => attr("class", value);
export const title = (value) => attr("title", value);
export const tabIndex = (value) => attr("tabIndex", value);
export const lang = (value) => attr("lang", value);
export const dir = (value) => attr("dir", value);
export const draggable = (value) => attr("draggable", value);
export const itemid = (value) => attr("itemid", value);
export const itemprop = (value) => attr("itemprop", value);
export const itemref = (value) => attr("itemref", value);
export const itemscope = (value) => attr("itemscope", value);
export const itemtype = (value) => attr("itemtype", value);
export const crossorigin = (value) => attr("crossorigin", value);
export const disabled = (value) => attr("disabled", value);
export const elementtiming = (value) => attr("elementtiming", value);
export const max = (value) => attr("max", value);
export const min = (value) => attr("min", value);
export const step = (value) => attr("step", value);
export const type = (value) => attr("type", value);
export const accept = (value) => attr("accept", value);
export const capture = (value) => attr("capture", value);
export const pattern = (value) => attr("pattern", value);
export const placeholder = (value) => attr("placeholder", value);
export const forAttr = (value) => attr("forAttr", value);
export const size = (value) => attr("size", value);
export const dirname = (value) => attr("dirname", value);
export const multiple = (value) => attr("multiple", value);
export const readonly = (value) => attr("readonly", value);
export const maxlength = (value) => attr("maxlength", value);
export const minlength = (value) => attr("minlength", value);
export const required = (value) => attr("required", value);
export const rel = (value) => attr("rel", value);
export const autocomplete = (value) => attr("autocomplete", value);
export const nodeValue = (value) => prop("nodeValue", value);
export const textContent = (value) => prop("textContent", value);
export const innerHTML = (value) => prop("innerHTML", value);
export const outerHTML = (value) => prop("outerHTML", value);
export const getId = (alias) => getAttr("id", alias);
export const getAccesskey = (alias) => getAttr("accesskey", alias);
export const getAutocapitalize = (alias) => getAttr("autocapitalize", alias);
export const getAutofocus = (alias) => getAttr("autofocus", alias);
export const getEnterkeyhint = (alias) => getAttr("enterkeyhint", alias);
export const getExportparts = (alias) => getAttr("exportparts", alias);
export const getHidden = (alias) => getAttr("hidden", alias);
export const getInert = (alias) => getAttr("inert", alias);
export const getInputmode = (alias) => getAttr("inputmode", alias);
export const getIs = (alias) => getAttr("is", alias);
export const getNonce = (alias) => getAttr("nonce", alias);
export const getPart = (alias) => getAttr("part", alias);
export const getPopover = (alias) => getAttr("popover", alias);
export const getSlot = (alias) => getAttr("slot", alias);
export const getSpellcheck = (alias) => getAttr("spellcheck", alias);
export const getTranslate = (alias) => getAttr("translate", alias);
export const getClassName = (alias) => getAttr("class", alias);
export const getNodeValue = (alias) => getProp("nodeValue", alias);
export const getTextContent = (alias) => getProp("textContent", alias);
export const getInnerHTML = (alias) => getProp("innerHTML", alias);
export const getOuterHTML = (alias) => getProp("outerHTML", alias);
export const nodeName = (alias) => getProp("nodeName", alias);
export const nodeType = (alias) => getProp("nodeType", alias);
export const clientHeight = (alias) => getProp("clientHeight", alias);
export const clientLeft = (alias) => getProp("clientLeft", alias);
export const clientTop = (alias) => getProp("clientTop", alias);
export const clientWidth = (alias) => getProp("clientWidth", alias);
export const tagName = (alias) => getProp("tagName", alias);
export const getTitle = (alias) => getAttr("title", alias);
export const getTabIndex = (alias) => getAttr("tabIndex", alias);
export const getLang = (alias) => getAttr("lang", alias);
export const getDir = (alias) => getAttr("dir", alias);
export const getDraggable = (alias) => getAttr("draggable", alias);
export const getItemid = (alias) => getAttr("itemid", alias);
export const getItemprop = (alias) => getAttr("itemprop", alias);
export const getItemref = (alias) => getAttr("itemref", alias);
export const getItemscope = (alias) => getAttr("itemscope", alias);
export const getItemtype = (alias) => getAttr("itemtype", alias);
export const getCrossorigin = (alias) => getAttr("crossorigin", alias);
export const getDisabled = (alias) => getAttr("disabled", alias);
export const getElementtiming = (alias) => getAttr("elementtiming", alias);
export const getMax = (alias) => getAttr("max", alias);
export const getMin = (alias) => getAttr("min", alias);
export const getStep = (alias) => getAttr("step", alias);
export const getType = (alias) => getAttr("type", alias);
export const getAccept = (alias) => getAttr("accept", alias);
export const getCapture = (alias) => getAttr("capture", alias);
export const getPattern = (alias) => getAttr("pattern", alias);
export const getPlaceholder = (alias) => getAttr("placeholder", alias);
export const getForAttr = (alias) => getAttr("forAttr", alias);
export const getSize = (alias) => getAttr("size", alias);
export const getDirname = (alias) => getAttr("dirname", alias);
export const getMultiple = (alias) => getAttr("multiple", alias);
export const getReadonly = (alias) => getAttr("readonly", alias);
export const getMaxlength = (alias) => getAttr("maxlength", alias);
export const getMinlength = (alias) => getAttr("minlength", alias);
export const getRequired = (alias) => getAttr("required", alias);
export const getRel = (alias) => getAttr("rel", alias);
export const getAutocomplete = (alias) => getAttr("autocomplete", alias);
export const addClass = (name) => (data2) => {
  data2.element.classList.add(name);
  return data2;
};
export const removeClass = (name) => (data2) => {
  data2.element.classList.remove(name);
  return data2;
};
export const toggleClass = (name) => (data2) => {
  data2.element.classList.toggle(name);
  return data2;
};
export const dispatch = (event) => (data2) => {
  data2.element.dispatchEvent(event);
  return data2;
};
export const onClick = (listener, options) => subscribe("click", listener, options);
export const onDbClick = (listener, options) => subscribe("dbclick", listener, options);
export const onBlur = (listener, options) => subscribe("blur", listener, options);
export const onFocus = (listener, options) => subscribe("focus", listener, options);
export const onChange = (listener, options) => subscribe("change", listener, options);
export const onMouseDown = (listener, options) => subscribe("mousedown", listener, options);
export const onMouseEnter = (listener, options) => subscribe("mouseenter", listener, options);
export const onMouseLeave = (listener, options) => subscribe("mouseleave", listener, options);
export const onMouseMove = (listener, options) => subscribe("mousemove", listener, options);
export const onMouseOut = (listener, options) => subscribe("mouseout", listener, options);
export const onMouseOver = (listener, options) => subscribe("mouseover", listener, options);
export const onMouseUp = (listener, options) => subscribe("mouseup", listener, options);
export const onWheel = (listener, options) => subscribe("wheel", listener, options);
export const onScroll = (listener, options) => subscribe("scroll", listener, options);
export const onKeyDown = (listener, options) => subscribe("keydown", listener, options);
export const onKeyPress = (listener, options) => subscribe("keypress", listener, options);
export const onKeyUp = (listener, options) => subscribe("keyup", listener, options);
export const onCopy = (listener, options) => subscribe("copy", listener, options);
export const onCut = (listener, options) => subscribe("cut", listener, options);
export const onPaste = (listener, options) => subscribe("paste", listener, options);
export const onSelect = (listener, options) => subscribe("select", listener, options);
export const onFocusIn = (listener, options) => subscribe("focusin", listener, options);
export const onFocusOut = (listener, options) => subscribe("focusout", listener, options);
