"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forkAsync = exports.fork = exports.flow = exports.resolve = exports.pipeAsync = exports.pipe = void 0;
const pipeEnd = (arg) => arg;
const pipe = (init) => {
    if (init === pipeEnd)
        return init;
    return (entry) => entry === pipeEnd ?
        init :
        (0, exports.pipe)((arg) => entry(init(arg)));
};
exports.pipe = pipe;
const pipeAsync = (init) => {
    if (init === pipeEnd)
        return init;
    return (entry, onRejected) => entry === pipeEnd ?
        init :
        (0, exports.pipeAsync)((arg) => Promise.resolve(init(arg)).then(value => entry(value), onRejected));
};
exports.pipeAsync = pipeAsync;
const resolve = (builder) => builder(pipeEnd);
exports.resolve = resolve;
const flow = (init, ...entries) => (0, exports.resolve)(entries.reduce((p, entry) => p(entry), (0, exports.pipe)(init)));
exports.flow = flow;
const fork = (handle) => (arg) => { handle(arg); return arg; };
exports.fork = fork;
const forkAsync = (handle) => (arg) => { handle(arg); return arg; };
exports.forkAsync = forkAsync;
