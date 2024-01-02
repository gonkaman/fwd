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
