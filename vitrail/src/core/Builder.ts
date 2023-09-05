import { PipeBuilder, Runner } from "fwd-result";

export interface EffectBuilder<T,E>{
    pipe(): PipeBuilder<T,E>,
    runner(): Runner<T,E>
}

export interface QueryBuilder<T,E>{
    source(): T,
    pipe(): PipeBuilder<[string, any][], E>,
    runner(): Runner<[string, any][], E>
}

export interface DeriveEffect<TOrigin, TBuilder>{
    handleEffect(
        handler: (builder: TBuilder) => any
    ): TOrigin
}

export interface DeriveQuery<TOrigin, TBuilder>{
    handleQuery(
        handler: (builder: TBuilder) => any
    ): TOrigin
}