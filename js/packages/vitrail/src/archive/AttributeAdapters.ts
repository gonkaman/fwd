import { PipeEntry, fork } from "@gonkaman/pipe";
import { AttributeAdapterValue, attr, getAttr } from "./BaseAdapters";


export const id = <T extends Element>(value: AttributeAdapterValue): PipeEntry<T,T> => attr('id', value);
export const getId = (key?: string) => getAttr('id', key);

export const className = <T extends Element>(value: AttributeAdapterValue): PipeEntry<T,T> => attr('class', value);
export const addClass = <T extends Element>(name: string): PipeEntry<T,T> => fork(elt => elt.classList.add(name));
export const removeClass = <T extends Element>(name: string): PipeEntry<T,T> => fork(elt => elt.classList.remove(name));
export const toggleClass = <T extends Element>(name: string): PipeEntry<T,T> => fork(elt => elt.classList.toggle(name));
export const getClass = (key?: string) => getAttr('class', key);

export const titleAttr = <T extends HTMLElement>(value: AttributeAdapterValue): PipeEntry<T,T> => attr('title', value);
export const getTitleAttr = (key?: string) => getAttr('title', key);

export const tabIndex = <T extends HTMLElement>(value: AttributeAdapterValue): PipeEntry<T,T> => attr('tabIndex', value);
export const getTabIndex = (key?: string) => getAttr('tabIndex', key);

export const lang = <T extends HTMLElement>(value: AttributeAdapterValue): PipeEntry<T,T> => attr('lang', value);
export const getLang = (key?: string) => getAttr('lang', key);

export const dir = <T extends HTMLElement>(value: AttributeAdapterValue): PipeEntry<T,T> => attr('dir', value);
export const getDir = (key?: string) => getAttr('dir', key);