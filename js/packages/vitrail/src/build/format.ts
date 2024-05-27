import { AdapterEntry, AttributeEntry, PropertyEntry, QueryEntry, ActionEntry, ActionArgEntry, EventEntry, EntryMap } from "../main/generator.ts"

type AdapterDefaultData = {
    target: string,
    type: string,
    parent: string | string[],
    childs: string | string[],
    preffix?: string
}

export type EntryNameProvider = (entryKey: string, entryData: any, defaultPreffix?: string) => string;

export const getEntryNameProvider = (processedKeys: Set<string>, keywords: string[]): EntryNameProvider => {
    return (key: string, data: any, preffix?: string): string => {
        let entryName = key;
        if(keywords.indexOf(entryName) >= 0){
            entryName = (preffix == null ? "$" : preffix)+key;
            console.warn(`* Collision with a registered keyword detected, changed entry name from [${key}] to [${entryName}]`)
            if(keywords.indexOf(entryName) >= 0){
                throw new Error(`
! Collision with keywords found while loading entries data: [${key}]
* Couldn't avoid collision even when using collision avoidance policies [${key} , ${entryName}]`);
            }
        }
        if(processedKeys.has(entryName)){
            throw new Error(`
! Duplicate keys found while loading entries data: [${key} , ${entryName}]`);
        }
        processedKeys.add(entryName);
        return entryName;
    };
}

const formatAdapters = (data: Record<string,any> | null | undefined, defaultData: AdapterDefaultData, getName: EntryNameProvider): Record<string, AdapterEntry> => {
    if(data == null) return {};
    return Object.fromEntries(Object.entries(data).map(entry => {
        const name = getName(...entry, defaultData.preffix);
        if(typeof entry[1] === 'string') return [
            entry[0], 
            {
                name: name, 
                key: entry[1], 
                target: defaultData.target, 
                type: defaultData.type, 
                parent: Array.isArray(defaultData.parent) ? defaultData.parent.join(" | ") : defaultData.parent,
                childs: Array.isArray(defaultData.childs) ? defaultData.childs.join(" | ") : defaultData.childs
            }
        ];

        entry[1]["name"] = name;
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

const formatAttributes = (data: Record<string,any> | null | undefined, defaultTarget: string | string[], getName: EntryNameProvider): Record<string, AttributeEntry> => {
    if(data == null) return {};
    return Object.fromEntries(Object.entries(data).map(entry => {
        const name = getName(...entry);
        if(typeof entry[1] === 'string') return [name, {name: name, key: entry[1], target: Array.isArray(defaultTarget) ? defaultTarget.join(" | ") : defaultTarget}];
        entry[1]["name"] = name;
        if(entry[1]["target"] == null) entry[1]["target"] = defaultTarget;
        if(Array.isArray(entry[1]["target"])) entry[1]["target"] = entry[1]["target"].join(" | ");
        if(entry[1]["key"] == null) entry[1]["key"] = entry[0];
        return entry;
    }));
} 

const formatProperties = (data: Record<string,any> | null | undefined, defaultTarget: string | string[], getName: EntryNameProvider): Record<string, PropertyEntry> => {
    if(data == null) return {};
    return Object.fromEntries(Object.entries(data).map(entry => {
        const name = getName(...entry);
        if(typeof entry[1] === 'string') return [name, {name: name, key: entry[1], target: Array.isArray(defaultTarget) ? defaultTarget.join(" | ") : defaultTarget}];
        entry[1]["name"] = name;
        if(entry[1]["target"] == null) entry[1]["target"] = defaultTarget;
        if(Array.isArray(entry[1]["target"])) entry[1]["target"] = entry[1]["target"].join(" | ");
        if(entry[1]["key"] == null) entry[1]["key"] = entry[0];
        return entry;
    }));
} 

const formatQueries = (data: Record<string,any> | null | undefined, defaultTarget: string | string[], getName: EntryNameProvider): Record<string, QueryEntry> => {
    if(data == null) return {};
    return Object.fromEntries(Object.entries(data).map(entry => {
        const name = getName(...entry);
        if(typeof entry[1] === 'string') return [name, {name: name, key: entry[1], getter: "getProp", target: Array.isArray(defaultTarget) ? defaultTarget.join(" | ") : defaultTarget}];
        entry[1]["name"] = name;
        if(entry[1]["target"] == null) entry[1]["target"] = defaultTarget;
        if(Array.isArray(entry[1]["target"])) entry[1]["target"] = entry[1]["target"].join(" | ");
        if(entry[1]["key"] == null) entry[1]["key"] = entry[0];
        if(entry[1]["getter"] == null) entry[1]["getter"] = "getProp";
        return entry;
    }));
} 

const formatActionArguments = (data: any): ActionArgEntry[] => {
    if(data == null) return [];
    return Object.entries(data).map(entry => {
        let name : string = entry[0], type : string = "", optional : boolean = false;
        if(typeof entry[1] === 'string'){
            type = entry[1];
        }else if(entry[1] != null){
            if(entry[1].hasOwnProperty("type")) type = (entry[1] as {type: any}).type+"";
            if(entry[1].hasOwnProperty("optional")) optional = (entry[1]  as {optional: any}).optional+"" !== "false";
        }
        if(entry[0].slice(-1) === "?"){
            name = entry[0].slice(0,-1);
            optional = true;
        }
        return {name: name, type: type, optional: optional};
    });
}

const formatActions = (data: Record<string,any> | null | undefined, defaultTarget: string | string[], getName: EntryNameProvider): Record<string, ActionEntry> => {
    if(data == null) return {};
    return Object.fromEntries(Object.entries(data).map(entry => {
        const requiredKeys = ["callPath","arguments"];
        requiredKeys.forEach(key => {
            if(entry[1][key] == null) throw new Error(`! Missing required key found while loading action data: [action: ${entry[0]}, missing key: ${key}]`);
        });
        const name = getName(...entry);
        entry[1]["name"] = name;
        if(entry[1]["target"] == null) entry[1]["target"] = defaultTarget;
        if(Array.isArray(entry[1]["target"])) entry[1]["target"] = entry[1]["target"].join(" | ");
        entry[1]["arguments"] = formatActionArguments(entry[1]["arguments"]);
        return entry;
    }));
} 

const formatEvents = (data: Record<string,any> | null | undefined, defaultTarget: string | string[], getName: EntryNameProvider): Record<string, EventEntry> => {
    if(data == null) return {};
    return Object.fromEntries(Object.entries(data).map(entry => {
        const name = getName('on'+entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]);
        if(typeof entry[1] === 'string') return [name, {name: name, key: entry[1], target: Array.isArray(defaultTarget) ? defaultTarget.join(" | ") : defaultTarget}];
        entry[1]["name"] = name;
        if(entry[1]["key"] == null) entry[1]["key"] = entry[0].toLowerCase();
        if(entry[1]["target"] == null) entry[1]["target"] = defaultTarget;
        if(Array.isArray(entry[1]["target"])) entry[1]["target"] = entry[1]["target"].join(" | ");
        return entry;
    }));
} 

export const formatBaseEntries = (data: Record<string, any>, getName: EntryNameProvider): EntryMap => {
    const baseAdapterDefaults : AdapterDefaultData = { target: "Element", type: "html", parent: "undefined", childs: "undefined"};
    const baseAttributeDefaultTarget = "Element";
    const basePropertyDefaultTarget = "Element";
    const baseQueryDefaultTarget = "Element";
    const baseActionDefaultTarget = "Element";
    const baseEventDefaultTarget = "EventTarget";
    return {
        adapter: formatAdapters(data["adapter"], baseAdapterDefaults, getName),
        attribute: formatAttributes(data["attribute"], baseAttributeDefaultTarget, getName),
        property: formatProperties(data["property"], basePropertyDefaultTarget, getName),
        query: formatQueries(data["query"], baseQueryDefaultTarget, getName),
        action: formatActions(data["action"], baseActionDefaultTarget, getName),
        event: formatEvents(data["event"], baseEventDefaultTarget, getName),
        provided: {}
    };
}

export const formatHtmlEntries = (data: Record<string, any>, getName: EntryNameProvider): EntryMap => {
    const baseAdapterDefaults : AdapterDefaultData = { target: "HTMLElement", type: "html", parent: "HTMLElement", childs: ["Text", "HTMLElement"], preffix: "html"};
    const baseAttributeDefaultTarget = "HTMLElement";
    const basePropertyDefaultTarget = "HTMLElement";
    const baseQueryDefaultTarget = "HTMLElement";
    const baseActionDefaultTarget = "HTMLElement";
    const baseEventDefaultTarget = "HTMLElement";
    return {
        adapter: formatAdapters(data["adapter"], baseAdapterDefaults, getName),
        attribute: formatAttributes(data["attribute"], baseAttributeDefaultTarget, getName),
        property: formatProperties(data["property"], basePropertyDefaultTarget, getName),
        query: formatQueries(data["query"], baseQueryDefaultTarget, getName),
        action: formatActions(data["action"], baseActionDefaultTarget, getName),
        event: formatEvents(data["event"], baseEventDefaultTarget, getName),
        provided: {}
    };
}

export const formatSvgEntries = (data: Record<string, any>, getName: EntryNameProvider): EntryMap => {
    const baseAdapterDefaults : AdapterDefaultData = { target: "SVGElement", type: "svg", parent: "SVGElement", childs: ["Text", "SVGElement"], preffix: "svg"};
    const baseAttributeDefaultTarget = "SVGElement";
    const basePropertyDefaultTarget = "SVGElement";
    const baseQueryDefaultTarget = "SVGElement";
    const baseActionDefaultTarget = "SVGElement";
    const baseEventDefaultTarget = "SVGElement";
    return {
        adapter: formatAdapters(data["adapter"], baseAdapterDefaults, getName),
        attribute: formatAttributes(data["attribute"], baseAttributeDefaultTarget, getName),
        property: formatProperties(data["property"], basePropertyDefaultTarget, getName),
        query: formatQueries(data["query"], baseQueryDefaultTarget, getName),
        action: formatActions(data["action"], baseActionDefaultTarget, getName),
        event: formatEvents(data["event"], baseEventDefaultTarget, getName),
        provided: {}
    };
}

export const formatMathmlEntries = (data: Record<string, any>, getName: EntryNameProvider): EntryMap => {
    const baseAdapterDefaults : AdapterDefaultData = { target: "MathMLElement", type: "mathml", parent: "MathMLElement", childs: ["Text", "MathMLElement"], preffix: "math"};
    const baseAttributeDefaultTarget = "MathMLElement";
    const basePropertyDefaultTarget = "MathMLElement";
    const baseQueryDefaultTarget = "MathMLElement";
    const baseActionDefaultTarget = "MathMLElement";
    const baseEventDefaultTarget = "MathMLElement";
    return {
        adapter: formatAdapters(data["adapter"], baseAdapterDefaults, getName),
        attribute: formatAttributes(data["attribute"], baseAttributeDefaultTarget, getName),
        property: formatProperties(data["property"], basePropertyDefaultTarget, getName),
        query: formatQueries(data["query"], baseQueryDefaultTarget, getName),
        action: formatActions(data["action"], baseActionDefaultTarget, getName),
        event: formatEvents(data["event"], baseEventDefaultTarget, getName),
        provided: {}
    };
}

const generateAttributeGetter = (getName: EntryNameProvider, key: string, value: AttributeEntry): QueryEntry => {
    return {
        name: getName('get' + key[0].toUpperCase() + key.slice(1), value),
        key: value.key,
        target: value.target,
        getter: "getAttr"
    }
}

const generatePropertyGetter = (getName: EntryNameProvider, key: string, value: PropertyEntry): QueryEntry => {
    return {
        name: getName('get' + key[0].toUpperCase() + key.slice(1), value),
        key: value.key,
        target: value.target,
        getter: "getProp"
    }
}


export const buildEntryMap = (getName: EntryNameProvider, corelibSource: string, ...formattedEntries: EntryMap[]): EntryMap => {
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
        Object.entries(entry.attribute).forEach(item => {
            const queryData = generateAttributeGetter(getName, ...item);
            result.query[queryData.name] = queryData
        });
        Object.assign(result.property, entry.property);
        Object.entries(entry.property).forEach(item => {
            const queryData = generatePropertyGetter(getName, ...item);
            result.query[queryData.name] = queryData
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
