/**@module fwd-result */
/**
 * Normalized representation of a result object's state
 * @typedef {Object} ResultState<TSuccess, TFailure>
 * @template TSuccess - Result value in case of success
 * @template TFailure - Result value in case of failure
 * @property {boolean} isSuccess - Indicate whether the result is a success or a failure
 * @property {TSuccess} value - Value contained in the result in case of success, undefined in case of failure
 * @property {TFailure} error - Value contained in the result in case of failure, undefined in case of success
 */
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
/**
 * Base interface for result objects.
 * A result object represent the outcome of an operation, that can either be a failure or a success.
 * The Result interface also provides several utility methods to chains operations
 * following the railway oriented programming style
 *
 * @template TSuccess - Value type in case of success
 * @template TFailure - Error type, Value type in case of failure
 * @interface Result<TSuccess, TFailure>
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
     * returns the normalized state of the result object
     * @returns {ResultState<TSuccess,TFailure>}
     */
    unwrap(): ResultState<TSuccess, TFailure>;
    /**
     * Executes the given bind handler, using the current result to get a new result
     * @param fn Handler to execute, must return a result object. The current result object will be passed as the first argument
     * @param args Optional, additional arguments needed for the handler execution
     * @template U
     * @template V
     * @returns {Result<U,V>}
     */
    bind<U, V>(fn: (result: Result<TSuccess, TFailure>, ...args: unknown[]) => Result<U, V>, ...args: unknown[]): Result<U, V>;
    /**
     * Executes the given asynchronous handler, using the current result to get a new result
     * @async
     * @param fn Async handler to execute, must return a result object. The current result object will be passed as the first argument
     * @param args Optional, additional arguments needed for the handler execution
     * @returns Promise<Result<U,V>>
     */
    bindAsync<U, V>(fn: (result: Result<TSuccess, TFailure>, ...args: unknown[]) => Promise<Result<U, V>>, ...args: unknown[]): Promise<Result<U, V>>;
    bindMerge<U, V>(bind: (...args: unknown[]) => (result: Result<TSuccess, TFailure>) => Result<U, V>, ...args: unknown[]): Result<U, V>;
    bindMergeAsync<U, V>(bind: (...args: unknown[]) => (result: Result<TSuccess, TFailure>) => Promise<Result<U, V>>, ...args: unknown[]): Promise<Result<U, V>>;
    map<U, V>(onSuccess: (value: TSuccess, ...args: unknown[]) => Result<U, V>, onFailure: (error: TFailure, ...args: unknown[]) => Result<U, V>, ...args: unknown[]): Result<U, V>;
    mapAsync<U, V>(onSuccess: (value: TSuccess, ...args: unknown[]) => Promise<Result<U, V>>, onFailure: (error: TFailure, ...args: unknown[]) => Promise<Result<U, V>>, ...args: unknown[]): Promise<Result<U, V>>;
    mapMerge<U, V>(onSuccess: (...args: unknown[]) => (value: TSuccess) => Result<U, V>, onFailure: (...args: unknown[]) => (value: TFailure) => Result<U, V>, ...args: unknown[]): Result<U, V>;
    mapMergeAsync<U, V>(onSuccess: (...args: unknown[]) => (value: TSuccess) => Promise<Result<U, V>>, onFailure: (...args: unknown[]) => (value: TFailure) => Promise<Result<U, V>>, ...args: unknown[]): Promise<Result<U, V>>;
    mapSuccess<U>(onSuccess: (value: TSuccess, ...args: unknown[]) => Result<U, TFailure>, ...args: unknown[]): Result<U, TFailure>;
    mapSuccessAsync<U>(onSuccess: (value: TSuccess, ...args: unknown[]) => Promise<Result<U, TFailure>>, ...args: unknown[]): Promise<Result<U, TFailure>>;
    mapMergeSuccess<U>(onSuccess: (...args: unknown[]) => (value: TSuccess) => Result<U, TFailure>, ...args: unknown[]): Result<U, TFailure>;
    mapMergeSuccessAsync<U>(onSuccess: (...args: unknown[]) => (value: TSuccess) => Promise<Result<U, TFailure>>, ...args: unknown[]): Promise<Result<U, TFailure>>;
    mapFailure<V>(onFailure: (error: TFailure, ...args: unknown[]) => Result<TSuccess, V>, ...args: unknown[]): Result<TSuccess, V>;
    mapFailureAsync<V>(onFailure: (error: TFailure, ...args: unknown[]) => Promise<Result<TSuccess, V>>, ...args: unknown[]): Promise<Result<TSuccess, V>>;
    mapMergeFailure<V>(onFailure: (...args: unknown[]) => (value: TFailure) => Result<TSuccess, V>, ...args: unknown[]): Result<TSuccess, V>;
    mapMergeFailureAsync<V>(onFailure: (...args: unknown[]) => (value: TFailure) => Promise<Result<TSuccess, V>>, ...args: unknown[]): Promise<Result<TSuccess, V>>;
    swap<U, V>(onSuccess: (value: TSuccess, ...args: unknown[]) => U, onFailure: (error: TFailure, ...args: unknown[]) => V, ...args: unknown[]): Result<U, V>;
    swapAsync<U, V>(onSuccess: (value: TSuccess, ...args: unknown[]) => Promise<U>, onFailure: (error: TFailure, ...args: unknown[]) => Promise<V>, ...args: unknown[]): Promise<Result<U, V>>;
    swapMerge<U, V>(onSuccess: (...args: unknown[]) => (value: TSuccess) => U, onFailure: (...args: unknown[]) => (value: TFailure) => V, ...args: unknown[]): Result<U, V>;
    swapMergeAsync<U, V>(onSuccess: (...args: unknown[]) => (value: TSuccess) => Promise<U>, onFailure: (...args: unknown[]) => (value: TFailure) => Promise<V>, ...args: unknown[]): Promise<Result<U, V>>;
    swapSuccess<U>(onSuccess: (value: TSuccess, ...args: unknown[]) => U, ...args: unknown[]): Result<U, TFailure>;
    swapSuccessAsync<U>(onSuccess: (value: TSuccess, ...args: unknown[]) => Promise<U>, ...args: unknown[]): Promise<Result<U, TFailure>>;
    swapMergeSuccess<U>(onSuccess: (...args: unknown[]) => (value: TSuccess) => U, ...args: unknown[]): Result<U, TFailure>;
    swapMergeSuccessAsync<U>(onSuccess: (...args: unknown[]) => (value: TSuccess) => Promise<U>, ...args: unknown[]): Promise<Result<U, TFailure>>;
    swapFailure<V>(onFailure: (error: TFailure, ...args: unknown[]) => V, ...args: unknown[]): Result<TSuccess, V>;
    swapFailureAsync<V>(onFailure: (error: TFailure, ...args: unknown[]) => Promise<V>, ...args: unknown[]): Promise<Result<TSuccess, V>>;
    swapMergeFailure<V>(onFailure: (...args: unknown[]) => (value: TFailure) => V, ...args: unknown[]): Result<TSuccess, V>;
    swapMergeFailureAsync<V>(onFailure: (...args: unknown[]) => (value: TFailure) => Promise<V>, ...args: unknown[]): Promise<Result<TSuccess, V>>;
    fork(handle: (result: Result<TSuccess, TFailure>, ...args: unknown[]) => unknown, ...args: unknown[]): Result<TSuccess, TFailure>;
    forkMap(onSuccess: (value: TSuccess, ...args: unknown[]) => unknown, onFailure: (error: TFailure, ...args: unknown[]) => unknown, ...args: unknown[]): Result<TSuccess, TFailure>;
    forkSuccess(onSuccess: (value: TSuccess, ...args: unknown[]) => unknown, ...args: unknown[]): Result<TSuccess, TFailure>;
    forkFailure(onFailure: (error: TFailure, ...args: unknown[]) => unknown, ...args: unknown[]): Result<TSuccess, TFailure>;
}
/**@module fwd-result */
/**
 * Implementation of Result<TSuccess, TFailure> for failure cases
 *
 * @class
 * @template TFailure - Value type for failure cases
 * @inheritdoc
 */
export declare class FailureResult<TFailure> implements Result<unknown, TFailure> {
    reason: TFailure;
    /**
     *
     * @constructor
     * @param error Failure data
     */
    constructor(error: TFailure);
    /**
     * Checks whether the result is a success or a failure.
     * Returns true in case of success, false in case of failure
     * @returns {boolean}
     */
    isSuccess(): boolean;
    /**
     * returns the normalized state of the result object
     * @returns {ResultState<unknown,TFailure>}
     */
    unwrap(): ResultState<unknown, TFailure>;
    /**
     * Executes the given handler, using the current result to get a new result
     * @param fn Handler to execute, must return a result object. The current result object will be passed as the first argument
     * @param args Optional, additional arguments needed for the handler execution
     * @returns Result<U,V>
     */
    bind<U, V>(fn: (result: Result<unknown, TFailure>, ...args: unknown[]) => Result<U, V>, ...args: unknown[]): Result<U, V>;
    /**
     * Executes the given asynchronous handler, using the current result to get a new result
     * @async
     * @param fn Async handler to execute, must return a result object. The current result object will be passed as the first argument
     * @param args Optional, additional arguments needed for the handler execution
     * @returns Promise<Result<U,V>>
     */
    bindAsync<U, V>(fn: (result: Result<unknown, TFailure>, ...args: unknown[]) => Promise<Result<U, V>>, ...args: unknown[]): Promise<Result<U, V>>;
    bindMerge<U, V>(bind: (...args: unknown[]) => (result: Result<unknown, TFailure>) => Result<U, V>, ...args: unknown[]): Result<U, V>;
    bindMergeAsync<U, V>(bind: (...args: unknown[]) => (result: Result<unknown, TFailure>) => Promise<Result<U, V>>, ...args: unknown[]): Promise<Result<U, V>>;
    map<U, V>(_: (value: unknown, ...args: unknown[]) => Result<U, V>, onFailure: (error: TFailure, ...args: unknown[]) => Result<U, V>, ...args: unknown[]): Result<U, V>;
    mapAsync<U, V>(_: (value: unknown, ...args: unknown[]) => Promise<Result<U, V>>, onFailure: (error: TFailure, ...args: unknown[]) => Promise<Result<U, V>>, ...args: unknown[]): Promise<Result<U, V>>;
    mapMerge<U, V>(_: (...args: unknown[]) => (value: unknown) => Result<U, V>, onFailure: (...args: unknown[]) => (value: TFailure) => Result<U, V>, ...args: unknown[]): Result<U, V>;
    mapMergeAsync<U, V>(_: (...args: unknown[]) => (value: unknown) => Promise<Result<U, V>>, onFailure: (...args: unknown[]) => (value: TFailure) => Promise<Result<U, V>>, ...args: unknown[]): Promise<Result<U, V>>;
    mapSuccess<U>(): Result<U, TFailure>;
    mapSuccessAsync<U>(): Promise<Result<U, TFailure>>;
    mapMergeSuccess<U>(): Result<U, TFailure>;
    mapMergeSuccessAsync<U>(): Promise<Result<U, TFailure>>;
    mapFailure<V>(onFailure: (error: TFailure, ...args: unknown[]) => Result<unknown, V>, ...args: unknown[]): Result<unknown, V>;
    mapFailureAsync<V>(onFailure: (error: TFailure, ...args: unknown[]) => Promise<Result<unknown, V>>, ...args: unknown[]): Promise<Result<unknown, V>>;
    mapMergeFailure<V>(onFailure: (...args: unknown[]) => (value: TFailure) => Result<unknown, V>, ...args: unknown[]): Result<unknown, V>;
    mapMergeFailureAsync<V>(onFailure: (...args: unknown[]) => (value: TFailure) => Promise<Result<unknown, V>>, ...args: unknown[]): Promise<Result<unknown, V>>;
    swap<U, V>(_: (value: unknown, ...args: unknown[]) => U, onFailure: (error: TFailure, ...args: unknown[]) => V, ...args: unknown[]): Result<U, V>;
    swapAsync<U, V>(_: (value: unknown, ...args: unknown[]) => Promise<U>, onFailure: (error: TFailure, ...args: unknown[]) => Promise<V>, ...args: unknown[]): Promise<Result<U, V>>;
    swapMerge<U, V>(_: (...args: unknown[]) => (value: unknown) => U, onFailure: (...args: unknown[]) => (value: TFailure) => V, ...args: unknown[]): Result<U, V>;
    swapMergeAsync<U, V>(_: (...args: unknown[]) => (value: unknown) => Promise<U>, onFailure: (...args: unknown[]) => (value: TFailure) => Promise<V>, ...args: unknown[]): Promise<Result<U, V>>;
    swapSuccess<U>(): Result<U, TFailure>;
    swapSuccessAsync<U>(): Promise<Result<U, TFailure>>;
    swapMergeSuccess<U>(): Result<U, TFailure>;
    swapMergeSuccessAsync<U>(): Promise<Result<U, TFailure>>;
    swapFailure<V>(onFailure: (error: TFailure, ...args: unknown[]) => V, ...args: unknown[]): Result<unknown, V>;
    swapFailureAsync<V>(onFailure: (error: TFailure, ...args: unknown[]) => Promise<V>, ...args: unknown[]): Promise<Result<unknown, V>>;
    swapMergeFailure<V>(onFailure: (...args: unknown[]) => (value: TFailure) => V, ...args: unknown[]): Result<unknown, V>;
    swapMergeFailureAsync<V>(onFailure: (...args: unknown[]) => (value: TFailure) => Promise<V>, ...args: unknown[]): Promise<Result<unknown, V>>;
    fork(handle: (result: Result<unknown, TFailure>, ...args: unknown[]) => unknown, ...args: unknown[]): Result<unknown, TFailure>;
    forkMap(_: (value: unknown, ...args: unknown[]) => unknown, onFailure: (error: TFailure, ...args: unknown[]) => unknown, ...args: unknown[]): Result<unknown, TFailure>;
    forkSuccess(): Result<unknown, TFailure>;
    forkFailure(onFailure: (error: TFailure, ...args: unknown[]) => unknown, ...args: unknown[]): Result<unknown, TFailure>;
}
/**@module fwd-result */
/**
 * Implementation of Result<TSuccess, TFailure> for success cases
 *
 * @class
 * @template TSuccess - Value type for success cases
 * @inheritdoc
 */
export declare class SuccessResult<TSuccess> implements Result<TSuccess, unknown> {
    value: TSuccess;
    /**
     * @constructor
     * @param value Success data
     */
    constructor(value: TSuccess);
    /**
     * Checks whether the result is a success or a failure.
     * Returns true in case of success, false in case of failure
     * @returns {boolean}
     */
    isSuccess(): boolean;
    /**
     * returns the normalized state of the result object
     * @template TSuccess - Value type for success cases
     * @returns {ResultState<TSuccess,unknown>}
     */
    unwrap(): ResultState<TSuccess, unknown>;
    /**
     * Executes the given handler, using the current result to get a new result
     * @param fn Handler to execute, must return a result object. The current result object will be passed as the first argument
     * @param args Optional, additional arguments needed for the handler execution
     * @returns Result<U,V>
     */
    bind<U, V>(fn: (result: Result<TSuccess, unknown>, ...args: unknown[]) => Result<U, V>, ...args: unknown[]): Result<U, V>;
    /**
     * Executes the given asynchronous handler, using the current result to get a new result
     * @async
     * @param fn Async handler to execute, must return a result object. The current result object will be passed as the first argument
     * @param args Optional, additional arguments needed for the handler execution
     * @returns Promise<Result<U,V>>
     */
    bindAsync<U, V>(fn: (result: Result<TSuccess, unknown>, ...args: unknown[]) => Promise<Result<U, V>>, ...args: unknown[]): Promise<Result<U, V>>;
    bindMerge<U, V>(bind: (...args: unknown[]) => (result: Result<TSuccess, unknown>) => Result<U, V>, ...args: unknown[]): Result<U, V>;
    bindMergeAsync<U, V>(bind: (...args: unknown[]) => (result: Result<TSuccess, unknown>) => Promise<Result<U, V>>, ...args: unknown[]): Promise<Result<U, V>>;
    map<U, V>(onSuccess: (value: TSuccess, ...args: unknown[]) => Result<U, V>, _: (error: unknown, ...args: unknown[]) => Result<U, V>, ...args: unknown[]): Result<U, V>;
    mapAsync<U, V>(onSuccess: (value: TSuccess, ...args: unknown[]) => Promise<Result<U, V>>, _: (error: unknown, ...args: unknown[]) => Promise<Result<U, V>>, ...args: unknown[]): Promise<Result<U, V>>;
    mapMerge<U, V>(onSuccess: (...args: unknown[]) => (value: TSuccess) => Result<U, V>, _: (...args: unknown[]) => (value: unknown) => Result<U, V>, ...args: unknown[]): Result<U, V>;
    mapMergeAsync<U, V>(onSuccess: (...args: unknown[]) => (value: TSuccess) => Promise<Result<U, V>>, _: (...args: unknown[]) => (value: unknown) => Promise<Result<U, V>>, ...args: unknown[]): Promise<Result<U, V>>;
    mapSuccess<U>(onSuccess: (value: TSuccess, ...args: unknown[]) => Result<U, unknown>, ...args: unknown[]): Result<U, unknown>;
    mapSuccessAsync<U>(onSuccess: (value: TSuccess, ...args: unknown[]) => Promise<Result<U, unknown>>, ...args: unknown[]): Promise<Result<U, unknown>>;
    mapMergeSuccess<U>(onSuccess: (...args: unknown[]) => (value: TSuccess) => Result<U, unknown>, ...args: unknown[]): Result<U, unknown>;
    mapMergeSuccessAsync<U>(onSuccess: (...args: unknown[]) => (value: TSuccess) => Promise<Result<U, unknown>>, ...args: unknown[]): Promise<Result<U, unknown>>;
    mapFailure<V>(): Result<TSuccess, V>;
    mapFailureAsync<V>(): Promise<Result<TSuccess, V>>;
    mapMergeFailure<V>(): Result<TSuccess, V>;
    mapMergeFailureAsync<V>(): Promise<Result<TSuccess, V>>;
    swap<U, V>(onSuccess: (value: TSuccess, ...args: unknown[]) => U, _: (error: unknown, ...args: unknown[]) => V, ...args: unknown[]): Result<U, V>;
    swapAsync<U, V>(onSuccess: (value: TSuccess, ...args: unknown[]) => Promise<U>, _: (error: unknown, ...args: unknown[]) => Promise<V>, ...args: unknown[]): Promise<Result<U, V>>;
    swapMerge<U, V>(onSuccess: (...args: unknown[]) => (value: TSuccess) => U, _: (...args: unknown[]) => (value: unknown) => V, ...args: unknown[]): Result<U, V>;
    swapMergeAsync<U, V>(onSuccess: (...args: unknown[]) => (value: TSuccess) => Promise<U>, _: (...args: unknown[]) => (value: unknown) => Promise<V>, ...args: unknown[]): Promise<Result<U, V>>;
    swapSuccess<U>(onSuccess: (value: TSuccess, ...args: unknown[]) => U, ...args: unknown[]): Result<U, unknown>;
    swapSuccessAsync<U>(onSuccess: (value: TSuccess, ...args: unknown[]) => Promise<U>, ...args: unknown[]): Promise<Result<U, unknown>>;
    swapMergeSuccess<U>(onSuccess: (...args: unknown[]) => (value: TSuccess) => U, ...args: unknown[]): Result<U, unknown>;
    swapMergeSuccessAsync<U>(onSuccess: (...args: unknown[]) => (value: TSuccess) => Promise<U>, ...args: unknown[]): Promise<Result<U, unknown>>;
    swapFailure<V>(): Result<TSuccess, V>;
    swapFailureAsync<V>(): Promise<Result<TSuccess, V>>;
    swapMergeFailure<V>(): Result<TSuccess, V>;
    swapMergeFailureAsync<V>(): Promise<Result<TSuccess, V>>;
    fork(handle: (result: Result<TSuccess, unknown>, ...args: unknown[]) => unknown, ...args: unknown[]): Result<TSuccess, unknown>;
    forkMap(onSuccess: (value: TSuccess, ...args: unknown[]) => unknown, _: (error: unknown, ...args: unknown[]) => unknown, ...args: unknown[]): Result<TSuccess, unknown>;
    forkSuccess(onSuccess: (value: TSuccess, ...args: unknown[]) => unknown, ...args: unknown[]): Result<TSuccess, unknown>;
    forkFailure(): Result<TSuccess, unknown>;
}
export declare const result: {
    /**
     * Creates an instance of Result representing a success, using the given value
     * @param value Result data for a success
     * @returns An instance of Result
     */
    success<T, E>(value: T): Result<T, E>;
    /**
     * Creates an instance of Result representing a failure, using the given error
     * @param error Result data for a failure
     * @returns An instance of Result
     */
    failure<T_1, E_1>(error: E_1): Result<T_1, E_1>;
};
