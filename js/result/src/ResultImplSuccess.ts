import { Result, ResultState } from "./Result";

/**
 * Implementation of Result<TSuccess, TFailure> for success cases
 * 
 * @class
 * @template TSuccess - Value type for success cases
 * @implements Result
 */
export class SuccessResult<TSuccess> implements Result<TSuccess, unknown>{
    value: TSuccess;

    /**
     * @constructor
     * @param value Success data 
     */
    constructor(value: TSuccess){
        this.value = value;
    }


    /**
     * Checks whether the result is a success or a failure.
     * Returns true in case of success, false in case of failure
     * @returns {boolean} 
     */
    isSuccess(): boolean{
        return true;
    }

    /**
     * returns the normalized state of the result object
     * @template TSuccess - Value type for success cases
     * @returns {ResultState} ResultState<TSuccess, unknown>
     */
    unwrap(): ResultState<TSuccess, unknown> {
        return {
            isSuccess: true,
            value: this.value
        };
    }

    /**
     * Executes the given handler, using the current result to get a new result
     * @param fn Handler to execute, must return a result object. The current result object will be passed as the first argument
     * @param args Optional, additional arguments needed for the handler execution
     * @returns Result<U,V>
     */
    bind<U,V>(
        fn: (result: Result<TSuccess, unknown>, ...args: unknown[]) => Result<U,V>,
        ...args: unknown[]
    ): Result<U,V>{
        return fn(this, ...args);
    }

    /**
     * Executes the given asynchronous handler, using the current result to get a new result
     * @async
     * @param fn Async handler to execute, must return a result object. The current result object will be passed as the first argument
     * @param args Optional, additional arguments needed for the handler execution
     * @returns Promise<Result<U,V>>
     */
    bindAsync<U,V>(
        fn: (result: Result<TSuccess, unknown>, ...args: unknown[]) => Promise<Result<U,V>>,
        ...args: unknown[]
    ): Promise<Result<U,V>>{
        return fn(this, ...args);
    }

    bindMerge<U, V>(
        bind: (...args: unknown[]) => (result: Result<TSuccess, unknown>) => Result<U, V>, 
        ...args: unknown[]
    ): Result<U, V> {
        return bind(...args)(this);    
    }

    bindMergeAsync<U, V>(
        bind: (...args: unknown[]) => (result: Result<TSuccess, unknown>) => Promise<Result<U, V>>, 
        ...args: unknown[]
    ): Promise<Result<U, V>> {
        return bind(...args)(this);    
    }





    map<U, V>(
        onSuccess: (value: TSuccess, ...args: unknown[]) => Result<U, V>, 
        _: (error: unknown, ...args: unknown[]) => Result<U, V>, 
        ...args: unknown[]
    ): Result<U, V> {
        return onSuccess(this.value, ...args);    
    }

    mapAsync<U, V>(
        onSuccess: (value: TSuccess, ...args: unknown[]) => Promise<Result<U, V>>, 
        _: (error: unknown, ...args: unknown[]) => Promise<Result<U, V>>, 
        ...args: unknown[]
    ): Promise<Result<U, V>> {
        return onSuccess(this.value, ...args);    
    }

    mapMerge<U, V>(
        onSuccess: (...args: unknown[]) => (value: TSuccess) => Result<U, V>, 
        _: (...args: unknown[]) => (value: unknown) => Result<U, V>, 
        ...args: unknown[]
    ): Result<U, V> {
        return onSuccess(...args)(this.value);    
    }

    mapMergeAsync<U, V>(
        onSuccess: (...args: unknown[]) => (value: TSuccess) => Promise<Result<U, V>>, 
        _: (...args: unknown[]) => (value: unknown) => Promise<Result<U, V>>, 
        ...args: unknown[]
    ): Promise<Result<U, V>> {
        return onSuccess(...args)(this.value);
    }




    mapSuccess<U>(
        onSuccess: (value: TSuccess, ...args: unknown[]) => Result<U, unknown>, 
        ...args: unknown[]
    ): Result<U, unknown> {
        return onSuccess(this.value, ...args);
    }

    mapSuccessAsync<U>(
        onSuccess: (value: TSuccess, ...args: unknown[]) => Promise<Result<U, unknown>>, 
        ...args: unknown[]
    ): Promise<Result<U, unknown>> {
        return onSuccess(this.value, ...args);    
    }

    mapMergeSuccess<U>(
        onSuccess: (...args: unknown[]) => (value: TSuccess) => Result<U, unknown>, 
        ...args: unknown[]
    ): Result<U, unknown> {
        return onSuccess(...args)(this.value);
    }

    mapMergeSuccessAsync<U>(
        onSuccess: (...args: unknown[]) => (value: TSuccess) => Promise<Result<U, unknown>>, 
        ...args: unknown[]
    ): Promise<Result<U, unknown>> {
        return onSuccess(...args)(this.value);    
    }
    

    
    
    mapFailure<V>(
    ): Result<TSuccess, V> {
        return this as Result<TSuccess, V>;    
    }

    mapFailureAsync<V>(
    ): Promise<Result<TSuccess, V>> {
        return Promise.resolve(this as Result<TSuccess, V>);    
    }

    mapMergeFailure<V>(
    ): Result<TSuccess, V> {
        return this as Result<TSuccess, V>;    
    }

    mapMergeFailureAsync<V>(
    ): Promise<Result<TSuccess, V>> {
        return Promise.resolve(this as Result<TSuccess, V>);    
    }




    swap<U, V>(
        onSuccess: (value: TSuccess, ...args: unknown[]) => U, 
        _: (error: unknown, ...args: unknown[]) => V, 
        ...args: unknown[]
    ): Result<U, V> {
        return new SuccessResult<U>(onSuccess(this.value, ...args)) as Result<U, V>;    
    }

    async swapAsync<U, V>(
        onSuccess: (value: TSuccess, ...args: unknown[]) => Promise<U>, 
        _: (error: unknown, ...args: unknown[]) => Promise<V>, 
        ...args: unknown[]
    ): Promise<Result<U, V>> {
        return new SuccessResult<U>(await onSuccess(this.value, ...args)) as Result<U, V>; 
    }

    swapMerge<U, V>(
        onSuccess: (...args: unknown[]) => (value: TSuccess) => U, 
        _: (...args: unknown[]) => (value: unknown) => V, 
        ...args: unknown[]
    ): Result<U, V> {
        return new SuccessResult<U>(onSuccess(...args)(this.value)) as Result<U, V>; 
    }

    async swapMergeAsync<U, V>(
        onSuccess: (...args: unknown[]) => (value: TSuccess) => Promise<U>, 
        _: (...args: unknown[]) => (value: unknown) => Promise<V>, 
        ...args: unknown[]
    ): Promise<Result<U, V>> {
        return new SuccessResult<U>(await onSuccess(...args)(this.value)) as Result<U, V>; 
    }




    swapSuccess<U>(
        onSuccess: (value: TSuccess, ...args: unknown[]) => U, 
        ...args: unknown[]
    ): Result<U, unknown> {
        return new SuccessResult<U>(onSuccess(this.value, ...args)); 
    }

    async swapSuccessAsync<U>(
        onSuccess: (value: TSuccess, ...args: unknown[]) => Promise<U>, 
        ...args: unknown[]
    ): Promise<Result<U, unknown>> {
        return new SuccessResult<U>(await onSuccess(this.value, ...args));     
    }

    swapMergeSuccess<U>(
        onSuccess: (...args: unknown[]) => (value: TSuccess) => U, 
        ...args: unknown[]
    ): Result<U, unknown> {
        return new SuccessResult<U>(onSuccess(...args)(this.value));     
    }

    async swapMergeSuccessAsync<U>(
        onSuccess: (...args: unknown[]) => (value: TSuccess) => Promise<U>, 
        ...args: unknown[]
    ): Promise<Result<U, unknown>> {
        return new SuccessResult<U>(await onSuccess(...args)(this.value)); 
    }




    swapFailure<V>(
    ): Result<TSuccess, V> {
        return this as Result<TSuccess, V>;    
    }

    swapFailureAsync<V>(
    ): Promise<Result<TSuccess, V>> {
        return Promise.resolve(this as Result<TSuccess, V>);    
    }

    swapMergeFailure<V>(
    ): Result<TSuccess, V> {
        return this as Result<TSuccess, V>;    
    }

    swapMergeFailureAsync<V>(
    ): Promise<Result<TSuccess, V>> {
        return Promise.resolve(this as Result<TSuccess, V>); 
    }



    fork(
        handle: (result: Result<TSuccess, unknown>, ...args: unknown[]) => unknown, 
        ...args: unknown[]
    ): Result<TSuccess, unknown> {
        handle(this, ...args);
        return this;    
    }

    forkMap(
        onSuccess: (value: TSuccess, ...args: unknown[]) => unknown, 
        _: (error: unknown, ...args: unknown[]) => unknown, 
        ...args: unknown[]
    ): Result<TSuccess, unknown> {
        onSuccess(this.value, ...args);
        return this;    
    }

    forkSuccess(
        onSuccess: (value: TSuccess, ...args: unknown[]) => unknown, 
        ...args: unknown[]
    ): Result<TSuccess, unknown> {
        onSuccess(this.value, ...args);
        return this; 
    }

    forkFailure(
    ): Result<TSuccess, unknown> {
        return this;    
    }
}


