"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSlot = void 0;
const fwd_pipe_1 = require("fwd-pipe");
const fwd_result_1 = require("fwd-result");
const empty = (0, fwd_pipe_1.pipe)(() => (0, fwd_result_1.success)(undefined));
const useSlot = (builder) => {
    let _builder = (builder == null ? builder : empty);
    return [
        ((p) => { _builder = p; }),
        (() => _builder)
    ];
};
exports.useSlot = useSlot;
