(() => {
  // ../serenia.js
  var noConnector = (_) => (target) => target;
  var htmlScope = "http://www.w3.org/1999/xhtml";
  var svgScope = "http://www.w3.org/2000/svg";
  var mathmlScope = "http://www.w3.org/1998/Math/MathML";
  var textScope = "text";
  var contextualScope = "ctx";
  var defaultNodeFactory = (tagName2) => (arg) => {
    if (arg == null) return { element: document.createElement(tagName2), document, scope: htmlScope };
    return { element: arg.document.createElement(tagName2), document: arg.document, scope: htmlScope };
  };
  var nodeFactory = (tagName2, scope) => {
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
  var deriveDOMTaskArg = (data22) => data22;
  var defaultConvert = (arg) => (data22) => {
    if (data22.scope === textScope) {
      data22.element.nodeValue = arg + "";
    } else {
      data22.element.appendChild(data22.document.createTextNode(arg + ""));
    }
    return data22;
  };
  var appendConnector = (filter22) => (data22) => {
    data22.element.appendChild(filter22(data22).element);
    return data22;
  };
  var domBranch = (args, tagName2, isEmpty, scope) => (tConnect, tDerive) => tConnect(
    args.reduce((filter22, arg) => typeof arg === "function" ? arg.length == 1 ? (ctx) => arg(filter22(ctx)) : (ctx) => arg(isEmpty ? noConnector : appendConnector, deriveDOMTaskArg)(filter22(ctx)) : (ctx) => defaultConvert(arg)(filter22(ctx)), nodeFactory(tagName2, scope)),
    tDerive
  );
  var domAdapter = (tagName2, isEmpty, scope) => (...args) => domBranch(args, tagName2, isEmpty, scope);
  var prop = (key, value2) => value2 === void 0 ? (data22) => {
    data22.element[key] = null;
    return data22;
  } : typeof value2 === "function" ? (data22) => {
    data22.element[key] = value2(data22.element[key]);
    return data22;
  } : (data22) => {
    data22.element[key] = value2;
    return data22;
  };
  var getProp = (key, alias) => (data22) => [[alias || key, data22.element[key]]];
  var attr = (key, value2) => value2 === void 0 ? (data22) => {
    data22.element.removeAttribute(key);
    return data22;
  } : typeof value2 === "function" ? (data22) => {
    data22.element.setAttribute(key, value2(data22.element.getAttribute(key) ?? void 0));
    return data22;
  } : (data22) => {
    data22.element.setAttribute(key, value2);
    return data22;
  };
  var getStyle = (key, alias) => (data22) => [[alias || key, data22.element.style[key]]];
  var remove = (property) => property(void 0);
  var subscribe = (eventType, listener, options) => (data22) => {
    data22.element.addEventListener(eventType, listener, options);
    return data22;
  };
  var unsubscribe = (eventType, listener, options) => (data22) => {
    data22.element.removeEventListener(eventType, listener, options);
    return data22;
  };
  var adapters = {
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
        if (typeof key === "string") return (value2) => prop(key, value2);
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
  var queries = {
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
  var textNode = domAdapter("", true, textScope);
  var scriptTag = domAdapter("script", false, htmlScope);
  var styleTag = domAdapter("style", false, htmlScope);
  var htmlA = domAdapter("htmlA", false, htmlScope);
  var abbr = domAdapter("abbr", false, htmlScope);
  var address = domAdapter("address", false, htmlScope);
  var area = domAdapter("area", true, htmlScope);
  var article = domAdapter("article", false, htmlScope);
  var aside = domAdapter("aside", false, htmlScope);
  var audio = domAdapter("audio", false, htmlScope);
  var b = domAdapter("b", false, htmlScope);
  var base = domAdapter("base", true, htmlScope);
  var bdi = domAdapter("bdi", false, htmlScope);
  var bdo = domAdapter("bdo", false, htmlScope);
  var blockquote = domAdapter("blockquote", false, htmlScope);
  var body = domAdapter("body", false, htmlScope);
  var br = domAdapter("br", true, htmlScope);
  var button = domAdapter("button", false, htmlScope);
  var canvas = domAdapter("canvas", false, htmlScope);
  var caption = domAdapter("caption", false, htmlScope);
  var cite = domAdapter("cite", false, htmlScope);
  var code = domAdapter("code", false, htmlScope);
  var col = domAdapter("col", true, htmlScope);
  var colgroup = domAdapter("colgroup", false, htmlScope);
  var data = domAdapter("data", false, htmlScope);
  var datalist = domAdapter("datalist", false, htmlScope);
  var dd = domAdapter("dd", false, htmlScope);
  var del = domAdapter("del", false, htmlScope);
  var details = domAdapter("details", false, htmlScope);
  var dfn = domAdapter("dfn", false, htmlScope);
  var dialog = domAdapter("dialog", false, htmlScope);
  var div = domAdapter("div", false, htmlScope);
  var dl = domAdapter("dl", false, htmlScope);
  var dt = domAdapter("dt", false, htmlScope);
  var em = domAdapter("em", false, htmlScope);
  var embed = domAdapter("embed", false, htmlScope);
  var fieldset = domAdapter("fieldset", false, htmlScope);
  var figcaption = domAdapter("figcaption", false, htmlScope);
  var figure = domAdapter("figure", false, htmlScope);
  var footer = domAdapter("footer", false, htmlScope);
  var form = domAdapter("form", false, htmlScope);
  var h1 = domAdapter("h1", false, htmlScope);
  var h2 = domAdapter("h2", false, htmlScope);
  var h3 = domAdapter("h3", false, htmlScope);
  var h4 = domAdapter("h4", false, htmlScope);
  var h5 = domAdapter("h5", false, htmlScope);
  var h6 = domAdapter("h6", false, htmlScope);
  var head = domAdapter("head", false, htmlScope);
  var header = domAdapter("header", false, htmlScope);
  var hgroup = domAdapter("hgroup", false, htmlScope);
  var hr = domAdapter("hr", true, htmlScope);
  var html = domAdapter("html", false, htmlScope);
  var i = domAdapter("i", false, htmlScope);
  var iframe = domAdapter("iframe", false, htmlScope);
  var img = domAdapter("img", true, htmlScope);
  var input = domAdapter("input", true, htmlScope);
  var ins = domAdapter("ins", false, htmlScope);
  var kbd = domAdapter("kbd", false, htmlScope);
  var label = domAdapter("label", false, htmlScope);
  var legend = domAdapter("legend", false, htmlScope);
  var li = domAdapter("li", false, htmlScope);
  var link = domAdapter("link", false, htmlScope);
  var main = domAdapter("main", false, htmlScope);
  var mark = domAdapter("mark", false, htmlScope);
  var menu = domAdapter("menu", false, htmlScope);
  var meta = domAdapter("meta", false, htmlScope);
  var meter = domAdapter("meter", false, htmlScope);
  var nav = domAdapter("nav", false, htmlScope);
  var noscript = domAdapter("noscript", false, htmlScope);
  var object = domAdapter("object", false, htmlScope);
  var ol = domAdapter("ol", false, htmlScope);
  var optgroup = domAdapter("optgroup", false, htmlScope);
  var option = domAdapter("option", false, htmlScope);
  var output = domAdapter("output", false, htmlScope);
  var p = domAdapter("p", false, htmlScope);
  var param = domAdapter("param", false, htmlScope);
  var picture = domAdapter("picture", false, htmlScope);
  var pre = domAdapter("pre", false, htmlScope);
  var progress = domAdapter("progress", false, htmlScope);
  var q = domAdapter("q", false, htmlScope);
  var rp = domAdapter("rp", false, htmlScope);
  var rt = domAdapter("rt", false, htmlScope);
  var ruby = domAdapter("ruby", false, htmlScope);
  var s = domAdapter("s", false, htmlScope);
  var samp = domAdapter("samp", false, htmlScope);
  var htmlScriptTag = domAdapter("script", false, htmlScope);
  var search = domAdapter("search", false, htmlScope);
  var section = domAdapter("section", false, htmlScope);
  var select = domAdapter("select", false, htmlScope);
  var slotTag = domAdapter("slot", false, htmlScope);
  var small = domAdapter("small", false, htmlScope);
  var source = domAdapter("source", false, htmlScope);
  var span = domAdapter("span", false, htmlScope);
  var strong = domAdapter("strong", false, htmlScope);
  var htmlStyleTag = domAdapter("style", false, htmlScope);
  var sub = domAdapter("sub", false, htmlScope);
  var summary = domAdapter("summary", false, htmlScope);
  var sup = domAdapter("sup", false, htmlScope);
  var table = domAdapter("table", false, htmlScope);
  var tbody = domAdapter("tbody", false, htmlScope);
  var td = domAdapter("td", false, htmlScope);
  var template = domAdapter("template", false, htmlScope);
  var textarea = domAdapter("textarea", false, htmlScope);
  var tfoot = domAdapter("tfoot", false, htmlScope);
  var th = domAdapter("th", false, htmlScope);
  var thead = domAdapter("thead", false, htmlScope);
  var tile = domAdapter("tile", false, htmlScope);
  var htmlTitleTag = domAdapter("title", false, htmlScope);
  var tr = domAdapter("tr", false, htmlScope);
  var track = domAdapter("track", false, htmlScope);
  var u = domAdapter("u", false, htmlScope);
  var ul = domAdapter("ul", false, htmlScope);
  var varTag = domAdapter("var", false, htmlScope);
  var video = domAdapter("video", false, htmlScope);
  var wbr = domAdapter("wbr", false, htmlScope);
  var animate = domAdapter("animate", false, svgScope);
  var animateMotion = domAdapter("animateMotion", false, svgScope);
  var animateTransform = domAdapter("animateTransform", false, svgScope);
  var circle = domAdapter("circle", false, svgScope);
  var clipPath = domAdapter("clipPath", false, svgScope);
  var defs = domAdapter("defs", false, svgScope);
  var desc = domAdapter("desc", false, svgScope);
  var ellipse = domAdapter("ellipse", false, svgScope);
  var feBlend = domAdapter("feBlend", false, svgScope);
  var feColorMatrix = domAdapter("feColorMatrix", false, svgScope);
  var feComponentTransfer = domAdapter("feComponentTransfer", false, svgScope);
  var feComposite = domAdapter("feComposite", false, svgScope);
  var feConvolveMatrix = domAdapter("feConvolveMatrix", false, svgScope);
  var feDiffuseLighting = domAdapter("feDiffuseLighting", false, svgScope);
  var feDisplacementMap = domAdapter("feDisplacementMap", false, svgScope);
  var feDistantLight = domAdapter("feDistantLight", false, svgScope);
  var feDropShadow = domAdapter("feDropShadow", false, svgScope);
  var feFlood = domAdapter("feFlood", false, svgScope);
  var feFuncA = domAdapter("feFuncA", false, svgScope);
  var feFuncB = domAdapter("feFuncB", false, svgScope);
  var feFuncG = domAdapter("feFuncG", false, svgScope);
  var feFuncR = domAdapter("feFuncR", false, svgScope);
  var feGaussianBlur = domAdapter("feGaussianBlur", false, svgScope);
  var feImage = domAdapter("feImage", false, svgScope);
  var feMerge = domAdapter("feMerge", false, svgScope);
  var feMergeNode = domAdapter("feMergeNode", false, svgScope);
  var feMorphology = domAdapter("feMorphology", false, svgScope);
  var feOffset = domAdapter("feOffset", false, svgScope);
  var fePointLight = domAdapter("fePointLight", false, svgScope);
  var feSpecularLighting = domAdapter("feSpecularLighting", false, svgScope);
  var feSpotLight = domAdapter("feSpotLight", false, svgScope);
  var feTile = domAdapter("feTile", false, svgScope);
  var feTurbulence = domAdapter("feTurbulence", false, svgScope);
  var filter = domAdapter("filter", false, svgScope);
  var g = domAdapter("g", false, svgScope);
  var image = domAdapter("image", false, svgScope);
  var line = domAdapter("line", false, svgScope);
  var linearGradient = domAdapter("linearGradient", false, svgScope);
  var marker = domAdapter("marker", false, svgScope);
  var mask = domAdapter("mask", false, svgScope);
  var metadata = domAdapter("metadata", false, svgScope);
  var mpath = domAdapter("mpath", false, svgScope);
  var path = domAdapter("path", false, svgScope);
  var polygon = domAdapter("polygon", false, svgScope);
  var polyline = domAdapter("polyline", false, svgScope);
  var radialGradient = domAdapter("radialGradient", false, svgScope);
  var rect = domAdapter("rect", false, svgScope);
  var stop = domAdapter("stop", false, svgScope);
  var svg = domAdapter("svg", false, svgScope);
  var set = domAdapter("set", false, svgScope);
  var svgA = domAdapter("a", false, svgScope);
  var patternTag = domAdapter("pattern", false, svgScope);
  var switchTag = domAdapter("switch", false, svgScope);
  var symbolTag = domAdapter("symbol", false, svgScope);
  var svgTitleTag = domAdapter("title", false, svgScope);
  var svgScriptTag = domAdapter("script", false, svgScope);
  var svgStyleTag = domAdapter("style", false, svgScope);
  var text = domAdapter("text", false, svgScope);
  var textPath = domAdapter("textPath", false, svgScope);
  var tspan = domAdapter("tspan", false, svgScope);
  var use = domAdapter("use", false, svgScope);
  var view = domAdapter("view", false, svgScope);
  var onDbClick = (listener, options) => subscribe("dbclick", listener, options);

  // serenia.ts
  var noConnector2 = (_) => (target) => target;
  var htmlScope2 = "http://www.w3.org/1999/xhtml";
  var svgScope2 = "http://www.w3.org/2000/svg";
  var mathmlScope2 = "http://www.w3.org/1998/Math/MathML";
  var textScope2 = "text";
  var contextualScope2 = "ctx";
  var defaultNodeFactory2 = (tagName) => (arg) => {
    if (arg == null) return { element: document.createElement(tagName), document, scope: htmlScope2 };
    return { element: arg.document.createElement(tagName), document: arg.document, scope: htmlScope2 };
  };
  var nodeFactory2 = (tagName, scope) => {
    if (scope == null) return defaultNodeFactory2(tagName);
    switch (scope) {
      case htmlScope2:
        return defaultNodeFactory2(tagName);
      case svgScope2:
        return (arg) => {
          if (arg == null) return { element: document.createElementNS(svgScope2, tagName), document, scope: svgScope2 };
          return { element: arg.document.createElementNS(svgScope2, tagName), document: arg.document, scope: svgScope2 };
        };
      case mathmlScope2:
        return (arg) => {
          if (arg == null) return { element: document.createElementNS(mathmlScope2, tagName), document, scope: mathmlScope2 };
          return { element: arg.document.createElementNS(mathmlScope2, tagName), document: arg.document, scope: mathmlScope2 };
        };
      case textScope2:
        return (arg) => {
          if (arg == null) return { element: document.createTextNode(tagName), document, scope: textScope2 };
          return { element: arg.document.createTextNode(tagName), document: arg.document, scope: textScope2 };
        };
      case contextualScope2:
        return (arg) => {
          if (arg == null) return defaultNodeFactory2(tagName)(arg);
          return nodeFactory2(tagName, arg.scope)(arg);
        };
      default:
        return defaultNodeFactory2(tagName);
    }
  };
  var deriveDOMTaskArg2 = (data3) => data3;
  var defaultConvert2 = (arg) => (data3) => {
    if (data3.scope === textScope2) {
      data3.element.nodeValue = arg + "";
    } else {
      data3.element.appendChild(data3.document.createTextNode(arg + ""));
    }
    return data3;
  };
  var appendConnector2 = (filter3) => (data3) => {
    data3.element.appendChild(filter3(data3).element);
    return data3;
  };
  var appendAll = (...branches) => (data3) => branches.reduce((current, branch) => branch(appendConnector2, deriveDOMTaskArg2)(current), data3);
  var prependConnector = (filter3) => (data3) => {
    data3.element.prepend(filter3(data3).element);
    return data3;
  };
  var prepend = (branch) => branch(prependConnector, deriveDOMTaskArg2);
  var getElement = (query2, container) => () => {
    const elt = container.querySelector(query2);
    return elt == null ? null : {
      element: elt,
      document: elt.ownerDocument,
      scope: elt.namespaceURI ?? htmlScope2
    };
  };
  var fromElement = (element) => () => {
    return {
      element,
      document: element.ownerDocument,
      scope: element.namespaceURI ?? htmlScope2
    };
  };
  var render = (lookup, ...tasks) => () => {
    const target = lookup();
    return target == null ? null : tasks.reduce((data3, task) => task(data3), target);
  };
  var detach = () => (data3) => {
    data3.element.parentNode?.removeChild(data3.element);
    return data3;
  };
  var createRef = () => {
    let getData = () => null;
    return [
      (lookup) => {
        getData = lookup;
      },
      () => getData()
    ];
  };
  var createQuery = () => {
    const queryMap = /* @__PURE__ */ new Map();
    return [
      (lookup) => {
        queryMap.set(...lookup);
      },
      (key) => {
        if (key == null) return new Map(Array.from(queryMap.entries()).map((entry) => [entry[0], entry[1]()]));
        const valueLookup = queryMap.get(key);
        return valueLookup == null ? valueLookup + "" : valueLookup();
      }
    ];
  };
  var ref = (curator) => (data3) => {
    curator(() => data3);
    return data3;
  };
  var query = (curator, ...queryFilters) => (data3) => {
    queryFilters.forEach((filter3) => curator(filter3(data3)));
    return data3;
  };
  var domBranch2 = (args, tagName, isEmpty, scope) => (tConnect, tDerive) => tConnect(
    args.reduce((filter3, arg) => typeof arg === "function" ? arg.length == 1 ? (ctx) => arg(filter3(ctx)) : (ctx) => arg(isEmpty ? noConnector2 : appendConnector2, deriveDOMTaskArg2)(filter3(ctx)) : (ctx) => defaultConvert2(arg)(filter3(ctx)), nodeFactory2(tagName, scope)),
    tDerive
  );
  var domAdapter2 = (tagName, isEmpty, scope) => (...args) => domBranch2(args, tagName, isEmpty, scope);
  var prop2 = (key, value2) => value2 === void 0 ? (data3) => {
    data3.element[key] = null;
    return data3;
  } : typeof value2 === "function" ? (data3) => {
    data3.element[key] = value2(data3.element[key]);
    return data3;
  } : (data3) => {
    data3.element[key] = value2;
    return data3;
  };
  var getProp2 = (key, alias) => (data3) => [alias || key, () => data3.element[key]];
  var attr2 = (key, value2) => value2 === void 0 ? (data3) => {
    data3.element.removeAttribute(key);
    return data3;
  } : typeof value2 === "function" ? (data3) => {
    data3.element.setAttribute(key, value2(data3.element.getAttribute(key) ?? void 0));
    return data3;
  } : (data3) => {
    data3.element.setAttribute(key, value2);
    return data3;
  };
  var getStyle2 = (key, alias) => (data3) => [alias || key, () => data3.element.style[key]];
  var subscribe2 = (eventType, listener, options) => (data3) => {
    data3.element.addEventListener(eventType, listener, options);
    return data3;
  };
  var unsubscribe2 = (eventType, listener, options) => (data3) => {
    data3.element.removeEventListener(eventType, listener, options);
    return data3;
  };
  var adapters2 = {
    html: new Proxy({}, {
      get(target, key, receiver) {
        if (typeof key === "string") return domAdapter2(key, ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "para", "source", "track", "wbr"].indexOf(key) >= 0, htmlScope2);
        return Reflect.get(target, key, receiver);
      }
    }),
    svg: new Proxy({}, {
      get(target, key, receiver) {
        if (typeof key === "string") return domAdapter2(key, false, svgScope2);
        return Reflect.get(target, key, receiver);
      }
    }),
    math: new Proxy({}, {
      get(target, key, receiver) {
        if (typeof key === "string") return domAdapter2(key, false, mathmlScope2);
        return Reflect.get(target, key, receiver);
      }
    }),
    props: new Proxy({}, {
      get(target, key, receiver) {
        if (typeof key === "string") return (value2) => prop2(key, value2);
        return Reflect.get(target, key, receiver);
      }
    }),
    events: new Proxy({}, {
      get(target, key, receiver) {
        if (typeof key === "string") return key.startsWith("on") && key.length > 2 ? (listener, options) => subscribe2(key.slice(2).toLowerCase(), listener, options) : key.startsWith("off") && key.length > 3 ? (listener, options) => unsubscribe2(key.slice(3).toLowerCase(), listener, options) : (listener, options) => subscribe2(key, listener, options);
        return Reflect.get(target, key, receiver);
      }
    })
  };
  var queries2 = {
    props: new Proxy({}, {
      get(target, key, receiver) {
        if (typeof key === "string") return (key2, alias) => getProp2(key2, alias);
        return Reflect.get(target, key, receiver);
      }
    }),
    style: new Proxy({}, {
      get(target, key, receiver) {
        if (typeof key === "string") return (key2, alias) => getStyle2(key2, alias);
        return Reflect.get(target, key, receiver);
      }
    })
  };
  var textNode2 = domAdapter2("", true, textScope2);
  var scriptTag2 = domAdapter2("script", false, htmlScope2);
  var styleTag2 = domAdapter2("style", false, htmlScope2);
  var htmlA2 = domAdapter2("htmlA", false, htmlScope2);
  var abbr2 = domAdapter2("abbr", false, htmlScope2);
  var address2 = domAdapter2("address", false, htmlScope2);
  var area2 = domAdapter2("area", true, htmlScope2);
  var article2 = domAdapter2("article", false, htmlScope2);
  var aside2 = domAdapter2("aside", false, htmlScope2);
  var audio2 = domAdapter2("audio", false, htmlScope2);
  var b2 = domAdapter2("b", false, htmlScope2);
  var base2 = domAdapter2("base", true, htmlScope2);
  var bdi2 = domAdapter2("bdi", false, htmlScope2);
  var bdo2 = domAdapter2("bdo", false, htmlScope2);
  var blockquote2 = domAdapter2("blockquote", false, htmlScope2);
  var body2 = domAdapter2("body", false, htmlScope2);
  var br2 = domAdapter2("br", true, htmlScope2);
  var button2 = domAdapter2("button", false, htmlScope2);
  var canvas2 = domAdapter2("canvas", false, htmlScope2);
  var caption2 = domAdapter2("caption", false, htmlScope2);
  var cite2 = domAdapter2("cite", false, htmlScope2);
  var code2 = domAdapter2("code", false, htmlScope2);
  var col2 = domAdapter2("col", true, htmlScope2);
  var colgroup2 = domAdapter2("colgroup", false, htmlScope2);
  var data2 = domAdapter2("data", false, htmlScope2);
  var datalist2 = domAdapter2("datalist", false, htmlScope2);
  var dd2 = domAdapter2("dd", false, htmlScope2);
  var del2 = domAdapter2("del", false, htmlScope2);
  var details2 = domAdapter2("details", false, htmlScope2);
  var dfn2 = domAdapter2("dfn", false, htmlScope2);
  var dialog2 = domAdapter2("dialog", false, htmlScope2);
  var div2 = domAdapter2("div", false, htmlScope2);
  var dl2 = domAdapter2("dl", false, htmlScope2);
  var dt2 = domAdapter2("dt", false, htmlScope2);
  var em2 = domAdapter2("em", false, htmlScope2);
  var embed2 = domAdapter2("embed", false, htmlScope2);
  var fieldset2 = domAdapter2("fieldset", false, htmlScope2);
  var figcaption2 = domAdapter2("figcaption", false, htmlScope2);
  var figure2 = domAdapter2("figure", false, htmlScope2);
  var footer2 = domAdapter2("footer", false, htmlScope2);
  var form2 = domAdapter2("form", false, htmlScope2);
  var h12 = domAdapter2("h1", false, htmlScope2);
  var h22 = domAdapter2("h2", false, htmlScope2);
  var h32 = domAdapter2("h3", false, htmlScope2);
  var h42 = domAdapter2("h4", false, htmlScope2);
  var h52 = domAdapter2("h5", false, htmlScope2);
  var h62 = domAdapter2("h6", false, htmlScope2);
  var head2 = domAdapter2("head", false, htmlScope2);
  var header2 = domAdapter2("header", false, htmlScope2);
  var hgroup2 = domAdapter2("hgroup", false, htmlScope2);
  var hr2 = domAdapter2("hr", true, htmlScope2);
  var html2 = domAdapter2("html", false, htmlScope2);
  var i2 = domAdapter2("i", false, htmlScope2);
  var iframe2 = domAdapter2("iframe", false, htmlScope2);
  var img2 = domAdapter2("img", true, htmlScope2);
  var input2 = domAdapter2("input", true, htmlScope2);
  var ins2 = domAdapter2("ins", false, htmlScope2);
  var kbd2 = domAdapter2("kbd", false, htmlScope2);
  var label2 = domAdapter2("label", false, htmlScope2);
  var legend2 = domAdapter2("legend", false, htmlScope2);
  var li2 = domAdapter2("li", false, htmlScope2);
  var link2 = domAdapter2("link", false, htmlScope2);
  var main2 = domAdapter2("main", false, htmlScope2);
  var mark2 = domAdapter2("mark", false, htmlScope2);
  var menu2 = domAdapter2("menu", false, htmlScope2);
  var meta2 = domAdapter2("meta", false, htmlScope2);
  var meter2 = domAdapter2("meter", false, htmlScope2);
  var nav2 = domAdapter2("nav", false, htmlScope2);
  var noscript2 = domAdapter2("noscript", false, htmlScope2);
  var object2 = domAdapter2("object", false, htmlScope2);
  var ol2 = domAdapter2("ol", false, htmlScope2);
  var optgroup2 = domAdapter2("optgroup", false, htmlScope2);
  var option2 = domAdapter2("option", false, htmlScope2);
  var output2 = domAdapter2("output", false, htmlScope2);
  var p2 = domAdapter2("p", false, htmlScope2);
  var param2 = domAdapter2("param", false, htmlScope2);
  var picture2 = domAdapter2("picture", false, htmlScope2);
  var pre2 = domAdapter2("pre", false, htmlScope2);
  var progress2 = domAdapter2("progress", false, htmlScope2);
  var q2 = domAdapter2("q", false, htmlScope2);
  var rp2 = domAdapter2("rp", false, htmlScope2);
  var rt2 = domAdapter2("rt", false, htmlScope2);
  var ruby2 = domAdapter2("ruby", false, htmlScope2);
  var s2 = domAdapter2("s", false, htmlScope2);
  var samp2 = domAdapter2("samp", false, htmlScope2);
  var htmlScriptTag2 = domAdapter2("script", false, htmlScope2);
  var search2 = domAdapter2("search", false, htmlScope2);
  var section2 = domAdapter2("section", false, htmlScope2);
  var select2 = domAdapter2("select", false, htmlScope2);
  var slotTag2 = domAdapter2("slot", false, htmlScope2);
  var small2 = domAdapter2("small", false, htmlScope2);
  var source2 = domAdapter2("source", false, htmlScope2);
  var span2 = domAdapter2("span", false, htmlScope2);
  var strong2 = domAdapter2("strong", false, htmlScope2);
  var htmlStyleTag2 = domAdapter2("style", false, htmlScope2);
  var sub2 = domAdapter2("sub", false, htmlScope2);
  var summary2 = domAdapter2("summary", false, htmlScope2);
  var sup2 = domAdapter2("sup", false, htmlScope2);
  var table2 = domAdapter2("table", false, htmlScope2);
  var tbody2 = domAdapter2("tbody", false, htmlScope2);
  var td2 = domAdapter2("td", false, htmlScope2);
  var template2 = domAdapter2("template", false, htmlScope2);
  var textarea2 = domAdapter2("textarea", false, htmlScope2);
  var tfoot2 = domAdapter2("tfoot", false, htmlScope2);
  var th2 = domAdapter2("th", false, htmlScope2);
  var thead2 = domAdapter2("thead", false, htmlScope2);
  var tile2 = domAdapter2("tile", false, htmlScope2);
  var htmlTitleTag2 = domAdapter2("title", false, htmlScope2);
  var tr2 = domAdapter2("tr", false, htmlScope2);
  var track2 = domAdapter2("track", false, htmlScope2);
  var u2 = domAdapter2("u", false, htmlScope2);
  var ul2 = domAdapter2("ul", false, htmlScope2);
  var varTag2 = domAdapter2("var", false, htmlScope2);
  var video2 = domAdapter2("video", false, htmlScope2);
  var wbr2 = domAdapter2("wbr", false, htmlScope2);
  var animate2 = domAdapter2("animate", false, svgScope2);
  var animateMotion2 = domAdapter2("animateMotion", false, svgScope2);
  var animateTransform2 = domAdapter2("animateTransform", false, svgScope2);
  var circle2 = domAdapter2("circle", false, svgScope2);
  var clipPath2 = domAdapter2("clipPath", false, svgScope2);
  var defs2 = domAdapter2("defs", false, svgScope2);
  var desc2 = domAdapter2("desc", false, svgScope2);
  var ellipse2 = domAdapter2("ellipse", false, svgScope2);
  var feBlend2 = domAdapter2("feBlend", false, svgScope2);
  var feColorMatrix2 = domAdapter2("feColorMatrix", false, svgScope2);
  var feComponentTransfer2 = domAdapter2("feComponentTransfer", false, svgScope2);
  var feComposite2 = domAdapter2("feComposite", false, svgScope2);
  var feConvolveMatrix2 = domAdapter2("feConvolveMatrix", false, svgScope2);
  var feDiffuseLighting2 = domAdapter2("feDiffuseLighting", false, svgScope2);
  var feDisplacementMap2 = domAdapter2("feDisplacementMap", false, svgScope2);
  var feDistantLight2 = domAdapter2("feDistantLight", false, svgScope2);
  var feDropShadow2 = domAdapter2("feDropShadow", false, svgScope2);
  var feFlood2 = domAdapter2("feFlood", false, svgScope2);
  var feFuncA2 = domAdapter2("feFuncA", false, svgScope2);
  var feFuncB2 = domAdapter2("feFuncB", false, svgScope2);
  var feFuncG2 = domAdapter2("feFuncG", false, svgScope2);
  var feFuncR2 = domAdapter2("feFuncR", false, svgScope2);
  var feGaussianBlur2 = domAdapter2("feGaussianBlur", false, svgScope2);
  var feImage2 = domAdapter2("feImage", false, svgScope2);
  var feMerge2 = domAdapter2("feMerge", false, svgScope2);
  var feMergeNode2 = domAdapter2("feMergeNode", false, svgScope2);
  var feMorphology2 = domAdapter2("feMorphology", false, svgScope2);
  var feOffset2 = domAdapter2("feOffset", false, svgScope2);
  var fePointLight2 = domAdapter2("fePointLight", false, svgScope2);
  var feSpecularLighting2 = domAdapter2("feSpecularLighting", false, svgScope2);
  var feSpotLight2 = domAdapter2("feSpotLight", false, svgScope2);
  var feTile2 = domAdapter2("feTile", false, svgScope2);
  var feTurbulence2 = domAdapter2("feTurbulence", false, svgScope2);
  var filter2 = domAdapter2("filter", false, svgScope2);
  var g2 = domAdapter2("g", false, svgScope2);
  var image2 = domAdapter2("image", false, svgScope2);
  var line2 = domAdapter2("line", false, svgScope2);
  var linearGradient2 = domAdapter2("linearGradient", false, svgScope2);
  var marker2 = domAdapter2("marker", false, svgScope2);
  var mask2 = domAdapter2("mask", false, svgScope2);
  var metadata2 = domAdapter2("metadata", false, svgScope2);
  var mpath2 = domAdapter2("mpath", false, svgScope2);
  var path2 = domAdapter2("path", false, svgScope2);
  var polygon2 = domAdapter2("polygon", false, svgScope2);
  var polyline2 = domAdapter2("polyline", false, svgScope2);
  var radialGradient2 = domAdapter2("radialGradient", false, svgScope2);
  var rect2 = domAdapter2("rect", false, svgScope2);
  var stop2 = domAdapter2("stop", false, svgScope2);
  var svg2 = domAdapter2("svg", false, svgScope2);
  var set2 = domAdapter2("set", false, svgScope2);
  var svgA2 = domAdapter2("a", false, svgScope2);
  var patternTag2 = domAdapter2("pattern", false, svgScope2);
  var switchTag2 = domAdapter2("switch", false, svgScope2);
  var symbolTag2 = domAdapter2("symbol", false, svgScope2);
  var svgTitleTag2 = domAdapter2("title", false, svgScope2);
  var svgScriptTag2 = domAdapter2("script", false, svgScope2);
  var svgStyleTag2 = domAdapter2("style", false, svgScope2);
  var text2 = domAdapter2("text", false, svgScope2);
  var textPath2 = domAdapter2("textPath", false, svgScope2);
  var tspan2 = domAdapter2("tspan", false, svgScope2);
  var use2 = domAdapter2("use", false, svgScope2);
  var view2 = domAdapter2("view", false, svgScope2);
  var className = (value2) => attr2("class", value2);
  var type = (value2) => attr2("type", value2);
  var placeholder = (value2) => attr2("placeholder", value2);
  var value = (value2) => prop2("value", value2);
  var getValue = (alias) => getProp2("value", alias);
  var toggleClass = (name) => (data3) => {
    data3.element.classList.toggle(name);
    return data3;
  };
  var onClick = (listener, options) => subscribe2("click", listener, options);
  var onChange = (listener, options) => subscribe2("change", listener, options);

  // todoapp.ts
  var [todoItemsRef, todoItems] = createRef();
  var [todoInputRef, todoInput] = createRef();
  var [todoInputQueryRef, todoInputQuery] = createQuery();
  var todoItem = (task) => li2(
    task,
    onClick((e) => render(fromElement(e.target), toggleClass("checked"))()),
    onDbClick((e) => render(fromElement(e.target), attr("contenteditable", "true"))()),
    onChange((e) => render(fromElement(e.target), remove("contenteditable"))()),
    span2(
      "\xD7",
      className("close"),
      onClick((e) => render(
        fromElement(e.target.parentElement),
        detach()
      )())
    )
  );
  var todoList = div2(
    className("todo-container"),
    div2(
      className("todo-header"),
      h22("My todo list"),
      input2(
        type("text"),
        placeholder("Next task ..."),
        query(todoInputQueryRef, getValue()),
        ref(todoInputRef),
        onChange((e) => appendNewItem())
      ),
      span2(
        className("todo-add-btn"),
        "Add",
        onClick((e) => appendNewItem())
      )
    ),
    ul2(
      className("todo-items"),
      ref(todoItemsRef),
      appendAll(...Array.from({ length: 10 }, (_, i3) => i3 + 1).map(
        (value2) => todoItem("Auto generated task " + value2)
      ))
    )
  );
  var appendNewItem = () => {
    const newTask = todoInputQuery("value") + "";
    if (newTask.trim().length == 0) return;
    render(todoItems, prepend(todoItem(newTask)))();
    render(todoInput, value(""))();
  };
  var renderTodo = render(
    getElement("body", document),
    prepend(todoList)
  );
  renderTodo();
})();
