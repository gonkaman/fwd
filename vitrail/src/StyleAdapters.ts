import { PipeEntry, fork } from "fwd-pipe";
import { PropertyAdapterValue, style, getStyle } from "./BaseAdapters";

export const cssText = <T extends HTMLElement>(value: PropertyAdapterValue): PipeEntry<T,T> => style('cssText', value);
export const getCssText = (key?: string) => getStyle('cssText', key);