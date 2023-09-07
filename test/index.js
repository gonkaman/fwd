"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fwd_pipe_1 = require("fwd-pipe");
function add1(n) {
    const res = n + 1;
    console.log("called add1 with " + n + " ==> " + res);
    return res;
}
function add3(n) {
    const res = n + 3;
    console.log("called add3 with " + n + " ==> " + res);
    return res;
}
function mult5(n) {
    const res = n * 5;
    console.log("called mult5 with " + n + " ==> " + res);
    return res;
}
function minus11(n) {
    const res = n - 11;
    console.log("called minus11 with " + n + " ==> " + res);
    return res;
}
const process = (0, fwd_pipe_1.resolve)((0, fwd_pipe_1.pipe)(add1)(add3)(mult5)(minus11)(console.log));
console.log("\nProcess for 2:");
process(2);
console.log("\nProcess for 10:");
process(10);
console.log("\nProcess for 7:");
process(7);
