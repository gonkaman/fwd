import { pipe, resolve } from "fwd-pipe";

function add1(n){
    const res = n+1;
    console.log("called add1 with "+n+" ==> "+res);
    return res;
}

function add3(n){
    const res = n+3;
    console.log("called add3 with "+n+" ==> "+res);
    return res;
}

function mult5(n){
    const res = n*5;
    console.log("called mult5 with "+n+" ==> "+res);
    return res;
}

function minus11(n){
    const res = n-11;
    console.log("called minus11 with "+n+" ==> "+res);
    return res;
}

function logProcess(n){
    console.log("\nProcess for "+n+":");
    return n;
}

function logResult(n){
    console.log("Result: "+n);
    return n;
}

const process = resolve(
    pipe(logProcess)(add1)(add3)(mult5)(minus11)(logResult)
);

process(2);
process(10);
process(7);
process(-30);
process(30);