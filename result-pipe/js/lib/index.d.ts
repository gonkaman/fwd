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

import { Result, PromiseLikeOfOr } from "fwd-result";
import { PipeEntry, AsyncPipeEntry, PipeBuilder, AsyncPipeBuilder } from "fwd-pipe";
export declare const map: <T, E, U, V>(onSuccess: (value: T) => Result<U, V>, onFailure: (error: E) => Result<U, V>) => PipeEntry<Result<T, E>, Result<U, V>>;
export declare const mapSuccess: <T, E, U>(onSuccess: (value: T) => Result<U, E>) => PipeEntry<Result<T, E>, Result<U, E>>;
export declare const mapFailure: <T, E, V>(onFailure: (error: E) => Result<T, V>) => PipeEntry<Result<T, E>, Result<T, V>>;
export declare const swap: <T, E, U, V>(onSuccess: (value: T) => U, onFailure: (error: E) => V) => PipeEntry<Result<T, E>, Result<U, V>>;
export declare const swapSuccess: <T, E, U>(onSuccess: (value: T) => U) => PipeEntry<Result<T, E>, Result<U, E>>;
export declare const swapFailure: <T, E, V>(onFailure: (error: E) => V) => PipeEntry<Result<T, E>, Result<T, V>>;
export declare const fork: <T, E>(handle: (res: Result<T, E>) => any) => PipeEntry<Result<T, E>, Result<T, E>>;
export declare const forkMap: <T, E>(onSuccess: (value: T) => any, onFailure: (error: E) => any) => PipeEntry<Result<T, E>, Result<T, E>>;
export declare const forkSuccess: <T, E>(onSuccess: (value: T) => any) => PipeEntry<Result<T, E>, Result<T, E>>;
export declare const forkFailure: <T, E>(onFailure: (error: E) => any) => PipeEntry<Result<T, E>, Result<T, E>>;
export declare const mapAsync: <T, E, U, V>(onSuccess: (value: T) => PromiseLikeOfOr<Result<U, V>>, onFailure: (error: E) => PromiseLikeOfOr<Result<U, V>>) => AsyncPipeEntry<Result<T, E>, Result<U, V>>;
export declare const mapSuccessAsync: <T, E, U>(onSuccess: (value: T) => PromiseLikeOfOr<Result<U, E>>) => AsyncPipeEntry<Result<T, E>, Result<U, E>>;
export declare const mapFailureAsync: <T, E, V>(onFailure: (error: E) => PromiseLikeOfOr<Result<T, V>>) => AsyncPipeEntry<Result<T, E>, Result<T, V>>;
export declare const swapAsync: <T, E, U, V>(onSuccess: (value: T) => PromiseLikeOfOr<U>, onFailure: (error: E) => PromiseLikeOfOr<V>) => AsyncPipeEntry<Result<T, E>, Result<U, V>>;
export declare const swapSuccessAsync: <T, E, U>(onSuccess: (value: T) => PromiseLikeOfOr<U>) => AsyncPipeEntry<Result<T, E>, Result<U, E>>;
export declare const swapFailureAsync: <T, E, V>(onFailure: (error: E) => PromiseLikeOfOr<V>) => AsyncPipeEntry<Result<T, E>, Result<T, V>>;
export declare const forkAsync: <T, E>(handle: (res: Result<T, E>) => any) => AsyncPipeEntry<Result<T, E>, Result<T, E>>;
export declare const forkMapAsync: <T, E>(onSuccess: (value: T) => any, onFailure: (error: E) => any) => AsyncPipeEntry<Result<T, E>, Result<T, E>>;
export declare const forkSuccessAsync: <T, E>(onSuccess: (value: T) => any) => AsyncPipeEntry<Result<T, E>, Result<T, E>>;
export declare const forkFailureAsync: <T, E>(onFailure: (error: E) => any) => AsyncPipeEntry<Result<T, E>, Result<T, E>>;
export type FnArgs<F extends Function> = F extends (...args: infer A) => any ? A : never;
export declare const rpipe: <TSuccess, TFailure, TEntry extends PipeEntry<any, Result<TSuccess, TFailure>>>(entry: TEntry) => PipeBuilder<FnArgs<TEntry>, Result<TSuccess, TFailure>>;
export declare const rpipeAsync: <TSuccess, TFailure, TEntry extends AsyncPipeEntry<any, Result<TSuccess, TFailure>>>(entry: TEntry) => AsyncPipeBuilder<FnArgs<TEntry>, Result<TSuccess, TFailure>>;
