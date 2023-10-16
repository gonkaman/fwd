import { Result, ResultState, PromiseLikeOfOr } from "./Result";

/**
 * Implementation of the Result interface for success cases
 */
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

/**
 * Checks wether a given value represents a success result
 * @param value Value to check
 * @returns Boolean - True if the given value is a success result, False if not
 */
export const isSuccessResult = (value: unknown): boolean => value instanceof SuccessResult;

