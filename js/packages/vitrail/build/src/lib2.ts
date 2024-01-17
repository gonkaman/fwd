type Converter<U,V> = (arg: U) => V;
type Filter<T> = (target: T) => T
type Connector<U,V> = (create: Converter<U,V>, ...onConnected: Filter<V>[]) => Filter<U>;
type Adapter<T, TConvert, TCompatible> = <U extends TConvert, K extends TCompatible>(...args: (Filter<T> | K )[]) => Converter<U,T>
type Curator<T> = (retriever: Converter<void,T>) => void;
type Sync<T> = [Curator<T>, Converter<void,T>];
type Query = Sync<[string, unknown][]>;



/**
 * DOM Manipulation
 */

const createDOMAdapter = <T extends Node, TCompatible>(factory: Converter<void,T>, optimize: Converter<TCompatible, Filter<T>>): Adapter<T, void, TCompatible> => {
    
}

