import { Result } from "./Result";
import { FailureResult } from "./ResultImplFailure";
import { SuccessResult } from "./ResultImplSuccess";

export type { Result }

/**
 * Creates an instance of Result representing a success, using the given value
 * @param value Result data for a success
 * @returns An instance of Result
 */
export const success = <T,E>(value: T): Result<T,E> => new SuccessResult<T>(value) as Result<T,E>;


/**
 * Creates an instance of Result representing a failure, using the given error
 * @param error Result data for a failure
 * @returns An instance of Result
 */
export const failure  = <T,E>(error: E): Result<T,E> => new FailureResult<E>(error) as Result<T,E>;


export { 
    Runner, PipeEntry, PipeBuilder, pipe, exec, map, swap, 
    mapSuccess, swapSuccess, mapFailure, swapFailure,
    fork, forkMap, forkSuccess, forkFailure 
} from "./Pipe";

