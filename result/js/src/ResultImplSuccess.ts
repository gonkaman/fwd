import { Result, ResultState } from "./Result";

/**
 * Implementation of Result<TSuccess, TFailure> for success cases
 * 
 * @class
 * @template TSuccess - Value type for success cases
 * @implements Result
 */
export class SuccessResult<TSuccess> implements Result<TSuccess, unknown>{

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
        fn: (result: Result<TSuccess, unknown>) => Promise<Result<U,V>>
    ): Promise<Result<U,V>>{
        return fn(this);
    }

    map<U, V>(
        onSuccess: (value: TSuccess) => Result<U, V>, 
        _: (error: unknown) => Result<U, V>
    ): Result<U, V> {
        return onSuccess(this._value);    
    }

    mapAsync<U, V>(
        onSuccess: (value: TSuccess) => Promise<Result<U, V>>, 
        _: (error: unknown) => Promise<Result<U, V>>
    ): Promise<Result<U, V>> {
        return onSuccess(this._value);    
    }

    mapSuccess<U>(
        onSuccess: (value: TSuccess) => Result<U, unknown>
    ): Result<U, unknown> {
        return onSuccess(this._value);
    }

    mapSuccessAsync<U>(
        onSuccess: (value: TSuccess) => Promise<Result<U, unknown>>
    ): Promise<Result<U, unknown>> {
        return onSuccess(this._value);    
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
        onSuccess: (value: TSuccess) => Promise<U>, 
        _: (error: unknown) => Promise<V>
    ): Promise<Result<U, V>> {
        return new SuccessResult<U>(await onSuccess(this._value)) as Result<U, V>; 
    }

    swapSuccess<U>(
        onSuccess: (value: TSuccess) => U,
    ): Result<U, unknown> {
        return new SuccessResult<U>(onSuccess(this._value)); 
    }

    async swapSuccessAsync<U>(
        onSuccess: (value: TSuccess) => Promise<U>
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

    forkMap(
        onSuccess: (value: TSuccess) => unknown, 
        _: (error: unknown) => unknown,
    ): Result<TSuccess, unknown> {
        onSuccess(this._value);
        return this;    
    }

    forkSuccess(
        onSuccess: (value: TSuccess) => unknown
    ): Result<TSuccess, unknown> {
        onSuccess(this._value);
        return this; 
    }

    forkFailure(
    ): Result<TSuccess, unknown> {
        return this;    
    }
}


