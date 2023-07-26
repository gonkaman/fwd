import { Result } from "./Result";
import { FailureResult } from "./ResultImplFailure";
import { SuccessResult } from "./ResultImplSuccess";

export const result = {
    /**
     * Creates an instance of Result representing a success, using the given value
     * @param value Result data for a success
     * @returns An instance of Result
     */
    success<T,E>(value: T): Result<T,E>{
        return new SuccessResult<T>(value) as Result<T,E>;
    },
    
    /**
     * Creates an instance of Result representing a failure, using the given error
     * @param error Result data for a failure
     * @returns An instance of Result
     */
    failure<T,E>(error: E): Result<T,E>{
        return new FailureResult<E>(error) as Result<T,E>;
    }
};

export type { Result }


