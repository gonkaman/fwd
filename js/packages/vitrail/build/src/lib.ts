type AnyFunc = (...arg: any) => any;

type LastFnReturnType<F extends Array<AnyFunc>, Else = never> = F extends [
  ...any[],
  (...arg: any) => infer R
]
  ? R
  : Else;

type PipeArgs<F extends AnyFunc[], Acc extends AnyFunc[] = []> = F extends [
  (...args: infer A) => infer B
]
  ? [...Acc, (...args: A) => B]
  : F extends [(...args: infer A) => any, ...infer Tail]
  ? Tail extends [(arg: infer B) => any, ...any[]]
    ? PipeArgs<Tail, [...Acc, (...args: A) => B]>
    : Acc
  : Acc;

const pipe = <FirstFn extends AnyFunc, F extends AnyFunc[]>(
  firstFn: FirstFn,
  ...fns: PipeArgs<F> extends F ? F : PipeArgs<F>
): (...arg: Parameters<FirstFn>) => LastFnReturnType<F, ReturnType<FirstFn>> =>
  (...params: Parameters<FirstFn>): LastFnReturnType<F, ReturnType<FirstFn>> => 
  (fns as AnyFunc[]).reduce((acc, fn) => fn(acc), firstFn(params));

type Filter<T> = (elt: T) => T
type Composer<T,K,P> = <TRef extends P>(...adapters: (Filter<T> | K)[]) => Filter<TRef>
type Converter<K,U,V> = <T extends U,TRef extends V>(ref: TRef, adapters: (Filter<T> | K)[]) => Filter<T>[]
type Factory<T> = () => T


const fork = <T>(fn: (_: T) => any): Filter<T> => 
    (arg: T) => { fn(arg); return arg; }

const createComposer = <U,V,T extends U,K>(factory: Factory<T>, convert: Converter<K,U,V>): Composer<T,K,V> => {
    return <TRef extends V>(...entries: (Filter<T> | K)[]): Filter<TRef> => 
        fork((ref: TRef) => pipe(factory, ...convert<T,TRef>(ref, entries)))
}

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

const elementConverter : Converter<string, Node, Element> = <T extends Node, TRef extends Element>(
    ref: TRef, 
    adapters: (Filter<T> | string)[]
): Filter<T>[] => {
    const filters : Filter<T>[] = adapters.map(entry => typeof entry === 'string' ? nodeValue(entry) : entry);
    filters.push(fork(elt => ref.append(elt)));
    return filters;
}

/**
 * Element composers
 */

export const nodeValue = <T extends Node>(
    value: string | ((currentValue: string | null) => string) | null
): Filter<T> => typeof value === 'function' ?
    fork(node => { node.nodeValue = value(node.nodeValue); }) :
    fork(node => { node.nodeValue = value; });

export const text = createComposer<Node, HTMLElement, Text, string>(
    textFactory, elementConverter
);

//will be generated

// export const a = createComposer<Node, void, HTMLAnchorElement, string>(
//     getElementFactory('a', false), elementConverter
// );

// export const abbr = createComposer<Node, HTMLElement, HTMLElement, string>(
//     getElementFactory('abbr', false), elementConverter
// )

// export const svga = createComposer<Node, SVGElement, SVGAElement, string>(
//     getElementFactory('a', true), elementConverter
// )


/**
 * Element filters
 */

