/*

MIT License

Copyright (c) 2023 Joël GONKAMAN

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStyleMap = exports.getStyle = exports.getDataMap = exports.getData = exports.getAriaMap = exports.getAria = exports.getAttrMap = exports.getAttr = exports.createQuery = exports.useQuery = void 0;
const fwd_result_pipe_1 = require("fwd-result-pipe");
const useQuery = () => {
    const queries = [];
    return [
        queries.push,
        () => queries.reduce((entries, query) => entries.concat(query()), [])
    ];
};
exports.useQuery = useQuery;
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
const createQuery = (handle, ...components) => (0, fwd_result_pipe_1.forkSuccess)(target => handle(() => components.reduce((entries, query) => entries.concat(query(target)), [])));
exports.createQuery = createQuery;
// QueryComponent<Element>
const getAttr = (name, key) => (target) => [[key || name, target.getAttribute(name)]];
exports.getAttr = getAttr;
// QueryComponent<Element>
const getAttrMap = (attributes) => (target) => Object.entries(attributes).map(entry => [entry[1] || entry[0], target.getAttribute(entry[0])]);
exports.getAttrMap = getAttrMap;
// QueryComponent<Element>
const getAria = (name, key) => (target) => [[key || 'aria_' + name, target.getAttribute('aria-' + name)]];
exports.getAria = getAria;
// QueryComponent<Element>
const getAriaMap = (attributes) => (target) => Object.entries(attributes).map(entry => [entry[1] || 'aria_' + entry[0], target.getAttribute('aria-' + entry[0])]);
exports.getAriaMap = getAriaMap;
// QueryComponent<Element>
const getData = (name, key) => (target) => [[key || 'data_' + name, target.dataset[name]]];
exports.getData = getData;
// QueryComponent<Element>
const getDataMap = (attributes) => (target) => Object.entries(attributes).map(entry => [entry[1] || 'data_' + entry[0], target.dataset[entry[0]]]);
exports.getDataMap = getDataMap;
// QueryComponent<Element>
const getStyle = (name, key) => (target) => [[key || 'style_' + name, target.style[name]]];
exports.getStyle = getStyle;
// QueryComponent<Element>
const getStyleMap = (attributes) => (target) => Object.entries(attributes).map(entry => [entry[1] || 'style_' + entry[0], target.style[entry[0]]]);
exports.getStyleMap = getStyleMap;
