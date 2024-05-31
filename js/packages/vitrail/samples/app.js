(() => {
  // myLib.ts
  var noConnector = (_) => (target) => target;
  var htmlScope = "http://www.w3.org/1999/xhtml";
  var svgScope = "http://www.w3.org/2000/svg";
  var mathmlScope = "http://www.w3.org/1998/Math/MathML";
  var textScope = "text";
  var contextualScope = "ctx";
  var defaultNodeFactory = (tagName) => (arg) => {
    if (arg == null) return { element: document.createElement(tagName), document, scope: htmlScope };
    return { element: arg.document.createElement(tagName), document: arg.document, scope: htmlScope };
  };
  var nodeFactory = (tagName, scope) => {
    if (scope == null) return defaultNodeFactory(tagName);
    switch (scope) {
      case htmlScope:
        return defaultNodeFactory(tagName);
      case svgScope:
        return (arg) => {
          if (arg == null) return { element: document.createElementNS(svgScope, tagName), document, scope: svgScope };
          return { element: arg.document.createElementNS(svgScope, tagName), document: arg.document, scope: svgScope };
        };
      case mathmlScope:
        return (arg) => {
          if (arg == null) return { element: document.createElementNS(mathmlScope, tagName), document, scope: mathmlScope };
          return { element: arg.document.createElementNS(mathmlScope, tagName), document: arg.document, scope: mathmlScope };
        };
      case textScope:
        return (arg) => {
          if (arg == null) return { element: document.createTextNode(tagName), document, scope: textScope };
          return { element: arg.document.createTextNode(tagName), document: arg.document, scope: textScope };
        };
      case contextualScope:
        return (arg) => {
          if (arg == null) return defaultNodeFactory(tagName)(arg);
          return nodeFactory(tagName, arg.scope)(arg);
        };
      default:
        return defaultNodeFactory(tagName);
    }
  };
  var deriveDOMTaskArg = (data2) => data2;
  var defaultConvert = (arg) => (data2) => {
    if (data2.scope === textScope) {
      data2.element.nodeValue = arg + "";
    } else {
      data2.element.appendChild(data2.document.createTextNode(arg + ""));
    }
    return data2;
  };
  var appendConnector = (filter2) => (data2) => {
    data2.element.appendChild(filter2(data2).element);
    return data2;
  };
  var prependConnector = (filter2) => (data2) => {
    data2.element.prepend(filter2(data2).element);
    return data2;
  };
  var prepend = (branch) => branch(prependConnector, deriveDOMTaskArg);
  var getElement = (query, container) => () => {
    const elt = container.querySelector(query);
    return elt == null ? null : {
      element: elt,
      document: elt.ownerDocument,
      scope: elt.namespaceURI ?? htmlScope
    };
  };
  var render = (lookup, ...tasks) => () => {
    const target = lookup();
    return target == null ? null : tasks.reduce((data2, task) => task(data2), target);
  };
  var domBranch = (args, tagName, isEmpty, scope) => (tConnect, tDerive) => tConnect(
    args.reduce((filter2, arg) => typeof arg === "function" ? arg.length == 1 ? (ctx) => arg(filter2(ctx)) : (ctx) => arg(isEmpty ? noConnector : appendConnector, deriveDOMTaskArg)(filter2(ctx)) : (ctx) => defaultConvert(arg)(filter2(ctx)), nodeFactory(tagName, scope)),
    tDerive
  );
  var domAdapter = (tagName, isEmpty, scope) => (...args) => domBranch(args, tagName, isEmpty, scope);
  var prop = (key, value) => value === void 0 ? (data2) => {
    data2.element[key] = null;
    return data2;
  } : typeof value === "function" ? (data2) => {
    data2.element[key] = value(data2.element[key]);
    return data2;
  } : (data2) => {
    data2.element[key] = value;
    return data2;
  };
  var getProp = (key, alias) => (data2) => [[alias || key, data2.element[key]]];
  var attr = (key, value) => value === void 0 ? (data2) => {
    data2.element.removeAttribute(key);
    return data2;
  } : typeof value === "function" ? (data2) => {
    data2.element.setAttribute(key, value(data2.element.getAttribute(key) ?? void 0));
    return data2;
  } : (data2) => {
    data2.element.setAttribute(key, value);
    return data2;
  };
  var getStyle = (key, alias) => (data2) => [[alias || key, data2.element.style[key]]];
  var subscribe = (eventType, listener, options) => (data2) => {
    data2.element.addEventListener(eventType, listener, options);
    return data2;
  };
  var unsubscribe = (eventType, listener, options) => (data2) => {
    data2.element.removeEventListener(eventType, listener, options);
    return data2;
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
  var textNode = domAdapter("", true, textScope);
  var div = domAdapter("div", false, htmlScope);
  var nav = domAdapter("nav", false, htmlScope);
  var a = (...args) => domBranch(args, "a", false, contextualScope);
  var className = (value) => attr("class", value);

  // myApp.ts
  var { p: p2, blockquote: blockquote2, h2: h22 } = adapters.html;
  var mainView = nav(
    className("site-nav"),
    div(
      className("trigger"),
      a(className("page-link"), attr("href", "/blog/"), "Blog"),
      a(
        className("page-link"),
        attr("href", "https://docs.genieacs.com/"),
        attr("target", "_blank"),
        textNode("Docs")
      ),
      a(
        className("page-link"),
        attr("href", "https://forum.genieacs.com/"),
        attr("target", "_blank"),
        textNode("Community")
      ),
      a(
        className("page-link"),
        attr("href", "/support/"),
        textNode("Support")
      )
    ),
    h22("My page title"),
    p2("This is a paragraph text", blockquote2("Super Citation"))
  );
  var renderApp = render(
    getElement("body", document),
    prepend(mainView)
  );
  renderApp();
})();
