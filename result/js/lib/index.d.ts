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
    bindAsync<U, V>(fn: (result: Result<TSuccess, TFailure>) => Promise<Result<U, V>>): Promise<Result<U, V>>;
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
    mapAsync<U, V>(onSuccess: (value: TSuccess) => Promise<Result<U, V>>, onFailure: (error: TFailure) => Promise<Result<U, V>>): Promise<Result<U, V>>;
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
    mapSuccessAsync<U>(onSuccess: (value: TSuccess) => Promise<Result<U, TFailure>>): Promise<Result<U, TFailure>>;
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
    mapFailureAsync<V>(onFailure: (error: TFailure) => Promise<Result<TSuccess, V>>): Promise<Result<TSuccess, V>>;
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
    swapAsync<U, V>(onSuccess: (value: TSuccess) => Promise<U>, onFailure: (error: TFailure) => Promise<V>): Promise<Result<U, V>>;
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
    swapSuccessAsync<U>(onSuccess: (value: TSuccess) => Promise<U>): Promise<Result<U, TFailure>>;
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
    swapFailureAsync<V>(onFailure: (error: TFailure) => Promise<V>): Promise<Result<TSuccess, V>>;
    /**
     * Executes the given handler, then returns the current result
     * @param handle Handler to execute using the current result
     * @returns Result<TSuccess,TFailure>
     */
    fork(handle: (result: Result<TSuccess, TFailure>) => unknown): Result<TSuccess, TFailure>;
    /**
     * Executes the corresponding handler, then returns the current result
     * @param onSuccess Handler to execute in case of success using the current result payload
     * @param onFailure Handler to execute in case of failure using the current result payload
     * @returns Result<TSuccess,TFailure>
     */
    forkMap(onSuccess: (value: TSuccess) => unknown, onFailure: (error: TFailure) => unknown): Result<TSuccess, TFailure>;
    /**
     * Executes the given handler, in case of success, then returns the current result
     * @param onSuccess Handler to execute in case of success using the current result payload
     * @returns Result<TSuccess,TFailure>
     */
    forkSuccess(onSuccess: (value: TSuccess) => unknown): Result<TSuccess, TFailure>;
    /**
     * Executes the given handler, in case of failure, then returns the current result
     * @param onFailure Handler to execute in case of failure using the current result payload
     * @returns Result<TSuccess,TFailure>
     */
    forkFailure(onFailure: (error: TFailure) => unknown): Result<TSuccess, TFailure>;
}
export declare class FailureResult<TFailure> implements Result<unknown, TFailure> {
    reason: TFailure;
    constructor(error: TFailure);
    value(): unknown;
    error(): TFailure | undefined;
    state(): ResultState<unknown, TFailure>;
    payload(): unknown;
    isSuccess(): boolean;
    bind<U, V>(fn: (result: Result<unknown, TFailure>) => Result<U, V>): Result<U, V>;
    bindAsync<U, V>(fn: (result: Result<unknown, TFailure>) => Promise<Result<U, V>>): Promise<Result<U, V>>;
    map<U, V>(_: (value: unknown) => Result<U, V>, onFailure: (error: TFailure) => Result<U, V>): Result<U, V>;
    mapAsync<U, V>(_: (value: unknown) => Promise<Result<U, V>>, onFailure: (error: TFailure) => Promise<Result<U, V>>): Promise<Result<U, V>>;
    mapSuccess<U>(): Result<U, TFailure>;
    mapSuccessAsync<U>(): Promise<Result<U, TFailure>>;
    mapFailure<V>(onFailure: (error: TFailure) => Result<unknown, V>): Result<unknown, V>;
    mapFailureAsync<V>(onFailure: (error: TFailure) => Promise<Result<unknown, V>>): Promise<Result<unknown, V>>;
    swap<U, V>(_: (value: unknown) => U, onFailure: (error: TFailure) => V): Result<U, V>;
    swapAsync<U, V>(_: (value: unknown) => Promise<U>, onFailure: (error: TFailure) => Promise<V>): Promise<Result<U, V>>;
    swapSuccess<U>(): Result<U, TFailure>;
    swapSuccessAsync<U>(): Promise<Result<U, TFailure>>;
    swapFailure<V>(onFailure: (error: TFailure) => V): Result<unknown, V>;
    swapFailureAsync<V>(onFailure: (error: TFailure) => Promise<V>): Promise<Result<unknown, V>>;
    fork(handle: (result: Result<unknown, TFailure>) => unknown): Result<unknown, TFailure>;
    forkMap(_: (value: unknown) => unknown, onFailure: (error: TFailure) => unknown): Result<unknown, TFailure>;
    forkSuccess(): Result<unknown, TFailure>;
    forkFailure(onFailure: (error: TFailure) => unknown): Result<unknown, TFailure>;
}
export declare class SuccessResult<TSuccess> implements Result<TSuccess, unknown> {
    _value: TSuccess;
    constructor(value: TSuccess);
    isSuccess(): boolean;
    value(): TSuccess | undefined;
    error(): unknown;
    payload(): unknown;
    state(): ResultState<TSuccess, unknown>;
    bind<U, V>(fn: (result: Result<TSuccess, unknown>) => Result<U, V>): Result<U, V>;
    bindAsync<U, V>(fn: (result: Result<TSuccess, unknown>) => Promise<Result<U, V>>): Promise<Result<U, V>>;
    map<U, V>(onSuccess: (value: TSuccess) => Result<U, V>, _: (error: unknown) => Result<U, V>): Result<U, V>;
    mapAsync<U, V>(onSuccess: (value: TSuccess) => Promise<Result<U, V>>, _: (error: unknown) => Promise<Result<U, V>>): Promise<Result<U, V>>;
    mapSuccess<U>(onSuccess: (value: TSuccess) => Result<U, unknown>): Result<U, unknown>;
    mapSuccessAsync<U>(onSuccess: (value: TSuccess) => Promise<Result<U, unknown>>): Promise<Result<U, unknown>>;
    mapFailure<V>(): Result<TSuccess, V>;
    mapFailureAsync<V>(): Promise<Result<TSuccess, V>>;
    swap<U, V>(onSuccess: (value: TSuccess) => U, _: (error: unknown) => V): Result<U, V>;
    swapAsync<U, V>(onSuccess: (value: TSuccess) => Promise<U>, _: (error: unknown) => Promise<V>): Promise<Result<U, V>>;
    swapSuccess<U>(onSuccess: (value: TSuccess) => U): Result<U, unknown>;
    swapSuccessAsync<U>(onSuccess: (value: TSuccess) => Promise<U>): Promise<Result<U, unknown>>;
    swapFailure<V>(): Result<TSuccess, V>;
    swapFailureAsync<V>(): Promise<Result<TSuccess, V>>;
    fork(handle: (result: Result<TSuccess, unknown>) => unknown): Result<TSuccess, unknown>;
    forkMap(onSuccess: (value: TSuccess) => unknown, _: (error: unknown) => unknown): Result<TSuccess, unknown>;
    forkSuccess(onSuccess: (value: TSuccess) => unknown): Result<TSuccess, unknown>;
    forkFailure(): Result<TSuccess, unknown>;
}
/**
 * Creates an instance of Result representing a success, using the given value
 * @param value Result data for a success
 * @returns An instance of Result
 */
export declare const success: <T, E>(value: T) => Result<T, E>;
/**
 * Creates an instance of Result representing a failure, using the given error
 * @param error Result data for a failure
 * @returns An instance of Result
 */
export declare const failure: <T, E>(error: E) => Result<T, E>;
