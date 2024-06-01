(() => {
  // serenia.ts
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
  var appendAll = (...branches) => (data2) => branches.reduce((current, branch) => branch(appendConnector, deriveDOMTaskArg)(current), data2);
  var prependConnector = (filter2) => (data2) => {
    data2.element.prepend(filter2(data2).element);
    return data2;
  };
  var prepend = (branch) => branch(prependConnector, deriveDOMTaskArg);
  var getElement = (query2, container) => () => {
    const elt = container.querySelector(query2);
    return elt == null ? null : {
      element: elt,
      document: elt.ownerDocument,
      scope: elt.namespaceURI ?? htmlScope
    };
  };
  var fromElement = (element) => () => {
    return {
      element,
      document: element.ownerDocument,
      scope: element.namespaceURI ?? htmlScope
    };
  };
  var render = (lookup, ...tasks) => () => {
    const target = lookup();
    return target == null ? null : tasks.reduce((data2, task) => task(data2), target);
  };
  var detach = () => (data2) => {
    data2.element.parentNode?.removeChild(data2.element);
    return data2;
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
  var ref = (curator) => (data2) => {
    curator(() => data2);
    return data2;
  };
  var query = (curator, ...queryFilters) => (data2) => {
    queryFilters.forEach((filter2) => curator(filter2(data2)));
    return data2;
  };
  var domBranch = (args, tagName, isEmpty, scope) => (tConnect, tDerive) => tConnect(
    args.reduce((filter2, arg) => typeof arg === "function" ? arg.length == 1 ? (ctx) => arg(filter2(ctx)) : (ctx) => arg(isEmpty ? noConnector : appendConnector, deriveDOMTaskArg)(filter2(ctx)) : (ctx) => defaultConvert(arg)(filter2(ctx)), nodeFactory(tagName, scope)),
    tDerive
  );
  var domAdapter = (tagName, isEmpty, scope) => (...args) => domBranch(args, tagName, isEmpty, scope);
  var prop = (key, value2) => value2 === void 0 ? (data2) => {
    data2.element[key] = null;
    return data2;
  } : typeof value2 === "function" ? (data2) => {
    data2.element[key] = value2(data2.element[key]);
    return data2;
  } : (data2) => {
    data2.element[key] = value2;
    return data2;
  };
  var getProp = (key, alias) => (data2) => [alias || key, () => data2.element[key]];
  var attr = (key, value2) => value2 === void 0 ? (data2) => {
    data2.element.removeAttribute(key);
    return data2;
  } : typeof value2 === "function" ? (data2) => {
    data2.element.setAttribute(key, value2(data2.element.getAttribute(key) ?? void 0));
    return data2;
  } : (data2) => {
    data2.element.setAttribute(key, value2);
    return data2;
  };
  var getStyle = (key, alias) => (data2) => [alias || key, () => data2.element.style[key]];
  var subscribe = (eventType, listener, options) => (data2) => {
    data2.element.addEventListener(eventType, listener, options);
    return data2;
  };
  var unsubscribe = (eventType, listener, options) => (data2) => {
    data2.element.removeEventListener(eventType, listener, options);
    return data2;
  };
  var div = domAdapter("div", false, htmlScope);
  var h2 = domAdapter("h2", false, htmlScope);
  var input = domAdapter("input", true, htmlScope);
  var li = domAdapter("li", false, htmlScope);
  var span = domAdapter("span", false, htmlScope);
  var ul = domAdapter("ul", false, htmlScope);
  var className = (value2) => attr("class", value2);
  var type = (value2) => attr("type", value2);
  var placeholder = (value2) => attr("placeholder", value2);
  var value = (value2) => prop("value", value2);
  var getValue = (alias) => getProp("value", alias);
  var toggleClass = (name) => (data2) => {
    data2.element.classList.toggle(name);
    return data2;
  };
  var onClick = (listener, options) => subscribe("click", listener, options);
  var onChange = (listener, options) => subscribe("change", listener, options);

  // todoapp.ts
  var [todoItemsRef, todoItems] = createRef();
  var [todoInputRef, todoInput] = createRef();
  var [todoInputQueryRef, todoInputQuery] = createQuery();
  var todoItem = (task) => li(
    task,
    onClick((e) => render(fromElement(e.target), toggleClass("checked"))()),
    span(
      "\xD7",
      className("close"),
      onClick((e) => render(
        fromElement(e.target.parentElement),
        detach()
      )())
    )
  );
  var todoList = div(
    className("todo-container"),
    div(
      className("todo-header"),
      h2("My todo list"),
      input(
        type("text"),
        placeholder("Next task ..."),
        query(todoInputQueryRef, getValue()),
        ref(todoInputRef),
        onChange(() => appendNewItem())
      ),
      span(
        className("todo-add-btn"),
        "Add",
        onClick(() => appendNewItem())
      )
    ),
    ul(
      className("todo-items"),
      ref(todoItemsRef),
      appendAll(...Array.from({ length: 10 }, (_, i2) => i2 + 1).map(
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
