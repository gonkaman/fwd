"use strict";
/**@module fwd-result */
Object.defineProperty(exports, "__esModule", { value: true });
exports.result = exports.SuccessResult = exports.FailureResult = void 0;
/**@module fwd-result */
/**
 * Implementation of Result<TSuccess, TFailure> for failure cases
 *
 * @class
 * @template TFailure - Value type for failure cases
 * @inheritdoc
 */
class FailureResult {
    /**
     *
     * @constructor
     * @param error Failure data
     */
    constructor(error) {
        this.reason = error;
    }
    /**
     * Checks whether the result is a success or a failure.
     * Returns true in case of success, false in case of failure
     * @returns {boolean}
     */
    isSuccess() {
        return false;
    }
    /**
     * returns the normalized state of the result object
     * @returns {ResultState<unknown,TFailure>}
     */
    unwrap() {
        return {
            isSuccess: false,
            error: this.reason
        };
    }
    /**
     * Executes the given handler, using the current result to get a new result
     * @param fn Handler to execute, must return a result object. The current result object will be passed as the first argument
     * @param args Optional, additional arguments needed for the handler execution
     * @returns Result<U,V>
     */
    bind(fn, ...args) {
        return fn(this, ...args);
    }
    /**
     * Executes the given asynchronous handler, using the current result to get a new result
     * @async
     * @param fn Async handler to execute, must return a result object. The current result object will be passed as the first argument
     * @param args Optional, additional arguments needed for the handler execution
     * @returns Promise<Result<U,V>>
     */
    bindAsync(fn, ...args) {
        return fn(this, ...args);
    }
    bindMerge(bind, ...args) {
        return bind(...args)(this);
    }
    bindMergeAsync(bind, ...args) {
        return bind(...args)(this);
    }
    map(_, onFailure, ...args) {
        return onFailure(this.reason, ...args);
    }
    mapAsync(_, onFailure, ...args) {
        return onFailure(this.reason, ...args);
    }
    mapMerge(_, onFailure, ...args) {
        return onFailure(...args)(this.reason);
    }
    mapMergeAsync(_, onFailure, ...args) {
        return onFailure(...args)(this.reason);
    }
    mapSuccess() {
        return this;
    }
    mapSuccessAsync() {
        return Promise.resolve(this);
    }
    mapMergeSuccess() {
        return this;
    }
    mapMergeSuccessAsync() {
        return Promise.resolve(this);
    }
    mapFailure(onFailure, ...args) {
        return onFailure(this.reason, ...args);
    }
    mapFailureAsync(onFailure, ...args) {
        return onFailure(this.reason, ...args);
    }
    mapMergeFailure(onFailure, ...args) {
        return onFailure(...args)(this.reason);
    }
    mapMergeFailureAsync(onFailure, ...args) {
        return onFailure(...args)(this.reason);
    }
    swap(_, onFailure, ...args) {
        return new FailureResult(onFailure(this.reason, ...args));
    }
    async swapAsync(_, onFailure, ...args) {
        return new FailureResult(await onFailure(this.reason, ...args));
    }
    swapMerge(_, onFailure, ...args) {
        return new FailureResult(onFailure(...args)(this.reason));
    }
    async swapMergeAsync(_, onFailure, ...args) {
        return new FailureResult(await onFailure(...args)(this.reason));
    }
    swapSuccess() {
        return this;
    }
    swapSuccessAsync() {
        return Promise.resolve(this);
    }
    swapMergeSuccess() {
        return this;
    }
    swapMergeSuccessAsync() {
        return Promise.resolve(this);
    }
    swapFailure(onFailure, ...args) {
        return new FailureResult(onFailure(this.reason, ...args));
    }
    async swapFailureAsync(onFailure, ...args) {
        return new FailureResult(await onFailure(this.reason, ...args));
    }
    swapMergeFailure(onFailure, ...args) {
        return new FailureResult(onFailure(...args)(this.reason));
    }
    async swapMergeFailureAsync(onFailure, ...args) {
        return new FailureResult(await onFailure(...args)(this.reason));
    }
    fork(handle, ...args) {
        handle(this, ...args);
        return this;
    }
    forkMap(_, onFailure, ...args) {
        onFailure(this.reason, ...args);
        return this;
    }
    forkSuccess() {
        return this;
    }
    forkFailure(onFailure, ...args) {
        onFailure(this.reason, ...args);
        return this;
    }
}
exports.FailureResult = FailureResult;
/**@module fwd-result */
/**
 * Implementation of Result<TSuccess, TFailure> for success cases
 *
 * @class
 * @template TSuccess - Value type for success cases
 * @inheritdoc
 */
class SuccessResult {
    /**
     * @constructor
     * @param value Success data
     */
    constructor(value) {
        this.value = value;
    }
    /**
     * Checks whether the result is a success or a failure.
     * Returns true in case of success, false in case of failure
     * @returns {boolean}
     */
    isSuccess() {
        return true;
    }
    /**
     * returns the normalized state of the result object
     * @template TSuccess - Value type for success cases
     * @returns {ResultState<TSuccess,unknown>}
     */
    unwrap() {
        return {
            isSuccess: true,
            value: this.value
        };
    }
    /**
     * Executes the given handler, using the current result to get a new result
     * @param fn Handler to execute, must return a result object. The current result object will be passed as the first argument
     * @param args Optional, additional arguments needed for the handler execution
     * @returns Result<U,V>
     */
    bind(fn, ...args) {
        return fn(this, ...args);
    }
    /**
     * Executes the given asynchronous handler, using the current result to get a new result
     * @async
     * @param fn Async handler to execute, must return a result object. The current result object will be passed as the first argument
     * @param args Optional, additional arguments needed for the handler execution
     * @returns Promise<Result<U,V>>
     */
    bindAsync(fn, ...args) {
        return fn(this, ...args);
    }
    bindMerge(bind, ...args) {
        return bind(...args)(this);
    }
    bindMergeAsync(bind, ...args) {
        return bind(...args)(this);
    }
    map(onSuccess, _, ...args) {
        return onSuccess(this.value, ...args);
    }
    mapAsync(onSuccess, _, ...args) {
        return onSuccess(this.value, ...args);
    }
    mapMerge(onSuccess, _, ...args) {
        return onSuccess(...args)(this.value);
    }
    mapMergeAsync(onSuccess, _, ...args) {
        return onSuccess(...args)(this.value);
    }
    mapSuccess(onSuccess, ...args) {
        return onSuccess(this.value, ...args);
    }
    mapSuccessAsync(onSuccess, ...args) {
        return onSuccess(this.value, ...args);
    }
    mapMergeSuccess(onSuccess, ...args) {
        return onSuccess(...args)(this.value);
    }
    mapMergeSuccessAsync(onSuccess, ...args) {
        return onSuccess(...args)(this.value);
    }
    mapFailure() {
        return this;
    }
    mapFailureAsync() {
        return Promise.resolve(this);
    }
    mapMergeFailure() {
        return this;
    }
    mapMergeFailureAsync() {
        return Promise.resolve(this);
    }
    swap(onSuccess, _, ...args) {
        return new SuccessResult(onSuccess(this.value, ...args));
    }
    async swapAsync(onSuccess, _, ...args) {
        return new SuccessResult(await onSuccess(this.value, ...args));
    }
    swapMerge(onSuccess, _, ...args) {
        return new SuccessResult(onSuccess(...args)(this.value));
    }
    async swapMergeAsync(onSuccess, _, ...args) {
        return new SuccessResult(await onSuccess(...args)(this.value));
    }
    swapSuccess(onSuccess, ...args) {
        return new SuccessResult(onSuccess(this.value, ...args));
    }
    async swapSuccessAsync(onSuccess, ...args) {
        return new SuccessResult(await onSuccess(this.value, ...args));
    }
    swapMergeSuccess(onSuccess, ...args) {
        return new SuccessResult(onSuccess(...args)(this.value));
    }
    async swapMergeSuccessAsync(onSuccess, ...args) {
        return new SuccessResult(await onSuccess(...args)(this.value));
    }
    swapFailure() {
        return this;
    }
    swapFailureAsync() {
        return Promise.resolve(this);
    }
    swapMergeFailure() {
        return this;
    }
    swapMergeFailureAsync() {
        return Promise.resolve(this);
    }
    fork(handle, ...args) {
        handle(this, ...args);
        return this;
    }
    forkMap(onSuccess, _, ...args) {
        onSuccess(this.value, ...args);
        return this;
    }
    forkSuccess(onSuccess, ...args) {
        onSuccess(this.value, ...args);
        return this;
    }
    forkFailure() {
        return this;
    }
}
exports.SuccessResult = SuccessResult;
exports.result = {
    /**
     * Creates an instance of Result representing a success, using the given value
     * @param value Result data for a success
     * @returns An instance of Result
     */
    success(value) {
        return new SuccessResult(value);
    },
    /**
     * Creates an instance of Result representing a failure, using the given error
     * @param error Result data for a failure
     * @returns An instance of Result
     */
    failure(error) {
        return new FailureResult(error);
    }
};
