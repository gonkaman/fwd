export interface Result<TSuccess, TFailure>{
    isSuccess(): boolean,

    bind<U,V>(
        fn: (result: Result<TSuccess,TFailure>, ...args: unknown[]) => Result<U,V>,
        ...args: unknown[]
    ): Result<U,V>,

    bindAsync<U,V>(
        fn: (result: Result<TSuccess,TFailure>, ...args: unknown[]) => Promise<Result<U,V>>,
        ...args: unknown[]
    ): Promise<Result<U,V>>,
    
    bindMerge<U,V>(
        bind: (...args: unknown[]) => (result: Result<TSuccess,TFailure>) => Result<U,V>,
        ...args: unknown[]
    ): Result<U,V>,
    
    bindMergeAsync<U,V>(
        bind: (...args: unknown[]) => (result: Result<TSuccess,TFailure>) => Promise<Result<U,V>>,
        ...args: unknown[]
    ): Promise<Result<U,V>>,




    map<U,V>(
        onSuccess: (value: TSuccess, ...args: unknown[]) => Result<U,V>,
        onFailure: (error: TFailure, ...args: unknown[]) => Result<U,V>,
        ...args: unknown[]
    ): Result<U,V>,
    
    mapAsync<U,V>(
        onSuccess: (value: TSuccess, ...args: unknown[]) => Promise<Result<U,V>>,
        onFailure: (error: TFailure, ...args: unknown[]) => Promise<Result<U,V>>,
        ...args: unknown[]
    ): Promise<Result<U,V>>,
    
    mapMerge<U,V>(
        onSuccess: (...args: unknown[]) => (value: TSuccess) => Result<U,V>,
        onFailure: (...args: unknown[]) => (value: TFailure) => Result<U,V>,
        ...args: unknown[]
    ): Result<U,V>,
    
    mapMergeAsync<U,V>(
        onSuccess: (...args: unknown[]) => (value: TSuccess) => Promise<Result<U,V>>,
        onFailure: (...args: unknown[]) => (value: TFailure) => Promise<Result<U,V>>,
        ...args: unknown[]
    ): Promise<Result<U,V>>,




    mapSuccess<U>(
        onSuccess: (value: TSuccess, ...args: unknown[]) => Result<U,TFailure>,
        ...args: unknown[]
    ): Result<U,TFailure>,
    
    mapSuccessAsync<U>(
        onSuccess: (value: TSuccess, ...args: unknown[]) => Promise<Result<U,TFailure>>,
        ...args: unknown[]
    ): Promise<Result<U,TFailure>>,

    mapMergeSuccess<U>(
        onSuccess: (...args: unknown[]) => (value: TSuccess) => Result<U,TFailure>,
        ...args: unknown[]
    ): Result<U,TFailure>,
    
    mapMergeSuccessAsync<U>(
        onSuccess: (...args: unknown[]) => (value: TSuccess) => Promise<Result<U,TFailure>>,
        ...args: unknown[]
    ): Promise<Result<U,TFailure>>,



    mapFailure<V>(
        onFailure: (error: TFailure, ...args: unknown[]) => Result<TSuccess,V>,
        ...args: unknown[]
    ): Result<TSuccess,V>,

    mapFailureAsync<V>(
        onFailure: (error: TFailure, ...args: unknown[]) => Promise<Result<TSuccess,V>>,
        ...args: unknown[]
    ): Promise<Result<TSuccess,V>>,

    mapMergeFailure<V>(
        onFailure: (...args: unknown[]) => (value: TFailure) => Result<TSuccess,V>,
        ...args: unknown[]
    ): Result<TSuccess,V>,
    
    mapMergeFailureAsync<V>(
        onFailure: (...args: unknown[]) => (value: TFailure) => Promise<Result<TSuccess,V>>,
        ...args: unknown[]
    ): Promise<Result<TSuccess,V>>,





    swap<U,V>(
        onSuccess: (value: TSuccess, ...args: unknown[]) => U,
        onFailure: (error: TFailure, ...args: unknown[]) => V,
        ...args: unknown[]
    ): Result<U,V>,
    
    swapAsync<U,V>(
        onSuccess: (value: TSuccess, ...args: unknown[]) => Promise<U>,
        onFailure: (error: TFailure, ...args: unknown[]) => Promise<V>,
        ...args: unknown[]
    ): Promise<Result<U,V>>,

    swapMerge<U,V>(
        onSuccess: (...args: unknown[]) => (value: TSuccess) => U,
        onFailure: (...args: unknown[]) => (value: TFailure) => V,
        ...args: unknown[]
    ): Result<U,V>,
    
    swapMergeAsync<U,V>(
        onSuccess: (...args: unknown[]) => (value: TSuccess) => Promise<U>,
        onFailure: (...args: unknown[]) => (value: TFailure) => Promise<V>,
        ...args: unknown[]
    ): Promise<Result<U,V>>,




    swapSuccess<U>(
        onSuccess: (value: TSuccess, ...args: unknown[]) => U,
        ...args: unknown[]
    ): Result<U,TFailure>,

    swapSuccessAsync<U>(
        onSuccess: (value: TSuccess, ...args: unknown[]) => Promise<U>,
        ...args: unknown[]
    ): Promise<Result<U,TFailure>>,

    swapMergeSuccess<U>(
        onSuccess: (...args: unknown[]) => (value: TSuccess) => U,
        ...args: unknown[]
    ): Result<U,TFailure>,
    
    swapMergeSuccessAsync<U>(
        onSuccess: (...args: unknown[]) => (value: TSuccess) => Promise<U>,
        ...args: unknown[]
    ): Promise<Result<U,TFailure>>,




    swapFailure<V>(
        onFailure: (error: TFailure, ...args: unknown[]) => V,
        ...args: unknown[]
    ): Result<TSuccess,V>,

    swapFailureAsync<V>(
        onFailure: (error: TFailure, ...args: unknown[]) => Promise<V>,
        ...args: unknown[]
    ): Promise<Result<TSuccess,V>>,

    swapMergeFailure<V>(
        onFailure: (...args: unknown[]) => (value: TFailure) => V,
        ...args: unknown[]
    ): Result<TSuccess,V>,
    
    swapMergeFailureAsync<V>(
        onFailure: (...args: unknown[]) => (value: TFailure) => Promise<V>,
        ...args: unknown[]
    ): Promise<Result<TSuccess,V>>,


    

    fork(
        handle: (result: Result<TSuccess,TFailure>, ...args: unknown[]) => unknown,
        ...args: unknown[]
    ): Result<TSuccess,TFailure>,
    
    forkMap(
        onSuccess: (value: TSuccess, ...args: unknown[]) => unknown,
        onFailure: (error: TFailure, ...args: unknown[]) => unknown,
        ...args: unknown[]
    ): Result<TSuccess,TFailure>,
    
    forkSuccess(
        onSuccess: (value: TSuccess, ...args: unknown[]) => unknown,
        ...args: unknown[]
    ): Result<TSuccess,TFailure>,
    
    forkFailure(
        onFailure: (error: TFailure, ...args: unknown[]) => unknown,
        ...args: unknown[]
    ): Result<TSuccess,TFailure>

    
}

