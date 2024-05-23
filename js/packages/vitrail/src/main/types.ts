export type AdapterType = "html" | "svg" | "mathml" | "text";
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
