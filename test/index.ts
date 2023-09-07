import { pipe, resolve } from "fwd-pipe";

function add1(n: number): number{
    const res = n+1;
    console.log("called add1 with "+n+" ==> "+res);
    return res;
}

function add3(n: number): number{
    const res = n+3;
    console.log("called add3 with "+n+" ==> "+res);
    return res;
}

function mult5(n: number): number{
    const res = n*5;
    console.log("called mult5 with "+n+" ==> "+res);
    return res;
}

function minus11(n: number): number{
    const res = n-11;
    console.log("called minus11 with "+n+" ==> "+res);
    return res;
}

const process = resolve(pipe(add1)(add3)(mult5)(minus11)(console.log));

console.log("\nProcess for 2:");
process(2);

console.log("\nProcess for 10:");
process(10);

console.log("\nProcess for 7:");
process(7);