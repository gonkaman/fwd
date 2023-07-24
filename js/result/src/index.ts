import { Result } from "./Result";
import { FailureResult } from "./ResultImplFailure";
import { SuccessResult } from "./ResultImplSuccess";

export const result = {
    success<T,E>(value: T): Result<T,E>{
        return new SuccessResult<T>(value) as Result<T,E>;
    },
    failure<T,E>(error: E): Result<T,E>{
        return new FailureResult<E>(error) as Result<T,E>;
    }
};

export type { Result }


