/**
 * Core framework
 */

//pipe lib

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


  const fork = <T>(fn: (_: T) => any): ((_: T) => T) => 
  (arg: T) => { fn(arg); return arg; }




// export const div = createDOMAdapter<
//     HTMLElement, Document, 
//     HTMLDivElement, Document, 
//     HTMLElement | Text, Document, 
//     string
// >('div', htmlNodeFactory, appendConnector, formatAdapterArgs);

// export const svg = createDOMAdapter<
//     HTMLElement | SVGElement, Document, 
//     SVGSVGElement, XMLDocument, 
//     SVGElement | Text, XMLDocument, 
//     string
// >('svg', svgNodeFactory, appendConnector, formatAdapterArgs);

// export const math = createDOMAdapter<
//     HTMLElement, Document, 
//     MathMLElement, XMLDocument, 
//     MathMLElement | Text, XMLDocument, 
//     string
// >('math', mathNodeFactory, appendConnector, formatAdapterArgs);


// type SourceGenerator = 
//     ((entry: [string, AdapterEntry]) => [string, string[]]) |
//     ((entry: [string, PropertyEntry]) => [string, string[]]) |
//     ((entry: [string, QueryEntry]) => [string, string[]]) |
//     ((entry: [string, ActionEntry]) => [string, string[]]) |
//     ((entry: [string, EventEntry]) => [string, string[]]);



//@@ text > createDOMAdapter @@//
// export const text = createDOMAdapter<
//     Element, Document, 
//     Text, Document, 
//     undefined, Document, 
//     string
// >('', textNodeFactory, noNodeConnector, formatAdapterArgs);


//@@ text > createDOMAdapter @@//
// export const text = createDOMAdapter<
//     Element, Document, 
//     Text, Document, 
//     undefined, Document, 
//     string
// >('', textNodeFactory, noNodeConnector, formatAdapterArgs);
