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

import { pipe, pipeAsync } from "fwd-pipe";
export const map = (onSuccess, onFailure) => (res) => res.map(onSuccess, onFailure);
export const mapSuccess = (onSuccess) => (res) => res.mapSuccess(onSuccess);
export const mapFailure = (onFailure) => (res) => res.mapFailure(onFailure);
export const swap = (onSuccess, onFailure) => (res) => res.swap(onSuccess, onFailure);
export const swapSuccess = (onSuccess) => (res) => res.swapSuccess(onSuccess);
export const swapFailure = (onFailure) => (res) => res.swapFailure(onFailure);
export const forkMap = (onSuccess, onFailure) => (res) => res.forkMap(onSuccess, onFailure);
export const forkSuccess = (onSuccess) => (res) => res.forkSuccess(onSuccess);
export const forkFailure = (onFailure) => (res) => res.forkFailure(onFailure);
export const mapAsync = (onSuccess, onFailure) => (res) => res.mapAsync(onSuccess, onFailure);
export const mapSuccessAsync = (onSuccess) => (res) => res.mapSuccessAsync(onSuccess);
export const mapFailureAsync = (onFailure) => (res) => res.mapFailureAsync(onFailure);
export const swapAsync = (onSuccess, onFailure) => (res) => res.swapAsync(onSuccess, onFailure);
export const swapSuccessAsync = (onSuccess) => (res) => res.swapSuccessAsync(onSuccess);
export const swapFailureAsync = (onFailure) => (res) => res.swapFailureAsync(onFailure);
export const forkMapAsync = (onSuccess, onFailure) => (res) => res.forkMapAsync(onSuccess, onFailure);
export const forkSuccessAsync = (onSuccess) => (res) => res.forkSuccessAsync(onSuccess);
export const forkFailureAsync = (onFailure) => (res) => res.forkFailureAsync(onFailure);
export const rpipe = (entry) => pipe(entry);
export const rpipeAsync = (entry) => pipeAsync(entry);
