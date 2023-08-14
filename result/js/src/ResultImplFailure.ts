import { Result, ResultState } from "./Result";

export class FailureResult<TFailure> implements Result<unknown, TFailure>{

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
        fn: (result: Result<unknown, TFailure>) => Promise<Result<U, V>>
    ): Promise<Result<U, V>> {
        return fn(this);
    }

    map<U, V>(
        _: (value: unknown) => Result<U, V>, 
        onFailure: (error: TFailure) => Result<U, V>
    ): Result<U, V> {
        return onFailure(this.reason);    
    }

    mapAsync<U, V>(
        _: (value: unknown) => Promise<Result<U, V>>, 
        onFailure: (error: TFailure) => Promise<Result<U, V>>
    ): Promise<Result<U, V>> {
        return onFailure(this.reason);    
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
        onFailure: (error: TFailure) => Promise<Result<unknown, V>>
    ): Promise<Result<unknown, V>> {
        return onFailure(this.reason);    
    }

    swap<U, V>(
        _: (value: unknown) => U, 
        onFailure: (error: TFailure) => V
    ): Result<U, V> {
        return new FailureResult<V>(onFailure(this.reason)) as Result<U, V>;
    }

    async swapAsync<U, V>(
        _: (value: unknown) => Promise<U>, 
        onFailure: (error: TFailure) => Promise<V>
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
        onFailure: (error: TFailure) => Promise<V>
    ): Promise<Result<unknown, V>> {
        return new FailureResult<V>(await onFailure(this.reason));
    }
    

    fork(
        handle: (result: Result<unknown, TFailure>) => unknown
    ): Result<unknown, TFailure> {
        handle(this);
        return this;
    }

    forkMap(
        _: (value: unknown) => unknown, 
        onFailure: (error: TFailure) => unknown
    ): Result<unknown, TFailure> {
        onFailure(this.reason);
        return this;
    }

    forkSuccess(
    ): Result<unknown, TFailure> {
        return this;
    }

    forkFailure(
        onFailure: (error: TFailure) => unknown
    ): Result<unknown, TFailure> {
        onFailure(this.reason);
        return this;
    }

}


