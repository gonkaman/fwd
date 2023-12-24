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


const handleAsync = <T,U>(
  onFulfilled: (arg: T) => U | PromiseLike<U>, 
  onRejected?: (error: any) => U | PromiseLike<U>
): (p: PromiseLike<T>) => PromiseLike<U> => 
  (input: PromiseLike<T>) => input.then(onFulfilled, onRejected);

const valid = pipe(
  (a: string, b: number) => Number(a),
  (c: number) => c + 1,
  (d: number) => `${d}`,
  (e: string) => Number(e)
)("1",0);


const invalid = pipe(
  (a: string) => Number(a),
  (c: number) => "c + 1",
  (d: number) => `${d}`,
  (e: string) => Number(e)
)("1");
