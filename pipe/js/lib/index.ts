/*

MIT License

Copyright (c) 2023 Joël GONKAMAN

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

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


export const fork = <T>(
    handle: (_: T) => any
): PipeEntry<T,T> => (arg: T) => { handle(arg); return arg; }


export const forkAsync = <T>(
    handle: (_: T) => any
): AsyncPipeEntry<T,T> => (arg: T) => { handle(arg); return arg; }
