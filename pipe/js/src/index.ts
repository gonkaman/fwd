export type PipeEntry<U,V> = (arg: U) => V

export type PipeBuilder<U,V> = <T>(entry: PipeEntry<V,T>) => PipeBuilder<U,T>

const pipeEnd = <U>(arg: U): U => arg;

export const pipe = <U,V>(init: PipeEntry<U,V>): PipeBuilder<U,V> => {
    if(init === pipeEnd) return (init as unknown) as PipeBuilder<U,V>;
    return <T>(entry: PipeEntry<V,T>): PipeBuilder<U,T> => 
        entry === pipeEnd ?
        (init as unknown) as PipeBuilder<U,T>:
        pipe((arg: U) => entry(init(arg)));
}

export type AsyncPipeEntry<U,V> = (arg: U) => V | PromiseLike<V>

export type AsyncErrorHandler<T> = (error: any) => T | PromiseLike<T>

export type AsyncPipeBuilder<U,V> = <T>(
    entry: AsyncPipeEntry<V,T>,
    onRejected?: AsyncErrorHandler<T>
) => AsyncPipeBuilder<U,T>

export const pipeAsync = <U,V>(init: AsyncPipeEntry<U,V>): AsyncPipeBuilder<U,V> => {
    if(init === pipeEnd) return (init as unknown) as AsyncPipeBuilder<U,V>;
    return <T>(entry: AsyncPipeEntry<V,T>, onRejected?: AsyncErrorHandler<T>): AsyncPipeBuilder<U,T> => 
        entry === pipeEnd ?
        (init as unknown) as AsyncPipeBuilder<U,T>:
        pipeAsync((arg: U) => Promise.resolve(init(arg)).then(
            value => entry(value), 
            onRejected
        ));
}

export type PipeResolve<T,U,V> = T extends AsyncPipeBuilder<U,V> ? AsyncPipeEntry<U,V> : PipeEntry<U,V>

export const resolve = <T extends PipeBuilder<U,V> | AsyncPipeBuilder<U,V>, U,V>(builder: T): PipeResolve<T,U,V> =>
    (builder(pipeEnd) as unknown) as PipeResolve<T,U,V>;


export const flow = <T,R>(init: PipeEntry<T,R>, ...entries: PipeEntry<R,R>[]): PipeEntry<T,R> => 
    resolve(entries.reduce((p, entry) => p(entry), pipe(init)));

// export const flowAsync = <T,R>(init: AsyncPipeEntry<T,R>, ...entries: AsyncPipeEntry<R,R>[]): AsyncPipeEntry<T,R> => 
//     resolve(entries.reduce((p, entry) => p(entry), pipeAsync(init)));

export const fork = <T>(
    handle: (_: T) => any
): PipeEntry<T,T> => (arg: T) => { handle(arg); return arg; }


export const forkAsync = <T>(
    handle: (_: T) => any
): AsyncPipeEntry<T,T> => (arg: T) => { handle(arg); return arg; }
