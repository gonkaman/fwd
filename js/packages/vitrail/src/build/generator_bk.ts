export type AdapterType = "html" | "svg" | "mathml" | "text" | "contextual";
export type QueryGetterType = "getAttr" | "getProp";

export type AdapterEntry = {
    name: string,
    key: string,
    type: AdapterType,
    target: string,
    parent: string,
    childs: string
}
export type AttributeEntry = {
    name: string,
    key: string,
    target: string
}
export type PropertyEntry = {
    name: string,
    key: string,
    target: string
}
export type QueryEntry = {
    name: string,
    key: string,
    target: string,
    getter: QueryGetterType
}
export type ActionArgEntry = {
    name: string,
    type: string,
    optional: boolean
}
export type ActionEntry = {
    name: string,
    target: string,
    callPath: string,
    arguments: ActionArgEntry[]
}
export type EventEntry = {
    name: string,
    key: string,
    target: string
}
export type CoreEntry = {
    name: string,
    deps: string[],
    body: string
}
export type EntryMap = {
    adapter: Record<string, AdapterEntry>,
    attribute: Record<string, PropertyEntry>,
    property: Record<string, PropertyEntry>,
    query: Record<string, QueryEntry>,
    action: Record<string, ActionEntry>,
    event: Record<string, EventEntry>,
    provided: Record<string, CoreEntry>
}



const sourceGenerators = {

    //adapters template
    adapter: (entry: AdapterEntry): [string, string[]] => {
        const connectorName = (entry.childs === "undefined" ? 'no' : 'append')+'Connector';
        const childs = entry.childs === "undefined" ? entry.childs : `DOMTaskData<${entry.childs}>`;
        return [
            `export const ${entry.name} = createTreeNodeAdapter<
    DOMTaskArg, DOMTaskData<${entry.target}>, 
    ${childs}, string
>(nodeFactory<${entry.target}>("${entry.key}", ${entry.type}Scope), ${connectorName}, deriveDOMTaskArg, defaultConvert);`, 
            ['createTreeNodeAdapter', "nodeFactory", connectorName, 'deriveDOMTaskArg', 'defaultConvert']
        ];
    },

    //attribute template
    attribute: (entry: AttributeEntry): [string, string[]] => {
        return [
            `export const ${entry.name} = <T extends ${entry.target}>(value: DOMPropertyValue): Task<DOMTaskData<T>> => attr('${entry.key}', value);`,
            ['DOMPropertyValue','Task','DOMTaskData','attr']
        ];
    },

    //property template
    property: (entry: PropertyEntry): [string, string[]] => {
        return [
            `export const ${entry.name} = <T extends ${entry.target}>(value: DOMPropertyValue): Task<DOMTaskData<T>> => prop('${entry.key}', value);`,
            ['DOMPropertyValue','Task','DOMTaskData','prop']
        ];
    },

    //query template
    query: (entry: QueryEntry): [string, string[]] => {
        return [
            `export const ${entry.name} = <T extends ${entry.target}>(alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => ${entry.getter}<T>('${entry.key}', alias);`, 
            ['Filter','DOMTaskData', entry.getter]
        ];
    },

    //action template
    action: (entry: ActionEntry): [string, string[]] => {
        const params = entry.arguments.map(arg => arg.name+(arg.optional ? '?' : '')+': '+arg.type).join(', ');
        const inputs = entry.arguments.map(arg => arg.name).join(', ');
        return [
            `export const ${entry.name} = <T extends ${entry.target}>(${params}): Task<DOMTaskData<T>> => (data: DOMTaskData<T>): DOMTaskData<T> => {
    data.element.${entry.callPath}(${inputs});
    return data;
};`,
            ['Task','DOMTaskData']
        ];
    },

    //event template
    event: (entry: EventEntry): [string, string[]] => {
        return [
            `export const ${entry.name} = <T extends ${entry.target}>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): Task<DOMTaskData<T>> => subscribe('${entry.key}', listener, options);`,
            ['Task','DOMTaskData','subscribe']
        ];
    }

}



const renderExposedEntries = (entryMap: EntryMap, token: string, rendered: Set<string>): [string, string[]] | null => {
    rendered.add(token);
    if(entryMap.adapter[token]) return sourceGenerators.adapter(entryMap.adapter[token]);
    if(entryMap.attribute[token]) return sourceGenerators.attribute(entryMap.attribute[token]);
    if(entryMap.property[token]) return sourceGenerators.property(entryMap.property[token]);
    if(entryMap.query[token]) return sourceGenerators.query(entryMap.query[token]);
    if(entryMap.action[token]) return sourceGenerators.action(entryMap.action[token]);
    if(entryMap.event[token]) return sourceGenerators.event(entryMap.event[token]);
    if(entryMap.provided[token]) return [entryMap.provided[token].body, entryMap.provided[token].deps];
    rendered.delete(token);
    return null;
}

const getUnexposedSource = (sourceEntry: string): string => sourceEntry.trim().replace(/^export/i, '').trim();

const renderDependencies = (entryMap: EntryMap, deps: Set<string>, rendered: Set<string>): string[] => {
    let result: string[] = [];
    deps.forEach(token => {
        if(!rendered.has(token)){
            rendered.add(token);
            let sourceData : [string, string[]] = ['',[]];
            if(entryMap.provided[token]) {
                sourceData = [entryMap.provided[token].body, entryMap.provided[token].deps];
            }
            else if(entryMap.adapter[token]) {
                sourceData = sourceGenerators.adapter(entryMap.adapter[token]);
            }
            else if(entryMap.attribute[token]) {
                sourceData = sourceGenerators.attribute(entryMap.attribute[token]);
            }
            else if(entryMap.property[token]) {
                sourceData = sourceGenerators.property(entryMap.property[token]);
            }
            else if(entryMap.query[token]) {
                sourceData = sourceGenerators.query(entryMap.query[token]);
            }
            else if(entryMap.action[token]) {
                sourceData = sourceGenerators.action(entryMap.action[token]);
            }
            else if(entryMap.event[token]) {
                sourceData = sourceGenerators.event(entryMap.event[token]);
            }
            result = result.concat(renderDependencies(entryMap, new Set<string>(sourceData[1]), rendered));
            result.push(getUnexposedSource(sourceData[0]));
        }
    })
    return result;
}

const renderSelectedEntries = (entryMap: EntryMap, tokens: string[]): string => {
    const renderedEntries = new Set<string>();
    const [exposedSources, deps] = tokens.map(token => renderExposedEntries(entryMap, token, renderedEntries))
        .reduce((acc: [string[], string[]], current) => { 
            return current == null ? acc : [
                acc[0].concat([current[0]]), 
                acc[1].concat(current[1])
            ];
        }, [[],[]] );
    const hiddenSources = renderDependencies(entryMap, new Set<string>(deps), renderedEntries);
    return hiddenSources.concat(exposedSources).join('\n');
}


const renderAllEntries = (entryMap: EntryMap): string => 
    Object.values(entryMap.provided).map(entry => entry.body)
    .concat(Object.values(entryMap.adapter).map(entry => sourceGenerators.adapter(entry)[0]))
    .concat(Object.values(entryMap.attribute).map(entry => sourceGenerators.attribute(entry)[0]))
    .concat(Object.values(entryMap.property).map(entry => sourceGenerators.property(entry)[0]))
    .concat(Object.values(entryMap.query).map(entry => sourceGenerators.query(entry)[0]))
    .concat(Object.values(entryMap.action).map(entry => sourceGenerators.action(entry)[0]))
    .concat(Object.values(entryMap.event).map(entry => sourceGenerators.event(entry)[0]))
    .join("\n");


export const generateSource = (tokens?: string[] | null): string => {
    const entryMap : EntryMap = {
  "adapter": {
    "textNode": {
      "key": "",
      "target": "Text",
      "type": "text",
      "parent": "Element",
      "name": "textNode",
      "childs": "undefined"
    },
    "a": {
      "target": "HTMLAnchorElement | SVGAElement",
      "type": "contextual",
      "childs": "HTMLElement | SVGElement | Text",
      "name": "a",
      "key": "a",
      "parent": "undefined"
    },
    "titleTag": {
      "key": "title",
      "target": "HTMLTitleElement | SVGTitleElement",
      "type": "contextual",
      "childs": "HTMLElement | SVGElement | Text",
      "name": "titleTag",
      "parent": "undefined"
    },
    "scriptTag": {
      "key": "script",
      "target": "HTMLElement | SVGScriptElement",
      "childs": "HTMLElement | SVGElement | Text",
      "name": "scriptTag",
      "type": "html",
      "parent": "undefined"
    },
    "styleTag": {
      "key": "style",
      "target": "HTMLElement | SVGStyleElement",
      "childs": "Text",
      "name": "styleTag",
      "type": "html",
      "parent": "undefined"
    },
    "htmlA": {
      "target": "HTMLAnchorElement",
      "name": "htmlA",
      "key": "htmlA",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "abbr": {
      "name": "abbr",
      "key": "abbr",
      "type": "html",
      "target": "HTMLElement",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "address": {
      "name": "address",
      "key": "address",
      "type": "html",
      "target": "HTMLElement",
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
      "type": "html",
      "target": "HTMLElement",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "aside": {
      "name": "aside",
      "key": "aside",
      "type": "html",
      "target": "HTMLElement",
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
      "type": "html",
      "target": "HTMLElement",
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
      "type": "html",
      "target": "HTMLElement",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "bdo": {
      "name": "bdo",
      "key": "bdo",
      "type": "html",
      "target": "HTMLElement",
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
      "type": "html",
      "target": "HTMLElement",
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
      "type": "html",
      "target": "HTMLElement",
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
      "type": "html",
      "target": "HTMLElement",
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
      "type": "html",
      "target": "HTMLElement",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "dfn": {
      "name": "dfn",
      "key": "dfn",
      "type": "html",
      "target": "HTMLElement",
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
      "type": "html",
      "target": "HTMLElement",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "dt": {
      "name": "dt",
      "key": "dt",
      "type": "html",
      "target": "HTMLElement",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "em": {
      "name": "em",
      "key": "em",
      "type": "html",
      "target": "HTMLElement",
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
      "type": "html",
      "target": "HTMLElement",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "figure": {
      "name": "figure",
      "key": "figure",
      "type": "html",
      "target": "HTMLElement",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "footer": {
      "name": "footer",
      "key": "footer",
      "type": "html",
      "target": "HTMLElement",
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
      "type": "html",
      "target": "HTMLElement",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "hgroup": {
      "name": "hgroup",
      "key": "hgroup",
      "type": "html",
      "target": "HTMLElement",
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
      "type": "html",
      "target": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "i": {
      "name": "i",
      "key": "i",
      "type": "html",
      "target": "HTMLElement",
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
      "type": "html",
      "target": "HTMLElement",
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
      "type": "html",
      "target": "HTMLElement",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "mark": {
      "name": "mark",
      "key": "mark",
      "type": "html",
      "target": "HTMLElement",
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
      "type": "html",
      "target": "HTMLElement",
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
      "type": "html",
      "target": "HTMLElement",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "noscript": {
      "name": "noscript",
      "key": "noscript",
      "type": "html",
      "target": "HTMLElement",
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
      "type": "html",
      "target": "HTMLElement",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "rt": {
      "name": "rt",
      "key": "rt",
      "type": "html",
      "target": "HTMLElement",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "ruby": {
      "name": "ruby",
      "key": "ruby",
      "type": "html",
      "target": "HTMLElement",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "s": {
      "name": "s",
      "key": "s",
      "type": "html",
      "target": "HTMLElement",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "samp": {
      "name": "samp",
      "key": "samp",
      "type": "html",
      "target": "HTMLElement",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "htmlScriptTag": {
      "key": "script",
      "name": "htmlScriptTag",
      "type": "html",
      "target": "HTMLElement",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "search": {
      "name": "search",
      "key": "search",
      "type": "html",
      "target": "HTMLElement",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "section": {
      "name": "section",
      "key": "section",
      "type": "html",
      "target": "HTMLElement",
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
    "slotTag": {
      "key": "slot",
      "target": "HTMLSlotElement",
      "name": "slotTag",
      "type": "html",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "small": {
      "name": "small",
      "key": "small",
      "type": "html",
      "target": "HTMLElement",
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
      "type": "html",
      "target": "HTMLElement",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "strong": {
      "name": "strong",
      "key": "strong",
      "type": "html",
      "target": "HTMLElement",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "htmlStyleTag": {
      "key": "style",
      "name": "htmlStyleTag",
      "type": "html",
      "target": "HTMLElement",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "sub": {
      "name": "sub",
      "key": "sub",
      "type": "html",
      "target": "HTMLElement",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "summary": {
      "name": "summary",
      "key": "summary",
      "type": "html",
      "target": "HTMLElement",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "sup": {
      "name": "sup",
      "key": "sup",
      "type": "html",
      "target": "HTMLElement",
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
      "target": "HTMLTableCellElement",
      "name": "td",
      "key": "td",
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
    "htmlTitleTag": {
      "key": "title",
      "target": "HTMLTitleElement",
      "name": "htmlTitleTag",
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
      "type": "html",
      "target": "HTMLElement",
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
    "varTag": {
      "key": "var",
      "name": "varTag",
      "type": "html",
      "target": "HTMLElement",
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
      "type": "html",
      "target": "HTMLElement",
      "parent": "HTMLElement",
      "childs": "Text | HTMLElement"
    },
    "animate": {
      "target": "SVGAnimateElement",
      "name": "animate",
      "key": "animate",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "animateMotion": {
      "target": "SVGAnimateMotionElement",
      "name": "animateMotion",
      "key": "animateMotion",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "animateTransform": {
      "target": "SVGAnimateTransformElement",
      "name": "animateTransform",
      "key": "animateTransform",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "circle": {
      "target": "SVGCircleElement",
      "name": "circle",
      "key": "circle",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "clipPath": {
      "target": "SVGClipPathElement",
      "name": "clipPath",
      "key": "clipPath",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "defs": {
      "target": "SVGDefsElement",
      "name": "defs",
      "key": "defs",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "desc": {
      "target": "SVGDescElement",
      "name": "desc",
      "key": "desc",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "ellipse": {
      "target": "SVGEllipseElement",
      "name": "ellipse",
      "key": "ellipse",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "feBlend": {
      "target": "SVGFEBlendElement",
      "name": "feBlend",
      "key": "feBlend",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "feColorMatrix": {
      "target": "SVGFEColorMatrixElement",
      "name": "feColorMatrix",
      "key": "feColorMatrix",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "feComponentTransfer": {
      "target": "SVGFEComponentTransferElement",
      "name": "feComponentTransfer",
      "key": "feComponentTransfer",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "feComposite": {
      "target": "SVGFECompositeElement",
      "name": "feComposite",
      "key": "feComposite",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "feConvolveMatrix": {
      "target": "SVGFEConvolveMatrixElement",
      "name": "feConvolveMatrix",
      "key": "feConvolveMatrix",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "feDiffuseLighting": {
      "target": "SVGFEDiffuseLightingElement",
      "name": "feDiffuseLighting",
      "key": "feDiffuseLighting",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "feDisplacementMap": {
      "target": "SVGFEDisplacementMapElement",
      "name": "feDisplacementMap",
      "key": "feDisplacementMap",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "feDistantLight": {
      "target": "SVGFEDistantLightElement",
      "name": "feDistantLight",
      "key": "feDistantLight",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "feDropShadow": {
      "target": "SVGFEDropShadowElement",
      "name": "feDropShadow",
      "key": "feDropShadow",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "feFlood": {
      "target": "SVGFEFloodElement",
      "name": "feFlood",
      "key": "feFlood",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "feFuncA": {
      "target": "SVGFEFuncAElement",
      "name": "feFuncA",
      "key": "feFuncA",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "feFuncB": {
      "target": "SVGFEFuncBElement",
      "name": "feFuncB",
      "key": "feFuncB",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "feFuncG": {
      "target": "SVGFEFuncGElement",
      "name": "feFuncG",
      "key": "feFuncG",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "feFuncR": {
      "target": "SVGFEFuncRElement",
      "name": "feFuncR",
      "key": "feFuncR",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "feGaussianBlur": {
      "target": "SVGFEGaussianBlurElement",
      "name": "feGaussianBlur",
      "key": "feGaussianBlur",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "feImage": {
      "target": "SVGFEImageElement",
      "name": "feImage",
      "key": "feImage",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "feMerge": {
      "target": "SVGFEMergeElement",
      "name": "feMerge",
      "key": "feMerge",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "feMergeNode": {
      "target": "SVGFEMergeNodeElement",
      "name": "feMergeNode",
      "key": "feMergeNode",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "feMorphology": {
      "target": "SVGFEMorphologyElement",
      "name": "feMorphology",
      "key": "feMorphology",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "feOffset": {
      "target": "SVGFEOffsetElement",
      "name": "feOffset",
      "key": "feOffset",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "fePointLight": {
      "target": "SVGFEPointLightElement",
      "name": "fePointLight",
      "key": "fePointLight",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "feSpecularLighting": {
      "target": "SVGFESpecularLightingElement",
      "name": "feSpecularLighting",
      "key": "feSpecularLighting",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "feSpotLight": {
      "target": "SVGFESpotLightElement",
      "name": "feSpotLight",
      "key": "feSpotLight",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "feTile": {
      "target": "SVGFETileElement",
      "name": "feTile",
      "key": "feTile",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "feTurbulence": {
      "target": "SVGFETurbulenceElement",
      "name": "feTurbulence",
      "key": "feTurbulence",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "filter": {
      "target": "SVGFilterElement",
      "name": "filter",
      "key": "filter",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "g": {
      "target": "SVGGElement",
      "name": "g",
      "key": "g",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "image": {
      "target": "SVGImageElement",
      "name": "image",
      "key": "image",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "line": {
      "target": "SVGLineElement",
      "name": "line",
      "key": "line",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "linearGradient": {
      "target": "SVGLinearGradientElement",
      "name": "linearGradient",
      "key": "linearGradient",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "marker": {
      "target": "SVGMarkerElement",
      "name": "marker",
      "key": "marker",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "mask": {
      "target": "SVGMaskElement",
      "name": "mask",
      "key": "mask",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "metadata": {
      "target": "SVGMetadataElement",
      "name": "metadata",
      "key": "metadata",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "mpath": {
      "target": "SVGMPathElement",
      "name": "mpath",
      "key": "mpath",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "path": {
      "target": "SVGPathElement",
      "name": "path",
      "key": "path",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "polygon": {
      "target": "SVGPolygonElement",
      "name": "polygon",
      "key": "polygon",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "polyline": {
      "target": "SVGPolylineElement",
      "name": "polyline",
      "key": "polyline",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "radialGradient": {
      "target": "SVGRadialGradientElement",
      "name": "radialGradient",
      "key": "radialGradient",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "rect": {
      "target": "SVGRectElement",
      "name": "rect",
      "key": "rect",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "stop": {
      "target": "SVGStopElement",
      "name": "stop",
      "key": "stop",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "svg": {
      "target": "SVGSVGElement",
      "name": "svg",
      "key": "svg",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "set": {
      "target": "SVGSetElement",
      "name": "set",
      "key": "set",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "svgA": {
      "key": "a",
      "target": "SVGAElement",
      "name": "svgA",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "patternTag": {
      "key": "pattern",
      "target": "SVGPatternElement",
      "name": "patternTag",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "switchTag": {
      "key": "switch",
      "target": "SVGSwitchElement",
      "name": "switchTag",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "symbolTag": {
      "key": "symbol",
      "target": "SVGSymbolElement",
      "name": "symbolTag",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "svgTitleTag": {
      "key": "title",
      "target": "SVGTitleElement",
      "name": "svgTitleTag",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "svgScriptTag": {
      "key": "script",
      "target": "SVGScriptElement",
      "name": "svgScriptTag",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "svgStyleTag": {
      "key": "style",
      "target": "SVGStyleElement",
      "name": "svgStyleTag",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "text": {
      "key": "text",
      "target": "SVGTextElement",
      "name": "text",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "textPath": {
      "target": "SVGTextPathElement",
      "name": "textPath",
      "key": "textPath",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "tspan": {
      "target": "SVGTSpanElement",
      "name": "tspan",
      "key": "tspan",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "use": {
      "target": "SVGUseElement",
      "name": "use",
      "key": "use",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
    },
    "view": {
      "target": "SVGViewElement",
      "name": "view",
      "key": "view",
      "type": "svg",
      "parent": "SVGElement",
      "childs": "Text | SVGElement"
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
    "forAttr": {
      "target": "HTMLLabelElement | HTMLOutputElement",
      "name": "forAttr",
      "key": "forAttr"
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
    "getForAttr": {
      "name": "getForAttr",
      "key": "forAttr",
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
      "body": "export type Filter<TArg,TResult> = (arg: TArg) => TResult;"
    },
    "Task": {
      "name": "Task",
      "deps": [
        "Filter"
      ],
      "body": "export type Task<T> = Filter<T,T>;"
    },
    "Connector": {
      "name": "Connector",
      "deps": [
        "Filter",
        "Task"
      ],
      "body": "export type Connector<TTarget, TArg, TChild> = <T extends TTarget>(filter: Filter<TArg,TChild>, deriveArg: Filter<TTarget, TArg>) => Task<T>;"
    },
    "Branch": {
      "name": "Branch",
      "deps": [
        "Filter",
        "Task",
        "Connector"
      ],
      "body": "export type Branch<TArg, TTarget> = <TParent>(connector: Connector<TParent, TArg, TTarget>, deriveArg: Filter<TParent, TArg>) => Task<TParent>;"
    },
    "Adapter": {
      "name": "Adapter",
      "deps": [
        "Task",
        "Branch"
      ],
      "body": "export type Adapter<TArg, TTarget, TCompat> = (...args: (Task<TTarget> | TCompat)[]) => Branch<TArg, TTarget>;"
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
      "body": "export type Delegate<T> = [Curator<T>, Lookup<T>];"
    },
    "createTreeNodeAdapter": {
      "name": "createTreeNodeAdapter",
      "deps": [
        "Filter",
        "Connector",
        "Branch",
        "Adapter"
      ],
      "body": "export const createTreeNodeAdapter = <TArg, TTarget, TChild, K>(\n    factory: Filter<TArg, TTarget>,\n    connect: Connector<TTarget, TArg, TChild>,\n    deriveArg: Filter<TTarget, TArg>,\n    convert: Filter<K, Task<TTarget>>\n): Adapter<TArg, TTarget, K | Branch<TArg, TChild>> => \n    (...args: (Task<TTarget> | K | Branch<TArg, TChild>)[]): Branch<TArg, TTarget> => \n        <T>(tConnect: Connector<T, TArg, TTarget>, tDerive: Filter<T, TArg>): Task<T> => \n            tConnect(\n                args.reduce((filter, arg) => typeof arg === \"function\" ?\n                    (arg.length == 1 ? \n                        (ctx: TArg) => (arg as Task<TTarget>)(filter(ctx)) :\n                        (ctx: TArg) => (arg as Branch<TArg, TChild>)<TTarget>(connect, deriveArg)(filter(ctx))) :\n                    (ctx: TArg) => convert(arg)(filter(ctx)), factory), \n                tDerive\n            );"
    },
    "noConnector": {
      "name": "noConnector",
      "deps": [
        "Filter",
        "Task"
      ],
      "body": "export const noConnector = <TArg, T>(_: Filter<TArg, any>): Task<T> => (target: T) => target;"
    },
    "DOMTaskContext": {
      "name": "DOMTaskContext",
      "deps": [],
      "body": "export type DOMTaskContext = { document: Document, scope: string }"
    },
    "DOMTaskData": {
      "name": "DOMTaskData",
      "deps": [],
      "body": "export type DOMTaskData<T> = { element: T, document: Document, scope: string }"
    },
    "DOMTaskArg": {
      "name": "DOMTaskArg",
      "deps": [
        "DOMTaskContext"
      ],
      "body": "export type DOMTaskArg = DOMTaskContext | null | undefined;"
    },
    "DOMTaskCompatible": {
      "name": "DOMTaskCompatible",
      "deps": [],
      "body": "export type DOMTaskCompatible = string | number; // | Date | string[] | number[] | Element;"
    },
    "htmlScope": {
      "name": "htmlScope",
      "deps": [],
      "body": "const htmlScope = \"http://www.w3.org/1999/xhtml\";"
    },
    "svgScope": {
      "name": "svgScope",
      "deps": [],
      "body": "const svgScope = \"http://www.w3.org/2000/svg\";"
    },
    "mathmlScope": {
      "name": "mathmlScope",
      "deps": [],
      "body": "const mathmlScope = \"http://www.w3.org/1998/Math/MathML\";"
    },
    "textScope": {
      "name": "textScope",
      "deps": [],
      "body": "const textScope = \"text\";"
    },
    "contextualScope": {
      "name": "contextualScope",
      "deps": [],
      "body": "const contextualScope = \"ctx\";"
    },
    "defaultNodeFactory": {
      "name": "defaultNodeFactory",
      "deps": [
        "Filter",
        "DOMTaskArg",
        "DOMTaskData",
        "htmlScope"
      ],
      "body": "const defaultNodeFactory = <T>(tagName: string): Filter<DOMTaskArg, DOMTaskData<T>> => (arg: DOMTaskArg): DOMTaskData<T> => {\n    if(arg == null) arg = { document: document, scope: htmlScope };\n    (arg as DOMTaskData<T>).element = arg.document.createElement(tagName) as T;\n    return arg as DOMTaskData<T>;\n}"
    },
    "nodeFactory": {
      "name": "nodeFactory",
      "deps": [
        "Filter",
        "DOMTaskArg",
        "DOMTaskData",
        "defaultNodeFactory",
        "htmlScope",
        "svgScope",
        "mathmlScope",
        "textScope",
        "contextualScope"
      ],
      "body": "export const nodeFactory = <T>(tagName: string, scope?: string): Filter<DOMTaskArg, DOMTaskData<T>> => {\n    if(scope == null) return defaultNodeFactory(tagName);\n    switch(scope){\n        case htmlScope: return defaultNodeFactory(tagName);\n        case svgScope: return (arg: DOMTaskArg): DOMTaskData<T> => {\n            if(arg == null) arg = { document: document, scope: svgScope };\n            (arg as DOMTaskData<T>).element = arg.document.createElementNS(svgScope, tagName) as T;\n            return arg as DOMTaskData<T>;\n        };\n        case mathmlScope: return (arg: DOMTaskArg): DOMTaskData<T> => {\n            if(arg == null) arg = { document: document, scope: mathmlScope };\n            (arg as DOMTaskData<T>).element = arg.document.createElementNS(mathmlScope, tagName) as T;\n            return arg as DOMTaskData<T>;\n        };\n        case textScope: return (arg: DOMTaskArg): DOMTaskData<T> => {\n            if(arg == null) arg = { document: document, scope: textScope };\n            (arg as DOMTaskData<T>).element = arg.document.createTextNode(tagName) as T;\n            return arg as DOMTaskData<T>;\n        };\n        case contextualScope: return (arg: DOMTaskArg): DOMTaskData<T> => {\n            if(arg == null) arg = { document: document, scope: htmlScope };\n            return nodeFactory<T>(tagName, arg.scope)(arg);\n        };\n        default: return defaultNodeFactory(tagName);\n    }\n}"
    },
    "deriveDOMTaskArg": {
      "name": "deriveDOMTaskArg",
      "deps": [
        "DOMTaskData",
        "DOMTaskArg"
      ],
      "body": "export const deriveDOMTaskArg = <T>(data: DOMTaskData<T>): DOMTaskArg => data;"
    },
    "defaultConvert": {
      "name": "defaultConvert",
      "deps": [
        "Task",
        "DOMTaskData",
        "DOMTaskCompatible",
        "textScope"
      ],
      "body": "export const defaultConvert = <T extends Node>(arg: DOMTaskCompatible): Task<DOMTaskData<T>> => \n    (data: DOMTaskData<T>): DOMTaskData<T> => {\n        if(data.scope === textScope){\n            data.element.nodeValue = arg+\"\";\n        }else{\n            data.element.appendChild(data.document.createTextNode(arg+\"\"));\n        }\n        return data;\n    }"
    },
    "appendConnector": {
      "name": "appendConnector",
      "deps": [
        "Filter",
        "Task",
        "DOMTaskData",
        "DOMTaskArg"
      ],
      "body": "export const appendConnector = <T extends DOMTaskData<Element>>(filter: Filter<DOMTaskArg,DOMTaskData<Node>>): Task<T> =>\n    (data: T): T => {\n        data.element.appendChild(filter(data).element);\n        return data;\n    }"
    },
    "append": {
      "name": "append",
      "deps": [
        "Task",
        "Branch",
        "DOMTaskData",
        "DOMTaskArg",
        "appendConnector",
        "deriveDOMTaskArg"
      ],
      "body": "export const append = <T extends Element>(branch: Branch<DOMTaskArg, DOMTaskData<Node>>): Task<DOMTaskData<T>> => \n    branch<DOMTaskData<T>>(appendConnector, deriveDOMTaskArg);"
    },
    "appendTo": {
      "name": "appendTo",
      "deps": [
        "Task",
        "Lookup",
        "DOMTaskData",
        "DOMTaskArg"
      ],
      "body": "export const appendTo = <T extends Node>(lookup: Lookup<DOMTaskData<Element>>): Task<DOMTaskData<T>> => \n    (node: DOMTaskData<T>): DOMTaskData<T> => {\n        lookup()?.element.appendChild(node.element);\n        return node; \n    }"
    },
    "prependConnector": {
      "name": "prependConnector",
      "deps": [
        "Filter",
        "Task",
        "DOMTaskData",
        "DOMTaskArg"
      ],
      "body": "export const prependConnector = <T extends DOMTaskData<Element>>(filter: Filter<DOMTaskArg,DOMTaskData<Node>>): Task<T> =>\n    (data: T): T => {\n        data.element.prepend(filter(data).element);\n        return data;\n    }"
    },
    "prepend": {
      "name": "prepend",
      "deps": [
        "Task",
        "Branch",
        "DOMTaskData",
        "DOMTaskArg",
        "prependConnector",
        "deriveDOMTaskArg"
      ],
      "body": "export const prepend = <T extends Element>(branch: Branch<DOMTaskArg, DOMTaskData<Node>>): Task<DOMTaskData<T>> =>\n    branch<DOMTaskData<T>>(prependConnector, deriveDOMTaskArg);"
    },
    "prependTo": {
      "name": "prependTo",
      "deps": [
        "Task",
        "Lookup",
        "DOMTaskData",
        "DOMTaskArg"
      ],
      "body": "export const prependTo = <T extends Node>(lookup: Lookup<DOMTaskData<Element>>): Task<DOMTaskData<T>> =>\n    (node: DOMTaskData<T>): DOMTaskData<T> => {\n        lookup()?.element.prepend(node.element);\n        return node;\n    }"
    },
    "getElement": {
      "name": "getElement",
      "deps": [
        "Lookup",
        "DOMTaskData",
        "htmlScope"
      ],
      "body": "export const getElement = <T extends Element>(query: string, container: Element | Document): Lookup<DOMTaskData<T>> => () => {\n    const elt = container.querySelector(query);\n    return elt == null ? null : { \n        element: elt as T, \n        document: elt.ownerDocument, \n        scope: elt.namespaceURI ?? htmlScope\n    };\n}"
    },
    "fromElement": {
      "name": "fromElement",
      "deps": [
        "Lookup",
        "DOMTaskData",
        "htmlScope"
      ],
      "body": "export const fromElement = <T extends Element>(element: T): Lookup<DOMTaskData<T>> => () => {\n    return {\n        element: element,\n        document: element.ownerDocument,\n        scope: element.namespaceURI ?? htmlScope\n    }\n}"
    },
    "render": {
      "name": "render",
      "deps": [
        "Task",
        "Lookup",
        "DOMTaskData"
      ],
      "body": "export const render = <T extends Element>(lookup: Lookup<DOMTaskData<T>>, ...tasks: Task<DOMTaskData<T>>[]): Lookup<DOMTaskData<T>> => () => {\n    const target = lookup();\n    return target == null ? null : tasks.reduce((data, task) => task(data), target);\n}"
    },
    "renderAll": {
      "name": "renderAll",
      "deps": [
        "Task",
        "Lookup",
        "DOMTaskData"
      ],
      "body": "export const renderAll = <T extends Element>(lookup: Lookup<DOMTaskData<T>[]>, ...tasks: Task<DOMTaskData<T>>[]): Lookup<DOMTaskData<T>[]> => () => {\n    const targets = lookup();\n    return targets == null ? null : targets.map(target => tasks.reduce((data, task) => task(data), target));\n}"
    },
    "handleNode": {
      "name": "handleNode",
      "deps": [
        "Task",
        "DOMTaskData"
      ],
      "body": "export const handleNode = <T extends Node>(task: Task<T>): Task<DOMTaskData<T>> => (data: DOMTaskData<T>) => {\n    data.element = task(data.element);\n    return data;\n}"
    },
    "createRef": {
      "name": "createRef",
      "deps": [
        "Lookup",
        "Delegate",
        "DOMTaskData"
      ],
      "body": "export const createRef = <T extends Node>(): Delegate<DOMTaskData<T>> => {\n    let getData: Lookup<DOMTaskData<T>> = () => null;\n    return [\n        (lookup: Lookup<DOMTaskData<T>>) => { getData = lookup; },\n        () => getData()\n    ]\n}"
    },
    "createMultiRef": {
      "name": "createMultiRef",
      "deps": [
        "Curator",
        "Lookup",
        "DOMTaskData"
      ],
      "body": "export const createMultiRef = <T extends Node>(): [Curator<DOMTaskData<T>>, Lookup<DOMTaskData<T>[]>] => {\n    let getters: Lookup<DOMTaskData<T>>[] = [];\n    return [\n        (lookup: Lookup<DOMTaskData<T>>) => { getters.push(lookup); },\n        () => getters.map(getData => getData()).filter(data => data != null) as DOMTaskData<T>[]\n    ]\n}"
    },
    "createQuery": {
      "name": "createQuery",
      "deps": [
        "Lookup",
        "Delegate",
        "DOMTaskData"
      ],
      "body": "export const createQuery = (): Delegate<[string, unknown][]> => {\n    const getters: Lookup<[string, unknown][]>[] = [];\n    return [\n        (lookup: Lookup<[string, unknown][]>) => { getters.push(lookup); },\n        () => getters.reduce((entries: [string, unknown][], getData) => entries.concat(getData() ?? []), [])\n    ]\n}"
    },
    "ref": {
      "name": "ref",
      "deps": [
        "Task",
        "Curator",
        "DOMTaskData"
      ],
      "body": "export const ref = <T extends Node>(curator: Curator<DOMTaskData<T>>): Task<DOMTaskData<T>> => \n    (data: DOMTaskData<T>) => {\n        curator(() => data);\n        return data;\n    }"
    },
    "query": {
      "name": "query",
      "deps": [
        "Filter",
        "Task",
        "Curator",
        "DOMTaskData"
      ],
      "body": "export const query = <T extends Node>(curator: Curator<[string, unknown][]>, ...queries: Filter<DOMTaskData<T>, [string, unknown][]>[]): Task<DOMTaskData<T>> =>\n    (data: DOMTaskData<T>) => {\n        curator(() => queries.reduce((entries: [string, unknown][], query) => entries.concat(query(data)), []));\n        return data;\n    }"
    },
    "tag": {
      "name": "tag",
      "deps": [
        "Filter",
        "Task",
        "Connector",
        "Branch",
        "DOMTaskArg",
        "DOMTaskData",
        "DOMTaskCompatible",
        "nodeFactory",
        "defaultConvert",
        "appendConnector",
        "deriveDOMTaskArg"
      ],
      "body": "export const tag = <T extends Element>(\n    tag: string | [string, string], \n    ...tasks: (Task<DOMTaskData<T>> | Branch<DOMTaskArg, DOMTaskData<Element>> | DOMTaskCompatible)[]\n): Branch<DOMTaskArg, DOMTaskData<T>> => \n<TParent>(pConnect: Connector<TParent, DOMTaskArg, DOMTaskData<T>>, pDerive: Filter<TParent, DOMTaskArg>): Task<TParent> => \n    pConnect( \n        tasks.reduce(\n            (filter: Filter<DOMTaskArg, DOMTaskData<T>>, task) => typeof task === \"function\" ?\n                (task.length == 1 ? \n                    (ctx: DOMTaskArg) => (task as Task<DOMTaskData<T>>)(filter(ctx)) :\n                    (ctx: DOMTaskArg) => (task as Branch<DOMTaskArg, DOMTaskData<Element>>)<DOMTaskData<T>>(\n                        appendConnector, deriveDOMTaskArg\n                    )(filter(ctx))) :\n                (ctx: DOMTaskArg) => defaultConvert<T>(task)(filter(ctx)), \n            typeof tag === 'string' ? nodeFactory<T>(tag) : nodeFactory<T>(tag[0], tag[1])),\n        pDerive\n    );"
    },
    "DOMPropertyValue": {
      "name": "DOMPropertyValue",
      "deps": [],
      "body": "export type DOMPropertyValue = string | ((previous?: string) => string) | undefined;"
    },
    "DOMPropertyTask": {
      "name": "DOMPropertyTask",
      "deps": [
        "DOMPropertyValue",
        "Task",
        "DOMTaskData"
      ],
      "body": "export type DOMPropertyTask = <T extends Node>(value: DOMPropertyValue) => Task<DOMTaskData<T>>;"
    },
    "prop": {
      "name": "prop",
      "deps": [
        "Task",
        "DOMTaskData",
        "DOMPropertyValue"
      ],
      "body": "export const prop = <T extends Node>(key: string, value: DOMPropertyValue): Task<DOMTaskData<T>> =>\n    value === undefined ?\n        (data: DOMTaskData<T>) => { data.element[key] = null; return data; } :\n        typeof value === \"function\" ?\n            (data: DOMTaskData<T>) => { data.element[key] = value(data.element[key]); return data; } :\n            (data: DOMTaskData<T>) => { data.element[key] = value; return data; }"
    },
    "getProp": {
      "name": "getProp",
      "deps": [
        "Filter",
        "DOMTaskData"
      ],
      "body": "export const getProp = <T extends Node>(key: string, alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> =>\n    (data: DOMTaskData<T>) => [[alias || key, data.element[key]]];"
    },
    "removeProp": {
      "name": "removeProp",
      "deps": [
        "Task",
        "DOMTaskData"
      ],
      "body": "export const removeProp = <T extends Node>(key: string): Task<DOMTaskData<T>> => prop<T>(key, undefined);"
    },
    "attr": {
      "name": "attr",
      "deps": [
        "Task",
        "DOMTaskData",
        "DOMPropertyValue"
      ],
      "body": "export const attr = <T extends Element>(key: string, value: DOMPropertyValue): Task<DOMTaskData<T>> =>\n    value === undefined ?\n        (data: DOMTaskData<T>) => { data.element.removeAttribute(key); return data; } :\n        typeof value === \"function\" ?\n            (data: DOMTaskData<T>) => { data.element.setAttribute(key, value(data.element.getAttribute(key) ?? undefined)); return data; } :\n            (data: DOMTaskData<T>) => { data.element.setAttribute(key, value); return data; }"
    },
    "getAttr": {
      "name": "getAttr",
      "deps": [
        "Filter",
        "DOMTaskData"
      ],
      "body": "export const getAttr = <T extends Element>(key: string, alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> =>\n    (data: DOMTaskData<T>) => [[alias || key, data.element.getAttribute(key)]];"
    },
    "removeAttr": {
      "name": "removeAttr",
      "deps": [
        "Task",
        "DOMTaskData"
      ],
      "body": "export const removeAttr = <T extends Element>(key: string): Task<DOMTaskData<T>> => attr<T>(key, undefined);"
    },
    "ariaPreffix": {
      "name": "ariaPreffix",
      "deps": [],
      "body": "const ariaPreffix = \"aria-\";"
    },
    "aria": {
      "name": "aria",
      "deps": [
        "Task",
        "DOMTaskData",
        "DOMPropertyValue",
        "ariaPreffix"
      ],
      "body": "export const aria = <T extends Element>(key: string, value: DOMPropertyValue): Task<DOMTaskData<T>> => attr<T>(ariaPreffix+key, value);"
    },
    "getAria": {
      "name": "getAria",
      "deps": [
        "Filter",
        "DOMTaskData",
        "ariaPreffix"
      ],
      "body": "export const getAria = <T extends Element>(key: string, alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> => getAttr<T>(ariaPreffix+key, alias);"
    },
    "removeAria": {
      "name": "removeAria",
      "deps": [
        "Task",
        "DOMTaskData",
        "ariaPreffix"
      ],
      "body": "export const removeAria = <T extends Element>(key: string): Task<DOMTaskData<T>> => aria<T>(ariaPreffix+key, undefined);"
    },
    "SpecializedElement": {
      "name": "SpecializedElement",
      "deps": [],
      "body": "export type SpecializedElement = HTMLElement | SVGElement | MathMLElement;"
    },
    "dataAttr": {
      "name": "dataAttr",
      "deps": [
        "Task",
        "DOMTaskData",
        "DOMPropertyValue",
        "SpecializedElement"
      ],
      "body": "export const dataAttr = <T extends SpecializedElement>(key: string, value: DOMPropertyValue): Task<DOMTaskData<T>> =>\n    value === undefined ?\n        (data: DOMTaskData<T>) => { delete data.element.dataset[key]; return data; } :\n        typeof value === \"function\" ?\n            (data: DOMTaskData<T>) => { data.element.dataset[key] = value(data.element.dataset[key] ?? undefined); return data; } :\n            (data: DOMTaskData<T>) => { data.element.dataset[key] = value; return data; }"
    },
    "getDataAttr": {
      "name": "getDataAttr",
      "deps": [
        "Filter",
        "DOMTaskData",
        "SpecializedElement"
      ],
      "body": "export const getDataAttr = <T extends SpecializedElement>(key: string, alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> =>\n    (data: DOMTaskData<T>) => [[alias || key, data.element.dataset[key]]];"
    },
    "removeDataAttr": {
      "name": "removeDataAttr",
      "deps": [
        "Task",
        "DOMTaskData",
        "SpecializedElement"
      ],
      "body": "export const removeDataAttr = <T extends SpecializedElement>(key: string): Task<DOMTaskData<T>> => dataAttr<T>(key, undefined);"
    },
    "style": {
      "name": "style",
      "deps": [
        "Task",
        "DOMTaskData",
        "DOMPropertyValue",
        "SpecializedElement"
      ],
      "body": "export const style = <T extends SpecializedElement>(key: string, value: DOMPropertyValue): Task<DOMTaskData<T>> =>\n    value === undefined ?\n        (data: DOMTaskData<T>) => { data.element.style[key] = null; return data; } :\n        typeof value === \"function\" ?\n            (data: DOMTaskData<T>) => { data.element.style[key] = value(data.element.style[key] ?? undefined); return data; } :\n            (data: DOMTaskData<T>) => { data.element.style[key] = value; return data; }"
    },
    "css": {
      "name": "css",
      "deps": [
        "Task",
        "DOMTaskData",
        "SpecializedElement"
      ],
      "body": "export const css = <T extends SpecializedElement>(value: string | ((previous: string) => string)): Task<DOMTaskData<T>> =>\n    typeof value === \"function\" ?\n        (data: DOMTaskData<T>) => { data.element.style.cssText = value(data.element.style.cssText); return data; } :\n        (data: DOMTaskData<T>) => { data.element.style.cssText = value; return data; }"
    },
    "getStyle": {
      "name": "getStyle",
      "deps": [
        "Filter",
        "DOMTaskData",
        "SpecializedElement"
      ],
      "body": "export const getStyle = <T extends SpecializedElement>(key: string, alias?: string): Filter<DOMTaskData<T>,[string, unknown][]> =>\n    (data: DOMTaskData<T>) => [[alias || key, data.element.style[key]]];"
    },
    "removeStyle": {
      "name": "removeStyle",
      "deps": [
        "Task",
        "DOMTaskData",
        "SpecializedElement"
      ],
      "body": "export const removeStyle = <T extends SpecializedElement>(key: string): Task<DOMTaskData<T>> => style<T>(key, undefined);"
    },
    "remove": {
      "name": "remove",
      "deps": [
        "Task",
        "DOMTaskData",
        "DOMPropertyTask"
      ],
      "body": "export const remove = <T extends Node>(property: DOMPropertyTask): Task<DOMTaskData<T>> => property(undefined);"
    },
    "subscribe": {
      "name": "subscribe",
      "deps": [
        "Task",
        "DOMTaskData"
      ],
      "body": "export const subscribe = <T extends EventTarget>(\n    eventType: string,\n    listener: EventListenerOrEventListenerObject, \n    options?: boolean | AddEventListenerOptions\n): Task<DOMTaskData<T>> => (data: DOMTaskData<T>) => { \n    data.element.addEventListener(eventType, listener, options); \n    return data; \n}"
    },
    "unsubscribe": {
      "name": "unsubscribe",
      "deps": [
        "Task",
        "DOMTaskData"
      ],
      "body": "export const unsubscribe = <T extends EventTarget>(\n    eventType: string,\n    listener: EventListenerOrEventListenerObject, \n    options?: boolean | AddEventListenerOptions\n): Task<DOMTaskData<T>> => (data: DOMTaskData<T>) => { \n    data.element.removeEventListener(eventType, listener, options); \n    return data; \n}"
    },
    "HTMLProxyTarget": {
      "name": "HTMLProxyTarget",
      "deps": [
        "Adapter",
        "Branch",
        "DOMTaskArg",
        "DOMTaskData"
      ],
      "body": "export type HTMLProxyTarget = Record<string, Adapter<DOMTaskArg, DOMTaskData<HTMLElement>, string | Branch<DOMTaskArg, DOMTaskData<Text | HTMLElement>>>>;"
    },
    "SVGProxyTarget": {
      "name": "SVGProxyTarget",
      "deps": [
        "Adapter",
        "Branch",
        "DOMTaskArg",
        "DOMTaskData"
      ],
      "body": "export type SVGProxyTarget = Record<string, Adapter<DOMTaskArg, DOMTaskData<SVGElement>, string | Branch<DOMTaskArg, DOMTaskData<Text | SVGElement>>>>;"
    },
    "MathMLProxyTarget": {
      "name": "MathMLProxyTarget",
      "deps": [
        "Adapter",
        "Branch",
        "DOMTaskArg",
        "DOMTaskData"
      ],
      "body": "export type MathMLProxyTarget = Record<string, Adapter<DOMTaskArg, DOMTaskData<MathMLElement>, string | Branch<DOMTaskArg, DOMTaskData<Text | MathMLElement>>>>;"
    },
    "DOMPropertyProxyTarget": {
      "name": "DOMPropertyProxyTarget",
      "deps": [
        "DOMPropertyTask"
      ],
      "body": "export type DOMPropertyProxyTarget = Record<string, DOMPropertyTask>;"
    },
    "DOMAttributeProxyTarget": {
      "name": "DOMAttributeProxyTarget",
      "deps": [
        "Task",
        "DOMTaskData",
        "DOMPropertyValue"
      ],
      "body": "export type DOMAttributeProxyTarget = Record<string, (value: DOMPropertyValue) => Task<DOMTaskData<Element>>>;"
    },
    "DOMStylePropertyProxyTarget": {
      "name": "DOMStylePropertyProxyTarget",
      "deps": [
        "Task",
        "DOMTaskData",
        "DOMPropertyValue",
        "SpecializedElement"
      ],
      "body": "export type DOMStylePropertyProxyTarget = Record<string, (value: DOMPropertyValue) => Task<DOMTaskData<SpecializedElement>>>;"
    },
    "DOMEventProxyTarget": {
      "name": "DOMEventProxyTarget",
      "deps": [
        "Task",
        "DOMTaskData"
      ],
      "body": "export type DOMEventProxyTarget = Record<string, (listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => Task<DOMTaskData<EventTarget>>>;"
    },
    "adapters": {
      "name": "adapters",
      "deps": [
        "HTMLProxyTarget",
        "SVGProxyTarget",
        "MathMLProxyTarget",
        "DOMTaskArg",
        "DOMTaskData",
        "createTreeNodeAdapter",
        "nodeFactory",
        "appendConnector",
        "deriveDOMTaskArg",
        "defaultConvert",
        "htmlScope",
        "svgScope",
        "mathmlScope"
      ],
      "body": "export const adapters = {\n    html: new Proxy<HTMLProxyTarget>({}, {\n        get(target, key, receiver) {\n            if(typeof key === \"string\") return createTreeNodeAdapter<\n                DOMTaskArg, DOMTaskData<HTMLElement>, DOMTaskData<Text | HTMLElement>, string\n            >(nodeFactory<HTMLElement>(key, htmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);\n            return Reflect.get(target, key, receiver);\n        }\n    }),\n    svg: new Proxy<SVGProxyTarget>({}, {\n        get(target, key, receiver) {\n            if(typeof key === \"string\") return createTreeNodeAdapter<\n                DOMTaskArg, DOMTaskData<SVGElement>, DOMTaskData<Text | SVGElement>, string\n            >(nodeFactory<SVGElement>(key, svgScope), appendConnector, deriveDOMTaskArg, defaultConvert);\n            return Reflect.get(target, key, receiver);\n        }\n    }),\n    math: new Proxy<MathMLProxyTarget>({}, {\n        get(target, key, receiver) {\n            if(typeof key === \"string\") return createTreeNodeAdapter<\n                DOMTaskArg, DOMTaskData<MathMLElement>, DOMTaskData<Text | MathMLElement>, string\n            >(nodeFactory<MathMLElement>(key, mathmlScope), appendConnector, deriveDOMTaskArg, defaultConvert);\n            return Reflect.get(target, key, receiver);\n        }\n    }),\n    props: new Proxy<DOMPropertyProxyTarget>({}, {\n        get(target, key, receiver) {\n            if(typeof key === \"string\") return (value: DOMPropertyValue): Task<DOMTaskData<Node>> => prop(key, value);\n            return Reflect.get(target, key, receiver);\n        }\n    }),\n    attrs: new Proxy<DOMAttributeProxyTarget>({}, {\n        get(target, key, receiver) {\n            if(typeof key === \"string\") return (value: DOMPropertyValue): Task<DOMTaskData<Element>> => \n                attr(/^aria[A-Z].*$/g.test(key) ? key.replace('aria', ariaPreffix) : key, value);\n            return Reflect.get(target, key, receiver);\n        }\n    }),\n    style: new Proxy<DOMStylePropertyProxyTarget>({}, {\n        get(target, key, receiver) {\n            if(typeof key === \"string\") return (value: DOMPropertyValue): Task<DOMTaskData<SpecializedElement>> => style(key, value);\n            return Reflect.get(target, key, receiver);\n        }\n    }),\n    events: new Proxy<DOMEventProxyTarget>({}, {\n        get(target, key, receiver) {\n            if(typeof key === \"string\") return (key.startsWith('on') && key.length > 2) ? \n                (listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<EventTarget>> => subscribe(key.slice(2).toLowerCase(), listener, options) :\n                (key.startsWith('off') && key.length > 3) ?\n                    (listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<EventTarget>> => unsubscribe(key.slice(3).toLowerCase(), listener, options) :\n                    (listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<EventTarget>> => subscribe(key, listener, options);\n\n            return Reflect.get(target, key, receiver);\n        }\n    })\n};"
    },
    "DOMPropertyQueryProxyTarget": {
      "name": "DOMPropertyQueryProxyTarget",
      "deps": [
        "Filter",
        "DOMTaskData"
      ],
      "body": "export type DOMPropertyQueryProxyTarget = Record<string, (key: string, alias?: string) => Filter<DOMTaskData<Node>,[string, unknown][]>>;"
    },
    "DOMStylePropertyQueryProxyTarget": {
      "name": "DOMStylePropertyQueryProxyTarget",
      "deps": [
        "Filter",
        "DOMTaskData",
        "SpecializedElement"
      ],
      "body": "export type DOMStylePropertyQueryProxyTarget = Record<string, (key: string, alias?: string) => Filter<DOMTaskData<SpecializedElement>,[string, unknown][]>>;"
    },
    "queries": {
      "name": "queries",
      "deps": [
        "DOMPropertyQueryProxyTarget",
        "DOMStylePropertyQueryProxyTarget",
        "Filter",
        "DOMTaskData",
        "SpecializedElement"
      ],
      "body": "export const queries = {\n    props: new Proxy<DOMPropertyQueryProxyTarget>({},{\n        get(target, key, receiver) {\n            if(typeof key === \"string\") return (key: string, alias?: string): Filter<DOMTaskData<Node>,[string, unknown][]> => \n                getProp(key, alias);\n            return Reflect.get(target, key, receiver);\n        }\n    }),\n    style: new Proxy<DOMStylePropertyQueryProxyTarget>({},{\n        get(target, key, receiver) {\n            if(typeof key === \"string\") return (key: string, alias?: string): Filter<DOMTaskData<SpecializedElement>,[string, unknown][]> => \n                getStyle(key, alias);\n            return Reflect.get(target, key, receiver);\n        }\n    })\n}"
    }
  }
}
    if(tokens == null) return renderAllEntries(entryMap);
    if(tokens.length == 0) return renderAllEntries(entryMap);
    return renderSelectedEntries(entryMap, tokens);
}
