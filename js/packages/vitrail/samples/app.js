(() => {
  // myLib.ts
  var createDOMAdapter = (tagName, factory, connector, format) => (...args) => {
    const tasks = format(connector)(args).map((entry) => entry[0]);
    const build = (doc) => tasks.reduce((node, task) => task(node), factory(doc, tagName));
    return (connect) => connect(build);
  };
  var textNodeFactory = (doc, _) => [doc.createTextNode(""), doc];
  var htmlNodeFactory = (doc, tagName) => [doc.createElement(tagName), doc];
  var appendNodeConnector = (filter) => [
    (entry) => {
      entry[0].appendChild(filter(entry[1])[0]);
      return entry;
    }
  ];
  var prependNodeConnector = (filter) => [
    (entry) => {
      entry[0].prepend(filter(entry[1])[0]);
      return entry;
    }
  ];
  var noNodeConnector = (_) => [
    (entry) => entry
  ];
  var formatAdapterArgs = (connector) => (args) => args.filter((arg) => arg != null).map((arg) => {
    if (typeof arg === "function") return arg(connector);
    if (typeof arg === "string") return [
      (entry) => {
        if (entry[0] != null) {
          try {
            entry[0].appendChild(entry[1].createTextNode(arg));
          } catch (e) {
            entry[0].nodeValue = arg;
          }
        }
        return entry;
      }
    ];
    return arg;
  });
  var getElement = (query, container) => () => {
    const node = container.querySelector(query);
    return node == null ? null : [node, node.ownerDocument];
  };
  var render = (lookup, ...tasks) => () => {
    const target = lookup();
    return target == null ? target : tasks.map((task) => task[0]).reduce((node, task) => task(node), target);
  };
  var prepend = (branch) => branch(prependNodeConnector);
  var setAttr = (key, value) => [
    value === void 0 ? (entry) => {
      entry[0].removeAttribute(key);
      return entry;
    } : typeof value === "function" ? (entry) => {
      entry[0].setAttribute(key, value(entry[0].getAttribute(key)));
      return entry;
    } : (entry) => {
      entry[0].setAttribute(key, value);
      return entry;
    }
  ];
  var text = createDOMAdapter("", textNodeFactory, noNodeConnector, formatAdapterArgs);
  var div = createDOMAdapter("div", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var h2 = createDOMAdapter("h2", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var id = (value) => setAttr("id", value);

  // myApp.ts
  var mainView = div(
    id("main"),
    h2(text("Hello, World!"))
  );
  var renderApp = render(
    getElement("body", document),
    prepend(mainView)
  );
  renderApp();
})();
