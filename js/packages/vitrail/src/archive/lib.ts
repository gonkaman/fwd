//core concepts

export type Factory<T> = () => T
export type Filter<T> = (elt: T) => T
export type Linker<U,V> = <T extends U,TRef extends V>(factory: Factory<T>) => LinkedComposer<T,TRef>
export type LinkedComposer<T,TRef> = (filter: Filter<T>) => Filter<TRef>
export type Converter<K,U,V> = <T extends U>(adapters: (Filter<T> | K)[]) => [Filter<T>[], Linker<U,V>, Filter<T>[]]
export type Composer<K,T,V> = <TRef extends V>(...adapters: (Filter<T> | K)[]) => Filter<TRef>
 
const createComposer = <K,U,V,T extends U>(factory: Factory<T>, convert: Converter<K,U,V>): Composer<K,T,V> => {
    return <TRef extends V>(...entries: (Filter<T> | K)[]): Filter<TRef> => {
      const [preLinkFilters, link, postLinkFilters] = convert<T>(entries);
      const preLink = () => preLinkFilters.reduce((t, filter) => filter(t), factory());
      const postLink = (target: T) => postLinkFilters.reduce((t, filter) => filter(t), target);
      return link<T,TRef>(preLink)(postLink);
    }
}

export type Picker<U,S> = <T extends U>(searchQuery: S) => T | null | undefined 
export type Renderer<U,S> = <T extends U>(...filters: Filter<T>[]) => (searchQuery: S, onFailure: (() => any)) => T | undefined

const createRenderer = <U,S>(pick: Picker<U,S>): Renderer<U,S> => 
  <T extends U>(...filters: Filter<T>[]) => (searchQuery: S, onFailure: (() => any)): T | undefined => {
    const target = pick<T>(searchQuery);
    if(target != null) return filters.reduce((t, filter) => filter(t), target as T);
    onFailure();
    return undefined;
  }


/**
 * HTML + SVG Implementation 
 */

// type XFilter<T> = [string, Filter<T>]

/**
 * Element factories
 */

const textFactory: Factory<Text> = () => document.createTextNode("");

const elementFactoryMap : Record<string, Factory<Element>> = {};
const getElementFactory  = <T extends Element>(tagName: string, svg: boolean): Factory<T> => {
    if(!elementFactoryMap[tagName]){
        elementFactoryMap[tagName] = svg ? 
            function(){
                return document.createElementNS("http://www.w3.org/2000/svg", tagName);
            } : 
            function(){
                return document.createElement(tagName);
            }
    }
    return elementFactoryMap[tagName] as Factory<T>;
}


/**
 * Element converters
 */

const nodeAppend : Linker<Node, Element> = <T extends Node, TRef extends Element>(
  factory: Factory<T>
): LinkedComposer<T,TRef> => (filter: Filter<T>) => (ref: TRef) => {
  const elt = factory();
  ref.append(elt);
  filter(elt);
  return ref;
}

const elementConvert : Converter<string, Node, Element> = <T extends Node>(
    adapters: (Filter<T> | string)[]
): [Filter<T>[], Linker<Node, Element>, Filter<T>[]] => {
    const filters : Filter<T>[] = adapters.map(
      entry => typeof entry === 'string' ? 
        (elt: T) => { elt.appendChild(document.createTextNode(entry)); return elt; } : 
        entry
    );
    return [filters, nodeAppend, []];
}

/**
 * Element renderer
 */

const nodePick: Picker<Element, Element | string> = <T extends Element>(target: Element | string) => 
      typeof target === 'string' ? 
        document.querySelector(target) as (T | null | undefined):
        target as T;

export const render = createRenderer<Element, Element | string>(nodePick);

/**
 * Element composers
 */

export const nodeValue = <T extends Node>(
    value: string | ((currentValue: string | null) => string) | null
): Filter<T> => typeof value === 'function' ?
  (node: T) => { node.nodeValue = value(node.nodeValue); return node; } :
  (node: T) => { node.nodeValue = value; return node;}


export const text = createComposer<string, Node, HTMLElement, Text>(
    textFactory, elementConvert
);

//will be generated

export const a = createComposer<string, HTMLElement, HTMLElement, HTMLAnchorElement>(
    getElementFactory('a', false), elementConvert
);

// export const div = createComposer<string, HTMLElement, void, HTMLDivElement>(
//     getElementFactory('div', false), elementConverter
// )

// export const svga = createComposer<Node, SVGElement, SVGAElement, string>(
//     getElementFactory('a', true), elementConverter
// )


/**
 * Element filters
 */

//attach filters

export const append = <T extends Element>(target: Element | string): Filter<T> => 
  (elt : T) => {
    nodePick(target)?.append(elt);
    return elt;
  }

export const prepend = <T extends Element>(target: Element | string): Filter<T> => 
  (elt : T) => {
    nodePick(target)?.prepend(elt);
    return elt;
  }

export const before = <T extends Element>(target: Element | string): Filter<T> => 
  (elt : T) => {
    nodePick(target)?.before(elt);
    return elt;
  }

export const after = <T extends Element>(target: Element | string): Filter<T> => 
  (elt : T) => {
    nodePick(target)?.after(elt);
    return elt;
  }


//action filters
export const remove = <T extends (Element | Text)>(): Filter<T> =>
  (elt: T) => { 
    switch(elt.nodeType){
      case 3: 
        elt.remove();
        break;
      default:
        elt.parentNode?.removeChild(elt);
        break;
    }
    return elt; 
  }