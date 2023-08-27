import { Result, ResultState, PromiseLikeOfOr } from "./Result";

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
