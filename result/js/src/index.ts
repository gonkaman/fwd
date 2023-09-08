import { isFailureResult } from "./ResultImplFailure";
import { isSuccessResult } from "./ResultImplSuccess";

export { Result } from "./Result";
export { failure } from "./ResultImplFailure";
export { success } from "./ResultImplSuccess";

export const isResultInstance = (value: unknown): boolean => isSuccessResult(value) || isFailureResult(value);


