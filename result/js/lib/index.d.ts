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

export type Runner<T, E> = (...args: any) => Result<T, E>;
export type PipeEntry<T, E, U, V> = (res: Result<T, E>) => Result<U, V>;
export type PipeBuilder<T, E> = <U, V>(fn: PipeEntry<T, E, U, V>) => PipeBuilder<U, V>;
export declare const pipe: <TSuccess, TFailure>(fn: Runner<TSuccess, TFailure>) => PipeBuilder<TSuccess, TFailure>;
export declare const exec: <TSuccess, TFailure>(pipeBuild: PipeBuilder<TSuccess, TFailure>) => Runner<TSuccess, TFailure>;
export declare const map: <T, E, U, V>(onSuccess: (value: T) => Result<U, V>, onFailure: (error: E) => Result<U, V>) => PipeEntry<T, E, U, V>;
export declare const mapSuccess: <T, E, U>(onSuccess: (value: T) => Result<U, E>) => PipeEntry<T, E, U, E>;
export declare const mapFailure: <T, E, V>(onFailure: (error: E) => Result<T, V>) => PipeEntry<T, E, T, V>;
export declare const swap: <T, E, U, V>(onSuccess: (value: T) => U, onFailure: (error: E) => V) => PipeEntry<T, E, U, V>;
export declare const swapSuccess: <T, E, U>(onSuccess: (value: T) => U) => PipeEntry<T, E, U, E>;
export declare const swapFailure: <T, E, V>(onFailure: (error: E) => V) => PipeEntry<T, E, T, V>;
export declare const fork: <T, E>(handle: (res: Result<T, E>) => any) => PipeEntry<T, E, T, E>;
export declare const forkMap: <T, E>(onSuccess: (value: T) => any, onFailure: (error: E) => any) => PipeEntry<T, E, T, E>;
export declare const forkSuccess: <T, E>(onSuccess: (value: T) => any) => PipeEntry<T, E, T, E>;
export declare const forkFailure: <T, E>(onFailure: (error: E) => any) => PipeEntry<T, E, T, E>;
export type AsyncRunner<T, E> = (...args: any) => Promise<Result<T, E>>;
export type AsyncPipeEntry<T, E, U, V> = (res: Result<T, E>) => PromiseLikeOfOr<Result<U, V>>;
export type AsyncErrorHandler<U, V> = (error: any) => PromiseLikeOfOr<Result<U, V>>;
export type AsyncPipeBuilder<T, E> = <U, V>(fn: AsyncPipeEntry<T, E, U, V>, onRejected?: AsyncErrorHandler<U, V>) => AsyncPipeBuilder<U, V>;
export declare const pipeAsync: <TSuccess, TFailure>(fn: AsyncRunner<TSuccess, TFailure>) => AsyncPipeBuilder<TSuccess, TFailure>;
export declare const execAsync: <TSuccess, TFailure>(pipeBuildAsync: AsyncPipeBuilder<TSuccess, TFailure>) => AsyncRunner<TSuccess, TFailure>;
export declare const mapAsync: <T, E, U, V>(onSuccess: (value: T) => PromiseLikeOfOr<Result<U, V>>, onFailure: (error: E) => PromiseLikeOfOr<Result<U, V>>) => AsyncPipeEntry<T, E, U, V>;
export declare const mapSuccessAsync: <T, E, U>(onSuccess: (value: T) => PromiseLikeOfOr<Result<U, E>>) => AsyncPipeEntry<T, E, U, E>;
export declare const mapFailureAsync: <T, E, V>(onFailure: (error: E) => PromiseLikeOfOr<Result<T, V>>) => AsyncPipeEntry<T, E, T, V>;
export declare const swapAsync: <T, E, U, V>(onSuccess: (value: T) => PromiseLikeOfOr<U>, onFailure: (error: E) => PromiseLikeOfOr<V>) => AsyncPipeEntry<T, E, U, V>;
export declare const swapSuccessAsync: <T, E, U>(onSuccess: (value: T) => PromiseLikeOfOr<U>) => AsyncPipeEntry<T, E, U, E>;
export declare const swapFailureAsync: <T, E, V>(onFailure: (error: E) => PromiseLikeOfOr<V>) => AsyncPipeEntry<T, E, T, V>;
export declare const forkAsync: <T, E>(handle: (res: Result<T, E>) => any) => AsyncPipeEntry<T, E, T, E>;
export declare const forkMapAsync: <T, E>(onSuccess: (value: T) => any, onFailure: (error: E) => any) => AsyncPipeEntry<T, E, T, E>;
export declare const forkSuccessAsync: <T, E>(onSuccess: (value: T) => any) => AsyncPipeEntry<T, E, T, E>;
export declare const forkFailureAsync: <T, E>(onFailure: (error: E) => any) => AsyncPipeEntry<T, E, T, E>;
/**
 * Normalized representation of a result object's state
 *
 * @template TSuccess - Value type in case of success
 * @template TFailure - Error type, Value type in case of failure
 *
 */
export type ResultState<TSuccess, TFailure> = {
    /**
     * Indicate whether the result is a success or a failure
     * @readonly
    */
    isSuccess: boolean;
    /**
     * Value contained in the result in case of success, undefined in case of failure
     * @readonly
     */
    value?: TSuccess;
    /**
     * Value contained in the result in case of failure, undefined in case of success
     * @readonly
     */
    error?: TFailure;
};
export type PromiseLikeOfOr<T> = T | PromiseLike<T>;
/**
 * Base interface for result objects.
 * A result object represent the outcome of an operation, that can either be a failure or a success.
 * The Result interface also provides several utility methods to chains operations
 * following the railway oriented programming style
 *
 * @template TSuccess - Value type in case of success
 * @template TFailure - Error type, Value type in case of failure
 * @interface Result
 *
 */
export interface Result<TSuccess, TFailure> {
    /**
     * Checks whether the result is a success or a failure.
     * Returns true in case of success, false in case of failure
     * @returns {boolean}
     */
    isSuccess(): boolean;
    /**
     * Value contained in the result in case of success, undefined in case of failure
     * @returns {TSuccess}
     */
    value(): TSuccess | undefined;
    /**
     * Value contained in the result in case of failure, undefined in case of success
     * @readonly
     */
    error(): TFailure | undefined;
    /**
     * Value contained in the result
     * @readonly
     */
    payload(): TSuccess | TFailure;
    /**
     * returns the normalized state of the result object
     * @returns ResultState<TSuccess, TFailure>
     */
    state(): ResultState<TSuccess, TFailure>;
    /**
     * Executes the given bind handler, using the current result to get a new result
     * @param fn Handler to execute.
     * @template U
     * @template V
     * @returns Result<U,V>
     */
    bind<U, V>(fn: (result: Result<TSuccess, TFailure>) => Result<U, V>): Result<U, V>;
    /**
     * Executes the given asynchronous handler, using the current result to get a new result
     * @param fn Asynchronous handler to execute.
     * @async
     * @template U
     * @template V
     * @returns Promise<Result<U,V>>
     */
    bindAsync<U, V>(fn: (result: Result<TSuccess, TFailure>) => PromiseLikeOfOr<Result<U, V>>): Promise<Result<U, V>>;
    /**
     * Executes the corresponding handler, using the current result to get a new result
     * @param onSuccess Handler to execute in case of success, using the current result payload.
     * @param onFailure Handler to execute in case of failure, using the current result payload.
     * @template U
     * @template V
     * @returns Result<U,V>
     */
    map<U, V>(onSuccess: (value: TSuccess) => Result<U, V>, onFailure: (error: TFailure) => Result<U, V>): Result<U, V>;
    /**
     * Executes the corresponding asynchronous handler, using the current result.
     * @param onSuccess Asynchronous handler to execute in case of success, using the current result payload.
     * @param onFailure Asynchronous handler to execute in case of failure, using the current result payload.
     * @async
     * @template U
     * @template V
     * @returns Promise<Result<U,V>>
     */
    mapAsync<U, V>(onSuccess: (value: TSuccess) => PromiseLikeOfOr<Result<U, V>>, onFailure: (error: TFailure) => PromiseLikeOfOr<Result<U, V>>): Promise<Result<U, V>>;
    /**
     * Execute the given handler in case of success using the current result payload.
     * In case of failure, the current result is simply returned
     * @param onSuccess Handler to execute in case of success.
     * @template U
     * @returns Result<U,TFailure>
     */
    mapSuccess<U>(onSuccess: (value: TSuccess) => Result<U, TFailure>): Result<U, TFailure>;
    /**
     * Execute the given asynchronous handler in case of success using the current result payload.
     * @param onSuccess Asynchronous handler to execute in case of success.
     * @async
     * @template U
     * @returns Promise<Result<U,TFailure>>
     */
    mapSuccessAsync<U>(onSuccess: (value: TSuccess) => PromiseLikeOfOr<Result<U, TFailure>>): Promise<Result<U, TFailure>>;
    /**
     * Execute the given handler in case of failure using the current result payload.
     * In case of success, the current result is simply returned
     * @param onFailure Handler to execute in case of failure.
     * @template V
     * @returns Result<TSuccess,V>
     */
    mapFailure<V>(onFailure: (error: TFailure) => Result<TSuccess, V>): Result<TSuccess, V>;
    /**
     * Execute the given asynchronous handler in case of failure using the current result payload.
     * In case of success, the current result is simply returned
     * @param onFailure Asynchronous handler to execute in case of failure.
     * @async
     * @template V
     * @returns Promise<Result<TSuccess,V>>
     */
    mapFailureAsync<V>(onFailure: (error: TFailure) => PromiseLikeOfOr<Result<TSuccess, V>>): Promise<Result<TSuccess, V>>;
    /**
     * Replaces the current result payload with the output of the corresponding handler output.
     * @param onSuccess Handler to execute in case of success using the current payload
     * @param onFailure Handler to execute in case of failure using the current payload
     * @template U
     * @template V
     * @returns Result<U,V>
     */
    swap<U, V>(onSuccess: (value: TSuccess) => U, onFailure: (error: TFailure) => V): Result<U, V>;
    /**
     * Replaces the current result payload with the output of the corresponding asynchronous handler output using the current payload.
     * @param onSuccess Asynchronous handler to execute in case of success using the current payload
     * @param onFailure Asynchronous handler to execute in case of failure using the current payload
     * @async
     * @template U
     * @template V
     * @returns Promise<Result<U,V>>
     */
    swapAsync<U, V>(onSuccess: (value: TSuccess) => PromiseLikeOfOr<U>, onFailure: (error: TFailure) => PromiseLikeOfOr<V>): Promise<Result<U, V>>;
    /**
     * In case of success, replaces the current result payload with the output of the given handler output.
     * In case of failure, simply returns the current result
     * @param onSuccess Handler to execute in case of success using the current payload.
     * @template U
     * @returns Result<U,TFailure>
     */
    swapSuccess<U>(onSuccess: (value: TSuccess) => U): Result<U, TFailure>;
    /**
     * In case of success, replaces the current result payload with the output of the given asynchronous handler output.
     * In case of failure, simply returns the current result
     * @param onSuccess Asynchronous handler to execute in case of success using the current payload.
     * @template U
     * @returns Promise<Result<U,TFailure>>
     */
    swapSuccessAsync<U>(onSuccess: (value: TSuccess) => PromiseLikeOfOr<U>): Promise<Result<U, TFailure>>;
    /**
     * In case of failure, replaces the current result payload with the output of the given handler output.
     * In case of success, simply returns the current result
     * @param onFailure Handler to execute in case of failure using the current payload.
     * @template V
     * @returns Result<TSuccess,V>
     */
    swapFailure<V>(onFailure: (error: TFailure) => V): Result<TSuccess, V>;
    /**
     * In case of failure, replaces the current result payload with the output of the given asynchronous handler output.
     * In case of success, simply returns the current result
     * @param onFailure Asynchronous handler to execute in case of failure using the current payload.
     * @template V
     * @returns Promise<Result<TSuccess,V>>
     */
    swapFailureAsync<V>(onFailure: (error: TFailure) => PromiseLikeOfOr<V>): Promise<Result<TSuccess, V>>;
    /**
     * Executes the given handler, then returns the current result
     * @param handle Handler to execute using the current result
     * @returns Result<TSuccess,TFailure>
     */
    fork(handle: (result: Result<TSuccess, TFailure>) => unknown): Result<TSuccess, TFailure>;
    /**
     * Executes the given asynchronous handler, then returns the current result
     * @param handle Asynchronous handler to execute using the current result
     * @returns romise<Result<TSuccess,TFailure>>
     */
    forkAsync(handle: (result: Result<TSuccess, TFailure>) => PromiseLikeOfOr<unknown>): Promise<Result<TSuccess, TFailure>>;
    /**
     * Executes the corresponding handler, then returns the current result
     * @param onSuccess Handler to execute in case of success using the current result payload
     * @param onFailure Handler to execute in case of failure using the current result payload
     * @returns Result<TSuccess,TFailure>
     */
    forkMap(onSuccess: (value: TSuccess) => unknown, onFailure: (error: TFailure) => unknown): Result<TSuccess, TFailure>;
    /**
     * Executes the corresponding asynchronous handler, then returns the current result
     * @param onSuccess Asynchronous handler to execute in case of success using the current result payload
     * @param onFailure Asynchronous handler to execute in case of failure using the current result payload
     * @returns Promise<Result<TSuccess,TFailure>>
     */
    forkMapAsync(onSuccess: (value: TSuccess) => PromiseLikeOfOr<unknown>, onFailure: (error: TFailure) => PromiseLikeOfOr<unknown>): Promise<Result<TSuccess, TFailure>>;
    /**
     * Executes the given handler, in case of success, then returns the current result
     * @param onSuccess Handler to execute in case of success using the current result payload
     * @returns Result<TSuccess,TFailure>
     */
    forkSuccess(onSuccess: (value: TSuccess) => unknown): Result<TSuccess, TFailure>;
    /**
     * Executes the given asynchronous handler, in case of success, then returns the current result
     * @param onSuccess Asynchronous handler to execute in case of success using the current result payload
     * @returns Promise<Result<TSuccess,TFailure>>
     */
    forkSuccessAsync(onSuccess: (value: TSuccess) => PromiseLikeOfOr<unknown>): Promise<Result<TSuccess, TFailure>>;
    /**
     * Executes the given handler, in case of failure, then returns the current result
     * @param onFailure Handler to execute in case of failure using the current result payload
     * @returns Result<TSuccess,TFailure>
     */
    forkFailure(onFailure: (error: TFailure) => unknown): Result<TSuccess, TFailure>;
    /**
     * Executes the given asynchronous handler, in case of failure, then returns the current result
     * @param onFailure Asynchronous handler to execute in case of failure using the current result payload
     * @returns Promise<Result<TSuccess,TFailure>>
     */
    forkFailureAsync(onFailure: (error: TFailure) => PromiseLikeOfOr<unknown>): Promise<Result<TSuccess, TFailure>>;
}
/**
 * Creates an instance of Result representing a failure, using the given error
 * @param error Result data for a failure
 * @returns An instance of Result
 */
export declare const failure: <T, E>(error: E) => Result<T, E>;
/**
 * Creates an instance of Result representing a success, using the given value
 * @param value Result data for a success
 * @returns An instance of Result
 */
export declare const success: <T, E>(value: T) => Result<T, E>;
