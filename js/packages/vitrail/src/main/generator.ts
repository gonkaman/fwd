type AdapterType = "html" | "svg" | "mathml" | "text";
type QueryGetterType = "getAttr" | "getProp";

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
        const connectorName = (entry.childs === "undefined" ? 'no' : 'append')+'NodeConnector';
        const nodeFactoryName = entry.type+'NodeFactory';

        return [
            `export const ${entry.name} = createDOMAdapter<
    ${entry.parent}, Document, 
    ${entry.target}, Document, 
    ${entry.childs}, Document, 
    string
>('${entry.key}', ${nodeFactoryName}, ${connectorName}, formatAdapterArgs);`, 
            ['createDOMAdapter', nodeFactoryName, connectorName, 'formatAdapterArgs']
        ];
    },

    //attribute template
    attribute: (entry: AttributeEntry): [string, string[]] => {
        return [
            `export const ${entry.name} = <T extends ${entry.target}, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setAttr('${entry.key}', value);`,
            ['PropertyValueType','NodeTask','setAttr']
        ];
    },

    //property template
    property: (entry: PropertyEntry): [string, string[]] => {
        return [
            `export const ${entry.name} = <T extends ${entry.target}, U extends Document>(value: PropertyValueType): NodeTask<T,U> => setProp('${entry.key}', value);`,
            ['PropertyValueType','NodeTask','setProp']
        ];
    },

    //query template
    query: (entry: QueryEntry): [string, string[]] => {
        return [
            `export const ${entry.name} = <T extends ${entry.target}, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => ${entry.getter}('${entry.key}', key);`, 
            ['Filter', entry.getter]
        ];
    },

    //action template
    action: (entry: ActionEntry): [string, string[]] => {
        const params = entry.arguments.map(arg => arg.name+(arg.optional ? '?' : '')+': '+arg.type).join(', ');
        const inputs = entry.arguments.map(arg => arg.name).join(', ');
        return [
            `export const ${entry.name} = <T extends ${entry.target}, U extends Document>(${params}): NodeTask<T,U> => [
    (entry: [T,U]) => {
        entry[0].${entry.callPath}(${inputs});
        return entry;
    }
];`,
            ['NodeTask']
        ];
    },

    //event template
    event: (entry: EventEntry): [string, string[]] => {
        // const name = entry.name[0] === "$" ? entry.name.slice(1) : entry.name;
        // because event adapter names follow the pattern 'on'+qualifiedName, there is a little to no chance of them to collide with a keyword
        // therefore, there is no need to check for a $
        return [
            `export const ${entry.name} = <T extends ${entry.target}, U extends Document>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): NodeTask<T,U> => subscribe('${entry.key}', listener, options);`,
            ['NodeTask','subscribe']
        ];
    }

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

export const generateLibSource = (entryMap: EntryMap, tokens?: string[]): string => 
    tokens == null ? renderAllEntries(entryMap) : 
    (tokens.length > 0 ? renderSelectedEntries(entryMap, tokens) : renderAllEntries(entryMap));