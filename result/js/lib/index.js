/*

MIT License

Copyright (c) 2023 Joël GONKAMAN

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = exports.failure = void 0;
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
/**
 * Creates an instance of Result representing a success, using the given value
 * @param value Result data for a success
 * @returns An instance of Result
 */
const success = (value) => new SuccessResult(value);
exports.success = success;
