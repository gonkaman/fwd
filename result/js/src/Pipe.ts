import { Result } from "./Result"

export type Runner<T,E> = (...args: any) => Result<T,E>

export type PipeEntry<T,E,U,V> = (res: Result<T,E>) => Result<U,V>

export type PipeBuilder<T,E> = <U,V>(fn: PipeEntry<T,E,U,V>) => PipeBuilder<U,V>

const pipeEnd = <T,E>(res: Result<T,E>): Result<T,E> => res;

export const pipe = <TSuccess,TFailure>(
    fn: Runner<TSuccess, TFailure>
): PipeBuilder<TSuccess, TFailure> => {
    return <U,V>(handle: PipeEntry<TSuccess, TFailure, U, V>): PipeBuilder<U,V> => {
        if(handle === pipeEnd) return (((...params: any) => handle(fn(...params))) as unknown) as PipeBuilder<U,V>;
        return pipe<U,V>((...params: any) => handle(fn(...params)));
    }
}

export const exec = <TSuccess,TFailure>(
    pipeBuild: PipeBuilder<TSuccess,TFailure>
): Runner<TSuccess,TFailure> => (pipeBuild(pipeEnd) as unknown) as Runner<TSuccess,TFailure>;


export const map = <T,E,U,V>(
    onSuccess: (value: T) => Result<U,V>,
    onFailure: (error: E) => Result<U,V>
): PipeEntry<T,E,U,V> => (res: Result<T,E>) => res.map<U,V>(onSuccess, onFailure);

export const mapSuccess = <T,E,U>(
    onSuccess: (value: T) => Result<U,E>
): PipeEntry<T,E,U,E> => (res: Result<T,E>) => res.mapSuccess<U>(onSuccess);

export const mapFailure = <T,E,V>(
    onFailure: (error: E) => Result<T,V>
): PipeEntry<T,E,T,V> => (res: Result<T,E>) => res.mapFailure<V>(onFailure);

export const swap = <T,E,U,V>(
    onSuccess: (value: T) => U,
    onFailure: (error: E) => V
): PipeEntry<T,E,U,V> => (res: Result<T,E>) => res.swap<U,V>(onSuccess, onFailure);

export const swapSuccess = <T,E,U>(
    onSuccess: (value: T) => U
): PipeEntry<T,E,U,E> => (res: Result<T,E>) => res.swapSuccess<U>(onSuccess);

export const swapFailure = <T,E,V>(
    onFailure: (error: E) => V
): PipeEntry<T,E,T,V> => (res: Result<T,E>) => res.swapFailure<V>(onFailure);

export const fork = <T,E>(
    handle: (res: Result<T,E>) => any
): PipeEntry<T,E,T,E> => (res: Result<T,E>) => res.fork(handle);

export const forkMap = <T,E>(
    onSuccess: (value: T) => any,
    onFailure: (error: E) => any
): PipeEntry<T,E,T,E> => (res: Result<T,E>) => res.forkMap(onSuccess, onFailure);

export const forkSuccess = <T,E>(
    onSuccess: (value: T) => any
): PipeEntry<T,E,T,E> => (res: Result<T,E>) => res.forkSuccess(onSuccess);

export const forkFailure = <T,E>(
    onFailure: (error: E) => any
): PipeEntry<T,E,T,E> => (res: Result<T,E>) => res.forkFailure(onFailure);
