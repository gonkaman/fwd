

/**@module fwd-result */

/**
 * ResultState<TSuccess, TFailure>: Normalized representation of a Result<TSuccess, TFailure> object's state
 * @typedef {Object} ResultState
 * @template TSuccess - Result value in case of success
 * @template TFailure - Result value in case of failure
 * @property {boolean} isSuccess - Indicate whether the result is a success or a failure
 * @property {?TSuccess} value - Value contained in the result in case of success, undefined in case of failure
 * @property {?TFailure} error - Value contained in the result in case of failure, undefined in case of success
 */

/**
 * Result<TSuccess, TFailure>: Base interface for result objects. \n
 * A result object represent the outcome of an operation, that can either be a failure or a success. \n
 * The Result interface also provides several utility methods to chains operations 
 * following the railway oriented programming style
 * 
 * @template TSuccess - Value type in case of success
 * @template TFailure - Error type, Value type in case of failure
 * @interface Result
 * 
 */

/**
 * Checks whether the result is a success or a failure.
 * Returns true in case of success, false in case of failure
 * @method
 * @name isSuccess
 * @returns {boolean} 
 * @memberof Result
 * @instance
 */

/**
 * returns the normalized state of the result object
 * @method
 * @name unwrap
 * @returns {ResultState} ResultState<TSuccess,TFailure>
 * @memberof Result
 * @instance
 */

