"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.failure = exports.success = exports.SuccessResult = exports.FailureResult = exports.forkFailure = exports.forkSuccess = exports.forkMap = exports.fork = exports.swapFailure = exports.swapSuccess = exports.swap = exports.mapFailure = exports.mapSuccess = exports.map = exports.exec = exports.pipe = void 0;
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
        return fn(this);
    }
    map(_, onFailure) {
        return onFailure(this.reason);
    }
    mapAsync(_, onFailure) {
        return onFailure(this.reason);
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
        return onFailure(this.reason);
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
    forkMap(_, onFailure) {
        onFailure(this.reason);
        return this;
    }
    forkSuccess() {
        return this;
    }
    forkFailure(onFailure) {
        onFailure(this.reason);
        return this;
    }
}
exports.FailureResult = FailureResult;
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
        return fn(this);
    }
    map(onSuccess, _) {
        return onSuccess(this._value);
    }
    mapAsync(onSuccess, _) {
        return onSuccess(this._value);
    }
    mapSuccess(onSuccess) {
        return onSuccess(this._value);
    }
    mapSuccessAsync(onSuccess) {
        return onSuccess(this._value);
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
    forkMap(onSuccess, _) {
        onSuccess(this._value);
        return this;
    }
    forkSuccess(onSuccess) {
        onSuccess(this._value);
        return this;
    }
    forkFailure() {
        return this;
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
/**
 * Creates an instance of Result representing a failure, using the given error
 * @param error Result data for a failure
 * @returns An instance of Result
 */
const failure = (error) => new FailureResult(error);
exports.failure = failure;
/*
export type { Result }

export {
    Runner, PipeEntry, PipeBuilder, pipe, exec, map, swap,
    mapSuccess, swapSuccess, mapFailure, swapFailure,
    fork, forkMap, forkSuccess, forkFailure
} from "./Pipe";

*/ 
