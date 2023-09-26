import { RPipeEntry, forkSuccess } from "fwd-result-pipe"

// [declareLoginData, collectLoginData] = useQuery()

// getUsername = declareLoginData('username')
// getPassword = declareLoginData('password')

// getLoginData = declare('loginData')



export type Query = () => [string, unknown][]
export type QueryMap = () => [string, [string, unknown][]][]

export type QueryComponent<TBase> = <T extends TBase>(target: T) => [string, unknown][]

export type QueryHandler = (query: Query) => any

export const useQuery = (): [QueryHandler, Query] => {
    const queries: Query[] = [];
    return [
        queries.push, 
        () => queries.reduce((entries: [string, unknown][], query) => entries.concat(query()), [])
    ] 
}

// export const useQueryMap = (): [(key: string) => QueryHandler, QueryMap] => {
//     const queryMap: Map<string, Query[]> = new Map<string, Query[]>();
//     return [
//         (key: string) => {
//             const queries: Query[] = [];
//             queryMap.set(key, queries);
//             return queries.push;
//         },
//         () => Array.from(queryMap.entries()).map(entry => [
//             entry[0],
//             entry[1].reduce((entries: [string, unknown][], query) => entries.concat(query()), [])
//         ])
//     ];
// }

// const assignFromEntries = (
//     target: Record<string, unknown>,
//     path: string[], 
//     entries: [string, unknown][]
// ): Record<string, unknown> => {

//     if(path.length > 1){
//         if(!target[path[0]]) target[path[0]] = {};
//         target[path[0]] = assignFromEntries()
//     } else{
//         target[path[0]] = Object.fromEntries(entries);
//     }
    
// }

// export const mapObject = (queryMap: QueryMap): (() => Record<string,unknown>) => 
//     () => Object.fromEntries(queryMap().map(entry => entry))


// Adapter<T>
export const createQuery = <T,E>(
    handle: (resultingQuery: Query) => any,
    ...components: QueryComponent<T>[]
): RPipeEntry<T,E,T,E> => forkSuccess<T,E>(
    target => handle(() => components.reduce(
        (entries: [string, unknown][], query) => entries.concat(query(target)), []
    ))
)

// QueryComponent<Element>
export const getAttr = <T extends Element>(name: string, key?: string): QueryComponent<T> =>
    (target: T) => [[key || name, target.getAttribute(name)]];

// QueryComponent<Element>
export const getAttrMap = <T extends Element>(
    attributes: Record<string, string | undefined>
): QueryComponent<T> =>
    (target: T) => Object.entries(attributes).map(
        entry => [entry[1] || entry[0], target.getAttribute(entry[0])]
    );

// QueryComponent<Element>
export const getAria = <T extends Element>(name: string, key?: string): QueryComponent<T> =>
    (target: T) => [[key || 'aria_'+name, target.getAttribute('aria-'+name)]];

// QueryComponent<Element>
export const getAriaMap = <T extends Element>(
    attributes: Record<string, string | undefined>
): QueryComponent<T> =>
    (target: T) => Object.entries(attributes).map(
        entry => [entry[1] || 'aria_'+entry[0], target.getAttribute('aria-'+entry[0])]
    );

// QueryComponent<Element>
export const getData = <T extends HTMLElement>(name: string, key?: string): QueryComponent<T> =>
    (target: T) => [[key || 'data_'+name, target.dataset[name]]];

// QueryComponent<Element>
export const getDataMap = <T extends HTMLElement>(
    attributes: Record<string, string | undefined>
): QueryComponent<T> =>
    (target: T) => Object.entries(attributes).map(
        entry => [entry[1] || 'data_'+entry[0], target.dataset[entry[0]]]
    );

// QueryComponent<Element>
export const getStyle = <T extends HTMLElement>(name: string, key?: string): QueryComponent<T> =>
    (target: T) => [[key || 'style_'+name, target.style[name]]];

// QueryComponent<Element>
export const getStyleMap = <T extends HTMLElement>(
    attributes: Record<string, string | undefined>
): QueryComponent<T> =>
    (target: T) => Object.entries(attributes).map(
        entry => [entry[1] || 'style_'+entry[0], target.style[entry[0]]]
    );