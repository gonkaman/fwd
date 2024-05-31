export const noConnector = (_) => (target) => target;
const htmlScope = "http://www.w3.org/1999/xhtml";
const svgScope = "http://www.w3.org/2000/svg";
const mathmlScope = "http://www.w3.org/1998/Math/MathML";
const textScope = "text";
const contextualScope = "ctx";
const defaultNodeFactory = (tagName2) => (arg) => {
  if (arg == null) return { element: document.createElement(tagName2), document, scope: htmlScope };
  return { element: arg.document.createElement(tagName2), document: arg.document, scope: htmlScope };
};
export const nodeFactory = (tagName2, scope) => {
  if (scope == null) return defaultNodeFactory(tagName2);
  switch (scope) {
    case htmlScope:
      return defaultNodeFactory(tagName2);
    case svgScope:
      return (arg) => {
        if (arg == null) return { element: document.createElementNS(svgScope, tagName2), document, scope: svgScope };
        return { element: arg.document.createElementNS(svgScope, tagName2), document: arg.document, scope: svgScope };
      };
    case mathmlScope:
      return (arg) => {
        if (arg == null) return { element: document.createElementNS(mathmlScope, tagName2), document, scope: mathmlScope };
        return { element: arg.document.createElementNS(mathmlScope, tagName2), document: arg.document, scope: mathmlScope };
      };
    case textScope:
      return (arg) => {
        if (arg == null) return { element: document.createTextNode(tagName2), document, scope: textScope };
        return { element: arg.document.createTextNode(tagName2), document: arg.document, scope: textScope };
      };
    case contextualScope:
      return (arg) => {
        if (arg == null) return defaultNodeFactory(tagName2)(arg);
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
export const domBranch = (args, tagName2, isEmpty, scope) => (tConnect, tDerive) => tConnect(
  args.reduce((filter2, arg) => typeof arg === "function" ? arg.length == 1 ? (ctx) => arg(filter2(ctx)) : (ctx) => arg(isEmpty ? noConnector : appendConnector, deriveDOMTaskArg)(filter2(ctx)) : (ctx) => defaultConvert(arg)(filter2(ctx)), nodeFactory(tagName2, scope)),
  tDerive
);
export const domAdapter = (tagName2, isEmpty, scope) => (...args) => domBranch(args, tagName2, isEmpty, scope);
export const tag = (tagName2, ...tasks) => domBranch(
  tasks,
  typeof tagName2 === "string" ? tagName2 : tagName2[0],
  false,
  typeof tagName2 === "string" ? htmlScope : tagName2[1]
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
      if (typeof key === "string") return domAdapter(key, ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "para", "source", "track", "wbr"].indexOf(key) >= 0, htmlScope);
      return Reflect.get(target, key, receiver);
    }
  }),
  svg: new Proxy({}, {
    get(target, key, receiver) {
      if (typeof key === "string") return domAdapter(key, false, svgScope);
      return Reflect.get(target, key, receiver);
    }
  }),
  math: new Proxy({}, {
    get(target, key, receiver) {
      if (typeof key === "string") return domAdapter(key, false, mathmlScope);
      return Reflect.get(target, key, receiver);
    }
  }),
  props: new Proxy({}, {
    get(target, key, receiver) {
      if (typeof key === "string") return (value) => prop(key, value);
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
export const textNode = domAdapter("", true, textScope);
export const scriptTag = domAdapter("script", false, htmlScope);
export const styleTag = domAdapter("style", false, htmlScope);
export const htmlA = domAdapter("htmlA", false, htmlScope);
export const abbr = domAdapter("abbr", false, htmlScope);
export const address = domAdapter("address", false, htmlScope);
export const area = domAdapter("area", true, htmlScope);
export const article = domAdapter("article", false, htmlScope);
export const aside = domAdapter("aside", false, htmlScope);
export const audio = domAdapter("audio", false, htmlScope);
export const b = domAdapter("b", false, htmlScope);
export const base = domAdapter("base", true, htmlScope);
export const bdi = domAdapter("bdi", false, htmlScope);
export const bdo = domAdapter("bdo", false, htmlScope);
export const blockquote = domAdapter("blockquote", false, htmlScope);
export const body = domAdapter("body", false, htmlScope);
export const br = domAdapter("br", true, htmlScope);
export const button = domAdapter("button", false, htmlScope);
export const canvas = domAdapter("canvas", false, htmlScope);
export const caption = domAdapter("caption", false, htmlScope);
export const cite = domAdapter("cite", false, htmlScope);
export const code = domAdapter("code", false, htmlScope);
export const col = domAdapter("col", true, htmlScope);
export const colgroup = domAdapter("colgroup", false, htmlScope);
export const data = domAdapter("data", false, htmlScope);
export const datalist = domAdapter("datalist", false, htmlScope);
export const dd = domAdapter("dd", false, htmlScope);
export const del = domAdapter("del", false, htmlScope);
export const details = domAdapter("details", false, htmlScope);
export const dfn = domAdapter("dfn", false, htmlScope);
export const dialog = domAdapter("dialog", false, htmlScope);
export const div = domAdapter("div", false, htmlScope);
export const dl = domAdapter("dl", false, htmlScope);
export const dt = domAdapter("dt", false, htmlScope);
export const em = domAdapter("em", false, htmlScope);
export const embed = domAdapter("embed", false, htmlScope);
export const fieldset = domAdapter("fieldset", false, htmlScope);
export const figcaption = domAdapter("figcaption", false, htmlScope);
export const figure = domAdapter("figure", false, htmlScope);
export const footer = domAdapter("footer", false, htmlScope);
export const form = domAdapter("form", false, htmlScope);
export const h1 = domAdapter("h1", false, htmlScope);
export const h2 = domAdapter("h2", false, htmlScope);
export const h3 = domAdapter("h3", false, htmlScope);
export const h4 = domAdapter("h4", false, htmlScope);
export const h5 = domAdapter("h5", false, htmlScope);
export const h6 = domAdapter("h6", false, htmlScope);
export const head = domAdapter("head", false, htmlScope);
export const header = domAdapter("header", false, htmlScope);
export const hgroup = domAdapter("hgroup", false, htmlScope);
export const hr = domAdapter("hr", true, htmlScope);
export const html = domAdapter("html", false, htmlScope);
export const i = domAdapter("i", false, htmlScope);
export const iframe = domAdapter("iframe", false, htmlScope);
export const img = domAdapter("img", true, htmlScope);
export const input = domAdapter("input", true, htmlScope);
export const ins = domAdapter("ins", false, htmlScope);
export const kbd = domAdapter("kbd", false, htmlScope);
export const label = domAdapter("label", false, htmlScope);
export const legend = domAdapter("legend", false, htmlScope);
export const li = domAdapter("li", false, htmlScope);
export const link = domAdapter("link", false, htmlScope);
export const main = domAdapter("main", false, htmlScope);
export const mark = domAdapter("mark", false, htmlScope);
export const menu = domAdapter("menu", false, htmlScope);
export const meta = domAdapter("meta", false, htmlScope);
export const meter = domAdapter("meter", false, htmlScope);
export const nav = domAdapter("nav", false, htmlScope);
export const noscript = domAdapter("noscript", false, htmlScope);
export const object = domAdapter("object", false, htmlScope);
export const ol = domAdapter("ol", false, htmlScope);
export const optgroup = domAdapter("optgroup", false, htmlScope);
export const option = domAdapter("option", false, htmlScope);
export const output = domAdapter("output", false, htmlScope);
export const p = domAdapter("p", false, htmlScope);
export const param = domAdapter("param", false, htmlScope);
export const picture = domAdapter("picture", false, htmlScope);
export const pre = domAdapter("pre", false, htmlScope);
export const progress = domAdapter("progress", false, htmlScope);
export const q = domAdapter("q", false, htmlScope);
export const rp = domAdapter("rp", false, htmlScope);
export const rt = domAdapter("rt", false, htmlScope);
export const ruby = domAdapter("ruby", false, htmlScope);
export const s = domAdapter("s", false, htmlScope);
export const samp = domAdapter("samp", false, htmlScope);
export const htmlScriptTag = domAdapter("script", false, htmlScope);
export const search = domAdapter("search", false, htmlScope);
export const section = domAdapter("section", false, htmlScope);
export const select = domAdapter("select", false, htmlScope);
export const slotTag = domAdapter("slot", false, htmlScope);
export const small = domAdapter("small", false, htmlScope);
export const source = domAdapter("source", false, htmlScope);
export const span = domAdapter("span", false, htmlScope);
export const strong = domAdapter("strong", false, htmlScope);
export const htmlStyleTag = domAdapter("style", false, htmlScope);
export const sub = domAdapter("sub", false, htmlScope);
export const summary = domAdapter("summary", false, htmlScope);
export const sup = domAdapter("sup", false, htmlScope);
export const table = domAdapter("table", false, htmlScope);
export const tbody = domAdapter("tbody", false, htmlScope);
export const td = domAdapter("td", false, htmlScope);
export const template = domAdapter("template", false, htmlScope);
export const textarea = domAdapter("textarea", false, htmlScope);
export const tfoot = domAdapter("tfoot", false, htmlScope);
export const th = domAdapter("th", false, htmlScope);
export const thead = domAdapter("thead", false, htmlScope);
export const tile = domAdapter("tile", false, htmlScope);
export const htmlTitleTag = domAdapter("title", false, htmlScope);
export const tr = domAdapter("tr", false, htmlScope);
export const track = domAdapter("track", false, htmlScope);
export const u = domAdapter("u", false, htmlScope);
export const ul = domAdapter("ul", false, htmlScope);
export const varTag = domAdapter("var", false, htmlScope);
export const video = domAdapter("video", false, htmlScope);
export const wbr = domAdapter("wbr", false, htmlScope);
export const animate = domAdapter("animate", false, svgScope);
export const animateMotion = domAdapter("animateMotion", false, svgScope);
export const animateTransform = domAdapter("animateTransform", false, svgScope);
export const circle = domAdapter("circle", false, svgScope);
export const clipPath = domAdapter("clipPath", false, svgScope);
export const defs = domAdapter("defs", false, svgScope);
export const desc = domAdapter("desc", false, svgScope);
export const ellipse = domAdapter("ellipse", false, svgScope);
export const feBlend = domAdapter("feBlend", false, svgScope);
export const feColorMatrix = domAdapter("feColorMatrix", false, svgScope);
export const feComponentTransfer = domAdapter("feComponentTransfer", false, svgScope);
export const feComposite = domAdapter("feComposite", false, svgScope);
export const feConvolveMatrix = domAdapter("feConvolveMatrix", false, svgScope);
export const feDiffuseLighting = domAdapter("feDiffuseLighting", false, svgScope);
export const feDisplacementMap = domAdapter("feDisplacementMap", false, svgScope);
export const feDistantLight = domAdapter("feDistantLight", false, svgScope);
export const feDropShadow = domAdapter("feDropShadow", false, svgScope);
export const feFlood = domAdapter("feFlood", false, svgScope);
export const feFuncA = domAdapter("feFuncA", false, svgScope);
export const feFuncB = domAdapter("feFuncB", false, svgScope);
export const feFuncG = domAdapter("feFuncG", false, svgScope);
export const feFuncR = domAdapter("feFuncR", false, svgScope);
export const feGaussianBlur = domAdapter("feGaussianBlur", false, svgScope);
export const feImage = domAdapter("feImage", false, svgScope);
export const feMerge = domAdapter("feMerge", false, svgScope);
export const feMergeNode = domAdapter("feMergeNode", false, svgScope);
export const feMorphology = domAdapter("feMorphology", false, svgScope);
export const feOffset = domAdapter("feOffset", false, svgScope);
export const fePointLight = domAdapter("fePointLight", false, svgScope);
export const feSpecularLighting = domAdapter("feSpecularLighting", false, svgScope);
export const feSpotLight = domAdapter("feSpotLight", false, svgScope);
export const feTile = domAdapter("feTile", false, svgScope);
export const feTurbulence = domAdapter("feTurbulence", false, svgScope);
export const filter = domAdapter("filter", false, svgScope);
export const g = domAdapter("g", false, svgScope);
export const image = domAdapter("image", false, svgScope);
export const line = domAdapter("line", false, svgScope);
export const linearGradient = domAdapter("linearGradient", false, svgScope);
export const marker = domAdapter("marker", false, svgScope);
export const mask = domAdapter("mask", false, svgScope);
export const metadata = domAdapter("metadata", false, svgScope);
export const mpath = domAdapter("mpath", false, svgScope);
export const path = domAdapter("path", false, svgScope);
export const polygon = domAdapter("polygon", false, svgScope);
export const polyline = domAdapter("polyline", false, svgScope);
export const radialGradient = domAdapter("radialGradient", false, svgScope);
export const rect = domAdapter("rect", false, svgScope);
export const stop = domAdapter("stop", false, svgScope);
export const svg = domAdapter("svg", false, svgScope);
export const set = domAdapter("set", false, svgScope);
export const svgA = domAdapter("a", false, svgScope);
export const patternTag = domAdapter("pattern", false, svgScope);
export const switchTag = domAdapter("switch", false, svgScope);
export const symbolTag = domAdapter("symbol", false, svgScope);
export const svgTitleTag = domAdapter("title", false, svgScope);
export const svgScriptTag = domAdapter("script", false, svgScope);
export const svgStyleTag = domAdapter("style", false, svgScope);
export const text = domAdapter("text", false, svgScope);
export const textPath = domAdapter("textPath", false, svgScope);
export const tspan = domAdapter("tspan", false, svgScope);
export const use = domAdapter("use", false, svgScope);
export const view = domAdapter("view", false, svgScope);
export const a = (...args) => domBranch(args, "a", false, contextualScope);
export const titleTag = (...args) => domBranch(args, "title", false, contextualScope);
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
export const offClick = (listener, options) => unsubscribe("click", listener, options);
export const onDbClick = (listener, options) => subscribe("dbclick", listener, options);
export const offDbClick = (listener, options) => unsubscribe("dbclick", listener, options);
export const onBlur = (listener, options) => subscribe("blur", listener, options);
export const offBlur = (listener, options) => unsubscribe("blur", listener, options);
export const onFocus = (listener, options) => subscribe("focus", listener, options);
export const offFocus = (listener, options) => unsubscribe("focus", listener, options);
export const onChange = (listener, options) => subscribe("change", listener, options);
export const offChange = (listener, options) => unsubscribe("change", listener, options);
export const onMouseDown = (listener, options) => subscribe("mousedown", listener, options);
export const offMouseDown = (listener, options) => unsubscribe("mousedown", listener, options);
export const onMouseEnter = (listener, options) => subscribe("mouseenter", listener, options);
export const offMouseEnter = (listener, options) => unsubscribe("mouseenter", listener, options);
export const onMouseLeave = (listener, options) => subscribe("mouseleave", listener, options);
export const offMouseLeave = (listener, options) => unsubscribe("mouseleave", listener, options);
export const onMouseMove = (listener, options) => subscribe("mousemove", listener, options);
export const offMouseMove = (listener, options) => unsubscribe("mousemove", listener, options);
export const onMouseOut = (listener, options) => subscribe("mouseout", listener, options);
export const offMouseOut = (listener, options) => unsubscribe("mouseout", listener, options);
export const onMouseOver = (listener, options) => subscribe("mouseover", listener, options);
export const offMouseOver = (listener, options) => unsubscribe("mouseover", listener, options);
export const onMouseUp = (listener, options) => subscribe("mouseup", listener, options);
export const offMouseUp = (listener, options) => unsubscribe("mouseup", listener, options);
export const onWheel = (listener, options) => subscribe("wheel", listener, options);
export const offWheel = (listener, options) => unsubscribe("wheel", listener, options);
export const onScroll = (listener, options) => subscribe("scroll", listener, options);
export const offScroll = (listener, options) => unsubscribe("scroll", listener, options);
export const onKeyDown = (listener, options) => subscribe("keydown", listener, options);
export const offKeyDown = (listener, options) => unsubscribe("keydown", listener, options);
export const onKeyPress = (listener, options) => subscribe("keypress", listener, options);
export const offKeyPress = (listener, options) => unsubscribe("keypress", listener, options);
export const onKeyUp = (listener, options) => subscribe("keyup", listener, options);
export const offKeyUp = (listener, options) => unsubscribe("keyup", listener, options);
export const onCopy = (listener, options) => subscribe("copy", listener, options);
export const offCopy = (listener, options) => unsubscribe("copy", listener, options);
export const onCut = (listener, options) => subscribe("cut", listener, options);
export const offCut = (listener, options) => unsubscribe("cut", listener, options);
export const onPaste = (listener, options) => subscribe("paste", listener, options);
export const offPaste = (listener, options) => unsubscribe("paste", listener, options);
export const onSelect = (listener, options) => subscribe("select", listener, options);
export const offSelect = (listener, options) => unsubscribe("select", listener, options);
export const onFocusIn = (listener, options) => subscribe("focusin", listener, options);
export const offFocusIn = (listener, options) => unsubscribe("focusin", listener, options);
export const onFocusOut = (listener, options) => subscribe("focusout", listener, options);
export const offFocusOut = (listener, options) => unsubscribe("focusout", listener, options);
