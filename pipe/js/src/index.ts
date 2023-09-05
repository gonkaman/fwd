export type PipeEntry<U,V> = (arg: U) => V

export type PipeBuilder<U,V> = <T>(entry: PipeEntry<V,T>) => PipeBuilder<U,T>

const pipeEnd = <U>(arg: U): U => arg;

export const build = <U,V>(init: PipeEntry<U,V>): PipeBuilder<U,V> => {
    if(init === pipeEnd) return (init as unknown) as PipeBuilder<U,V>;
    return <T>(entry: PipeEntry<V,T>): PipeBuilder<U,T> => 
        entry === pipeEnd ?
        (init as unknown) as PipeBuilder<U,T>:
        build((arg: U) => entry(init(arg)));
}

export const resolve = <U,V>(builder: PipeBuilder<U,V>): PipeEntry<U,V> =>
    (builder(pipeEnd) as unknown) as PipeEntry<U,V>;

