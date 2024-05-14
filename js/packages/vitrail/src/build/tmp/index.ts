import { parse } from "https://deno.land/std@0.217.0/flags/mod.ts";
import { resolve } from "https://deno.land/std@0.217.0/path/resolve.ts";
import { EntryMap, generateLibSource } from "./generator.ts";

//ugo output_file_path
//ugo --quiet/--verbose --directory scope_dir --name key_name  ouput_file_path 
//ugo --help


const flags = parse(Deno.args, {
    boolean: ["help","verbose", "quiet"],
    string: [ "directory", "name"],
    alias: {  
        "name": "n",
        "directory": "d",
        "help": "h", 
        "quiet": "q", 
        "verbose": "v"
    },
    default: { 
        "quiet": false,
        "verbose": false,
        "help": false
    }
});

const entryMap: EntryMap = {
  "adapter": {
    "text": {
      "key": "",
      "target": "Text",
      "type": "text",
      "parent": "Element",
      "name": "text",
      "childs": "undefined"
    },
    "a": {
      "target": "HTMLAnchorElement",
      "name": "a",
      "key": "a",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "abbr": {
      "name": "abbr",
      "key": "abbr",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "address": {
      "name": "address",
      "key": "address",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "area": {
      "target": "HTMLAreaElement",
      "childs": "undefined",
      "name": "area",
      "key": "area",
      "type": "html",
      "parent": "HTMLElement"
    },
    "article": {
      "name": "article",
      "key": "article",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "aside": {
      "name": "aside",
      "key": "aside",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "audio": {
      "target": "HTMLAudioElement",
      "name": "audio",
      "key": "audio",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "b": {
      "name": "b",
      "key": "b",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "base": {
      "target": "HTMLBaseElement",
      "childs": "undefined",
      "name": "base",
      "key": "base",
      "type": "html",
      "parent": "HTMLElement"
    },
    "bdi": {
      "name": "bdi",
      "key": "bdi",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "bdo": {
      "name": "bdo",
      "key": "bdo",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "blockquote": {
      "target": "HTMLQuoteElement",
      "name": "blockquote",
      "key": "blockquote",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "body": {
      "name": "body",
      "key": "body",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "br": {
      "target": "HTMLBRElement",
      "childs": "undefined",
      "name": "br",
      "key": "br",
      "type": "html",
      "parent": "HTMLElement"
    },
    "button": {
      "target": "HTMLButtonElement",
      "name": "button",
      "key": "button",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "canvas": {
      "target": "HTMLCanvasElement",
      "name": "canvas",
      "key": "canvas",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "caption": {
      "target": "HTMLTableCaptionElement",
      "name": "caption",
      "key": "caption",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "cite": {
      "target": "HTMLQuoteElement",
      "name": "cite",
      "key": "cite",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "code": {
      "name": "code",
      "key": "code",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "col": {
      "target": "HTMLTableColElement",
      "parent": "HTMLTableColElement",
      "childs": "undefined",
      "name": "col",
      "key": "col",
      "type": "html"
    },
    "colgroup": {
      "target": "HTMLTableColElement",
      "parent": "HTMLTableElement",
      "childs": "HTMLTableColElement",
      "name": "colgroup",
      "key": "colgroup",
      "type": "html"
    },
    "data": {
      "target": "HTMLDataElement",
      "name": "data",
      "key": "data",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "datalist": {
      "target": "HTMLDataListElement",
      "name": "datalist",
      "key": "datalist",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "dd": {
      "name": "dd",
      "key": "dd",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "del": {
      "target": "HTMLModElement",
      "name": "del",
      "key": "del",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "details": {
      "name": "details",
      "key": "details",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "dfn": {
      "name": "dfn",
      "key": "dfn",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "dialog": {
      "target": "HTMLDialogElement",
      "name": "dialog",
      "key": "dialog",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "div": {
      "target": "HTMLDivElement",
      "name": "div",
      "key": "div",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "dl": {
      "name": "dl",
      "key": "dl",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "dt": {
      "name": "dt",
      "key": "dt",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "em": {
      "name": "em",
      "key": "em",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "embed": {
      "target": "HTMLEmbedElement",
      "name": "embed",
      "key": "embed",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "fieldset": {
      "target": "HTMLFieldSetElement",
      "name": "fieldset",
      "key": "fieldset",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "figcaption": {
      "name": "figcaption",
      "key": "figcaption",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "figure": {
      "name": "figure",
      "key": "figure",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "footer": {
      "name": "footer",
      "key": "footer",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "form": {
      "target": "HTMLFormElement",
      "name": "form",
      "key": "form",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "h1": {
      "target": "HTMLHeadingElement",
      "name": "h1",
      "key": "h1",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "h2": {
      "target": "HTMLHeadingElement",
      "name": "h2",
      "key": "h2",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "h3": {
      "target": "HTMLHeadingElement",
      "name": "h3",
      "key": "h3",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "h4": {
      "target": "HTMLHeadingElement",
      "name": "h4",
      "key": "h4",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "h5": {
      "target": "HTMLHeadingElement",
      "name": "h5",
      "key": "h5",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "h6": {
      "target": "HTMLHeadingElement",
      "name": "h6",
      "key": "h6",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "head": {
      "target": "HTMLHeadElement",
      "name": "head",
      "key": "head",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "header": {
      "name": "header",
      "key": "header",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "hgroup": {
      "name": "hgroup",
      "key": "hgroup",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "hr": {
      "target": "HTMLHRElement",
      "childs": "undefined",
      "name": "hr",
      "key": "hr",
      "type": "html",
      "parent": "HTMLElement"
    },
    "html": {
      "parent": "undefined",
      "name": "html",
      "key": "html",
      "target": "HTMLElement",
      "type": "html",
      "childs": "Text | HTMLElement"
    },
    "i": {
      "name": "i",
      "key": "i",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "iframe": {
      "target": "HTMLIFrameElement",
      "name": "iframe",
      "key": "iframe",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "img": {
      "target": "HTMLImageElement",
      "childs": "undefined",
      "name": "img",
      "key": "img",
      "type": "html",
      "parent": "HTMLElement"
    },
    "input": {
      "target": "HTMLInputElement",
      "childs": "undefined",
      "name": "input",
      "key": "input",
      "type": "html",
      "parent": "HTMLElement"
    },
    "ins": {
      "target": "HTMLModElement",
      "name": "ins",
      "key": "ins",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "kbd": {
      "name": "kbd",
      "key": "kbd",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "label": {
      "target": "HTMLLabelElement",
      "name": "label",
      "key": "label",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "legend": {
      "target": "HTMLLegendElement",
      "name": "legend",
      "key": "legend",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "li": {
      "target": "HTMLLIElement",
      "name": "li",
      "key": "li",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "link": {
      "target": "HTMLLinkElement",
      "name": "link",
      "key": "link",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "main": {
      "name": "main",
      "key": "main",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "mark": {
      "name": "mark",
      "key": "mark",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "menu": {
      "target": "HTMLMenuElement",
      "name": "menu",
      "key": "menu",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "meta": {
      "name": "meta",
      "key": "meta",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "meter": {
      "target": "HTMLMeterElement",
      "name": "meter",
      "key": "meter",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "nav": {
      "name": "nav",
      "key": "nav",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "noscript": {
      "name": "noscript",
      "key": "noscript",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "object": {
      "target": "HTMLObjectElement",
      "name": "object",
      "key": "object",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "ol": {
      "target": "HTMLOListElement",
      "name": "ol",
      "key": "ol",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "optgroup": {
      "target": "HTMLOptGroupElement",
      "name": "optgroup",
      "key": "optgroup",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "option": {
      "target": "HTMLOptionElement",
      "name": "option",
      "key": "option",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "output": {
      "target": "HTMLOutputElement",
      "name": "output",
      "key": "output",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "p": {
      "target": "HTMLParagraphElement",
      "name": "p",
      "key": "p",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "param": {
      "target": "HTMLParagraphElement",
      "name": "param",
      "key": "param",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "picture": {
      "target": "HTMLPictureElement",
      "name": "picture",
      "key": "picture",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "pre": {
      "target": "HTMLPreElement",
      "name": "pre",
      "key": "pre",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "progress": {
      "target": "HTMLProgressElement",
      "name": "progress",
      "key": "progress",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "q": {
      "target": "HTMLQuoteElement",
      "name": "q",
      "key": "q",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "rp": {
      "name": "rp",
      "key": "rp",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "rt": {
      "name": "rt",
      "key": "rt",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "ruby": {
      "name": "ruby",
      "key": "ruby",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "s": {
      "name": "s",
      "key": "s",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "samp": {
      "name": "samp",
      "key": "samp",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "script": {
      "name": "script",
      "key": "script",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "search": {
      "name": "search",
      "key": "search",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "section": {
      "name": "section",
      "key": "section",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "select": {
      "target": "HTMLSelectElement",
      "name": "select",
      "key": "select",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "htmlSlot": {
      "key": "slot",
      "target": "HTMLSlotElement",
      "name": "htmlSlot",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "small": {
      "name": "small",
      "key": "small",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "source": {
      "target": "HTMLSourceElement",
      "name": "source",
      "key": "source",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "span": {
      "name": "span",
      "key": "span",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "strong": {
      "name": "strong",
      "key": "strong",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "style": {
      "name": "style",
      "key": "style",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "sub": {
      "name": "sub",
      "key": "sub",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "summary": {
      "name": "summary",
      "key": "summary",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "sup": {
      "name": "sup",
      "key": "sup",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "table": {
      "target": "HTMLTableElement",
      "name": "table",
      "key": "table",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "tbody": {
      "target": "HTMLTableSectionElement",
      "name": "tbody",
      "key": "tbody",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "td": {
      "key": "td",
      "target": "HTMLTableCellElement",
      "name": "td",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "template": {
      "target": "HTMLTemplateElement",
      "name": "template",
      "key": "template",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "textarea": {
      "target": "HTMLTextAreaElement",
      "name": "textarea",
      "key": "textarea",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "tfoot": {
      "target": "HTMLTableSectionElement",
      "name": "tfoot",
      "key": "tfoot",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "th": {
      "target": "HTMLTableCellElement",
      "name": "th",
      "key": "th",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "thead": {
      "target": "HTMLTableSectionElement",
      "name": "thead",
      "key": "thead",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "tile": {
      "target": "HTMLTimeElement",
      "name": "tile",
      "key": "tile",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "htmlTitle": {
      "target": "HTMLTitleElement",
      "name": "htmlTitle",
      "key": "htmlTitle",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "tr": {
      "target": "HTMLTableRowElement",
      "name": "tr",
      "key": "tr",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "track": {
      "target": "HTMLTrackElement",
      "name": "track",
      "key": "track",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "u": {
      "name": "u",
      "key": "u",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "ul": {
      "target": "HTMLUListElement",
      "name": "ul",
      "key": "ul",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "htmlVar": {
      "key": "var",
      "name": "htmlVar",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "video": {
      "target": "HTMLVideoElement",
      "name": "video",
      "key": "video",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "wbr": {
      "name": "wbr",
      "key": "wbr",
      "target": "HTMLElement",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    }
  },
  "attribute": {
    "id": {
      "name": "id",
      "target": "Element",
      "key": "id"
    },
    "accesskey": {
      "name": "accesskey",
      "target": "Element",
      "key": "accesskey"
    },
    "autocapitalize": {
      "name": "autocapitalize",
      "target": "Element",
      "key": "autocapitalize"
    },
    "autofocus": {
      "name": "autofocus",
      "target": "Element",
      "key": "autofocus"
    },
    "enterkeyhint": {
      "name": "enterkeyhint",
      "target": "Element",
      "key": "enterkeyhint"
    },
    "exportparts": {
      "name": "exportparts",
      "target": "Element",
      "key": "exportparts"
    },
    "hidden": {
      "name": "hidden",
      "target": "Element",
      "key": "hidden"
    },
    "inert": {
      "name": "inert",
      "target": "Element",
      "key": "inert"
    },
    "inputmode": {
      "name": "inputmode",
      "target": "Element",
      "key": "inputmode"
    },
    "is": {
      "name": "is",
      "target": "Element",
      "key": "is"
    },
    "nonce": {
      "name": "nonce",
      "target": "Element",
      "key": "nonce"
    },
    "part": {
      "name": "part",
      "target": "Element",
      "key": "part"
    },
    "popover": {
      "name": "popover",
      "target": "Element",
      "key": "popover"
    },
    "slot": {
      "name": "slot",
      "target": "Element",
      "key": "slot"
    },
    "spellcheck": {
      "name": "spellcheck",
      "target": "Element",
      "key": "spellcheck"
    },
    "translate": {
      "name": "translate",
      "target": "Element",
      "key": "translate"
    },
    "className": {
      "name": "className",
      "key": "class",
      "target": "Element"
    },
    "title": {
      "name": "title",
      "target": "HTMLElement",
      "key": "title"
    },
    "tabIndex": {
      "name": "tabIndex",
      "target": "HTMLElement",
      "key": "tabIndex"
    },
    "lang": {
      "name": "lang",
      "target": "HTMLElement",
      "key": "lang"
    },
    "dir": {
      "name": "dir",
      "target": "HTMLElement",
      "key": "dir"
    },
    "draggable": {
      "name": "draggable",
      "target": "HTMLElement",
      "key": "draggable"
    },
    "itemid": {
      "name": "itemid",
      "target": "HTMLElement",
      "key": "itemid"
    },
    "itemprop": {
      "name": "itemprop",
      "target": "HTMLElement",
      "key": "itemprop"
    },
    "itemref": {
      "name": "itemref",
      "target": "HTMLElement",
      "key": "itemref"
    },
    "itemscope": {
      "name": "itemscope",
      "target": "HTMLElement",
      "key": "itemscope"
    },
    "itemtype": {
      "name": "itemtype",
      "target": "HTMLElement",
      "key": "itemtype"
    },
    "crossorigin": {
      "name": "crossorigin",
      "target": "HTMLElement",
      "key": "crossorigin"
    },
    "disabled": {
      "name": "disabled",
      "target": "HTMLElement",
      "key": "disabled"
    },
    "elementtiming": {
      "name": "elementtiming",
      "target": "HTMLElement",
      "key": "elementtiming"
    },
    "max": {
      "name": "max",
      "target": "HTMLElement",
      "key": "max"
    },
    "min": {
      "name": "min",
      "target": "HTMLElement",
      "key": "min"
    },
    "step": {
      "target": "HTMLInputElement",
      "name": "step",
      "key": "step"
    },
    "type": {
      "target": "HTMLInputElement",
      "name": "type",
      "key": "type"
    },
    "accept": {
      "target": "HTMLInputElement",
      "name": "accept",
      "key": "accept"
    },
    "capture": {
      "target": "HTMLInputElement",
      "name": "capture",
      "key": "capture"
    },
    "pattern": {
      "target": "HTMLInputElement",
      "name": "pattern",
      "key": "pattern"
    },
    "placeholder": {
      "target": "HTMLInputElement",
      "name": "placeholder",
      "key": "placeholder"
    },
    "for": {
      "target": "HTMLLabelElement | HTMLOutputElement",
      "name": "$for",
      "key": "for"
    },
    "size": {
      "target": "HTMLInputElement | HTMLSelectElement",
      "name": "size",
      "key": "size"
    },
    "dirname": {
      "target": "HTMLInputElement | HTMLTextAreaElement",
      "name": "dirname",
      "key": "dirname"
    },
    "multiple": {
      "target": "HTMLInputElement | HTMLTextAreaElement",
      "name": "multiple",
      "key": "multiple"
    },
    "readonly": {
      "target": "HTMLInputElement | HTMLTextAreaElement",
      "name": "readonly",
      "key": "readonly"
    },
    "maxlength": {
      "target": "HTMLInputElement | HTMLTextAreaElement",
      "name": "maxlength",
      "key": "maxlength"
    },
    "minlength": {
      "target": "HTMLInputElement | HTMLTextAreaElement",
      "name": "minlength",
      "key": "minlength"
    },
    "required": {
      "target": "HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement",
      "name": "required",
      "key": "required"
    },
    "rel": {
      "target": "HTMLAnchorElement | HTMLAreaElement | HTMLLinkElement | HTMLFormElement",
      "name": "rel",
      "key": "rel"
    },
    "autocomplete": {
      "target": "HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLFormElement",
      "name": "autocomplete",
      "key": "autocomplete"
    }
  },
  "property": {
    "nodeValue": {
      "target": "Node",
      "name": "nodeValue",
      "key": "nodeValue"
    },
    "textContent": {
      "target": "Node",
      "name": "textContent",
      "key": "textContent"
    },
    "innerHTML": {
      "name": "innerHTML",
      "target": "Element",
      "key": "innerHTML"
    },
    "outerHTML": {
      "name": "outerHTML",
      "target": "Element",
      "key": "outerHTML"
    }
  },
  "query": {
    "getId": {
      "name": "getId",
      "key": "id",
      "target": "Element",
      "getter": "getAttr"
    },
    "getAccesskey": {
      "name": "getAccesskey",
      "key": "accesskey",
      "target": "Element",
      "getter": "getAttr"
    },
    "getAutocapitalize": {
      "name": "getAutocapitalize",
      "key": "autocapitalize",
      "target": "Element",
      "getter": "getAttr"
    },
    "getAutofocus": {
      "name": "getAutofocus",
      "key": "autofocus",
      "target": "Element",
      "getter": "getAttr"
    },
    "getEnterkeyhint": {
      "name": "getEnterkeyhint",
      "key": "enterkeyhint",
      "target": "Element",
      "getter": "getAttr"
    },
    "getExportparts": {
      "name": "getExportparts",
      "key": "exportparts",
      "target": "Element",
      "getter": "getAttr"
    },
    "getHidden": {
      "name": "getHidden",
      "key": "hidden",
      "target": "Element",
      "getter": "getAttr"
    },
    "getInert": {
      "name": "getInert",
      "key": "inert",
      "target": "Element",
      "getter": "getAttr"
    },
    "getInputmode": {
      "name": "getInputmode",
      "key": "inputmode",
      "target": "Element",
      "getter": "getAttr"
    },
    "getIs": {
      "name": "getIs",
      "key": "is",
      "target": "Element",
      "getter": "getAttr"
    },
    "getNonce": {
      "name": "getNonce",
      "key": "nonce",
      "target": "Element",
      "getter": "getAttr"
    },
    "getPart": {
      "name": "getPart",
      "key": "part",
      "target": "Element",
      "getter": "getAttr"
    },
    "getPopover": {
      "name": "getPopover",
      "key": "popover",
      "target": "Element",
      "getter": "getAttr"
    },
    "getSlot": {
      "name": "getSlot",
      "key": "slot",
      "target": "Element",
      "getter": "getAttr"
    },
    "getSpellcheck": {
      "name": "getSpellcheck",
      "key": "spellcheck",
      "target": "Element",
      "getter": "getAttr"
    },
    "getTranslate": {
      "name": "getTranslate",
      "key": "translate",
      "target": "Element",
      "getter": "getAttr"
    },
    "getClassName": {
      "name": "getClassName",
      "key": "class",
      "target": "Element",
      "getter": "getAttr"
    },
    "getNodeValue": {
      "name": "getNodeValue",
      "key": "nodeValue",
      "target": "Node",
      "getter": "getProp"
    },
    "getTextContent": {
      "name": "getTextContent",
      "key": "textContent",
      "target": "Node",
      "getter": "getProp"
    },
    "getInnerHTML": {
      "name": "getInnerHTML",
      "key": "innerHTML",
      "target": "Element",
      "getter": "getProp"
    },
    "getOuterHTML": {
      "name": "getOuterHTML",
      "key": "outerHTML",
      "target": "Element",
      "getter": "getProp"
    },
    "nodeName": {
      "target": "Node",
      "name": "nodeName",
      "key": "nodeName",
      "getter": "getProp"
    },
    "nodeType": {
      "target": "Node",
      "name": "nodeType",
      "key": "nodeType",
      "getter": "getProp"
    },
    "clientHeight": {
      "name": "clientHeight",
      "target": "Element",
      "key": "clientHeight",
      "getter": "getProp"
    },
    "clientLeft": {
      "name": "clientLeft",
      "target": "Element",
      "key": "clientLeft",
      "getter": "getProp"
    },
    "clientTop": {
      "name": "clientTop",
      "target": "Element",
      "key": "clientTop",
      "getter": "getProp"
    },
    "clientWidth": {
      "name": "clientWidth",
      "target": "Element",
      "key": "clientWidth",
      "getter": "getProp"
    },
    "tagName": {
      "name": "tagName",
      "target": "Element",
      "key": "tagName",
      "getter": "getProp"
    },
    "getTitle": {
      "name": "getTitle",
      "key": "title",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "getTabIndex": {
      "name": "getTabIndex",
      "key": "tabIndex",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "getLang": {
      "name": "getLang",
      "key": "lang",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "getDir": {
      "name": "getDir",
      "key": "dir",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "getDraggable": {
      "name": "getDraggable",
      "key": "draggable",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "getItemid": {
      "name": "getItemid",
      "key": "itemid",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "getItemprop": {
      "name": "getItemprop",
      "key": "itemprop",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "getItemref": {
      "name": "getItemref",
      "key": "itemref",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "getItemscope": {
      "name": "getItemscope",
      "key": "itemscope",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "getItemtype": {
      "name": "getItemtype",
      "key": "itemtype",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "getCrossorigin": {
      "name": "getCrossorigin",
      "key": "crossorigin",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "getDisabled": {
      "name": "getDisabled",
      "key": "disabled",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "getElementtiming": {
      "name": "getElementtiming",
      "key": "elementtiming",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "getMax": {
      "name": "getMax",
      "key": "max",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "getMin": {
      "name": "getMin",
      "key": "min",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "getStep": {
      "name": "getStep",
      "key": "step",
      "target": "HTMLInputElement",
      "getter": "getAttr"
    },
    "getType": {
      "name": "getType",
      "key": "type",
      "target": "HTMLInputElement",
      "getter": "getAttr"
    },
    "getAccept": {
      "name": "getAccept",
      "key": "accept",
      "target": "HTMLInputElement",
      "getter": "getAttr"
    },
    "getCapture": {
      "name": "getCapture",
      "key": "capture",
      "target": "HTMLInputElement",
      "getter": "getAttr"
    },
    "getPattern": {
      "name": "getPattern",
      "key": "pattern",
      "target": "HTMLInputElement",
      "getter": "getAttr"
    },
    "getPlaceholder": {
      "name": "getPlaceholder",
      "key": "placeholder",
      "target": "HTMLInputElement",
      "getter": "getAttr"
    },
    "getFor": {
      "name": "getFor",
      "key": "for",
      "target": "HTMLLabelElement | HTMLOutputElement",
      "getter": "getAttr"
    },
    "getSize": {
      "name": "getSize",
      "key": "size",
      "target": "HTMLInputElement | HTMLSelectElement",
      "getter": "getAttr"
    },
    "getDirname": {
      "name": "getDirname",
      "key": "dirname",
      "target": "HTMLInputElement | HTMLTextAreaElement",
      "getter": "getAttr"
    },
    "getMultiple": {
      "name": "getMultiple",
      "key": "multiple",
      "target": "HTMLInputElement | HTMLTextAreaElement",
      "getter": "getAttr"
    },
    "getReadonly": {
      "name": "getReadonly",
      "key": "readonly",
      "target": "HTMLInputElement | HTMLTextAreaElement",
      "getter": "getAttr"
    },
    "getMaxlength": {
      "name": "getMaxlength",
      "key": "maxlength",
      "target": "HTMLInputElement | HTMLTextAreaElement",
      "getter": "getAttr"
    },
    "getMinlength": {
      "name": "getMinlength",
      "key": "minlength",
      "target": "HTMLInputElement | HTMLTextAreaElement",
      "getter": "getAttr"
    },
    "getRequired": {
      "name": "getRequired",
      "key": "required",
      "target": "HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement",
      "getter": "getAttr"
    },
    "getRel": {
      "name": "getRel",
      "key": "rel",
      "target": "HTMLAnchorElement | HTMLAreaElement | HTMLLinkElement | HTMLFormElement",
      "getter": "getAttr"
    },
    "getAutocomplete": {
      "name": "getAutocomplete",
      "key": "autocomplete",
      "target": "HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLFormElement",
      "getter": "getAttr"
    }
  },
  "action": {
    "addClass": {
      "target": "Element",
      "callPath": "classList.add",
      "arguments": [
        {
          "name": "name",
          "type": "string",
          "optional": false
        }
      ],
      "name": "addClass"
    },
    "removeClass": {
      "target": "Element",
      "callPath": "classList.remove",
      "arguments": [
        {
          "name": "name",
          "type": "string",
          "optional": false
        }
      ],
      "name": "removeClass"
    },
    "toggleClass": {
      "target": "Element",
      "callPath": "classList.toggle",
      "arguments": [
        {
          "name": "name",
          "type": "string",
          "optional": false
        }
      ],
      "name": "toggleClass"
    },
    "dispatch": {
      "target": "EventTarget",
      "callPath": "dispatchEvent",
      "arguments": [
        {
          "name": "event",
          "type": "Event",
          "optional": false
        }
      ],
      "name": "dispatch"
    }
  },
  "event": {
    "click": {
      "name": "onClick",
      "key": "click",
      "target": "EventTarget"
    },
    "dbClick": {
      "name": "onDbClick",
      "key": "dbclick",
      "target": "EventTarget"
    },
    "blur": {
      "name": "onBlur",
      "key": "blur",
      "target": "EventTarget"
    },
    "focus": {
      "name": "onFocus",
      "key": "focus",
      "target": "EventTarget"
    },
    "change": {
      "name": "onChange",
      "key": "change",
      "target": "EventTarget"
    },
    "mouseDown": {
      "name": "onMouseDown",
      "key": "mousedown",
      "target": "EventTarget"
    },
    "mouseEnter": {
      "name": "onMouseEnter",
      "key": "mouseenter",
      "target": "EventTarget"
    },
    "mouseLeave": {
      "name": "onMouseLeave",
      "key": "mouseleave",
      "target": "EventTarget"
    },
    "mouseMove": {
      "name": "onMouseMove",
      "key": "mousemove",
      "target": "EventTarget"
    },
    "mouseOut": {
      "name": "onMouseOut",
      "key": "mouseout",
      "target": "EventTarget"
    },
    "mouseOver": {
      "name": "onMouseOver",
      "key": "mouseover",
      "target": "EventTarget"
    },
    "mouseUp": {
      "name": "onMouseUp",
      "key": "mouseup",
      "target": "EventTarget"
    },
    "wheel": {
      "name": "onWheel",
      "key": "wheel",
      "target": "EventTarget"
    },
    "scroll": {
      "name": "onScroll",
      "key": "scroll",
      "target": "EventTarget"
    },
    "keyDown": {
      "name": "onKeyDown",
      "key": "keydown",
      "target": "EventTarget"
    },
    "keyPress": {
      "name": "onKeyPress",
      "key": "keypress",
      "target": "EventTarget"
    },
    "keyUp": {
      "name": "onKeyUp",
      "key": "keyup",
      "target": "EventTarget"
    },
    "copy": {
      "name": "onCopy",
      "key": "copy",
      "target": "EventTarget"
    },
    "cut": {
      "name": "onCut",
      "key": "cut",
      "target": "EventTarget"
    },
    "paste": {
      "name": "onPaste",
      "key": "paste",
      "target": "EventTarget"
    },
    "select": {
      "name": "onSelect",
      "key": "select",
      "target": "EventTarget"
    },
    "focusIn": {
      "name": "onFocusIn",
      "key": "focusin",
      "target": "EventTarget"
    },
    "focusOut": {
      "name": "onFocusOut",
      "key": "focusout",
      "target": "EventTarget"
    }
  },
  "provided": {
    "Filter": {
      "name": "Filter",
      "deps": [],
      "body": "export type Filter<U,V> = (arg: U) => V;"
    },
    "Task": {
      "name": "Task",
      "deps": [
        "Filter"
      ],
      "body": "export type Task<T> = [Filter<T,T>, ...string[]];"
    },
    "Connector": {
      "name": "Connector",
      "deps": [
        "Task"
      ],
      "body": "export type Connector<TParent,TArg,TChild> = <T extends TParent, U extends TArg, V extends TChild>(filter: Filter<U,V>) => Task<T>"
    },
    "Branch": {
      "name": "Branch",
      "deps": [
        "Task"
      ],
      "body": "export type Branch<TParent,U,V> = <T extends TParent>(connect: ((filter: Filter<U,V>) => Task<T>)) => Task<T>;"
    },
    "Adapter": {
      "name": "Adapter",
      "deps": [
        "Task",
        "Branch"
      ],
      "body": "export type Adapter<TParent, U, T, TConvert> = <K extends TConvert>(...args: (Task<T> | K)[]) => Branch<TParent,U,T>;"
    },
    "NodeTask": {
      "name": "NodeTask",
      "deps": [
        "Task"
      ],
      "body": "export type NodeTask<T,U> = Task<[T,U]>;"
    },
    "NodeFactory": {
      "name": "NodeFactory",
      "deps": [],
      "body": "export type NodeFactory<PDoc,TNode,TDoc> = <TArg extends PDoc, T extends TNode, U extends TDoc>(doc: TArg, tag: string) => [T,U];"
    },
    "NodeConnector": {
      "name": "NodeConnector",
      "deps": [
        "Connector"
      ],
      "body": "export type NodeConnector<T,TDoc,V,VDoc> = Connector<[T,TDoc],TDoc,[V,VDoc]>;"
    },
    "NodeBranch": {
      "name": "NodeBranch",
      "deps": [
        "Branch"
      ],
      "body": "export type NodeBranch<TNode,TDoc,TChild,VDoc> = Branch<[TNode,TDoc],TDoc,[TChild,VDoc]>;"
    },
    "NodeAdapterArg": {
      "name": "NodeAdapterArg",
      "deps": [
        "NodeTask",
        "NodeBranch"
      ],
      "body": "export type NodeAdapterArg<T,TDoc,V,VDoc,TConvert> = (NodeTask<T,TDoc> | TConvert | NodeBranch<T,TDoc,V,VDoc>)[];"
    },
    "NodeAdapterArgsFormater": {
      "name": "NodeAdapterArgsFormater",
      "deps": [
        "NodeConnector",
        "NodeAdapterArg",
        "NodeTask"
      ],
      "body": "export type NodeAdapterArgsFormater<TNode,TDoc,TChild, VDoc, TConvert> = \n    <T extends TNode, V extends TChild>(connector: NodeConnector<T,TDoc,V,VDoc>) => (args: NodeAdapterArg<T,TDoc,V,VDoc,TConvert>) => NodeTask<T,TDoc>[];"
    },
    "NodeAdapter": {
      "name": "NodeAdapter",
      "deps": [
        "Adapter",
        "NodeBranch"
      ],
      "body": "export type NodeAdapter<P,PDoc,T,TDoc,V,VDoc,TConvert> = Adapter<[P,PDoc],PDoc,[T,TDoc],TConvert | NodeBranch<T,TDoc,V,VDoc>>;"
    },
    "createDOMAdapter": {
      "name": "createDOMAdapter",
      "deps": [
        "NodeFactory",
        "NodeConnector",
        "NodeAdapterArgsFormater",
        "NodeAdapter",
        "NodeAdapterArg",
        "NodeBranch"
      ],
      "body": "const createDOMAdapter = <P,PDoc,T,TDoc,V,VDoc,TConvert>(\n    tagName: string,\n    factory: NodeFactory<PDoc,T,TDoc>, \n    connector: NodeConnector<T,TDoc,V,VDoc>,\n    format: NodeAdapterArgsFormater<T,TDoc,V,VDoc,TConvert>\n): NodeAdapter<P,PDoc,T,TDoc,V,VDoc,TConvert> => \n    (...args: NodeAdapterArg<T,TDoc,V,VDoc,TConvert>): NodeBranch<P,PDoc,T,TDoc> => {\n        const tasks = format(connector)(args).map(entry => entry[0]);\n        const build: Filter<PDoc,[T,TDoc]> = (doc: PDoc) => tasks.reduce((node, task) => task(node), factory(doc, tagName));\n        return <TParent extends [P,PDoc]>(connect: ((filter: Filter<PDoc,[T,TDoc]>) => Task<TParent>)):Task<TParent> => connect(build);\n    }"
    },
    "Lookup": {
      "name": "Lookup",
      "deps": [
        "Filter"
      ],
      "body": "export type Lookup<T> = Filter<void,T|null|undefined>;"
    },
    "Curator": {
      "name": "Curator",
      "deps": [
        "Lookup"
      ],
      "body": "export type Curator<T> = (lookup: Lookup<T>) => void;"
    },
    "Store": {
      "name": "Store",
      "deps": [
        "Curator",
        "Lookup"
      ],
      "body": "export type Store<T> = [Curator<T>, Lookup<T>];"
    },
    "Query": {
      "name": "Query",
      "deps": [
        "Store"
      ],
      "body": "export type Query = Store<[string, unknown][]>;"
    },
    "NodePicker": {
      "name": "NodePicker",
      "deps": [
        "Lookup"
      ],
      "body": "export type NodePicker<T,U> = Lookup<[T,U]>;"
    },
    "NodeRenderer": {
      "name": "NodeRenderer",
      "deps": [
        "NodePicker",
        "NodeTask"
      ],
      "body": "export type NodeRenderer<TNode,TDoc> = <T extends TNode, U extends TDoc>(lookup: NodePicker<T,U>, ...tasks: NodeTask<T,U>[]) => NodePicker<T,U>;"
    },
    "textNodeFactory": {
      "name": "textNodeFactory",
      "deps": [
        "NodeFactory"
      ],
      "body": "const textNodeFactory: NodeFactory<Document | XMLDocument, Text, Document> = <T extends Text, U extends Document>(doc: Document, _: string) => \n    [doc.createTextNode('') as T, doc as U];"
    },
    "htmlNodeFactory": {
      "name": "htmlNodeFactory",
      "deps": [
        "NodeFactory"
      ],
      "body": "const htmlNodeFactory: NodeFactory<Document, HTMLElement, Document> = <T extends HTMLElement, U extends Document>(doc: Document, tagName: string) => \n    [doc.createElement(tagName) as T, doc as U];"
    },
    "svgNodeFactory": {
      "name": "svgNodeFactory",
      "deps": [
        "NodeFactory"
      ],
      "body": "const svgNodeFactory: NodeFactory<Document, SVGElement, XMLDocument> = <T extends SVGElement, U extends XMLDocument>(doc: XMLDocument, tagName: string) => \n    [doc.createElementNS(\"http://www.w3.org/2000/svg\", tagName) as T, doc as U];"
    },
    "mathmlNodeFactory": {
      "name": "mathmlNodeFactory",
      "deps": [
        "NodeFactory"
      ],
      "body": "const mathmlNodeFactory: NodeFactory<Document, MathMLElement, XMLDocument> = <T extends MathMLElement, U extends XMLDocument>(doc: XMLDocument, tagName: string) => \n    [doc.createElementNS(\"http://www.w3.org/1998/Math/MathML\", tagName) as T, doc as U];"
    },
    "appendNodeConnector": {
      "name": "appendNodeConnector",
      "deps": [
        "NodeConnector"
      ],
      "body": "const appendNodeConnector: NodeConnector<Node, Document, Node, Document> = \n    <T extends [Node, Document], TArg extends Document, V extends [Node,Document]>(filter: Filter<TArg,V>): Task<T> => [\n        (entry: T) => {\n            entry[0].appendChild(filter(entry[1] as TArg)[0]);\n            return entry;\n        }\n    ];"
    },
    "prependNodeConnector": {
      "name": "prependNodeConnector",
      "deps": [
        "NodeConnector"
      ],
      "body": "const prependNodeConnector: NodeConnector<Element, Document, Node, Document> = \n    <T extends [Element, Document], TArg extends Document, V extends [Node,Document]>(filter: Filter<TArg,V>): Task<T> => [\n        (entry: T) => {\n            entry[0].prepend(filter(entry[1] as TArg)[0]);\n            return entry;\n        }\n    ];"
    },
    "noNodeConnector": {
      "name": "noNodeConnector",
      "deps": [
        "NodeConnector"
      ],
      "body": "const noNodeConnector: NodeConnector<Node, Document, Node | undefined, Document> = \n    <T extends [Node, Document], U extends Document, V extends [Node | undefined, Document]>(_: Filter<U,V>): Task<T> => [\n        (entry: T) => entry\n    ];"
    },
    "formatAdapterArgs": {
      "name": "formatAdapterArgs",
      "deps": [
        "NodeAdapterArgsFormater"
      ],
      "body": "const formatAdapterArgs: NodeAdapterArgsFormater<Node | undefined, Document, Node | undefined, Document, string | undefined> = \n    <T extends Node | undefined, V extends Node | undefined>(connector: NodeConnector<T,Document,V,Document>) => \n    (args: NodeAdapterArg<T,Document,V,Document,string | undefined>): NodeTask<T,Document>[] => \n        (args.filter(arg => arg != null) as NodeAdapterArg<T,Document,V,Document,string>).map(arg => {\n            if(typeof arg === 'function') return arg(connector);\n            if(typeof arg === 'string') return [\n                (entry: [T,Document]) => {\n                    if(entry[0] != null){\n                        try{\n                            entry[0].appendChild(entry[1].createTextNode(arg));\n                        }catch(e){\n                            entry[0].nodeValue = arg; \n                        }\n                    }\n                    return entry;\n                }\n            ];\n            return arg;\n        });"
    },
    "getElement": {
      "name": "getElement",
      "deps": [
        "NodePicker"
      ],
      "body": "export const getElement = <T extends Element, U extends Document>(query: string, container: Document | Element): NodePicker<T,U> => () => {\n    const node = container.querySelector(query);\n    return node == null ? null : [node as T, node.ownerDocument as U];\n}"
    },
    "fromElement": {
      "name": "fromElement",
      "deps": [
        "NodePicker"
      ],
      "body": "export const fromElement = <T extends Element, U extends Document>(node: Element): NodePicker<T,U> => () => [node as T,node.ownerDocument as U];"
    },
    "render": {
      "name": "render",
      "deps": [
        "NodeRenderer"
      ],
      "body": "export const render : NodeRenderer<Element,Document> = <T extends Element, U extends Document>( lookup: NodePicker<T,U>, ...tasks: NodeTask<T,U>[]): NodePicker<T,U> => () => {\n    const target = lookup();\n    return target == null ? target : tasks.map(task => task[0]).reduce((node, task) => task(node), target);\n}"
    },
    "createRef": {
      "name": "createRef",
      "deps": [
        "Store"
      ],
      "body": "export const createRef = <T extends Node,U extends Document>(): Store<[T,U]> => {\n    let innerLookup: Lookup<[T,U]> = () => null;\n    return [\n        (lookup: Lookup<[T,U]>) => { innerLookup = lookup; },\n        () => innerLookup()\n    ];\n}"
    },
    "createQuery": {
      "name": "createQuery",
      "deps": [
        "Query"
      ],
      "body": "export const createQuery = (): Query => {\n    const registeredLookups: Lookup<[string, unknown][]>[] = [];\n    return [\n        (lookup: Lookup<[string, unknown][]>) => { registeredLookups.push(lookup); },\n        () => registeredLookups.reduce((entries: [string, unknown][], lookup) => entries.concat(lookup() ?? []), [])\n    ]\n}"
    },
    "store": {
      "name": "store",
      "deps": [
        "Curator",
        "NodeTask"
      ],
      "body": "export const store = <T extends Node,U extends Document>(curator: Curator<[T,U]>): NodeTask<T,U> => [\n    (entry: [T,U]) => {\n        curator(() => entry);\n        return entry;\n    }\n]"
    },
    "query": {
      "name": "query",
      "deps": [
        "Curator",
        "NodeTask"
      ],
      "body": "export const query = <T extends Node,U extends Document>(curator: Curator<[string, unknown][]>, ...queries: Filter<[T,U],[string, unknown][]>[]): NodeTask<T,U> => [\n    (entry: [T,U]) => {\n        curator(() => queries.reduce((entries: [string, unknown][], query) => entries.concat(query(entry)), []));\n        return entry;\n    }\n]"
    },
    "apply": {
      "name": "apply",
      "deps": [
        "NodeTask"
      ],
      "body": "export const apply = <T extends Node, U extends Document>(action: ((tnode: T, udoc: U) => [T,U])): NodeTask<T,U> => [\n    (entry: [T,U]) => action(...entry)\n]"
    },
    "elementFactory": {
      "name": "elementFactory",
      "deps": [
        "htmlNodeFactory",
        "svgNodeFactory",
        "mathmlNodeFactory"
      ],
      "body": "const elementFactory = <T extends Element, U extends Document>(doc: Document, tagName: string | [string,string]) => {\n    if(typeof tagName === 'string') return htmlNodeFactory(doc, tagName) as unknown as [T,U];\n    switch(tagName[1]){\n        case 'svg': return svgNodeFactory(doc, tagName[0]) as unknown as [T,U];\n        case 'mathml': return mathmlNodeFactory(doc, tagName[0]) as unknown as [T,U];\n        default: return htmlNodeFactory(doc, tagName[0]) as unknown as [T,U];\n    }\n}"
    },
    "element": {
      "name": "element",
      "deps": [
        "NodeAdapterArg",
        "elementFactory",
        "formatAdapterArgs",
        "appendNodeConnector"
      ],
      "body": "export const element = <T extends Element>(\n    tagName: string | [string,string], \n    ...args: NodeAdapterArg<T,Document,Node,Document,string | undefined>\n): NodeBranch<Element,Document,Element,Document> => {\n    const tasks = formatAdapterArgs<T,Node>(appendNodeConnector)(args).map(entry => entry[0]);\n    const build: Filter<Document,[T,Document]> = (doc: Document) => tasks.reduce((node, task) => task(node), elementFactory<T,Document>(doc, tagName));\n    return <TParent extends [Element,Document]>(connect: ((filter: Filter<Document,[T,Document]>) => Task<TParent>)):Task<TParent> => connect(build);\n}"
    },
    "append": {
      "name": "append",
      "deps": [
        "NodeBranch",
        "appendNodeConnector"
      ],
      "body": "export const append = <T extends Node, U extends Document>(branch: NodeBranch<T,U,Node,Document>): NodeTask<T,U> => branch(appendNodeConnector);"
    },
    "prepend": {
      "name": "prepend",
      "deps": [
        "NodeBranch",
        "prependNodeConnector"
      ],
      "body": "export const prepend = <T extends Element, U extends Document>(branch: NodeBranch<T,U,Node,Document>): NodeTask<T,U> => branch(prependNodeConnector);"
    },
    "appendTo": {
      "name": "appendTo",
      "deps": [
        "NodePicker",
        "NodeTask"
      ],
      "body": "export const appendTo = <T extends Node, V extends Node, U extends Document>(lookup: NodePicker<V,U>): NodeTask<T,U> => [\n    (entry: [T,U]) => {\n        lookup()?.[0].appendChild(entry[0]);\n        return entry;\n    }\n]"
    },
    "prependTo": {
      "name": "prependTo",
      "deps": [
        "NodePicker",
        "NodeTask"
      ],
      "body": "export const prependTo = <T extends Node, V extends Element, U extends Document>(lookup: NodePicker<V,U>): NodeTask<T,U> => [\n    (entry: [T,U]) => {\n        lookup()?.[0].prepend(entry[0]);\n        return entry;\n    }\n]"
    },
    "PropertyValueType": {
      "name": "PropertyValueType",
      "deps": [],
      "body": "export type PropertyValueType = string | ((previousValue: string | null) => string) | undefined;"
    },
    "PropertyAdapter": {
      "name": "PropertyAdapter",
      "deps": [
        "PropertyValueType",
        "NodeTask"
      ],
      "body": "export type PropertyAdapter = <T extends Node, U extends Document>(value: PropertyValueType) => NodeTask<T,U>;"
    },
    "DataPropertyValueType": {
      "name": "DataPropertyValueType",
      "deps": [],
      "body": "export type DataPropertyValueType = string | ((previousValue?: string) => string) | undefined;"
    },
    "CssValueType": {
      "name": "CssValueType",
      "deps": [],
      "body": "export type CssValueType = string | ((previousValue: string) => string);"
    },
    "setProp": {
      "name": "setProp",
      "deps": [
        "PropertyValueType",
        "NodeTask"
      ],
      "body": "export const setProp = <T extends Node, U extends Document>(key: string, value: PropertyValueType): NodeTask<T, U> => [\n    value === undefined ?\n        (entry: [T,U]) => { entry[0][key] = null; return entry; } :\n        typeof value === 'function' ?\n            (entry: [T,U]) => { entry[0][key] = value(entry[0][key]); return entry; } :\n            (entry: [T,U]) => { entry[0][key] = value; return entry; }\n];"
    },
    "removeProp": {
      "name": "removeProp",
      "deps": [
        "PropertyAdapter",
        "NodeTask"
      ],
      "body": "export const removeProp = <T extends Node, U extends Document>(adapter: PropertyAdapter): NodeTask<T,U> => adapter(undefined);"
    },
    "getProp": {
      "name": "getProp",
      "deps": [
        "Filter"
      ],
      "body": "export const getProp = <T extends Node, U extends Document>(name: string, key?: string): Filter<[T,U],[string, unknown][]> =>\n    (entry: [T,U]) => ([[key || name, entry[0][name]]] as [string, unknown][]);"
    },
    "setAttr": {
      "name": "setAttr",
      "deps": [
        "PropertyValueType",
        "NodeTask"
      ],
      "body": "export const setAttr = <T extends Element, U extends Document>(key: string, value: PropertyValueType): NodeTask<T, U> => [\n    value === undefined ?\n        (entry: [T,U]) => { entry[0].removeAttribute(key); return entry; } :\n        typeof value === 'function' ?\n            (entry: [T,U]) => { entry[0].setAttribute(key, value(entry[0].getAttribute(key))); return entry; } :\n            (entry: [T,U]) => { entry[0].setAttribute(key, value); return entry; }\n];"
    },
    "removeAttr": {
      "name": "removeAttr",
      "deps": [
        "setAttr"
      ],
      "body": "export const removeAttr = <T extends Element, U extends Document>(key: string): NodeTask<T,U> => setAttr(key, undefined);"
    },
    "getAttr": {
      "name": "getAttr",
      "deps": [
        "Filter"
      ],
      "body": "export const getAttr = <T extends Element, U extends Document>(name: string, key?: string): Filter<[T,U],[string, unknown][]> =>\n    (entry: [T,U]) => ([[key || name, entry[0].getAttribute(name)]] as [string, unknown][]);"
    },
    "setAria": {
      "name": "setAria",
      "deps": [
        "setAttr"
      ],
      "body": "export const setAria = <T extends Element, U extends Document>(key: string, value: PropertyValueType): NodeTask<T, U> => setAttr('aria-'+key, value);"
    },
    "removeAria": {
      "name": "removeAria",
      "deps": [
        "removeAttr"
      ],
      "body": "export const removeAria = <T extends Element, U extends Document>(key: string): NodeTask<T,U> => removeAttr('aria-'+key);"
    },
    "getAria": {
      "name": "getAria",
      "deps": [
        "getAttr"
      ],
      "body": "export const getAria = <T extends Element, U extends Document>(name: string, key?: string): Filter<[T,U],[string, unknown][]> => getAttr('aria-'+name, key);"
    },
    "setData": {
      "name": "setData",
      "deps": [
        "DataPropertyValueType",
        "NodeTask"
      ],
      "body": "export const setData = <T extends HTMLElement, U extends Document>(key: string, value: DataPropertyValueType): NodeTask<T, U> => [\n    value === undefined ?\n        (entry: [T,U]) => { delete entry[0].dataset[key]; return entry; } :\n        typeof value === 'function' ?\n            (entry: [T,U]) => { entry[0].dataset[key] = value(entry[0].dataset[key]); return entry; } :\n            (entry: [T,U]) => { entry[0].dataset[key] = value; return entry; }\n];"
    },
    "removeData": {
      "name": "removeData",
      "deps": [
        "setData"
      ],
      "body": "export const removeData = <T extends HTMLElement, U extends Document>(key: string): NodeTask<T,U> => setData(key, undefined);"
    },
    "getData": {
      "name": "getData",
      "deps": [
        "Filter"
      ],
      "body": "export const getData = <T extends HTMLElement, U extends Document>(name: string, key?: string): Filter<[T,U],[string, unknown][]> =>\n    (entry: [T,U]) => ([[key || name, entry[0].dataset[name]]] as [string, unknown][]);"
    },
    "setStyle": {
      "name": "setStyle",
      "deps": [
        "DataPropertyValueType",
        "NodeTask"
      ],
      "body": "export const setStyle = <T extends HTMLElement, U extends Document>(key: string, value: DataPropertyValueType): NodeTask<T, U> => [\n    value === undefined ?\n        (entry: [T,U]) => { entry[0].style[key] = null; return entry; } :\n        typeof value === 'function' ?\n            (entry: [T,U]) => { entry[0].style[key] = value(entry[0].style[key]); return entry; } :\n            (entry: [T,U]) => { entry[0].style[key] = value; return entry; }\n];"
    },
    "setCss": {
      "name": "setCss",
      "deps": [
        "CssValueType",
        "NodeTask"
      ],
      "body": "export const setCss = <T extends HTMLElement, U extends Document>(value: CssValueType): NodeTask<T, U> => [\n    typeof value === 'function' ?\n            (entry: [T,U]) => { entry[0].style.cssText = value(entry[0].style.cssText); return entry; } :\n            (entry: [T,U]) => { entry[0].style.cssText = value; return entry; }\n];"
    },
    "removeStyle": {
      "name": "removeStyle",
      "deps": [
        "setStyle"
      ],
      "body": "export const removeStyle = <T extends HTMLElement, U extends Document>(key: string): NodeTask<T,U> => setStyle(key, undefined);"
    },
    "getStyle": {
      "name": "getStyle",
      "deps": [
        "Filter"
      ],
      "body": "export const getStyle = <T extends HTMLElement, U extends Document>(name: string, key?: string): Filter<[T,U],[string, unknown][]> =>\n    (entry: [T,U]) => ([[key || name, entry[0].style[name]]] as [string, unknown][]);"
    },
    "subscribe": {
      "name": "subscribe",
      "deps": [
        "NodeTask"
      ],
      "body": "export const subscribe = <T extends EventTarget, U extends Document>(\n    eventType: string, \n    listener: EventListenerOrEventListenerObject, \n    options?: boolean | AddEventListenerOptions\n): NodeTask<T,U> => [\n    (entry: [T,U]) => { entry[0].addEventListener(eventType, listener, options); return entry; }\n]"
    },
    "unsubscribe": {
      "name": "unsubscribe",
      "deps": [
        "NodeTask"
      ],
      "body": "export const unsubscribe = <T extends EventTarget, U extends Document>(\n    eventType: string, \n    listener: EventListenerOrEventListenerObject, \n    options?: boolean | AddEventListenerOptions\n): NodeTask<T,U> => [\n    (entry: [T,U]) => { entry[0].removeEventListener(eventType, listener, options); return entry; }\n]"
    }
  }
};
await Deno.writeTextFile(flags._[0]+'', generateLibSource(entryMap));