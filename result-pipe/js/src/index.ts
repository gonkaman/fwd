import { Result, PromiseLikeOfOr } from "fwd-result";
import { PipeEntry, AsyncPipeEntry, PipeBuilder, AsyncPipeBuilder, pipe, pipeAsync } from "fwd-pipe";

export const map = <T,E,U,V>(
    onSuccess: (value: T) => Result<U,V>,
    onFailure: (error: E) => Result<U,V>
): PipeEntry<Result<T,E>,Result<U,V>> => (res: Result<T,E>) => res.map<U,V>(onSuccess, onFailure);

export const mapSuccess = <T,E,U>(
    onSuccess: (value: T) => Result<U,E>
): PipeEntry<Result<T,E>,Result<U,E>> => (res: Result<T,E>) => res.mapSuccess<U>(onSuccess);

export const mapFailure = <T,E,V>(
    onFailure: (error: E) => Result<T,V>
): PipeEntry<Result<T,E>,Result<T,V>> => (res: Result<T,E>) => res.mapFailure<V>(onFailure);

export const swap = <T,E,U,V>(
    onSuccess: (value: T) => U,
    onFailure: (error: E) => V
): PipeEntry<Result<T,E>,Result<U,V>> => (res: Result<T,E>) => res.swap<U,V>(onSuccess, onFailure);

export const swapSuccess = <T,E,U>(
    onSuccess: (value: T) => U
): PipeEntry<Result<T,E>,Result<U,E>> => (res: Result<T,E>) => res.swapSuccess<U>(onSuccess);

export const swapFailure = <T,E,V>(
    onFailure: (error: E) => V
): PipeEntry<Result<T,E>,Result<T,V>> => (res: Result<T,E>) => res.swapFailure<V>(onFailure);

export const fork = <T,E>(
    handle: (res: Result<T,E>) => any
): PipeEntry<Result<T,E>,Result<T,E>> => (res: Result<T,E>) => res.fork(handle);

export const forkMap = <T,E>(
    onSuccess: (value: T) => any,
    onFailure: (error: E) => any
): PipeEntry<Result<T,E>,Result<T,E>> => (res: Result<T,E>) => res.forkMap(onSuccess, onFailure);

export const forkSuccess = <T,E>(
    onSuccess: (value: T) => any
): PipeEntry<Result<T,E>,Result<T,E>> => (res: Result<T,E>) => res.forkSuccess(onSuccess);

export const forkFailure = <T,E>(
    onFailure: (error: E) => any
): PipeEntry<Result<T,E>,Result<T,E>> => (res: Result<T,E>) => res.forkFailure(onFailure);




export const mapAsync = <T,E,U,V>(
    onSuccess: (value: T) => PromiseLikeOfOr<Result<U,V>>,
    onFailure: (error: E) => PromiseLikeOfOr<Result<U,V>>
): AsyncPipeEntry<Result<T,E>,Result<U,V>> => (res: Result<T,E>) => res.mapAsync<U,V>(onSuccess, onFailure);

export const mapSuccessAsync = <T,E,U>(
    onSuccess: (value: T) => PromiseLikeOfOr<Result<U,E>>
): AsyncPipeEntry<Result<T,E>,Result<U,E>> => (res: Result<T,E>) => res.mapSuccessAsync<U>(onSuccess);

export const mapFailureAsync = <T,E,V>(
    onFailure: (error: E) => PromiseLikeOfOr<Result<T,V>>
): AsyncPipeEntry<Result<T,E>,Result<T,V>> => (res: Result<T,E>) => res.mapFailureAsync<V>(onFailure);

export const swapAsync = <T,E,U,V>(
    onSuccess: (value: T) => PromiseLikeOfOr<U>,
    onFailure: (error: E) => PromiseLikeOfOr<V>
): AsyncPipeEntry<Result<T,E>,Result<U,V>> => (res: Result<T,E>) => res.swapAsync<U,V>(onSuccess, onFailure);

export const swapSuccessAsync = <T,E,U>(
    onSuccess: (value: T) => PromiseLikeOfOr<U>
): AsyncPipeEntry<Result<T,E>,Result<U,E>> => (res: Result<T,E>) => res.swapSuccessAsync<U>(onSuccess);

export const swapFailureAsync = <T,E,V>(
    onFailure: (error: E) => PromiseLikeOfOr<V>
): AsyncPipeEntry<Result<T,E>,Result<T,V>> => (res: Result<T,E>) => res.swapFailureAsync<V>(onFailure);

export const forkAsync = <T,E>(
    handle: (res: Result<T,E>) => any
): AsyncPipeEntry<Result<T,E>,Result<T,E>> => (res: Result<T,E>) => res.forkAsync(handle);

export const forkMapAsync = <T,E>(
    onSuccess: (value: T) => any,
    onFailure: (error: E) => any
): AsyncPipeEntry<Result<T,E>,Result<T,E>> => (res: Result<T,E>) => res.forkMapAsync(onSuccess, onFailure);

export const forkSuccessAsync = <T,E>(
    onSuccess: (value: T) => any
): AsyncPipeEntry<Result<T,E>,Result<T,E>> => (res: Result<T,E>) => res.forkSuccessAsync(onSuccess);

export const forkFailureAsync = <T,E>(
    onFailure: (error: E) => any
): AsyncPipeEntry<Result<T,E>,Result<T,E>> => (res: Result<T,E>) => res.forkFailureAsync(onFailure);






export type FnArgs<F extends Function> = F extends (...args: infer A) => any ? A : never;

export const rpipe = <TSuccess, TFailure, TEntry extends PipeEntry<any,Result<TSuccess,TFailure>>>(
    entry: TEntry
): PipeBuilder<FnArgs<TEntry>, Result<TSuccess,TFailure>> => pipe(entry);

export const rpipeAsync = <TSuccess, TFailure, TEntry extends AsyncPipeEntry<any,Result<TSuccess,TFailure>>>(
    entry: TEntry
): AsyncPipeBuilder<FnArgs<TEntry>, Result<TSuccess,TFailure>> => pipeAsync(entry);


export type RPipeEntry<T,E,U,V> = PipeEntry<Result<T,E>, Result<U,V>>;
export type AsyncRPipeEntry<T,E,U,V> = AsyncPipeEntry<Result<T,E>, Result<U,V>>;