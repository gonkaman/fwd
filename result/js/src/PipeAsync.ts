import { Result, PromiseLikeOfOr } from "./Result"

export type AsyncRunner<T,E> = (...args: any) => Promise<Result<T,E>>

export type AsyncPipeEntry<T,E,U,V> = (res: Result<T,E>) => PromiseLikeOfOr<Result<U,V>>

export type AsyncErrorHandler<U,V> = (error: any) => PromiseLikeOfOr<Result<U,V>>

export type AsyncPipeBuilder<T,E> = <U,V>(
    fn: AsyncPipeEntry<T,E,U,V>,
    onRejected?: AsyncErrorHandler<U,V>
) => AsyncPipeBuilder<U,V>

const asyncPipeEnd = <T,E>(res: Result<T,E>): PromiseLikeOfOr<Result<T,E>> => res;

export const pipeAsync = <TSuccess,TFailure>(
    fn: AsyncRunner<TSuccess, TFailure>
): AsyncPipeBuilder<TSuccess, TFailure> => {
    return <U,V>(handle: AsyncPipeEntry<TSuccess, TFailure, U, V>, onRejected?: AsyncErrorHandler<U,V>): AsyncPipeBuilder<U,V> => {
        
        if(handle === asyncPipeEnd) return ((
            (...params: any) => fn(...params).then(res => handle(res), onRejected)
        ) as unknown) as AsyncPipeBuilder<U,V>;

        return pipeAsync<U,V>(
            (...params: any) => fn(...params).then(res => handle(res), onRejected)
        );

    }
}

export const execAsync = <TSuccess,TFailure>(
    pipeBuildAsync: AsyncPipeBuilder<TSuccess,TFailure>
): AsyncRunner<TSuccess,TFailure> => (pipeBuildAsync(asyncPipeEnd) as unknown) as AsyncRunner<TSuccess,TFailure>;


export const mapAsync = <T,E,U,V>(
    onSuccess: (value: T) => PromiseLikeOfOr<Result<U,V>>,
    onFailure: (error: E) => PromiseLikeOfOr<Result<U,V>>
): AsyncPipeEntry<T,E,U,V> => (res: Result<T,E>) => res.mapAsync<U,V>(onSuccess, onFailure);

export const mapSuccessAsync = <T,E,U>(
    onSuccess: (value: T) => PromiseLikeOfOr<Result<U,E>>
): AsyncPipeEntry<T,E,U,E> => (res: Result<T,E>) => res.mapSuccessAsync<U>(onSuccess);

export const mapFailureAsync = <T,E,V>(
    onFailure: (error: E) => PromiseLikeOfOr<Result<T,V>>
): AsyncPipeEntry<T,E,T,V> => (res: Result<T,E>) => res.mapFailureAsync<V>(onFailure);

export const swapAsync = <T,E,U,V>(
    onSuccess: (value: T) => PromiseLikeOfOr<U>,
    onFailure: (error: E) => PromiseLikeOfOr<V>
): AsyncPipeEntry<T,E,U,V> => (res: Result<T,E>) => res.swapAsync<U,V>(onSuccess, onFailure);

export const swapSuccessAsync = <T,E,U>(
    onSuccess: (value: T) => PromiseLikeOfOr<U>
): AsyncPipeEntry<T,E,U,E> => (res: Result<T,E>) => res.swapSuccessAsync<U>(onSuccess);

export const swapFailureAsync = <T,E,V>(
    onFailure: (error: E) => PromiseLikeOfOr<V>
): AsyncPipeEntry<T,E,T,V> => (res: Result<T,E>) => res.swapFailureAsync<V>(onFailure);

export const forkAsync = <T,E>(
    handle: (res: Result<T,E>) => any
): AsyncPipeEntry<T,E,T,E> => (res: Result<T,E>) => res.forkAsync(handle);

export const forkMapAsync = <T,E>(
    onSuccess: (value: T) => any,
    onFailure: (error: E) => any
): AsyncPipeEntry<T,E,T,E> => (res: Result<T,E>) => res.forkMapAsync(onSuccess, onFailure);

export const forkSuccessAsync = <T,E>(
    onSuccess: (value: T) => any
): AsyncPipeEntry<T,E,T,E> => (res: Result<T,E>) => res.forkSuccessAsync(onSuccess);

export const forkFailureAsync = <T,E>(
    onFailure: (error: E) => any
): AsyncPipeEntry<T,E,T,E> => (res: Result<T,E>) => res.forkFailureAsync(onFailure);
