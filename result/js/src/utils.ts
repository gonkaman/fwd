import { isFailureResult } from "./ResultImplFailure";
import { isSuccessResult } from "./ResultImplSuccess";

/**
 * Checks wether a given value is an result instance
 * @param value Value to check
 * @returns Boolean - True if the value is a result instance, False if not
 */
export const isResultInstance = (value: unknown): boolean => isSuccessResult(value) || isFailureResult(value);


