"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.result = exports.SuccessResult = exports.FailureResult = void 0;
class FailureResult {
    constructor(error) {
        this.reason = error;
    }
    isSuccess() {
        return false;
    }
    bind(fn, ...args) {
        return fn(this, ...args);
    }
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
class SuccessResult {
    constructor(value) {
        this.value = value;
    }
    isSuccess() {
        return true;
    }
    bind(fn, ...args) {
        return fn(this, ...args);
    }
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
    success(value) {
        return new SuccessResult(value);
    },
    failure(error) {
        return new FailureResult(error);
    }
};
