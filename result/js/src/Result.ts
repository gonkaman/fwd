
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
    isSuccess: boolean,

    /**
     * Value contained in the result in case of success, undefined in case of failure
     * @readonly
     */
    value?: TSuccess,

    /**
     * Value contained in the result in case of failure, undefined in case of success
     * @readonly
     */
    error?: TFailure
}

export type PromiseLikeOfOr<T> = T | PromiseLike<T>

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
export interface Result<TSuccess, TFailure>{

    /**
     * Tells if the result instance is a success result.
     * Returns true if the result instance is a success result.
     * @returns {boolean}
     */
    isSuccess(): boolean,

    /**
     * Returns the payload of the result instance if it's a success result.
     * Returns undefined if it's a failure result
     * @returns {TSuccess}
     */
    value(): TSuccess | undefined,
    
    /**
     * Returns the payload (error message) of the result instance if it's a failure result.
     * Returns undefined if it's a success result
     * @returns {TSuccess}
     */
    error(): TFailure | undefined

    /**
     * Returns the payload of the result instance
     * @returns {TSuccess | TFailure}
     */
    payload(): TSuccess | TFailure

    /**
     * returns a representation of the result instance state
     * @returns {ResultState<TSuccess, TFailure>}
     */
    state(): ResultState<TSuccess, TFailure>,

    /**
     * Executes the given bind handler, using the current result instance an returns a result instance
     * @param fn Handler to execute. 
     * @template U Returned result payload type in case of success
     * @template V Returned result payload type in case of failure
     * @returns {Result<U,V>}
     */
    bind<U,V>(
        fn: (result: Result<TSuccess,TFailure>) => Result<U,V>
    ): Result<U,V>,

    /**
     * Executes the given asynchronous handler, using the current result to get a new result
     * @param fn Asynchronous handler to execute.
     * @async
     * @template U Returned result payload type in case of success
     * @template V Returned result payload type in case of failure
     * @returns {Promise<Result<U,V>>}
     */
    bindAsync<U,V>(
        fn: (result: Result<TSuccess,TFailure>) => PromiseLikeOfOr<Result<U,V>>
    ): Promise<Result<U,V>>,


    /**
     * Executes the corresponding handler, using the current result to get a new result
     * @param onSuccess Handler to execute in case of success, using the current result payload. 
     * @param onFailure Handler to execute in case of failure, using the current result payload. 
     * @template U Returned result payload type in case of success
     * @template V Returned result payload type in case of failure
     * @returns {Result<U,V>}
     */
    map<U,V>(
        onSuccess: (value: TSuccess) => Result<U,V>,
        onFailure: (error: TFailure) => Result<U,V>
    ): Result<U,V>,
    
    /**
     * Executes the corresponding asynchronous handler, using the current result.
     * @param onSuccess Asynchronous handler to execute in case of success, using the current result payload. 
     * @param onFailure Asynchronous handler to execute in case of failure, using the current result payload. 
     * @async
     * @template U Returned result payload type in case of success
     * @template V Returned result payload type in case of failure
     * @returns {Promise<Result<U,V>>}
     */
    mapAsync<U,V>(
        onSuccess: (value: TSuccess) => PromiseLikeOfOr<Result<U,V>>,
        onFailure: (error: TFailure) => PromiseLikeOfOr<Result<U,V>>
    ): Promise<Result<U,V>>,



    /**
     * Execute the given handler in case of success using the current result payload. 
     * In case of failure, the current result is simply returned
     * @param onSuccess Handler to execute in case of success. 
     * @template U Returned result payload type in case of success
     * @returns {Result<U,TFailure>}
     */
    mapSuccess<U>(
        onSuccess: (value: TSuccess) => Result<U,TFailure>
    ): Result<U,TFailure>,
    
    /**
     * Execute the given asynchronous handler in case of success using the current result payload. 
     * @param onSuccess Asynchronous handler to execute in case of success. 
     * @async
     * @template U Returned result payload type in case of success
     * @returns {Promise<Result<U,TFailure>>}
     */
    mapSuccessAsync<U>(
        onSuccess: (value: TSuccess) => PromiseLikeOfOr<Result<U,TFailure>>
    ): Promise<Result<U,TFailure>>,


    /**
     * Execute the given handler in case of failure using the current result payload. 
     * In case of success, the current result is simply returned
     * @param onFailure Handler to execute in case of failure. 
     * @template V Returned result payload type in case of failure
     * @returns {Result<TSuccess,V>}
     */
    mapFailure<V>(
        onFailure: (error: TFailure) => Result<TSuccess,V>
    ): Result<TSuccess,V>,

    /**
     * Execute the given asynchronous handler in case of failure using the current result payload. 
     * In case of success, the current result is simply returned
     * @param onFailure Asynchronous handler to execute in case of failure. 
     * @async
     * @template V Returned result payload type in case of failure
     * @returns {Promise<Result<TSuccess,V>>}
     */
    mapFailureAsync<V>(
        onFailure: (error: TFailure) => PromiseLikeOfOr<Result<TSuccess,V>>
    ): Promise<Result<TSuccess,V>>,


    /**
     * Replaces the current result payload with the output of the corresponding handler output.
     * @param onSuccess Handler to execute in case of success using the current payload
     * @param onFailure Handler to execute in case of failure using the current payload
     * @template U Returned result payload type in case of success
     * @template V Returned result payload type in case of failure
     * @returns {Result<U,V>}
     */
    swap<U,V>(
        onSuccess: (value: TSuccess) => U,
        onFailure: (error: TFailure) => V
    ): Result<U,V>,
    
    /**
     * Replaces the current result payload with the output of the corresponding asynchronous handler output using the current payload.
     * @param onSuccess Asynchronous handler to execute in case of success using the current payload
     * @param onFailure Asynchronous handler to execute in case of failure using the current payload
     * @async
     * @template U Returned result payload type in case of success
     * @template V Returned result payload type in case of failure
     * @returns {Promise<Result<U,V>>}
     */
    swapAsync<U,V>(
        onSuccess: (value: TSuccess) => PromiseLikeOfOr<U>,
        onFailure: (error: TFailure) => PromiseLikeOfOr<V>
    ): Promise<Result<U,V>>,


    /**
     * In case of success, replaces the current result payload with the output of the given handler output.
     * In case of failure, simply returns the current result
     * @param onSuccess Handler to execute in case of success using the current payload.
     * @template U Returned result payload type in case of success
     * @returns {Result<U,TFailure>}
     */
    swapSuccess<U>(
        onSuccess: (value: TSuccess) => U
    ): Result<U,TFailure>,

    /**
     * In case of success, replaces the current result payload with the output of the given asynchronous handler output.
     * In case of failure, simply returns the current result
     * @param onSuccess Asynchronous handler to execute in case of success using the current payload.
     * @template U Returned result payload type in case of success
     * @returns {Promise<Result<U,TFailure>>}
     */
    swapSuccessAsync<U>(
        onSuccess: (value: TSuccess) => PromiseLikeOfOr<U>
    ): Promise<Result<U,TFailure>>,

    /**
     * In case of failure, replaces the current result payload with the output of the given handler output.
     * In case of success, simply returns the current result
     * @param onFailure Handler to execute in case of failure using the current payload.
     * @template V Returned result payload type in case of failure
     * @returns {Result<TSuccess,V>}
     */
    swapFailure<V>(
        onFailure: (error: TFailure) => V
    ): Result<TSuccess,V>,

    /**
     * In case of failure, replaces the current result payload with the output of the given asynchronous handler output.
     * In case of success, simply returns the current result
     * @param onFailure Asynchronous handler to execute in case of failure using the current payload.
     * @template V Returned result payload type in case of failure
     * @returns {Promise<Result<TSuccess,V>>}
     */
    swapFailureAsync<V>(
        onFailure: (error: TFailure) => PromiseLikeOfOr<V>
    ): Promise<Result<TSuccess,V>>,

    /**
     * Executes the given handler, then returns the current result
     * @param handle Handler to execute using the current result
     * @returns {Result<TSuccess,TFailure>}
     */
    fork(
        handle: (result: Result<TSuccess,TFailure>) => unknown
    ): Result<TSuccess,TFailure>,
    
    
    /**
     * Executes the given asynchronous handler, then returns the current result
     * @param handle Asynchronous handler to execute using the current result
     * @returns {Promise<Result<TSuccess,TFailure>>}
     */
    forkAsync(
        handle: (result: Result<TSuccess,TFailure>) => PromiseLikeOfOr<unknown>
    ): Promise<Result<TSuccess,TFailure>>,


    /**
     * Executes the corresponding handler, then returns the current result
     * @param onSuccess Handler to execute in case of success using the current result payload
     * @param onFailure Handler to execute in case of failure using the current result payload
     * @returns {Result<TSuccess,TFailure>}
     */
    forkMap(
        onSuccess: (value: TSuccess) => unknown,
        onFailure: (error: TFailure) => unknown
    ): Result<TSuccess,TFailure>,

    
    /**
     * Executes the corresponding asynchronous handler, then returns the current result
     * @param onSuccess Asynchronous handler to execute in case of success using the current result payload
     * @param onFailure Asynchronous handler to execute in case of failure using the current result payload
     * @returns {Promise<Result<TSuccess,TFailure>>}
     */
    forkMapAsync(
        onSuccess: (value: TSuccess) => PromiseLikeOfOr<unknown>,
        onFailure: (error: TFailure) => PromiseLikeOfOr<unknown>
    ): Promise<Result<TSuccess,TFailure>>,
    
    /**
     * Executes the given handler, in case of success, then returns the current result
     * @param onSuccess Handler to execute in case of success using the current result payload
     * @returns {Result<TSuccess,TFailure>}
     */
    forkSuccess(
        onSuccess: (value: TSuccess) => unknown
    ): Result<TSuccess,TFailure>,
    
    /**
     * Executes the given asynchronous handler, in case of success, then returns the current result
     * @param onSuccess Asynchronous handler to execute in case of success using the current result payload
     * @returns {Promise<Result<TSuccess,TFailure>>}
     */
    forkSuccessAsync(
        onSuccess: (value: TSuccess) => PromiseLikeOfOr<unknown>
    ): Promise<Result<TSuccess,TFailure>>,
    
    /**
     * Executes the given handler, in case of failure, then returns the current result
     * @param onFailure Handler to execute in case of failure using the current result payload
     * @returns {Result<TSuccess,TFailure>}
     */
    forkFailure(
        onFailure: (error: TFailure) => unknown
    ): Result<TSuccess,TFailure>,
    
    /**
     * Executes the given asynchronous handler, in case of failure, then returns the current result
     * @param onFailure Asynchronous handler to execute in case of failure using the current result payload
     * @returns {Promise<Result<TSuccess,TFailure>>}
     */
    forkFailureAsync(
        onFailure: (error: TFailure) => PromiseLikeOfOr<unknown>
    ): Promise<Result<TSuccess,TFailure>>

    
}

