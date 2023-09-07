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

export type PipeEntry<U, V> = (arg: U) => V;
export type PipeBuilder<U, V> = <T>(entry: PipeEntry<V, T>) => PipeBuilder<U, T>;
export declare const pipe: <U, V>(init: PipeEntry<U, V>) => PipeBuilder<U, V>;
export type AsyncPipeEntry<U, V> = (arg: U) => V | PromiseLike<V>;
export type AsyncErrorHandler<T> = (error: any) => T | PromiseLike<T>;
export type AsyncPipeBuilder<U, V> = <T>(entry: AsyncPipeEntry<V, T>, onRejected?: AsyncErrorHandler<T>) => AsyncPipeBuilder<U, T>;
export declare const pipeAsync: <U, V>(init: AsyncPipeEntry<U, V>) => AsyncPipeBuilder<U, V>;
export type PipeResolve<T, U, V> = T extends AsyncPipeBuilder<U, V> ? AsyncPipeEntry<U, V> : PipeEntry<U, V>;
export declare const resolve: <T extends PipeBuilder<U, V> | AsyncPipeBuilder<U, V>, U, V>(builder: T) => PipeResolve<T, U, V>;
