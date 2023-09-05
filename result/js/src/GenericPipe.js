const pipeEnd = (arg) => arg;
const pipe = (init) => {
    if (init === pipeEnd)
        return init;
    return (entry) => entry === pipeEnd ?
        init :
        pipe((arg) => entry(init(arg)));
};
const resolve = (builder) => builder(pipeEnd);
const add1 = (n) => {
    const res = n + 1;
    console.log("called add1 to " + n + " => " + res);
    return res;
};
const add3 = (n) => {
    const res = n + 3;
    console.log("called add3 to " + n + " => " + res);
    return res;
};
const mult2 = (n) => {
    const res = n * 2;
    console.log("called mult2 to " + n + " => " + res);
    return res;
};
const minus9 = (n) => {
    const res = n - 9;
    console.log("called minus9 to " + n + " => " + res);
    return res;
};
const process = resolve(pipe(add1)(add3)(mult2)(minus9)(console.log));
console.log("\nProcessing for 6:");
process(6);
console.log("\nProcessing for 10:");
process(10);
console.log("\nProcessing for 0:");
process(0);
console.log("\nProcessing for 5:");
process(5);
