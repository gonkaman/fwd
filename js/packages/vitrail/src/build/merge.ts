import { ActionEntry, AdapterEntry, AttributeEntry, CoreEntry, EntryMap, EventEntry, PropertyEntry, QueryEntry } from "../main/engine.ts";

type AdapterDefaultData = {
    target: string,
    type: string,
    parent: string | string[],
    childs: string | string[]
}

const checkKeyCollision = (key: string, processedKeys: Set<string>, keywords: string[]) => {
    if(processedKeys.has(key)) throw new Error(`! Duplicate keys found while loading entries data: [${key}]`);
    if(keywords.indexOf(key) >= 0) throw new Error(`! Collision with keywords found while loading entries data: [${key}]`);
}

const formatAdapters = (data: Record<string,any> | null | undefined, defaultData: AdapterDefaultData, processedKeys: Set<string>, keywords: string[]): Record<string, AdapterEntry> => {
    if(data == null) return {};
    return Object.fromEntries(Object.entries(data).map(entry => {
        checkKeyCollision(entry[0], processedKeys, keywords);
        
        if(typeof entry[1] === 'string') return [
            entry[0], 
            {
                name: entry[0], 
                key: entry[1], 
                target: defaultData.target, 
                type: defaultData.type, 
                parent: Array.isArray(defaultData.parent) ? defaultData.parent.join(" | ") : defaultData.parent,
                childs: Array.isArray(defaultData.childs) ? defaultData.childs.join(" | ") : defaultData.childs
            }
        ];

        entry[1]["name"] = entry[0];
        if(entry[1]["key"] == null) entry[1]["key"] = entry[0];
        if(entry[1]["target"] == null) entry[1]["target"] = defaultData.target;
        if(entry[1]["type"] == null) entry[1]["type"] = defaultData.type;
        if(entry[1]["parent"] == null) entry[1]["parent"] = defaultData.parent;
        if(Array.isArray(entry[1]["parent"])) entry[1]["parent"] = entry[1]["parent"].join(" | ");
        if(entry[1]["childs"] == null) entry[1]["childs"] = defaultData.childs;
        if(Array.isArray(entry[1]["childs"])) entry[1]["childs"] = entry[1]["childs"].join(" | ");
        return entry;
    }));
} 

const formatAttributes = (data: Record<string,any> | null | undefined, defaultTarget: string | string[], processedKeys: Set<string>, keywords: string[]): Record<string, AttributeEntry> => {
    if(data == null) return {};
    return Object.fromEntries(Object.entries(data).map(entry => {
        checkKeyCollision(entry[0], processedKeys, keywords);
        if(typeof entry[1] === 'string') return [entry[0], {name: entry[0], key: entry[1], target: Array.isArray(defaultTarget) ? defaultTarget.join(" | ") : defaultTarget}];
        entry[1]["name"] = entry[0];
        if(entry[1]["target"] == null) entry[1]["target"] = defaultTarget;
        if(Array.isArray(entry[1]["target"])) entry[1]["target"] = entry[1]["target"].join(" | ");
        if(entry[1]["key"] == null) entry[1]["key"] = entry[0];
        return entry;
    }));
} 

const formatProperties = (data: Record<string,any> | null | undefined, defaultTarget: string | string[], processedKeys: Set<string>, keywords: string[]): Record<string, PropertyEntry> => {
    if(data == null) return {};
    return Object.fromEntries(Object.entries(data).map(entry => {
        checkKeyCollision(entry[0], processedKeys, keywords);
        if(typeof entry[1] === 'string') return [entry[0], {name: entry[0], key: entry[1], target: Array.isArray(defaultTarget) ? defaultTarget.join(" | ") : defaultTarget}];
        entry[1]["name"] = entry[0];
        if(entry[1]["target"] == null) entry[1]["target"] = defaultTarget;
        if(Array.isArray(entry[1]["target"])) entry[1]["target"] = entry[1]["target"].join(" | ");
        if(entry[1]["key"] == null) entry[1]["key"] = entry[0];
        return entry;
    }));
} 

const formatQueries = (data: Record<string,any> | null | undefined, defaultTarget: string | string[], processedKeys: Set<string>, keywords: string[]): Record<string, QueryEntry> => {
    if(data == null) return {};
    return Object.fromEntries(Object.entries(data).map(entry => {
        checkKeyCollision(entry[0], processedKeys, keywords);
        if(typeof entry[1] === 'string') return [entry[0], {name: entry[0], key: entry[1], getter: "getProp", target: Array.isArray(defaultTarget) ? defaultTarget.join(" | ") : defaultTarget}];
        entry[1]["name"] = entry[0];
        if(entry[1]["target"] == null) entry[1]["target"] = defaultTarget;
        if(Array.isArray(entry[1]["target"])) entry[1]["target"] = entry[1]["target"].join(" | ");
        if(entry[1]["key"] == null) entry[1]["key"] = entry[0];
        if(entry[1]["getter"] == null) entry[1]["getter"] = "getProp";
        return entry;
    }));
} 

const formatActions = (data: Record<string,any> | null | undefined, defaultTarget: string | string[], processedKeys: Set<string>, keywords: string[]): Record<string, ActionEntry> => {
    if(data == null) return {};
    return Object.fromEntries(Object.entries(data).map(entry => {
        checkKeyCollision(entry[0], processedKeys, keywords);
        const requiredKeys = ["callPath","arguments"];
        requiredKeys.forEach(key => {
            if(entry[1][key] == null) throw new Error(`! Missing required key found while loading action data: [action: ${entry[0]}, missing key: ${key}]`);
        })
        entry[1]["name"] = entry[0];
        if(entry[1]["target"] == null) entry[1]["target"] = defaultTarget;
        if(Array.isArray(entry[1]["target"])) entry[1]["target"] = entry[1]["target"].join(" | ");
        return entry;
    }));
} 

const formatEvents = (data: Record<string,any> | null | undefined, defaultTarget: string | string[], processedKeys: Set<string>, keywords: string[]): Record<string, EventEntry> => {
    if(data == null) return {};
    return Object.fromEntries(Object.entries(data).map(entry => {
        checkKeyCollision(entry[0], processedKeys, keywords);
        if(typeof entry[1] === 'string') return [entry[0], {name: entry[0], key: entry[1], target: Array.isArray(defaultTarget) ? defaultTarget.join(" | ") : defaultTarget}];
        entry[1]["name"] = entry[0];
        if(entry[1]["key"] == null) entry[1]["key"] = entry[0].slice(2).toLowerCase();
        if(entry[1]["target"] == null) entry[1]["target"] = defaultTarget;
        if(Array.isArray(entry[1]["target"])) entry[1]["target"] = entry[1]["target"].join(" | ");
        return entry;
    }));
} 

const formatBaseEntries = (data: Record<string, any>, processedKeys: Set<string>, keywords: string[]): EntryMap => {
    const baseAdapterDefaults : AdapterDefaultData = { target: "Element", type: "html", parent: "undefined", childs: "undefined"};
    const baseAttributeDefaultTarget = "Element";
    const basePropertyDefaultTarget = "Element";
    const baseQueryDefaultTarget = "Element";
    const baseActionDefaultTarget = "Element";
    const baseEventDefaultTarget = "EventTarget";
    return {
        adapter: formatAdapters(data["adapter"], baseAdapterDefaults, processedKeys, keywords),
        attribute: formatAttributes(data["attribute"], baseAttributeDefaultTarget, processedKeys, keywords),
        property: formatProperties(data["property"], basePropertyDefaultTarget, processedKeys, keywords),
        query: formatQueries(data["query"], baseQueryDefaultTarget, processedKeys, keywords),
        action: formatActions(data["action"], baseActionDefaultTarget, processedKeys, keywords),
        event: formatEvents(data["event"], baseEventDefaultTarget, processedKeys, keywords),
        provided: {}
    };
}

const formatHtmlEntries = (data: Record<string, any>, processedKeys: Set<string>, keywords: string[]): EntryMap => {
    const baseAdapterDefaults : AdapterDefaultData = { target: "HTMLElement", type: "html", parent: "HTMLElement", childs: ["Text", "HTMLElement"]};
    const baseAttributeDefaultTarget = "HTMLElement";
    const basePropertyDefaultTarget = "HTMLElement";
    const baseQueryDefaultTarget = "HTMLElement";
    const baseActionDefaultTarget = "HTMLElement";
    const baseEventDefaultTarget = "HTMLElement";
    return {
        adapter: formatAdapters(data["adapter"], baseAdapterDefaults, processedKeys, keywords),
        attribute: formatAttributes(data["attribute"], baseAttributeDefaultTarget, processedKeys, keywords),
        property: formatProperties(data["property"], basePropertyDefaultTarget, processedKeys, keywords),
        query: formatQueries(data["query"], baseQueryDefaultTarget, processedKeys, keywords),
        action: formatActions(data["action"], baseActionDefaultTarget, processedKeys, keywords),
        event: formatEvents(data["event"], baseEventDefaultTarget, processedKeys, keywords),
        provided: {}
    };
}

const formatSvgEntries = (data: Record<string, any>, processedKeys: Set<string>, keywords: string[]): EntryMap => {
    const baseAdapterDefaults : AdapterDefaultData = { target: "SVGElement", type: "svg", parent: "SVGElement", childs: ["Text", "SVGElement"]};
    const baseAttributeDefaultTarget = "SVGElement";
    const basePropertyDefaultTarget = "SVGElement";
    const baseQueryDefaultTarget = "SVGElement";
    const baseActionDefaultTarget = "SVGElement";
    const baseEventDefaultTarget = "SVGElement";
    return {
        adapter: formatAdapters(data["adapter"], baseAdapterDefaults, processedKeys, keywords),
        attribute: formatAttributes(data["attribute"], baseAttributeDefaultTarget, processedKeys, keywords),
        property: formatProperties(data["property"], basePropertyDefaultTarget, processedKeys, keywords),
        query: formatQueries(data["query"], baseQueryDefaultTarget, processedKeys, keywords),
        action: formatActions(data["action"], baseActionDefaultTarget, processedKeys, keywords),
        event: formatEvents(data["event"], baseEventDefaultTarget, processedKeys, keywords),
        provided: {}
    };
}

const formatMathmlEntries = (data: Record<string, any>, processedKeys: Set<string>, keywords: string[]): EntryMap => {
    const baseAdapterDefaults : AdapterDefaultData = { target: "MathMLElement", type: "mathml", parent: "MathMLElement", childs: ["Text", "MathMLElement"]};
    const baseAttributeDefaultTarget = "MathMLElement";
    const basePropertyDefaultTarget = "MathMLElement";
    const baseQueryDefaultTarget = "MathMLElement";
    const baseActionDefaultTarget = "MathMLElement";
    const baseEventDefaultTarget = "MathMLElement";
    return {
        adapter: formatAdapters(data["adapter"], baseAdapterDefaults, processedKeys, keywords),
        attribute: formatAttributes(data["attribute"], baseAttributeDefaultTarget, processedKeys, keywords),
        property: formatProperties(data["property"], basePropertyDefaultTarget, processedKeys, keywords),
        query: formatQueries(data["query"], baseQueryDefaultTarget, processedKeys, keywords),
        action: formatActions(data["action"], baseActionDefaultTarget, processedKeys, keywords),
        event: formatEvents(data["event"], baseEventDefaultTarget, processedKeys, keywords),
        provided: {}
    };
}

const generateAttributeGetter = (attr: AttributeEntry): QueryEntry => {
    return {
        name: 'get' + attr.name[0].toUpperCase() + attr.name.slice(1),
        key: attr.name,
        target: attr.target,
        getter: "getAttr"
    }
}

const generatePropertyGetter = (prop: PropertyEntry): QueryEntry => {
    return {
        name: 'get' + prop.name[0].toUpperCase() + prop.name.slice(1),
        key: prop.name,
        target: prop.target,
        getter: "getProp"
    }
}


const buildEntryMap = (corelibSource: string, ...formattedEntries: EntryMap[]): EntryMap => {
    const result : EntryMap = {
        adapter: {},
        attribute: {},
        property: {},
        query: {},
        action: {},
        event: {},
        provided: {}
    };

    formattedEntries.forEach(entry => {
        Object.assign(result.adapter, entry.adapter);
        Object.assign(result.attribute, entry.attribute);
        Object.values(entry.attribute).forEach(value => {
            result.query[value.name] = generateAttributeGetter(value);
        });
        Object.assign(result.property, entry.property);
        Object.values(entry.property).forEach(value => {
            result.query[value.name] = generatePropertyGetter(value);
        });
        Object.assign(result.query, entry.query);
        Object.assign(result.action, entry.action);
        Object.assign(result.event, entry.event);
    });

    result.provided = Object.fromEntries(corelibSource.split('//@@').slice(1).map(entry => {
        const parts = entry.split('@@//\n');
        const headers = parts[0].split('>');
        return [
            headers[0].trim(), 
            {
                name: headers[0].trim(),
                deps: headers.length > 1 ? headers[1].split(',').map(dep => dep.trim()) : [],
                body: parts[1].trim()
            }
        ];
    }));

    return result;
}


const keys: Set<string> = new Set([]);
const keywords = await Deno.readTextFile("../resources/keywords.json").then(content => JSON.parse(content));

const coreLib = await Deno.readTextFile("../resources/lib.ts");
const baseEntryData = await Deno.readTextFile("../resources/baseEntries.json")
                        .then(content => formatBaseEntries(JSON.parse(content), keys, keywords));
const htmlEntryData = await Deno.readTextFile("../resources/htmlEntries.json")
                        .then(content => formatHtmlEntries(JSON.parse(content), keys, keywords));
const svgEntryData = await Deno.readTextFile("../resources/svgEntries.json")
                        .then(content => formatSvgEntries(JSON.parse(content), keys, keywords));
const mathmlEntryData = await Deno.readTextFile("../resources/mathmlEntries.json")
                        .then(content => formatMathmlEntries(JSON.parse(content), keys, keywords));

const entryMap : EntryMap = buildEntryMap(coreLib, baseEntryData, htmlEntryData, svgEntryData, mathmlEntryData);
const generated_source = await Deno.readTextFile("../main/index.ts")
                        .then(content => content.replace(/\{\/\*entrymap\*\/\}/g, JSON.stringify(entryMap, null, 2)));
await Deno.writeTextFile("./tmp/index.ts", generated_source);
console.log("reference build source generated !");