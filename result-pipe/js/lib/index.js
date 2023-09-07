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
exports.rpipeAsync = exports.rpipe = exports.forkFailureAsync = exports.forkSuccessAsync = exports.forkMapAsync = exports.forkAsync = exports.swapFailureAsync = exports.swapSuccessAsync = exports.swapAsync = exports.mapFailureAsync = exports.mapSuccessAsync = exports.mapAsync = exports.forkFailure = exports.forkSuccess = exports.forkMap = exports.fork = exports.swapFailure = exports.swapSuccess = exports.swap = exports.mapFailure = exports.mapSuccess = exports.map = void 0;
const fwd_pipe_1 = require("fwd-pipe");
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
const rpipe = (entry) => (0, fwd_pipe_1.pipe)(entry);
exports.rpipe = rpipe;
const rpipeAsync = (entry) => (0, fwd_pipe_1.pipeAsync)(entry);
exports.rpipeAsync = rpipeAsync;
