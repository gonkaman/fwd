export enum AdapterType {
    html = "html",
    svg = "svg",
    math = "mathml",
    text = "text"
}
export enum QueryGetterType {
    attr = "getAttr", 
    prop = "getProp"
}
export type AdapterEntry = {
    name: string,
    key: string,
    type: string,
    target: string,
    childs?: string
}
export type ContextualAdapterEntry = {
    name: string,
    key: string,
    target: {
        task: string,
        compatible: string,
        type: string
    }
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
    getter: string
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
    contextual: Record<string, ContextualAdapterEntry>,
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
        return [
            `export const ${entry.name} = domAdapter("${entry.key}", ${entry.childs === "undefined"}, ${entry.type}Scope) as unknown as Adapter<DOMTaskArg, DOMTaskData<${entry.target}>, ${entry.childs === "undefined" ? "" : `Branch<DOMTaskArg, DOMTaskData<${entry.childs}>, DOMTaskData<${entry.target}>> | `}DOMTaskCompatible>;`,
            ['DOMTaskArg', 'DOMTaskData', 'DOMTaskCompatible', 'domAdapter']
        ];
    },

    //contextual adapter
    contextual: (entry: ContextualAdapterEntry): [string, string[]] => {
        return [
`export const ${entry.name} = <T>(...args: (
        ${entry.target.task}
        | ${entry.target.compatible} 
    )[]
) => domBranch<T>(args as (Task<DOMTaskData<Node>> | DOMTaskCompatible | Branch<DOMTaskArg, DOMTaskData<Node>, DOMTaskData<Node>>)[], "${entry.key}", ${entry.target.compatible.indexOf('Branch') < 0}, contextualScope) as unknown as Branch<
    DOMTaskArg, ${entry.target.type}, T
>;`, 
                    ['Task', 'Branch', 'DOMTaskArg', 'DOMTaskData', 'DOMTaskCompatible', 'domBranch'] 
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
            `export const ${entry.name} = <T extends ${entry.target}>(alias?: string): Filter<DOMTaskData<T>,[string, Lookup<unknown>]> => ${entry.getter}<T>('${entry.key}', alias);`, 
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
`export const ${entry.name} = <T extends ${entry.target}>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    subscribe('${entry.key}', listener, options);
export const off${entry.name.slice(2)} = <T extends ${entry.target}>(listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Task<DOMTaskData<T>> => 
    unsubscribe('${entry.key}', listener, options);`,
            ['Task','DOMTaskData','subscribe']
        ];
    }

}



const renderExposedEntries = (entryMap: EntryMap, token: string, rendered: Set<string>): [string, string[]] | null => {
    rendered.add(token);
    if(entryMap.adapter[token]) return sourceGenerators.adapter(entryMap.adapter[token]);
    if(entryMap.contextual[token]) return sourceGenerators.contextual(entryMap.contextual[token]);
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
            else if(entryMap.contextual[token]) {
                sourceData = sourceGenerators.contextual(entryMap.contextual[token]);
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
    .concat(Object.values(entryMap.contextual).map(entry => sourceGenerators.contextual(entry)[0]))
    .concat(Object.values(entryMap.attribute).map(entry => sourceGenerators.attribute(entry)[0]))
    .concat(Object.values(entryMap.property).map(entry => sourceGenerators.property(entry)[0]))
    .concat(Object.values(entryMap.query).map(entry => sourceGenerators.query(entry)[0]))
    .concat(Object.values(entryMap.action).map(entry => sourceGenerators.action(entry)[0]))
    .concat(Object.values(entryMap.event).map(entry => sourceGenerators.event(entry)[0]))
    .join("\n");


export const generateSource = (tokens?: string[] | null): string => {
    const entryMap : EntryMap = {} as EntryMap;
    if(tokens == null) return renderAllEntries(entryMap);
    if(tokens.length == 0) return renderAllEntries(entryMap);
    return renderSelectedEntries(entryMap, tokens);
}
