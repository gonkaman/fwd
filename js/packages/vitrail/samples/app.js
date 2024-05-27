(() => {
  // myLib.ts
  var createDOMAdapter = (tagName, factory, connector, format) => (...args) => {
    console.log(args);
    const tasks = format(connector)(args).map((entry) => entry[0]);
    const build = (doc) => tasks.reduce((node, task) => task(node), factory(doc, tagName));
    return (connect) => connect(build);
  };
  var textNodeFactory = (doc, _) => [doc.createTextNode(""), doc];
  var htmlNodeFactory = (doc, tagName) => [doc.createElement(tagName), doc];
  var svgNodeFactory = (doc, tagName) => [doc.createElementNS("http://www.w3.org/2000/svg", tagName), doc];
  var appendNodeConnector = (filter2) => [
    (entry) => {
      entry[0].appendChild(filter2(entry[1])[0]);
      return entry;
    }
  ];
  var prependNodeConnector = (filter2) => [
    (entry) => {
      entry[0].prepend(filter2(entry[1])[0]);
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
  var a = createDOMAdapter("a", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var abbr = createDOMAdapter("abbr", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var address = createDOMAdapter("address", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var area = createDOMAdapter("area", htmlNodeFactory, noNodeConnector, formatAdapterArgs);
  var article = createDOMAdapter("article", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var aside = createDOMAdapter("aside", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var audio = createDOMAdapter("audio", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var b = createDOMAdapter("b", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var base = createDOMAdapter("base", htmlNodeFactory, noNodeConnector, formatAdapterArgs);
  var bdi = createDOMAdapter("bdi", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var bdo = createDOMAdapter("bdo", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var blockquote = createDOMAdapter("blockquote", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var body = createDOMAdapter("body", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var br = createDOMAdapter("br", htmlNodeFactory, noNodeConnector, formatAdapterArgs);
  var button = createDOMAdapter("button", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var canvas = createDOMAdapter("canvas", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var caption = createDOMAdapter("caption", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var cite = createDOMAdapter("cite", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var code = createDOMAdapter("code", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var col = createDOMAdapter("col", htmlNodeFactory, noNodeConnector, formatAdapterArgs);
  var colgroup = createDOMAdapter("colgroup", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var data = createDOMAdapter("data", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var datalist = createDOMAdapter("datalist", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var dd = createDOMAdapter("dd", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var del = createDOMAdapter("del", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var details = createDOMAdapter("details", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var dfn = createDOMAdapter("dfn", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var dialog = createDOMAdapter("dialog", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var div = createDOMAdapter("div", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var dl = createDOMAdapter("dl", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var dt = createDOMAdapter("dt", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var em = createDOMAdapter("em", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var embed = createDOMAdapter("embed", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var fieldset = createDOMAdapter("fieldset", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var figcaption = createDOMAdapter("figcaption", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var figure = createDOMAdapter("figure", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var footer = createDOMAdapter("footer", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var form = createDOMAdapter("form", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var h1 = createDOMAdapter("h1", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var h2 = createDOMAdapter("h2", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var h3 = createDOMAdapter("h3", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var h4 = createDOMAdapter("h4", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var h5 = createDOMAdapter("h5", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var h6 = createDOMAdapter("h6", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var head = createDOMAdapter("head", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var header = createDOMAdapter("header", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var hgroup = createDOMAdapter("hgroup", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var hr = createDOMAdapter("hr", htmlNodeFactory, noNodeConnector, formatAdapterArgs);
  var html = createDOMAdapter("html", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var i = createDOMAdapter("i", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var iframe = createDOMAdapter("iframe", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var img = createDOMAdapter("img", htmlNodeFactory, noNodeConnector, formatAdapterArgs);
  var input = createDOMAdapter("input", htmlNodeFactory, noNodeConnector, formatAdapterArgs);
  var ins = createDOMAdapter("ins", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var kbd = createDOMAdapter("kbd", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var label = createDOMAdapter("label", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var legend = createDOMAdapter("legend", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var li = createDOMAdapter("li", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var link = createDOMAdapter("link", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var main = createDOMAdapter("main", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var mark = createDOMAdapter("mark", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var menu = createDOMAdapter("menu", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var meta = createDOMAdapter("meta", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var meter = createDOMAdapter("meter", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var nav = createDOMAdapter("nav", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var noscript = createDOMAdapter("noscript", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var object = createDOMAdapter("object", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var ol = createDOMAdapter("ol", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var optgroup = createDOMAdapter("optgroup", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var option = createDOMAdapter("option", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var output = createDOMAdapter("output", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var p = createDOMAdapter("p", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var param = createDOMAdapter("param", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var picture = createDOMAdapter("picture", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var pre = createDOMAdapter("pre", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var progress = createDOMAdapter("progress", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var q = createDOMAdapter("q", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var rp = createDOMAdapter("rp", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var rt = createDOMAdapter("rt", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var ruby = createDOMAdapter("ruby", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var s = createDOMAdapter("s", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var samp = createDOMAdapter("samp", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var script = createDOMAdapter("script", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var search = createDOMAdapter("search", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var section = createDOMAdapter("section", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var select = createDOMAdapter("select", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var htmlSlot = createDOMAdapter("slot", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var small = createDOMAdapter("small", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var source = createDOMAdapter("source", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var span = createDOMAdapter("span", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var strong = createDOMAdapter("strong", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var style = createDOMAdapter("style", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var sub = createDOMAdapter("sub", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var summary = createDOMAdapter("summary", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var sup = createDOMAdapter("sup", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var table = createDOMAdapter("table", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var tbody = createDOMAdapter("tbody", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var td = createDOMAdapter("td", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var template = createDOMAdapter("template", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var textarea = createDOMAdapter("textarea", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var tfoot = createDOMAdapter("tfoot", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var th = createDOMAdapter("th", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var thead = createDOMAdapter("thead", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var tile = createDOMAdapter("tile", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var htmlTitle = createDOMAdapter("htmlTitle", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var tr = createDOMAdapter("tr", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var track = createDOMAdapter("track", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var u = createDOMAdapter("u", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var ul = createDOMAdapter("ul", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var htmlVar = createDOMAdapter("var", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var video = createDOMAdapter("video", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var wbr = createDOMAdapter("wbr", htmlNodeFactory, appendNodeConnector, formatAdapterArgs);
  var animateColor = createDOMAdapter("animateColor", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var animate = createDOMAdapter("animate", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var animateMotion = createDOMAdapter("animateMotion", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var animateTransform = createDOMAdapter("animateTransform", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var circle = createDOMAdapter("circle", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var clipPath = createDOMAdapter("clipPath", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var defs = createDOMAdapter("defs", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var desc = createDOMAdapter("desc", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var ellipse = createDOMAdapter("ellipse", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var feBlend = createDOMAdapter("feBlend", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var feColorMatrix = createDOMAdapter("feColorMatrix", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var feComponentTransfer = createDOMAdapter("feComponentTransfer", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var feComposite = createDOMAdapter("feComposite", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var feConvolveMatrix = createDOMAdapter("feConvolveMatrix", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var feDiffuseLighting = createDOMAdapter("feDiffuseLighting", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var feDisplacementMap = createDOMAdapter("feDisplacementMap", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var feDistantLight = createDOMAdapter("feDistantLight", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var feDropShadow = createDOMAdapter("feDropShadow", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var feFlood = createDOMAdapter("feFlood", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var feFuncA = createDOMAdapter("feFuncA", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var feFuncB = createDOMAdapter("feFuncB", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var feFuncG = createDOMAdapter("feFuncG", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var feFuncR = createDOMAdapter("feFuncR", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var feGaussianBlur = createDOMAdapter("feGaussianBlur", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var feImage = createDOMAdapter("feImage", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var feMerge = createDOMAdapter("feMerge", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var feMergeNode = createDOMAdapter("feMergeNode", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var feMorphology = createDOMAdapter("feMorphology", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var feOffset = createDOMAdapter("feOffset", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var fePointLight = createDOMAdapter("fePointLight", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var feSpecularLighting = createDOMAdapter("feSpecularLighting", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var feSpotLight = createDOMAdapter("feSpotLight", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var feTile = createDOMAdapter("feTile", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var feTurbulence = createDOMAdapter("feTurbulence", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var filter = createDOMAdapter("filter", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var g = createDOMAdapter("g", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var image = createDOMAdapter("image", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var line = createDOMAdapter("line", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var linearGradient = createDOMAdapter("linearGradient", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var marker = createDOMAdapter("marker", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var mask = createDOMAdapter("mask", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var metadata = createDOMAdapter("metadata", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var mpath = createDOMAdapter("mpath", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var path = createDOMAdapter("path", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var polygon = createDOMAdapter("polygon", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var polyline = createDOMAdapter("polyline", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var radialGradient = createDOMAdapter("radialGradient", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var rect = createDOMAdapter("rect", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var stop = createDOMAdapter("stop", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var svg = createDOMAdapter("svg", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var set = createDOMAdapter("set", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var svgA = createDOMAdapter("a", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var svgPattern = createDOMAdapter("svgPattern", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var svgScript = createDOMAdapter("svgScript", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var svgStyle = createDOMAdapter("svgStyle", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var svgSwitch = createDOMAdapter("svgSwitch", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var svgSymbol = createDOMAdapter("svgSymbol", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var svgText = createDOMAdapter("svgText", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var svgTitle = createDOMAdapter("svgTitle", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var textPath = createDOMAdapter("textPath", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var tspan = createDOMAdapter("tspan", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var use = createDOMAdapter("use", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var view = createDOMAdapter("view", svgNodeFactory, appendNodeConnector, formatAdapterArgs);
  var className = (value) => setAttr("class", value);

  // myApp.ts
  var mainView = nav(className("site-nav"), div(
    className("trigger"),
    a(
      className("page-link"),
      setAttr("href", "/blog/"),
      text("Blog")
    ),
    a(
      className("page-link"),
      setAttr("href", "https://docs.genieacs.com/"),
      setAttr("target", "_blank"),
      text("Docs")
    ),
    a(
      className("page-link"),
      setAttr("href", "https://forum.genieacs.com/"),
      setAttr("target", "_blank"),
      text("Community")
    ),
    a(
      className("page-link"),
      setAttr("href", "/support/"),
      text("Support")
    )
  ));
  var renderApp = render(
    getElement("body", document),
    prepend(mainView)
  );
  renderApp();
})();
