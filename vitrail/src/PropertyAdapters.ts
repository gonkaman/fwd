import { PipeEntry, fork } from "fwd-pipe";
import { PropertyAdapterValue, prop, getProp } from "./BaseAdapters";

export const textContent = <T extends Node>(value: PropertyAdapterValue): PipeEntry<T,T> => prop('textContent', value);
export const getTextContent = (key?: string) => getProp('textContent', key);