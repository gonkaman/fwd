import { Result, ResultState } from "./Result";

/**
 * Implementation of Result<TSuccess, TFailure> for failure cases
 * 
 * @class
 * @template TFailure - Value type for failure cases
 * @implements Result
 */
export class FailureResult<TFailure> implements Result<unknown, TFailure>{

    /**@type {TFailure} */
    reason: TFailure;

    /**
     * 
     * @constructor
     * @param error Failure data 
     */
    constructor(error: TFailure){
        this.reason = error;
    }

    /**
     * Checks whether the result is a success or a failure.
     * Returns true in case of success, false in case of failure
     * @returns {boolean} 
     */
    isSuccess(): boolean {
        return false;
    }

    /**
     * returns the normalized state of the result object
     * @template TFailure
     * @returns {ResultState} ResultState<unknown, TFailure>
     */
    unwrap(): ResultState<unknown, TFailure> {
        return {
            isSuccess: false,
            error: this.reason
        };
    }


    /**
     * Executes the given handler, using the current result to get a new result
     * @param fn Handler to execute, must return a result object. The current result object will be passed as the first argument
     * @param args Optional, additional arguments needed for the handler execution
     * @returns Result<U,V>
     */
    bind<U, V>(
        fn: (result: Result<unknown, TFailure>, ...args: unknown[]) => Result<U, V>, 
        ...args: unknown[]
    ): Result<U, V> {
        return fn(this, ...args);    
    }

    /**
     * Executes the given asynchronous handler, using the current result to get a new result
     * @async
     * @param fn Async handler to execute, must return a result object. The current result object will be passed as the first argument
     * @param args Optional, additional arguments needed for the handler execution
     * @returns Promise<Result<U,V>>
     */
    bindAsync<U, V>(
        fn: (result: Result<unknown, TFailure>, ...args: unknown[]) => Promise<Result<U, V>>, 
        ...args: unknown[]
    ): Promise<Result<U, V>> {
        return fn(this, ...args);
    }

    bindMerge<U, V>(
        bind: (...args: unknown[]) => (result: Result<unknown, TFailure>) => Result<U, V>, 
        ...args: unknown[]
    ): Result<U, V> {
        return bind(...args)(this);    
    }

    bindMergeAsync<U, V>(
        bind: (...args: unknown[]) => (result: Result<unknown, TFailure>) => Promise<Result<U, V>>, 
        ...args: unknown[]
    ): Promise<Result<U, V>> {
        return bind(...args)(this);    
    }




    map<U, V>(
        _: (value: unknown, ...args: unknown[]) => Result<U, V>, 
        onFailure: (error: TFailure, ...args: unknown[]) => Result<U, V>, 
        ...args: unknown[]
    ): Result<U, V> {
        return onFailure(this.reason, ...args);    
    }

    mapAsync<U, V>(
        _: (value: unknown, ...args: unknown[]) => Promise<Result<U, V>>, 
        onFailure: (error: TFailure, ...args: unknown[]) => Promise<Result<U, V>>, 
        ...args: unknown[]
    ): Promise<Result<U, V>> {
        return onFailure(this.reason, ...args);    
    }

    mapMerge<U, V>(
        _: (...args: unknown[]) => (value: unknown) => Result<U, V>, 
        onFailure: (...args: unknown[]) => (value: TFailure) => Result<U, V>, 
        ...args: unknown[]
    ): Result<U, V> {
        return onFailure(...args)(this.reason);    
    }

    mapMergeAsync<U, V>(
        _: (...args: unknown[]) => (value: unknown) => Promise<Result<U, V>>, 
        onFailure: (...args: unknown[]) => (value: TFailure) => Promise<Result<U, V>>, 
        ...args: unknown[]
    ): Promise<Result<U, V>> {
        return onFailure(...args)(this.reason);    
    }




    mapSuccess<U>(
    ): Result<U, TFailure> {
        return this as Result<U, TFailure>;    
    }

    mapSuccessAsync<U>(
    ): Promise<Result<U, TFailure>> {
        return Promise.resolve(this as Result<U, TFailure>);    
    }

    mapMergeSuccess<U>(
    ): Result<U, TFailure> {
        return this as Result<U, TFailure>;
    }

    mapMergeSuccessAsync<U>(
    ): Promise<Result<U, TFailure>> {
        return Promise.resolve(this as Result<U, TFailure>);    
    }




    mapFailure<V>(
        onFailure: (error: TFailure, ...args: unknown[]) => Result<unknown, V>, 
        ...args: unknown[]
    ): Result<unknown, V> {
        return onFailure(this.reason, ...args);    
    }

    mapFailureAsync<V>(
        onFailure: (error: TFailure, ...args: unknown[]) => Promise<Result<unknown, V>>, 
        ...args: unknown[]
    ): Promise<Result<unknown, V>> {
        return onFailure(this.reason, ...args);    
    }

    mapMergeFailure<V>(
        onFailure: (...args: unknown[]) => (value: TFailure) => Result<unknown, V>, 
        ...args: unknown[]
    ): Result<unknown, V> {
        return onFailure(...args)(this.reason);    
    }

    mapMergeFailureAsync<V>(
        onFailure: (...args: unknown[]) => (value: TFailure) => Promise<Result<unknown, V>>, 
        ...args: unknown[]
    ): Promise<Result<unknown, V>> {
        return onFailure(...args)(this.reason);
    }




    swap<U, V>(
        _: (value: unknown, ...args: unknown[]) => U, 
        onFailure: (error: TFailure, ...args: unknown[]) => V, 
        ...args: unknown[]
    ): Result<U, V> {
        return new FailureResult<V>(onFailure(this.reason, ...args)) as Result<U, V>;
    }

    async swapAsync<U, V>(
        _: (value: unknown, ...args: unknown[]) => Promise<U>, 
        onFailure: (error: TFailure, ...args: unknown[]) => Promise<V>, 
        ...args: unknown[]
    ): Promise<Result<U, V>> {
        return new FailureResult<V>(await onFailure(this.reason, ...args)) as Result<U, V>;
    }

    swapMerge<U, V>(
        _: (...args: unknown[]) => (value: unknown) => U, 
        onFailure: (...args: unknown[]) => (value: TFailure) => V, 
        ...args: unknown[]
    ): Result<U, V> {
        return new FailureResult<V>(onFailure(...args)(this.reason)) as Result<U, V>;
    }

    async swapMergeAsync<U, V>(
        _: (...args: unknown[]) => (value: unknown) => Promise<U>, 
        onFailure: (...args: unknown[]) => (value: TFailure) => Promise<V>, 
        ...args: unknown[]
    ): Promise<Result<U, V>> {
        return new FailureResult<V>(await onFailure(...args)(this.reason)) as Result<U, V>;
    }




    swapSuccess<U>(
    ): Result<U, TFailure> {
        return this as Result<U, TFailure>;
    }

    swapSuccessAsync<U>(
    ): Promise<Result<U, TFailure>> {
        return Promise.resolve(this as Result<U, TFailure>);
    }

    swapMergeSuccess<U>(
    ): Result<U, TFailure> {
        return this as Result<U, TFailure>;
    }

    swapMergeSuccessAsync<U>(
    ): Promise<Result<U, TFailure>> {
        return Promise.resolve(this as Result<U, TFailure>);
    }




    swapFailure<V>(
        onFailure: (error: TFailure, ...args: unknown[]) => V, 
        ...args: unknown[]
    ): Result<unknown, V> {
        return new FailureResult<V>(onFailure(this.reason, ...args));
    }

    async swapFailureAsync<V>(
        onFailure: (error: TFailure, ...args: unknown[]) => Promise<V>, 
        ...args: unknown[]
    ): Promise<Result<unknown, V>> {
        return new FailureResult<V>(await onFailure(this.reason, ...args));
    }

    swapMergeFailure<V>(
        onFailure: (...args: unknown[]) => (value: TFailure) => V, 
        ...args: unknown[]
    ): Result<unknown, V> {
        return new FailureResult<V>(onFailure(...args)(this.reason));
    }

    async swapMergeFailureAsync<V>(
        onFailure: (...args: unknown[]) => (value: TFailure) => Promise<V>, 
        ...args: unknown[]
    ): Promise<Result<unknown, V>> {
        return new FailureResult<V>(await onFailure(...args)(this.reason));
    }

    

    fork(
        handle: (result: Result<unknown, TFailure>, ...args: unknown[]) => unknown, 
        ...args: unknown[]
    ): Result<unknown, TFailure> {
        handle(this, ...args);
        return this;
    }

    forkMap(
        _: (value: unknown, ...args: unknown[]) => unknown, 
        onFailure: (error: TFailure, ...args: unknown[]) => unknown, 
        ...args: unknown[]
    ): Result<unknown, TFailure> {
        onFailure(this.reason, ...args);
        return this;
    }

    forkSuccess(
    ): Result<unknown, TFailure> {
        return this;
    }

    forkFailure(
        onFailure: (error: TFailure, ...args: unknown[]) => unknown, 
        ...args: unknown[]
    ): Result<unknown, TFailure> {
        onFailure(this.reason, ...args);
        return this;
    }

}


