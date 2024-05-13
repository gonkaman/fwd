import { parse } from "https://deno.land/std@0.217.0/flags/mod.ts";
import { resolve } from "https://deno.land/std@0.217.0/path/resolve.ts";
import { EntryMap, generateLibSource } from "./engine.ts";

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
      "target": "TextElement",
      "type": "text",
      "parent": "Element",
      "name": "text",
      "childs": "undefined"
    },
    "a": {
      "key": "a",
      "target": "HTMLAnchorElement",
      "name": "a",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "abbr": {
      "key": "abbr",
      "target": "HTMLElement",
      "name": "abbr",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "address": {
      "key": "address",
      "target": "HTMLElement",
      "name": "address",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "area": {
      "key": "abbr",
      "target": "HTMLAreaElement",
      "childs": "undefined",
      "name": "area",
      "type": "html",
      "parent": "HTMLElement"
    },
    "article": {
      "key": "article",
      "target": "HTMLElement",
      "name": "article",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "aside": {
      "key": "aside",
      "target": "HTMLElement",
      "name": "aside",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "audio": {
      "key": "audio",
      "target": "HTMLAudioElement",
      "name": "audio",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "b": {
      "key": "b",
      "target": "HTMLElement",
      "name": "b",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "base": {
      "key": "base",
      "target": "HTMLBaseElement",
      "childs": "undefined",
      "name": "base",
      "type": "html",
      "parent": "HTMLElement"
    },
    "bdi": {
      "key": "bdi",
      "target": "HTMLElement",
      "name": "bdi",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "bdo": {
      "key": "bdo",
      "target": "HTMLElement",
      "name": "bdo",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "blockquote": {
      "key": "blockquote",
      "target": "HTMLQuoteElement",
      "name": "blockquote",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "body": {
      "key": "body",
      "target": "HTMLElement",
      "name": "body",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "br": {
      "key": "br",
      "target": "HTMLBRElement",
      "childs": "undefined",
      "name": "br",
      "type": "html",
      "parent": "HTMLElement"
    },
    "button": {
      "key": "button",
      "target": "HTMLButtonElement",
      "name": "button",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "canvas": {
      "key": "canvas",
      "target": "HTMLCanvasElement",
      "name": "canvas",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "caption": {
      "key": "caption",
      "target": "HTMLTableCaptionElement",
      "name": "caption",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "cite": {
      "key": "cite",
      "target": "HTMLQuoteElement",
      "name": "cite",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "code": {
      "key": "code",
      "target": "HTMLElement",
      "name": "code",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "col": {
      "key": "col",
      "target": "HTMLTableColElement",
      "parent": "HTMLTableColElement",
      "childs": "undefined",
      "name": "col",
      "type": "html"
    },
    "colgroup": {
      "key": "colgroup",
      "target": "HTMLTableColElement",
      "parent": "HTMLTableElement",
      "childs": "HTMLTableColElement",
      "name": "colgroup",
      "type": "html"
    },
    "data": {
      "key": "data",
      "target": "HTMLDataElement",
      "name": "data",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "datalist": {
      "key": "datalist",
      "target": "HTMLDataListElement",
      "name": "datalist",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "dd": {
      "key": "dd",
      "target": "HTMLElement",
      "name": "dd",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "del": {
      "key": "del",
      "target": "HTMLModElement",
      "name": "del",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "details": {
      "key": "details",
      "target": "HTMLElement",
      "name": "details",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "dfn": {
      "key": "dfn",
      "target": "HTMLElement",
      "name": "dfn",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "dialog": {
      "key": "dialog",
      "target": "HTMLDialogElement",
      "name": "dialog",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "div": {
      "key": "div",
      "target": "HTMLDivElement",
      "name": "div",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "dl": {
      "key": "dl",
      "target": "HTMLElement",
      "name": "dl",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "dt": {
      "key": "dt",
      "target": "HTMLElement",
      "name": "dt",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "em": {
      "key": "em",
      "target": "HTMLElement",
      "name": "em",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "embed": {
      "key": "embed",
      "target": "HTMLEmbedElement",
      "name": "embed",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "fieldset": {
      "key": "fieldset",
      "target": "HTMLFieldSetElement",
      "name": "fieldset",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "figcaption": {
      "key": "figcaption",
      "target": "HTMLElement",
      "name": "figcaption",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "figure": {
      "key": "figure",
      "target": "HTMLElement",
      "name": "figure",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "footer": {
      "key": "footer",
      "target": "HTMLElement",
      "name": "footer",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "form": {
      "key": "form",
      "target": "HTMLFormElement",
      "name": "form",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "h1": {
      "key": "h1",
      "target": "HTMLHeadingElement",
      "name": "h1",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "h2": {
      "key": "h2",
      "target": "HTMLHeadingElement",
      "name": "h2",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "h3": {
      "key": "h3",
      "target": "HTMLHeadingElement",
      "name": "h3",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "h4": {
      "key": "h4",
      "target": "HTMLHeadingElement",
      "name": "h4",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "h5": {
      "key": "h5",
      "target": "HTMLHeadingElement",
      "name": "h5",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "h6": {
      "key": "h6",
      "target": "HTMLHeadingElement",
      "name": "h6",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "head": {
      "key": "head",
      "target": "HTMLHeadElement",
      "name": "head",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "header": {
      "key": "header",
      "target": "HTMLElement",
      "name": "header",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "hgroup": {
      "key": "hgroup",
      "target": "HTMLElement",
      "name": "hgroup",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "hr": {
      "key": "hr",
      "target": "HTMLHRElement",
      "childs": "undefined",
      "name": "hr",
      "type": "html",
      "parent": "HTMLElement"
    },
    "html": {
      "key": "html",
      "target": "HTMLElement",
      "parent": "undefined",
      "name": "html",
      "type": "html",
      "childs": "Text | HTMLElement"
    },
    "i": {
      "key": "i",
      "target": "HTMLElement",
      "name": "i",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "iframe": {
      "key": "iframe",
      "target": "HTMLIFrameElement",
      "name": "iframe",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "img": {
      "key": "img",
      "target": "HTMLImageElement",
      "childs": "undefined",
      "name": "img",
      "type": "html",
      "parent": "HTMLElement"
    },
    "input": {
      "key": "input",
      "target": "HTMLInputElement",
      "childs": "undefined",
      "name": "input",
      "type": "html",
      "parent": "HTMLElement"
    },
    "ins": {
      "key": "ins",
      "target": "HTMLModElement",
      "name": "ins",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "kbd": {
      "key": "kbd",
      "target": "HTMLElement",
      "name": "kbd",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "label": {
      "key": "label",
      "target": "HTMLLabelElement",
      "name": "label",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "legend": {
      "key": "legend",
      "target": "HTMLLegendElement",
      "name": "legend",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "li": {
      "key": "li",
      "target": "HTMLLIElement",
      "name": "li",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "link": {
      "key": "link",
      "target": "HTMLLinkElement",
      "name": "link",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "main": {
      "key": "main",
      "target": "HTMLElement",
      "name": "main",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "mark": {
      "key": "mark",
      "target": "HTMLElement",
      "name": "mark",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "menu": {
      "key": "menu",
      "target": "HTMLMenuElement",
      "name": "menu",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "meta": {
      "key": "meta",
      "target": "HTMLElement",
      "name": "meta",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "meter": {
      "key": "meter",
      "target": "HTMLMeterElement",
      "name": "meter",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "nav": {
      "key": "nav",
      "target": "HTMLElement",
      "name": "nav",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "noscript": {
      "key": "noscript",
      "target": "HTMLElement",
      "name": "noscript",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "object": {
      "key": "object",
      "target": "HTMLObjectElement",
      "name": "object",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "ol": {
      "key": "ol",
      "target": "HTMLOListElement",
      "name": "ol",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "optgroup": {
      "key": "optgroup",
      "target": "HTMLOptGroupElement",
      "name": "optgroup",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "option": {
      "key": "option",
      "target": "HTMLOptionElement",
      "name": "option",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "output": {
      "key": "output",
      "target": "HTMLOutputElement",
      "name": "output",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "p": {
      "key": "p",
      "target": "HTMLParagraphElement",
      "name": "p",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "param": {
      "key": "param",
      "target": "HTMLParagraphElement",
      "name": "param",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "picture": {
      "key": "picture",
      "target": "HTMLPictureElement",
      "name": "picture",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "pre": {
      "key": "pre",
      "target": "HTMLPreElement",
      "name": "pre",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "progress": {
      "key": "progress",
      "target": "HTMLProgressElement",
      "name": "progress",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "q": {
      "key": "q",
      "target": "HTMLQuoteElement",
      "name": "q",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "rp": {
      "key": "rp",
      "target": "HTMLElement",
      "name": "rp",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "rt": {
      "key": "rt",
      "target": "HTMLElement",
      "name": "rt",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "ruby": {
      "key": "ruby",
      "target": "HTMLElement",
      "name": "ruby",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "s": {
      "key": "s",
      "target": "HTMLElement",
      "name": "s",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "samp": {
      "key": "samp",
      "target": "HTMLElement",
      "name": "samp",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "script": {
      "key": "script",
      "target": "HTMLElement",
      "name": "script",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "search": {
      "key": "search",
      "target": "HTMLElement",
      "name": "search",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "section": {
      "key": "section",
      "target": "HTMLElement",
      "name": "section",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "select": {
      "key": "select",
      "target": "HTMLSelectElement",
      "name": "select",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "$slot": {
      "key": "slot",
      "target": "HTMLSlotElement",
      "name": "$slot",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "small": {
      "key": "small",
      "target": "HTMLElement",
      "name": "small",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "source": {
      "key": "source",
      "target": "HTMLSourceElement",
      "name": "source",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "span": {
      "key": "span",
      "target": "HTMLElement",
      "name": "span",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "strong": {
      "key": "strong",
      "target": "HTMLElement",
      "name": "strong",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "style": {
      "key": "style",
      "target": "HTMLElement",
      "name": "style",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "sub": {
      "key": "sub",
      "target": "HTMLElement",
      "name": "sub",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "summary": {
      "key": "summary",
      "target": "HTMLElement",
      "name": "summary",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "sup": {
      "key": "sup",
      "target": "HTMLElement",
      "name": "sup",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "table": {
      "key": "table",
      "target": "HTMLTableElement",
      "name": "table",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "tbody": {
      "key": "tbody",
      "target": "HTMLTableSectionElement",
      "name": "tbody",
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
      "key": "template",
      "target": "HTMLTemplateElement",
      "name": "template",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "textarea": {
      "key": "textarea",
      "target": "HTMLTextAreaElement",
      "name": "textarea",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "tfoot": {
      "key": "tfoot",
      "target": "HTMLTableSectionElement",
      "name": "tfoot",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "th": {
      "key": "th",
      "target": "HTMLTableCellElement",
      "name": "th",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "thead": {
      "key": "thead",
      "target": "HTMLTableSectionElement",
      "name": "thead",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "tile": {
      "key": "time",
      "target": "HTMLTimeElement",
      "name": "tile",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "htmlTitle": {
      "key": "title",
      "target": "HTMLTitleElement",
      "name": "htmlTitle",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "tr": {
      "key": "tr",
      "target": "HTMLTableRowElement",
      "name": "tr",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "track": {
      "key": "track",
      "target": "HTMLTrackElement",
      "name": "track",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "u": {
      "key": "u",
      "target": "HTMLElement",
      "name": "u",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "ul": {
      "key": "ul",
      "target": "HTMLUListElement",
      "name": "ul",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "$var": {
      "key": "var",
      "target": "HTMLElement",
      "name": "$var",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "video": {
      "key": "video",
      "target": "HTMLVideoElement",
      "name": "video",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "wbr": {
      "key": "wbr",
      "target": "HTMLElement",
      "name": "wbr",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    }
  },
  "attribute": {
    "id": {
      "name": "id",
      "key": "id",
      "target": "Element"
    },
    "accesskey": {
      "name": "accesskey",
      "key": "accesskey",
      "target": "Element"
    },
    "autocapitalize": {
      "name": "autocapitalize",
      "key": "autocapitalize",
      "target": "Element"
    },
    "autofocus": {
      "name": "autofocus",
      "key": "autofocus",
      "target": "Element"
    },
    "enterkeyhint": {
      "name": "enterkeyhint",
      "key": "enterkeyhint",
      "target": "Element"
    },
    "exportparts": {
      "name": "exportparts",
      "key": "exportparts",
      "target": "Element"
    },
    "hidden": {
      "name": "hidden",
      "key": "hidden",
      "target": "Element"
    },
    "inert": {
      "name": "inert",
      "key": "inert",
      "target": "Element"
    },
    "inputmode": {
      "name": "inputmode",
      "key": "inputmode",
      "target": "Element"
    },
    "is": {
      "name": "is",
      "key": "is",
      "target": "Element"
    },
    "nonce": {
      "name": "nonce",
      "key": "nonce",
      "target": "Element"
    },
    "part": {
      "name": "part",
      "key": "part",
      "target": "Element"
    },
    "popover": {
      "name": "popover",
      "key": "popover",
      "target": "Element"
    },
    "slot": {
      "name": "slot",
      "key": "slot",
      "target": "Element"
    },
    "spellcheck": {
      "name": "spellcheck",
      "key": "spellcheck",
      "target": "Element"
    },
    "translate": {
      "name": "translate",
      "key": "translate",
      "target": "Element"
    },
    "className": {
      "name": "className",
      "key": "class",
      "target": "Element"
    },
    "title": {
      "name": "title",
      "key": "title",
      "target": "HTMLElement"
    },
    "tabIndex": {
      "name": "tabIndex",
      "key": "tabIndex",
      "target": "HTMLElement"
    },
    "lang": {
      "name": "lang",
      "key": "lang",
      "target": "HTMLElement"
    },
    "dir": {
      "name": "dir",
      "key": "dir",
      "target": "HTMLElement"
    },
    "draggable": {
      "name": "draggable",
      "key": "draggable",
      "target": "HTMLElement"
    },
    "itemid": {
      "name": "itemid",
      "key": "itemid",
      "target": "HTMLElement"
    },
    "itemprop": {
      "name": "itemprop",
      "key": "itemprop",
      "target": "HTMLElement"
    },
    "itemref": {
      "name": "itemref",
      "key": "itemref",
      "target": "HTMLElement"
    },
    "itemscope": {
      "name": "itemscope",
      "key": "itemscope",
      "target": "HTMLElement"
    },
    "itemtype": {
      "name": "itemtype",
      "key": "itemtype",
      "target": "HTMLElement"
    },
    "crossorigin": {
      "name": "crossorigin",
      "key": "crossorigin",
      "target": "HTMLElement"
    },
    "disabled": {
      "name": "disabled",
      "key": "disabled",
      "target": "HTMLElement"
    },
    "elementtiming": {
      "name": "elementtiming",
      "key": "elementtiming",
      "target": "HTMLElement"
    },
    "max": {
      "name": "max",
      "key": "max",
      "target": "HTMLElement"
    },
    "min": {
      "name": "min",
      "key": "min",
      "target": "HTMLElement"
    },
    "step": {
      "key": "step",
      "target": "HTMLInputElement",
      "name": "step"
    },
    "type": {
      "key": "type",
      "target": "HTMLInputElement",
      "name": "type"
    },
    "accept": {
      "key": "accept",
      "target": "HTMLInputElement",
      "name": "accept"
    },
    "capture": {
      "key": "capture",
      "target": "HTMLInputElement",
      "name": "capture"
    },
    "pattern": {
      "key": "pattern",
      "target": "HTMLInputElement",
      "name": "pattern"
    },
    "placeholder": {
      "key": "placeholder",
      "target": "HTMLInputElement",
      "name": "placeholder"
    },
    "$for": {
      "key": "for",
      "target": "HTMLLabelElement | HTMLOutputElement",
      "name": "$for"
    },
    "size": {
      "key": "size",
      "target": "HTMLInputElement | HTMLSelectElement",
      "name": "size"
    },
    "dirname": {
      "key": "dirname",
      "target": "HTMLInputElement | HTMLTextAreaElement",
      "name": "dirname"
    },
    "multiple": {
      "key": "multiple",
      "target": "HTMLInputElement | HTMLTextAreaElement",
      "name": "multiple"
    },
    "readonly": {
      "key": "readonly",
      "target": "HTMLInputElement | HTMLTextAreaElement",
      "name": "readonly"
    },
    "maxlength": {
      "key": "maxlength",
      "target": "HTMLInputElement | HTMLTextAreaElement",
      "name": "maxlength"
    },
    "minlength": {
      "key": "minlength",
      "target": "HTMLInputElement | HTMLTextAreaElement",
      "name": "minlength"
    },
    "required": {
      "key": "required",
      "target": "HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement",
      "name": "required"
    },
    "rel": {
      "key": "rel",
      "target": "HTMLAnchorElement | HTMLAreaElement | HTMLLinkElement | HTMLFormElement",
      "name": "rel"
    },
    "autocomplete": {
      "key": "autocomplete",
      "target": "HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLFormElement",
      "name": "autocomplete"
    }
  },
  "property": {
    "nodeValue": {
      "key": "nodeValue",
      "target": "Node",
      "name": "nodeValue"
    },
    "textContent": {
      "key": "textContent",
      "target": "Node",
      "name": "textContent"
    },
    "innerHTML": {
      "key": "innerHTML",
      "target": "Element",
      "name": "innerHTML"
    },
    "outerHTML": {
      "key": "outerHTML",
      "target": "Element",
      "name": "outerHTML"
    }
  },
  "query": {
    "id": {
      "name": "getId",
      "key": "id",
      "target": "Element",
      "getter": "getAttr"
    },
    "accesskey": {
      "name": "getAccesskey",
      "key": "accesskey",
      "target": "Element",
      "getter": "getAttr"
    },
    "autocapitalize": {
      "name": "getAutocapitalize",
      "key": "autocapitalize",
      "target": "Element",
      "getter": "getAttr"
    },
    "autofocus": {
      "name": "getAutofocus",
      "key": "autofocus",
      "target": "Element",
      "getter": "getAttr"
    },
    "enterkeyhint": {
      "name": "getEnterkeyhint",
      "key": "enterkeyhint",
      "target": "Element",
      "getter": "getAttr"
    },
    "exportparts": {
      "name": "getExportparts",
      "key": "exportparts",
      "target": "Element",
      "getter": "getAttr"
    },
    "hidden": {
      "name": "getHidden",
      "key": "hidden",
      "target": "Element",
      "getter": "getAttr"
    },
    "inert": {
      "name": "getInert",
      "key": "inert",
      "target": "Element",
      "getter": "getAttr"
    },
    "inputmode": {
      "name": "getInputmode",
      "key": "inputmode",
      "target": "Element",
      "getter": "getAttr"
    },
    "is": {
      "name": "getIs",
      "key": "is",
      "target": "Element",
      "getter": "getAttr"
    },
    "nonce": {
      "name": "getNonce",
      "key": "nonce",
      "target": "Element",
      "getter": "getAttr"
    },
    "part": {
      "name": "getPart",
      "key": "part",
      "target": "Element",
      "getter": "getAttr"
    },
    "popover": {
      "name": "getPopover",
      "key": "popover",
      "target": "Element",
      "getter": "getAttr"
    },
    "slot": {
      "name": "getSlot",
      "key": "slot",
      "target": "Element",
      "getter": "getAttr"
    },
    "spellcheck": {
      "name": "getSpellcheck",
      "key": "spellcheck",
      "target": "Element",
      "getter": "getAttr"
    },
    "translate": {
      "name": "getTranslate",
      "key": "translate",
      "target": "Element",
      "getter": "getAttr"
    },
    "className": {
      "name": "getClassName",
      "key": "className",
      "target": "Element",
      "getter": "getAttr"
    },
    "nodeValue": {
      "name": "getNodeValue",
      "key": "nodeValue",
      "target": "Node",
      "getter": "getProp"
    },
    "textContent": {
      "name": "getTextContent",
      "key": "textContent",
      "target": "Node",
      "getter": "getProp"
    },
    "innerHTML": {
      "name": "getInnerHTML",
      "key": "innerHTML",
      "target": "Element",
      "getter": "getProp"
    },
    "outerHTML": {
      "name": "getOuterHTML",
      "key": "outerHTML",
      "target": "Element",
      "getter": "getProp"
    },
    "nodeName": {
      "key": "nodeName",
      "target": "Node",
      "name": "nodeName",
      "getter": "getProp"
    },
    "nodeType": {
      "key": "nodeType",
      "target": "Node",
      "name": "nodeType",
      "getter": "getProp"
    },
    "clientHeight": {
      "key": "clientHeight",
      "target": "Element",
      "name": "clientHeight",
      "getter": "getProp"
    },
    "clientLeft": {
      "key": "clientLeft",
      "target": "Element",
      "name": "clientLeft",
      "getter": "getProp"
    },
    "clientTop": {
      "key": "clientTop",
      "target": "Element",
      "name": "clientTop",
      "getter": "getProp"
    },
    "clientWidth": {
      "key": "clientWidth",
      "target": "Element",
      "name": "clientWidth",
      "getter": "getProp"
    },
    "tagName": {
      "key": "tagName",
      "target": "Element",
      "name": "tagName",
      "getter": "getProp"
    },
    "title": {
      "name": "getTitle",
      "key": "title",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "tabIndex": {
      "name": "getTabIndex",
      "key": "tabIndex",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "lang": {
      "name": "getLang",
      "key": "lang",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "dir": {
      "name": "getDir",
      "key": "dir",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "draggable": {
      "name": "getDraggable",
      "key": "draggable",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "itemid": {
      "name": "getItemid",
      "key": "itemid",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "itemprop": {
      "name": "getItemprop",
      "key": "itemprop",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "itemref": {
      "name": "getItemref",
      "key": "itemref",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "itemscope": {
      "name": "getItemscope",
      "key": "itemscope",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "itemtype": {
      "name": "getItemtype",
      "key": "itemtype",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "crossorigin": {
      "name": "getCrossorigin",
      "key": "crossorigin",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "disabled": {
      "name": "getDisabled",
      "key": "disabled",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "elementtiming": {
      "name": "getElementtiming",
      "key": "elementtiming",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "max": {
      "name": "getMax",
      "key": "max",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "min": {
      "name": "getMin",
      "key": "min",
      "target": "HTMLElement",
      "getter": "getAttr"
    },
    "step": {
      "name": "getStep",
      "key": "step",
      "target": "HTMLInputElement",
      "getter": "getAttr"
    },
    "type": {
      "name": "getType",
      "key": "type",
      "target": "HTMLInputElement",
      "getter": "getAttr"
    },
    "accept": {
      "name": "getAccept",
      "key": "accept",
      "target": "HTMLInputElement",
      "getter": "getAttr"
    },
    "capture": {
      "name": "getCapture",
      "key": "capture",
      "target": "HTMLInputElement",
      "getter": "getAttr"
    },
    "pattern": {
      "name": "getPattern",
      "key": "pattern",
      "target": "HTMLInputElement",
      "getter": "getAttr"
    },
    "placeholder": {
      "name": "getPlaceholder",
      "key": "placeholder",
      "target": "HTMLInputElement",
      "getter": "getAttr"
    },
    "$for": {
      "name": "get$for",
      "key": "$for",
      "target": "HTMLLabelElement | HTMLOutputElement",
      "getter": "getAttr"
    },
    "size": {
      "name": "getSize",
      "key": "size",
      "target": "HTMLInputElement | HTMLSelectElement",
      "getter": "getAttr"
    },
    "dirname": {
      "name": "getDirname",
      "key": "dirname",
      "target": "HTMLInputElement | HTMLTextAreaElement",
      "getter": "getAttr"
    },
    "multiple": {
      "name": "getMultiple",
      "key": "multiple",
      "target": "HTMLInputElement | HTMLTextAreaElement",
      "getter": "getAttr"
    },
    "readonly": {
      "name": "getReadonly",
      "key": "readonly",
      "target": "HTMLInputElement | HTMLTextAreaElement",
      "getter": "getAttr"
    },
    "maxlength": {
      "name": "getMaxlength",
      "key": "maxlength",
      "target": "HTMLInputElement | HTMLTextAreaElement",
      "getter": "getAttr"
    },
    "minlength": {
      "name": "getMinlength",
      "key": "minlength",
      "target": "HTMLInputElement | HTMLTextAreaElement",
      "getter": "getAttr"
    },
    "required": {
      "name": "getRequired",
      "key": "required",
      "target": "HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement",
      "getter": "getAttr"
    },
    "rel": {
      "name": "getRel",
      "key": "rel",
      "target": "HTMLAnchorElement | HTMLAreaElement | HTMLLinkElement | HTMLFormElement",
      "getter": "getAttr"
    },
    "autocomplete": {
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
        [
          "name",
          "string"
        ]
      ],
      "name": "addClass"
    },
    "removeClass": {
      "target": "Element",
      "callPath": "classList.remove",
      "arguments": [
        [
          "name",
          "string"
        ]
      ],
      "name": "removeClass"
    },
    "toggleClass": {
      "target": "Element",
      "callPath": "classList.toggle",
      "arguments": [
        [
          "name",
          "string"
        ]
      ],
      "name": "toggleClass"
    },
    "dispatch": {
      "target": "EventTarget",
      "callPath": "dispatchEvent",
      "arguments": [
        [
          "name",
          "string"
        ]
      ],
      "name": "dispatch"
    }
  },
  "event": {
    "onClick": {
      "name": "onClick",
      "key": "click",
      "target": "EventTarget"
    },
    "onDbClick": {
      "name": "onDbClick",
      "key": "dbclick",
      "target": "EventTarget"
    },
    "onBlur": {
      "name": "onBlur",
      "key": "blur",
      "target": "EventTarget"
    },
    "onFocus": {
      "name": "onFocus",
      "key": "focus",
      "target": "EventTarget"
    },
    "onChange": {
      "name": "onChange",
      "key": "change",
      "target": "EventTarget"
    },
    "onMouseDown": {
      "name": "onMouseDown",
      "key": "mousedown",
      "target": "EventTarget"
    },
    "onMouseEnter": {
      "name": "onMouseEnter",
      "key": "mouseenter",
      "target": "EventTarget"
    },
    "onMouseLeave": {
      "name": "onMouseLeave",
      "key": "mouseleave",
      "target": "EventTarget"
    },
    "onMouseMove": {
      "name": "onMouseMove",
      "key": "mousemove",
      "target": "EventTarget"
    },
    "onMouseOut": {
      "name": "onMouseOut",
      "key": "mouseout",
      "target": "EventTarget"
    },
    "onMouseOver": {
      "name": "onMouseOver",
      "key": "mouseover",
      "target": "EventTarget"
    },
    "onMouseUp": {
      "name": "onMouseUp",
      "key": "mouseup",
      "target": "EventTarget"
    },
    "onWheel": {
      "name": "onWheel",
      "key": "wheel",
      "target": "EventTarget"
    },
    "onScroll": {
      "name": "onScroll",
      "key": "scroll",
      "target": "EventTarget"
    },
    "onKeyDown": {
      "name": "onKeyDown",
      "key": "keydown",
      "target": "EventTarget"
    },
    "onKeyPress": {
      "name": "onKeyPress",
      "key": "keypress",
      "target": "EventTarget"
    },
    "onKeyUp": {
      "name": "onKeyUp",
      "key": "keyup",
      "target": "EventTarget"
    },
    "onCopy": {
      "name": "onCopy",
      "key": "copy",
      "target": "EventTarget"
    },
    "onCut": {
      "name": "onCut",
      "key": "cut",
      "target": "EventTarget"
    },
    "onPaste": {
      "name": "onPaste",
      "key": "paste",
      "target": "EventTarget"
    },
    "onSelect": {
      "name": "onSelect",
      "key": "select",
      "target": "EventTarget"
    },
    "onFocusIn": {
      "name": "onFocusIn",
      "key": "focusin",
      "target": "EventTarget"
    },
    "onFocusOut": {
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
      "body": "const formatAdapterArgs: NodeAdapterArgsFormater<Node | undefined, Document, Node | undefined, Document, string | undefined> = \n    <T extends Node | undefined, V extends Node | undefined>(connector: NodeConnector<T,Document,V,Document>) => \n    (args: NodeAdapterArg<T,Document,V,Document,string | undefined>): NodeTask<T,Document>[] => \n        (args.filter(arg => arg != null) as NodeAdapterArg<T,Document,V,Document,string>).map(arg => {\n            if(typeof arg === 'function') return arg(connector);\n            if(typeof arg === 'string') return [\n                (entry: [T,Document]) => {\n                    entry[0]?.appendChild(entry[1].createTextNode(arg));\n                    return entry;\n                }\n            ];\n            return arg;\n        });"
    },
    "getElement": {
      "name": "getElement",
      "deps": [
        "NodePicker"
      ],
      "body": "export const getElement = <T extends Element, U extends Document>(query: string, container: Document | Element): NodePicker<T,U> => () => {\n    const node = container.querySelector(query);\n    return node == null ? node : [node as T, node.ownerDocument as U];\n}"
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