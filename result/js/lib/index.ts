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
     * Checks whether the result is a success or a failure.
     * Returns true in case of success, false in case of failure
     * @returns {boolean} 
     */
    isSuccess(): boolean,

    /**
     * Value contained in the result in case of success, undefined in case of failure
     * @returns {TSuccess}
     */
    value(): TSuccess | undefined,
    
    /**
     * Value contained in the result in case of failure, undefined in case of success
     * @readonly
     */
    error(): TFailure | undefined

    /**
     * Value contained in the result
     * @readonly
     */
    payload(): TSuccess | TFailure

    /**
     * returns the normalized state of the result object
     * @returns ResultState<TSuccess, TFailure>
     */
    state(): ResultState<TSuccess, TFailure>,

    /**
     * Executes the given bind handler, using the current result to get a new result
     * @param fn Handler to execute. 
     * @template U
     * @template V
     * @returns Result<U,V>
     */
    bind<U,V>(
        fn: (result: Result<TSuccess,TFailure>) => Result<U,V>
    ): Result<U,V>,

    /**
     * Executes the given asynchronous handler, using the current result to get a new result
     * @param fn Asynchronous handler to execute.
     * @async
     * @template U
     * @template V
     * @returns Promise<Result<U,V>>
     */
    bindAsync<U,V>(
        fn: (result: Result<TSuccess,TFailure>) => PromiseLikeOfOr<Result<U,V>>
    ): Promise<Result<U,V>>,


    /**
     * Executes the corresponding handler, using the current result to get a new result
     * @param onSuccess Handler to execute in case of success, using the current result payload. 
     * @param onFailure Handler to execute in case of failure, using the current result payload. 
     * @template U
     * @template V
     * @returns Result<U,V>
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
     * @template U
     * @template V
     * @returns Promise<Result<U,V>>
     */
    mapAsync<U,V>(
        onSuccess: (value: TSuccess) => PromiseLikeOfOr<Result<U,V>>,
        onFailure: (error: TFailure) => PromiseLikeOfOr<Result<U,V>>
    ): Promise<Result<U,V>>,



    /**
     * Execute the given handler in case of success using the current result payload. 
     * In case of failure, the current result is simply returned
     * @param onSuccess Handler to execute in case of success. 
     * @template U
     * @returns Result<U,TFailure>
     */
    mapSuccess<U>(
        onSuccess: (value: TSuccess) => Result<U,TFailure>
    ): Result<U,TFailure>,
    
    /**
     * Execute the given asynchronous handler in case of success using the current result payload. 
     * @param onSuccess Asynchronous handler to execute in case of success. 
     * @async
     * @template U
     * @returns Promise<Result<U,TFailure>>
     */
    mapSuccessAsync<U>(
        onSuccess: (value: TSuccess) => PromiseLikeOfOr<Result<U,TFailure>>
    ): Promise<Result<U,TFailure>>,


    /**
     * Execute the given handler in case of failure using the current result payload. 
     * In case of success, the current result is simply returned
     * @param onFailure Handler to execute in case of failure. 
     * @template V
     * @returns Result<TSuccess,V>
     */
    mapFailure<V>(
        onFailure: (error: TFailure) => Result<TSuccess,V>
    ): Result<TSuccess,V>,

    /**
     * Execute the given asynchronous handler in case of failure using the current result payload. 
     * In case of success, the current result is simply returned
     * @param onFailure Asynchronous handler to execute in case of failure. 
     * @async
     * @template V
     * @returns Promise<Result<TSuccess,V>>
     */
    mapFailureAsync<V>(
        onFailure: (error: TFailure) => PromiseLikeOfOr<Result<TSuccess,V>>
    ): Promise<Result<TSuccess,V>>,


    /**
     * Replaces the current result payload with the output of the corresponding handler output.
     * @param onSuccess Handler to execute in case of success using the current payload
     * @param onFailure Handler to execute in case of failure using the current payload
     * @template U
     * @template V
     * @returns Result<U,V>
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
     * @template U
     * @template V
     * @returns Promise<Result<U,V>>
     */
    swapAsync<U,V>(
        onSuccess: (value: TSuccess) => PromiseLikeOfOr<U>,
        onFailure: (error: TFailure) => PromiseLikeOfOr<V>
    ): Promise<Result<U,V>>,


    /**
     * In case of success, replaces the current result payload with the output of the given handler output.
     * In case of failure, simply returns the current result
     * @param onSuccess Handler to execute in case of success using the current payload.
     * @template U
     * @returns Result<U,TFailure>
     */
    swapSuccess<U>(
        onSuccess: (value: TSuccess) => U
    ): Result<U,TFailure>,

    /**
     * In case of success, replaces the current result payload with the output of the given asynchronous handler output.
     * In case of failure, simply returns the current result
     * @param onSuccess Asynchronous handler to execute in case of success using the current payload.
     * @template U
     * @returns Promise<Result<U,TFailure>>
     */
    swapSuccessAsync<U>(
        onSuccess: (value: TSuccess) => PromiseLikeOfOr<U>
    ): Promise<Result<U,TFailure>>,

    /**
     * In case of failure, replaces the current result payload with the output of the given handler output.
     * In case of success, simply returns the current result
     * @param onFailure Handler to execute in case of failure using the current payload.
     * @template V
     * @returns Result<TSuccess,V>
     */
    swapFailure<V>(
        onFailure: (error: TFailure) => V
    ): Result<TSuccess,V>,

    /**
     * In case of failure, replaces the current result payload with the output of the given asynchronous handler output.
     * In case of success, simply returns the current result
     * @param onFailure Asynchronous handler to execute in case of failure using the current payload.
     * @template V
     * @returns Promise<Result<TSuccess,V>>
     */
    swapFailureAsync<V>(
        onFailure: (error: TFailure) => PromiseLikeOfOr<V>
    ): Promise<Result<TSuccess,V>>,

    /**
     * Executes the given handler, then returns the current result
     * @param handle Handler to execute using the current result
     * @returns Result<TSuccess,TFailure>
     */
    fork(
        handle: (result: Result<TSuccess,TFailure>) => unknown
    ): Result<TSuccess,TFailure>,
    
    
    /**
     * Executes the given asynchronous handler, then returns the current result
     * @param handle Asynchronous handler to execute using the current result
     * @returns romise<Result<TSuccess,TFailure>>
     */
    forkAsync(
        handle: (result: Result<TSuccess,TFailure>) => PromiseLikeOfOr<unknown>
    ): Promise<Result<TSuccess,TFailure>>,


    /**
     * Executes the corresponding handler, then returns the current result
     * @param onSuccess Handler to execute in case of success using the current result payload
     * @param onFailure Handler to execute in case of failure using the current result payload
     * @returns Result<TSuccess,TFailure>
     */
    forkMap(
        onSuccess: (value: TSuccess) => unknown,
        onFailure: (error: TFailure) => unknown
    ): Result<TSuccess,TFailure>,

    
    /**
     * Executes the corresponding asynchronous handler, then returns the current result
     * @param onSuccess Asynchronous handler to execute in case of success using the current result payload
     * @param onFailure Asynchronous handler to execute in case of failure using the current result payload
     * @returns Promise<Result<TSuccess,TFailure>>
     */
    forkMapAsync(
        onSuccess: (value: TSuccess) => PromiseLikeOfOr<unknown>,
        onFailure: (error: TFailure) => PromiseLikeOfOr<unknown>
    ): Promise<Result<TSuccess,TFailure>>,
    
    /**
     * Executes the given handler, in case of success, then returns the current result
     * @param onSuccess Handler to execute in case of success using the current result payload
     * @returns Result<TSuccess,TFailure>
     */
    forkSuccess(
        onSuccess: (value: TSuccess) => unknown
    ): Result<TSuccess,TFailure>,
    
    /**
     * Executes the given asynchronous handler, in case of success, then returns the current result
     * @param onSuccess Asynchronous handler to execute in case of success using the current result payload
     * @returns Promise<Result<TSuccess,TFailure>>
     */
    forkSuccessAsync(
        onSuccess: (value: TSuccess) => PromiseLikeOfOr<unknown>
    ): Promise<Result<TSuccess,TFailure>>,
    
    /**
     * Executes the given handler, in case of failure, then returns the current result
     * @param onFailure Handler to execute in case of failure using the current result payload
     * @returns Result<TSuccess,TFailure>
     */
    forkFailure(
        onFailure: (error: TFailure) => unknown
    ): Result<TSuccess,TFailure>,
    
    /**
     * Executes the given asynchronous handler, in case of failure, then returns the current result
     * @param onFailure Asynchronous handler to execute in case of failure using the current result payload
     * @returns Promise<Result<TSuccess,TFailure>>
     */
    forkFailureAsync(
        onFailure: (error: TFailure) => PromiseLikeOfOr<unknown>
    ): Promise<Result<TSuccess,TFailure>>

    
}


class FailureResult<TFailure> implements Result<unknown, TFailure>{

    reason: TFailure;

    constructor(error: TFailure){
        this.reason = error;
    }

    value(): unknown {
        return undefined;
    }

    error(): TFailure | undefined {
        return this.reason;
    }

    state(): ResultState<unknown, TFailure> {
        return {
            error: this.reason,
            isSuccess: false
        }
    }

    payload(): unknown {
        return this.reason;
    }

    isSuccess(): boolean {
        return false;
    }
    
    bind<U, V>(
        fn: (result: Result<unknown, TFailure>) => Result<U, V>
    ): Result<U, V> {
        return fn(this);    
    }

    bindAsync<U, V>(
        fn: (result: Result<unknown, TFailure>) => PromiseLikeOfOr<Result<U,V>>
    ): Promise<Result<U, V>> {
        return Promise.resolve(fn(this));
    }

    map<U, V>(
        _: (value: unknown) => Result<U, V>, 
        onFailure: (error: TFailure) => Result<U, V>
    ): Result<U, V> {
        return onFailure(this.reason);    
    }

    mapAsync<U, V>(
        _: (value: unknown) => PromiseLikeOfOr<Result<U,V>>, 
        onFailure: (error: TFailure) => PromiseLikeOfOr<Result<U,V>>
    ): Promise<Result<U, V>> {
        return Promise.resolve(onFailure(this.reason));    
    }

    mapSuccess<U>(
    ): Result<U, TFailure> {
        return this as Result<U, TFailure>;    
    }

    mapSuccessAsync<U>(
    ): Promise<Result<U, TFailure>> {
        return Promise.resolve(this as Result<U, TFailure>);    
    }

    mapFailure<V>(
        onFailure: (error: TFailure) => Result<unknown, V>
    ): Result<unknown, V> {
        return onFailure(this.reason);    
    }

    mapFailureAsync<V>(
        onFailure: (error: TFailure) => PromiseLikeOfOr<Result<unknown, V>>
    ): Promise<Result<unknown, V>> {
        return Promise.resolve(onFailure(this.reason));    
    }

    swap<U, V>(
        _: (value: unknown) => U, 
        onFailure: (error: TFailure) => V
    ): Result<U, V> {
        return new FailureResult<V>(onFailure(this.reason)) as Result<U, V>;
    }

    async swapAsync<U, V>(
        _: (value: unknown) => PromiseLikeOfOr<U>, 
        onFailure: (error: TFailure) => PromiseLikeOfOr<V>
    ): Promise<Result<U, V>> {
        return new FailureResult<V>(await onFailure(this.reason)) as Result<U, V>;
    }

    swapSuccess<U>(
    ): Result<U, TFailure> {
        return this as Result<U, TFailure>;
    }

    swapSuccessAsync<U>(
    ): Promise<Result<U, TFailure>> {
        return Promise.resolve(this as Result<U, TFailure>);
    }

    swapFailure<V>(
        onFailure: (error: TFailure) => V
    ): Result<unknown, V> {
        return new FailureResult<V>(onFailure(this.reason));
    }

    async swapFailureAsync<V>(
        onFailure: (error: TFailure) => PromiseLikeOfOr<V>
    ): Promise<Result<unknown, V>> {
        return new FailureResult<V>(await onFailure(this.reason));
    }
    

    fork(
        handle: (result: Result<unknown, TFailure>) => unknown
    ): Result<unknown, TFailure> {
        handle(this);
        return this;
    }

    async forkAsync(
        handle: (result: Result<unknown, TFailure>) => unknown
    ): Promise<Result<unknown, TFailure>> {
        return Promise.resolve(handle(this)).then(_ => this);
    }

    forkMap(
        _: (value: unknown) => unknown, 
        onFailure: (error: TFailure) => unknown
    ): Result<unknown, TFailure> {
        onFailure(this.reason);
        return this;
    }

    async forkMapAsync(
        _: (value: unknown) => unknown, 
        onFailure: (error: TFailure) => unknown
    ): Promise<Result<unknown, TFailure>> {
        return Promise.resolve(onFailure(this.reason)).then(_ => this);    
    }

    forkSuccess(
    ): Result<unknown, TFailure> {
        return this;
    }

    async forkSuccessAsync(
    ): Promise<Result<unknown, TFailure>> {
        return Promise.resolve(this);
    }

    forkFailure(
        onFailure: (error: TFailure) => unknown
    ): Result<unknown, TFailure> {
        onFailure(this.reason);
        return this;
    }

    async forkFailureAsync(
        onFailure: (error: TFailure) => unknown
    ): Promise<Result<unknown, TFailure>> {
        return Promise.resolve(onFailure(this.reason)).then(_ => this);    
    }

}


/**
 * Creates an instance of Result representing a failure, using the given error
 * @param error Result data for a failure
 * @returns An instance of Result
 */
export const failure  = <T,E>(error: E): Result<T,E> => new FailureResult<E>(error) as Result<T,E>;

class SuccessResult<TSuccess> implements Result<TSuccess, unknown>{

    _value: TSuccess;

    constructor(value: TSuccess){
        this._value = value;
    }

    isSuccess(): boolean{
        return true;
    }
    
    value(): TSuccess | undefined {
        return this._value;
    }

    error(): unknown {
        return undefined;
    }

    payload(): unknown {
        return this._value;
    }

    state(): ResultState<TSuccess, unknown> {
        return {
            value: this._value,
            isSuccess: true
        }
    }

    bind<U,V>(
        fn: (result: Result<TSuccess, unknown>) => Result<U,V>
    ): Result<U,V>{
        return fn(this);
    }

    bindAsync<U,V>(
        fn: (result: Result<TSuccess, unknown>) => PromiseLikeOfOr<Result<U,V>>
    ): Promise<Result<U,V>>{
        return Promise.resolve(fn(this));
    }

    map<U, V>(
        onSuccess: (value: TSuccess) => Result<U, V>, 
        _: (error: unknown) => Result<U, V>
    ): Result<U, V> {
        return onSuccess(this._value);    
    }

    mapAsync<U, V>(
        onSuccess: (value: TSuccess) => PromiseLikeOfOr<Result<U,V>>, 
        _: (error: unknown) => PromiseLikeOfOr<Result<U, V>>
    ): Promise<Result<U, V>> {
        return Promise.resolve(onSuccess(this._value));    
    }

    mapSuccess<U>(
        onSuccess: (value: TSuccess) => Result<U, unknown>
    ): Result<U, unknown> {
        return onSuccess(this._value);
    }

    mapSuccessAsync<U>(
        onSuccess: (value: TSuccess) => PromiseLikeOfOr<Result<U, unknown>>
    ): Promise<Result<U, unknown>> {
        return Promise.resolve(onSuccess(this._value));    
    }

    mapFailure<V>(
    ): Result<TSuccess, V> {
        return this as Result<TSuccess, V>;    
    }

    mapFailureAsync<V>(
    ): Promise<Result<TSuccess, V>> {
        return Promise.resolve(this as Result<TSuccess, V>);    
    }

    swap<U, V>(
        onSuccess: (value: TSuccess) => U, 
        _: (error: unknown) => V
    ): Result<U, V> {
        return new SuccessResult<U>(onSuccess(this._value)) as Result<U, V>;    
    }

    async swapAsync<U, V>(
        onSuccess: (value: TSuccess) => PromiseLikeOfOr<U>, 
        _: (error: unknown) => PromiseLikeOfOr<V>
    ): Promise<Result<U, V>> {
        return new SuccessResult<U>(await onSuccess(this._value)) as Result<U, V>; 
    }

    swapSuccess<U>(
        onSuccess: (value: TSuccess) => U,
    ): Result<U, unknown> {
        return new SuccessResult<U>(onSuccess(this._value)); 
    }

    async swapSuccessAsync<U>(
        onSuccess: (value: TSuccess) => PromiseLikeOfOr<U>
    ): Promise<Result<U, unknown>> {
        return new SuccessResult<U>(await onSuccess(this._value));     
    }

    swapFailure<V>(
    ): Result<TSuccess, V> {
        return this as Result<TSuccess, V>;    
    }

    swapFailureAsync<V>(
    ): Promise<Result<TSuccess, V>> {
        return Promise.resolve(this as Result<TSuccess, V>);    
    }


    fork(
        handle: (result: Result<TSuccess, unknown>) => unknown
    ): Result<TSuccess, unknown> {
        handle(this);
        return this;    
    }

    async forkAsync(
        handle: (result: Result<TSuccess, unknown>) => unknown
    ): Promise<Result<TSuccess, unknown>> {
        return Promise.resolve(handle(this)).then(_ => this);
    }

    forkMap(
        onSuccess: (value: TSuccess) => unknown, 
        _: (error: unknown) => unknown,
    ): Result<TSuccess, unknown> {
        onSuccess(this._value);
        return this;    
    }

    async forkMapAsync(
        onSuccess: (value: TSuccess) => unknown, 
        _: (error: unknown) => unknown
    ): Promise<Result<TSuccess, unknown>> {
        return Promise.resolve(onSuccess(this._value)).then(_ => this);    
    }

    forkSuccess(
        onSuccess: (value: TSuccess) => unknown
    ): Result<TSuccess, unknown> {
        onSuccess(this._value);
        return this; 
    }

    async forkSuccessAsync(
        onSuccess: (value: TSuccess) => unknown
    ): Promise<Result<TSuccess, unknown>> {
        return Promise.resolve(onSuccess(this._value)).then(_ => this);      
    }

    forkFailure(
    ): Result<TSuccess, unknown> {
        return this;    
    }

    async forkFailureAsync(
    ): Promise<Result<TSuccess, unknown>> {
        return Promise.resolve(this);
    }
}


/**
 * Creates an instance of Result representing a success, using the given value
 * @param value Result data for a success
 * @returns An instance of Result
 */
export const success = <T,E>(value: T): Result<T,E> => new SuccessResult<T>(value) as Result<T,E>;

