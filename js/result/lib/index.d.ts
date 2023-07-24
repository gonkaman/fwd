export interface Result<TSuccess, TFailure> {
    isSuccess(): boolean;
    bind<U, V>(fn: (result: Result<TSuccess, TFailure>, ...args: unknown[]) => Result<U, V>, ...args: unknown[]): Result<U, V>;
    bindAsync<U, V>(fn: (result: Result<TSuccess, TFailure>, ...args: unknown[]) => Promise<Result<U, V>>, ...args: unknown[]): Promise<Result<U, V>>;
    bindMerge<U, V>(bind: (...args: unknown[]) => (result: Result<TSuccess, TFailure>) => Result<U, V>, ...args: unknown[]): Result<U, V>;
    bindMergeAsync<U, V>(bind: (...args: unknown[]) => (result: Result<TSuccess, TFailure>) => Promise<Result<U, V>>, ...args: unknown[]): Promise<Result<U, V>>;
    map<U, V>(onSuccess: (value: TSuccess, ...args: unknown[]) => Result<U, V>, onFailure: (error: TFailure, ...args: unknown[]) => Result<U, V>, ...args: unknown[]): Result<U, V>;
    mapAsync<U, V>(onSuccess: (value: TSuccess, ...args: unknown[]) => Promise<Result<U, V>>, onFailure: (error: TFailure, ...args: unknown[]) => Promise<Result<U, V>>, ...args: unknown[]): Promise<Result<U, V>>;
    mapMerge<U, V>(onSuccess: (...args: unknown[]) => (value: TSuccess) => Result<U, V>, onFailure: (...args: unknown[]) => (value: TFailure) => Result<U, V>, ...args: unknown[]): Result<U, V>;
    mapMergeAsync<U, V>(onSuccess: (...args: unknown[]) => (value: TSuccess) => Promise<Result<U, V>>, onFailure: (...args: unknown[]) => (value: TFailure) => Promise<Result<U, V>>, ...args: unknown[]): Promise<Result<U, V>>;
    mapSuccess<U>(onSuccess: (value: TSuccess, ...args: unknown[]) => Result<U, TFailure>, ...args: unknown[]): Result<U, TFailure>;
    mapSuccessAsync<U>(onSuccess: (value: TSuccess, ...args: unknown[]) => Promise<Result<U, TFailure>>, ...args: unknown[]): Promise<Result<U, TFailure>>;
    mapMergeSuccess<U>(onSuccess: (...args: unknown[]) => (value: TSuccess) => Result<U, TFailure>, ...args: unknown[]): Result<U, TFailure>;
    mapMergeSuccessAsync<U>(onSuccess: (...args: unknown[]) => (value: TSuccess) => Promise<Result<U, TFailure>>, ...args: unknown[]): Promise<Result<U, TFailure>>;
    mapFailure<V>(onFailure: (error: TFailure, ...args: unknown[]) => Result<TSuccess, V>, ...args: unknown[]): Result<TSuccess, V>;
    mapFailureAsync<V>(onFailure: (error: TFailure, ...args: unknown[]) => Promise<Result<TSuccess, V>>, ...args: unknown[]): Promise<Result<TSuccess, V>>;
    mapMergeFailure<V>(onFailure: (...args: unknown[]) => (value: TFailure) => Result<TSuccess, V>, ...args: unknown[]): Result<TSuccess, V>;
    mapMergeFailureAsync<V>(onFailure: (...args: unknown[]) => (value: TFailure) => Promise<Result<TSuccess, V>>, ...args: unknown[]): Promise<Result<TSuccess, V>>;
    swap<U, V>(onSuccess: (value: TSuccess, ...args: unknown[]) => U, onFailure: (error: TFailure, ...args: unknown[]) => V, ...args: unknown[]): Result<U, V>;
    swapAsync<U, V>(onSuccess: (value: TSuccess, ...args: unknown[]) => Promise<U>, onFailure: (error: TFailure, ...args: unknown[]) => Promise<V>, ...args: unknown[]): Promise<Result<U, V>>;
    swapMerge<U, V>(onSuccess: (...args: unknown[]) => (value: TSuccess) => U, onFailure: (...args: unknown[]) => (value: TFailure) => V, ...args: unknown[]): Result<U, V>;
    swapMergeAsync<U, V>(onSuccess: (...args: unknown[]) => (value: TSuccess) => Promise<U>, onFailure: (...args: unknown[]) => (value: TFailure) => Promise<V>, ...args: unknown[]): Promise<Result<U, V>>;
    swapSuccess<U>(onSuccess: (value: TSuccess, ...args: unknown[]) => U, ...args: unknown[]): Result<U, TFailure>;
    swapSuccessAsync<U>(onSuccess: (value: TSuccess, ...args: unknown[]) => Promise<U>, ...args: unknown[]): Promise<Result<U, TFailure>>;
    swapMergeSuccess<U>(onSuccess: (...args: unknown[]) => (value: TSuccess) => U, ...args: unknown[]): Result<U, TFailure>;
    swapMergeSuccessAsync<U>(onSuccess: (...args: unknown[]) => (value: TSuccess) => Promise<U>, ...args: unknown[]): Promise<Result<U, TFailure>>;
    swapFailure<V>(onFailure: (error: TFailure, ...args: unknown[]) => V, ...args: unknown[]): Result<TSuccess, V>;
    swapFailureAsync<V>(onFailure: (error: TFailure, ...args: unknown[]) => Promise<V>, ...args: unknown[]): Promise<Result<TSuccess, V>>;
    swapMergeFailure<V>(onFailure: (...args: unknown[]) => (value: TFailure) => V, ...args: unknown[]): Result<TSuccess, V>;
    swapMergeFailureAsync<V>(onFailure: (...args: unknown[]) => (value: TFailure) => Promise<V>, ...args: unknown[]): Promise<Result<TSuccess, V>>;
    fork(handle: (result: Result<TSuccess, TFailure>, ...args: unknown[]) => unknown, ...args: unknown[]): Result<TSuccess, TFailure>;
    forkMap(onSuccess: (value: TSuccess, ...args: unknown[]) => unknown, onFailure: (error: TFailure, ...args: unknown[]) => unknown, ...args: unknown[]): Result<TSuccess, TFailure>;
    forkSuccess(onSuccess: (value: TSuccess, ...args: unknown[]) => unknown, ...args: unknown[]): Result<TSuccess, TFailure>;
    forkFailure(onFailure: (error: TFailure, ...args: unknown[]) => unknown, ...args: unknown[]): Result<TSuccess, TFailure>;
}
export declare class FailureResult<TFailure> implements Result<unknown, TFailure> {
    reason: TFailure;
    constructor(error: TFailure);
    isSuccess(): boolean;
    bind<U, V>(fn: (result: Result<unknown, TFailure>, ...args: unknown[]) => Result<U, V>, ...args: unknown[]): Result<U, V>;
    bindAsync<U, V>(fn: (result: Result<unknown, TFailure>, ...args: unknown[]) => Promise<Result<U, V>>, ...args: unknown[]): Promise<Result<U, V>>;
    bindMerge<U, V>(bind: (...args: unknown[]) => (result: Result<unknown, TFailure>) => Result<U, V>, ...args: unknown[]): Result<U, V>;
    bindMergeAsync<U, V>(bind: (...args: unknown[]) => (result: Result<unknown, TFailure>) => Promise<Result<U, V>>, ...args: unknown[]): Promise<Result<U, V>>;
    map<U, V>(_: (value: unknown, ...args: unknown[]) => Result<U, V>, onFailure: (error: TFailure, ...args: unknown[]) => Result<U, V>, ...args: unknown[]): Result<U, V>;
    mapAsync<U, V>(_: (value: unknown, ...args: unknown[]) => Promise<Result<U, V>>, onFailure: (error: TFailure, ...args: unknown[]) => Promise<Result<U, V>>, ...args: unknown[]): Promise<Result<U, V>>;
    mapMerge<U, V>(_: (...args: unknown[]) => (value: unknown) => Result<U, V>, onFailure: (...args: unknown[]) => (value: TFailure) => Result<U, V>, ...args: unknown[]): Result<U, V>;
    mapMergeAsync<U, V>(_: (...args: unknown[]) => (value: unknown) => Promise<Result<U, V>>, onFailure: (...args: unknown[]) => (value: TFailure) => Promise<Result<U, V>>, ...args: unknown[]): Promise<Result<U, V>>;
    mapSuccess<U>(): Result<U, TFailure>;
    mapSuccessAsync<U>(): Promise<Result<U, TFailure>>;
    mapMergeSuccess<U>(): Result<U, TFailure>;
    mapMergeSuccessAsync<U>(): Promise<Result<U, TFailure>>;
    mapFailure<V>(onFailure: (error: TFailure, ...args: unknown[]) => Result<unknown, V>, ...args: unknown[]): Result<unknown, V>;
    mapFailureAsync<V>(onFailure: (error: TFailure, ...args: unknown[]) => Promise<Result<unknown, V>>, ...args: unknown[]): Promise<Result<unknown, V>>;
    mapMergeFailure<V>(onFailure: (...args: unknown[]) => (value: TFailure) => Result<unknown, V>, ...args: unknown[]): Result<unknown, V>;
    mapMergeFailureAsync<V>(onFailure: (...args: unknown[]) => (value: TFailure) => Promise<Result<unknown, V>>, ...args: unknown[]): Promise<Result<unknown, V>>;
    swap<U, V>(_: (value: unknown, ...args: unknown[]) => U, onFailure: (error: TFailure, ...args: unknown[]) => V, ...args: unknown[]): Result<U, V>;
    swapAsync<U, V>(_: (value: unknown, ...args: unknown[]) => Promise<U>, onFailure: (error: TFailure, ...args: unknown[]) => Promise<V>, ...args: unknown[]): Promise<Result<U, V>>;
    swapMerge<U, V>(_: (...args: unknown[]) => (value: unknown) => U, onFailure: (...args: unknown[]) => (value: TFailure) => V, ...args: unknown[]): Result<U, V>;
    swapMergeAsync<U, V>(_: (...args: unknown[]) => (value: unknown) => Promise<U>, onFailure: (...args: unknown[]) => (value: TFailure) => Promise<V>, ...args: unknown[]): Promise<Result<U, V>>;
    swapSuccess<U>(): Result<U, TFailure>;
    swapSuccessAsync<U>(): Promise<Result<U, TFailure>>;
    swapMergeSuccess<U>(): Result<U, TFailure>;
    swapMergeSuccessAsync<U>(): Promise<Result<U, TFailure>>;
    swapFailure<V>(onFailure: (error: TFailure, ...args: unknown[]) => V, ...args: unknown[]): Result<unknown, V>;
    swapFailureAsync<V>(onFailure: (error: TFailure, ...args: unknown[]) => Promise<V>, ...args: unknown[]): Promise<Result<unknown, V>>;
    swapMergeFailure<V>(onFailure: (...args: unknown[]) => (value: TFailure) => V, ...args: unknown[]): Result<unknown, V>;
    swapMergeFailureAsync<V>(onFailure: (...args: unknown[]) => (value: TFailure) => Promise<V>, ...args: unknown[]): Promise<Result<unknown, V>>;
    fork(handle: (result: Result<unknown, TFailure>, ...args: unknown[]) => unknown, ...args: unknown[]): Result<unknown, TFailure>;
    forkMap(_: (value: unknown, ...args: unknown[]) => unknown, onFailure: (error: TFailure, ...args: unknown[]) => unknown, ...args: unknown[]): Result<unknown, TFailure>;
    forkSuccess(): Result<unknown, TFailure>;
    forkFailure(onFailure: (error: TFailure, ...args: unknown[]) => unknown, ...args: unknown[]): Result<unknown, TFailure>;
}
export declare class SuccessResult<TSuccess> implements Result<TSuccess, unknown> {
    value: TSuccess;
    constructor(value: TSuccess);
    isSuccess(): boolean;
    bind<U, V>(fn: (result: Result<TSuccess, unknown>, ...args: unknown[]) => Result<U, V>, ...args: unknown[]): Result<U, V>;
    bindAsync<U, V>(fn: (result: Result<TSuccess, unknown>, ...args: unknown[]) => Promise<Result<U, V>>, ...args: unknown[]): Promise<Result<U, V>>;
    bindMerge<U, V>(bind: (...args: unknown[]) => (result: Result<TSuccess, unknown>) => Result<U, V>, ...args: unknown[]): Result<U, V>;
    bindMergeAsync<U, V>(bind: (...args: unknown[]) => (result: Result<TSuccess, unknown>) => Promise<Result<U, V>>, ...args: unknown[]): Promise<Result<U, V>>;
    map<U, V>(onSuccess: (value: TSuccess, ...args: unknown[]) => Result<U, V>, _: (error: unknown, ...args: unknown[]) => Result<U, V>, ...args: unknown[]): Result<U, V>;
    mapAsync<U, V>(onSuccess: (value: TSuccess, ...args: unknown[]) => Promise<Result<U, V>>, _: (error: unknown, ...args: unknown[]) => Promise<Result<U, V>>, ...args: unknown[]): Promise<Result<U, V>>;
    mapMerge<U, V>(onSuccess: (...args: unknown[]) => (value: TSuccess) => Result<U, V>, _: (...args: unknown[]) => (value: unknown) => Result<U, V>, ...args: unknown[]): Result<U, V>;
    mapMergeAsync<U, V>(onSuccess: (...args: unknown[]) => (value: TSuccess) => Promise<Result<U, V>>, _: (...args: unknown[]) => (value: unknown) => Promise<Result<U, V>>, ...args: unknown[]): Promise<Result<U, V>>;
    mapSuccess<U>(onSuccess: (value: TSuccess, ...args: unknown[]) => Result<U, unknown>, ...args: unknown[]): Result<U, unknown>;
    mapSuccessAsync<U>(onSuccess: (value: TSuccess, ...args: unknown[]) => Promise<Result<U, unknown>>, ...args: unknown[]): Promise<Result<U, unknown>>;
    mapMergeSuccess<U>(onSuccess: (...args: unknown[]) => (value: TSuccess) => Result<U, unknown>, ...args: unknown[]): Result<U, unknown>;
    mapMergeSuccessAsync<U>(onSuccess: (...args: unknown[]) => (value: TSuccess) => Promise<Result<U, unknown>>, ...args: unknown[]): Promise<Result<U, unknown>>;
    mapFailure<V>(): Result<TSuccess, V>;
    mapFailureAsync<V>(): Promise<Result<TSuccess, V>>;
    mapMergeFailure<V>(): Result<TSuccess, V>;
    mapMergeFailureAsync<V>(): Promise<Result<TSuccess, V>>;
    swap<U, V>(onSuccess: (value: TSuccess, ...args: unknown[]) => U, _: (error: unknown, ...args: unknown[]) => V, ...args: unknown[]): Result<U, V>;
    swapAsync<U, V>(onSuccess: (value: TSuccess, ...args: unknown[]) => Promise<U>, _: (error: unknown, ...args: unknown[]) => Promise<V>, ...args: unknown[]): Promise<Result<U, V>>;
    swapMerge<U, V>(onSuccess: (...args: unknown[]) => (value: TSuccess) => U, _: (...args: unknown[]) => (value: unknown) => V, ...args: unknown[]): Result<U, V>;
    swapMergeAsync<U, V>(onSuccess: (...args: unknown[]) => (value: TSuccess) => Promise<U>, _: (...args: unknown[]) => (value: unknown) => Promise<V>, ...args: unknown[]): Promise<Result<U, V>>;
    swapSuccess<U>(onSuccess: (value: TSuccess, ...args: unknown[]) => U, ...args: unknown[]): Result<U, unknown>;
    swapSuccessAsync<U>(onSuccess: (value: TSuccess, ...args: unknown[]) => Promise<U>, ...args: unknown[]): Promise<Result<U, unknown>>;
    swapMergeSuccess<U>(onSuccess: (...args: unknown[]) => (value: TSuccess) => U, ...args: unknown[]): Result<U, unknown>;
    swapMergeSuccessAsync<U>(onSuccess: (...args: unknown[]) => (value: TSuccess) => Promise<U>, ...args: unknown[]): Promise<Result<U, unknown>>;
    swapFailure<V>(): Result<TSuccess, V>;
    swapFailureAsync<V>(): Promise<Result<TSuccess, V>>;
    swapMergeFailure<V>(): Result<TSuccess, V>;
    swapMergeFailureAsync<V>(): Promise<Result<TSuccess, V>>;
    fork(handle: (result: Result<TSuccess, unknown>, ...args: unknown[]) => unknown, ...args: unknown[]): Result<TSuccess, unknown>;
    forkMap(onSuccess: (value: TSuccess, ...args: unknown[]) => unknown, _: (error: unknown, ...args: unknown[]) => unknown, ...args: unknown[]): Result<TSuccess, unknown>;
    forkSuccess(onSuccess: (value: TSuccess, ...args: unknown[]) => unknown, ...args: unknown[]): Result<TSuccess, unknown>;
    forkFailure(): Result<TSuccess, unknown>;
}
export declare const result: {
    success<T, E>(value: T): Result<T, E>;
    failure<T_1, E_1>(error: E_1): Result<T_1, E_1>;
};
