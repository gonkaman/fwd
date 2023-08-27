"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = exports.SuccessResult = exports.failure = exports.FailureResult = exports.forkFailureAsync = exports.forkSuccessAsync = exports.forkMapAsync = exports.forkAsync = exports.swapFailureAsync = exports.swapSuccessAsync = exports.swapAsync = exports.mapFailureAsync = exports.mapSuccessAsync = exports.mapAsync = exports.execAsync = exports.pipeAsync = exports.forkFailure = exports.forkSuccess = exports.forkMap = exports.fork = exports.swapFailure = exports.swapSuccess = exports.swap = exports.mapFailure = exports.mapSuccess = exports.map = exports.exec = exports.pipe = void 0;
const pipeEnd = (res) => res;
const pipe = (fn) => {
    return (handle) => {
        if (handle === pipeEnd)
            return ((...params) => handle(fn(...params)));
        return (0, exports.pipe)((...params) => handle(fn(...params)));
    };
};
exports.pipe = pipe;
const exec = (pipeBuild) => pipeBuild(pipeEnd);
exports.exec = exec;
const map = (onSuccess, onFailure) => (res) => res.map(onSuccess, onFailure);
exports.map = map;
const mapSuccess = (onSuccess) => (res) => res.mapSuccess(onSuccess);
exports.mapSuccess = mapSuccess;
const mapFailure = (onFailure) => (res) => res.mapFailure(onFailure);
exports.mapFailure = mapFailure;
const swap = (onSuccess, onFailure) => (res) => res.swap(onSuccess, onFailure);
exports.swap = swap;
const swapSuccess = (onSuccess) => (res) => res.swapSuccess(onSuccess);
exports.swapSuccess = swapSuccess;
const swapFailure = (onFailure) => (res) => res.swapFailure(onFailure);
exports.swapFailure = swapFailure;
const fork = (handle) => (res) => res.fork(handle);
exports.fork = fork;
const forkMap = (onSuccess, onFailure) => (res) => res.forkMap(onSuccess, onFailure);
exports.forkMap = forkMap;
const forkSuccess = (onSuccess) => (res) => res.forkSuccess(onSuccess);
exports.forkSuccess = forkSuccess;
const forkFailure = (onFailure) => (res) => res.forkFailure(onFailure);
exports.forkFailure = forkFailure;
const asyncPipeEnd = (res) => res;
const pipeAsync = (fn) => {
    return (handle, onRejected) => {
        if (handle === asyncPipeEnd)
            return ((...params) => fn(...params).then(res => handle(res), onRejected));
        return (0, exports.pipeAsync)((...params) => fn(...params).then(res => handle(res), onRejected));
    };
};
exports.pipeAsync = pipeAsync;
const execAsync = (pipeBuildAsync) => pipeBuildAsync(asyncPipeEnd);
exports.execAsync = execAsync;
const mapAsync = (onSuccess, onFailure) => (res) => res.mapAsync(onSuccess, onFailure);
exports.mapAsync = mapAsync;
const mapSuccessAsync = (onSuccess) => (res) => res.mapSuccessAsync(onSuccess);
exports.mapSuccessAsync = mapSuccessAsync;
const mapFailureAsync = (onFailure) => (res) => res.mapFailureAsync(onFailure);
exports.mapFailureAsync = mapFailureAsync;
const swapAsync = (onSuccess, onFailure) => (res) => res.swapAsync(onSuccess, onFailure);
exports.swapAsync = swapAsync;
const swapSuccessAsync = (onSuccess) => (res) => res.swapSuccessAsync(onSuccess);
exports.swapSuccessAsync = swapSuccessAsync;
const swapFailureAsync = (onFailure) => (res) => res.swapFailureAsync(onFailure);
exports.swapFailureAsync = swapFailureAsync;
const forkAsync = (handle) => (res) => res.forkAsync(handle);
exports.forkAsync = forkAsync;
const forkMapAsync = (onSuccess, onFailure) => (res) => res.forkMapAsync(onSuccess, onFailure);
exports.forkMapAsync = forkMapAsync;
const forkSuccessAsync = (onSuccess) => (res) => res.forkSuccessAsync(onSuccess);
exports.forkSuccessAsync = forkSuccessAsync;
const forkFailureAsync = (onFailure) => (res) => res.forkFailureAsync(onFailure);
exports.forkFailureAsync = forkFailureAsync;
class FailureResult {
    constructor(error) {
        this.reason = error;
    }
    value() {
        return undefined;
    }
    error() {
        return this.reason;
    }
    state() {
        return {
            error: this.reason,
            isSuccess: false
        };
    }
    payload() {
        return this.reason;
    }
    isSuccess() {
        return false;
    }
    bind(fn) {
        return fn(this);
    }
    bindAsync(fn) {
        return Promise.resolve(fn(this));
    }
    map(_, onFailure) {
        return onFailure(this.reason);
    }
    mapAsync(_, onFailure) {
        return Promise.resolve(onFailure(this.reason));
    }
    mapSuccess() {
        return this;
    }
    mapSuccessAsync() {
        return Promise.resolve(this);
    }
    mapFailure(onFailure) {
        return onFailure(this.reason);
    }
    mapFailureAsync(onFailure) {
        return Promise.resolve(onFailure(this.reason));
    }
    swap(_, onFailure) {
        return new FailureResult(onFailure(this.reason));
    }
    async swapAsync(_, onFailure) {
        return new FailureResult(await onFailure(this.reason));
    }
    swapSuccess() {
        return this;
    }
    swapSuccessAsync() {
        return Promise.resolve(this);
    }
    swapFailure(onFailure) {
        return new FailureResult(onFailure(this.reason));
    }
    async swapFailureAsync(onFailure) {
        return new FailureResult(await onFailure(this.reason));
    }
    fork(handle) {
        handle(this);
        return this;
    }
    async forkAsync(handle) {
        return Promise.resolve(handle(this)).then(_ => this);
    }
    forkMap(_, onFailure) {
        onFailure(this.reason);
        return this;
    }
    async forkMapAsync(_, onFailure) {
        return Promise.resolve(onFailure(this.reason)).then(_ => this);
    }
    forkSuccess() {
        return this;
    }
    async forkSuccessAsync() {
        return Promise.resolve(this);
    }
    forkFailure(onFailure) {
        onFailure(this.reason);
        return this;
    }
    async forkFailureAsync(onFailure) {
        return Promise.resolve(onFailure(this.reason)).then(_ => this);
    }
}
exports.FailureResult = FailureResult;
/**
 * Creates an instance of Result representing a failure, using the given error
 * @param error Result data for a failure
 * @returns An instance of Result
 */
const failure = (error) => new FailureResult(error);
exports.failure = failure;
class SuccessResult {
    constructor(value) {
        this._value = value;
    }
    isSuccess() {
        return true;
    }
    value() {
        return this._value;
    }
    error() {
        return undefined;
    }
    payload() {
        return this._value;
    }
    state() {
        return {
            value: this._value,
            isSuccess: true
        };
    }
    bind(fn) {
        return fn(this);
    }
    bindAsync(fn) {
        return Promise.resolve(fn(this));
    }
    map(onSuccess, _) {
        return onSuccess(this._value);
    }
    mapAsync(onSuccess, _) {
        return Promise.resolve(onSuccess(this._value));
    }
    mapSuccess(onSuccess) {
        return onSuccess(this._value);
    }
    mapSuccessAsync(onSuccess) {
        return Promise.resolve(onSuccess(this._value));
    }
    mapFailure() {
        return this;
    }
    mapFailureAsync() {
        return Promise.resolve(this);
    }
    swap(onSuccess, _) {
        return new SuccessResult(onSuccess(this._value));
    }
    async swapAsync(onSuccess, _) {
        return new SuccessResult(await onSuccess(this._value));
    }
    swapSuccess(onSuccess) {
        return new SuccessResult(onSuccess(this._value));
    }
    async swapSuccessAsync(onSuccess) {
        return new SuccessResult(await onSuccess(this._value));
    }
    swapFailure() {
        return this;
    }
    swapFailureAsync() {
        return Promise.resolve(this);
    }
    fork(handle) {
        handle(this);
        return this;
    }
    async forkAsync(handle) {
        return Promise.resolve(handle(this)).then(_ => this);
    }
    forkMap(onSuccess, _) {
        onSuccess(this._value);
        return this;
    }
    async forkMapAsync(onSuccess, _) {
        return Promise.resolve(onSuccess(this._value)).then(_ => this);
    }
    forkSuccess(onSuccess) {
        onSuccess(this._value);
        return this;
    }
    async forkSuccessAsync(onSuccess) {
        return Promise.resolve(onSuccess(this._value)).then(_ => this);
    }
    forkFailure() {
        return this;
    }
    async forkFailureAsync() {
        return Promise.resolve(this);
    }
}
exports.SuccessResult = SuccessResult;
/**
 * Creates an instance of Result representing a success, using the given value
 * @param value Result data for a success
 * @returns An instance of Result
 */
const success = (value) => new SuccessResult(value);
exports.success = success;
