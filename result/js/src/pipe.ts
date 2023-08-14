import { Result } from "."

export type PipeBuilder<T,E> = 
    (<U,V>(fn: (res: Result<T,E>) => Result<U,V>) => PipeBuilder<U,V>) 
    | ((...args: any) => Result<T,E>);

const endpipe = <T,E>(res: Result<T,E>): Result<T,E> => res;

export const pipe = <TSuccess,TFailure>(
    fn: (...args: any) => Result<TSuccess, TFailure>
): PipeBuilder<TSuccess, TFailure> => {
    return <U,V>(handle: (res: Result<TSuccess,TFailure>) => Result<U,V>): PipeBuilder<U,V>{
        if(handle === endpipe) return (...params: any) => handle(fn(...params));
        return pipe<U,V>((...params: any) => handle(fn(...params)));
    }
}

export const exec = function(){

}