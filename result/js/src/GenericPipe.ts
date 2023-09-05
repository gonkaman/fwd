
type PipeEntry<U,V> = (arg: U) => V

type PipeBuilder<U,V> = <T>(entry: PipeEntry<V,T>) => PipeBuilder<U,T>

const pipeEnd = <U>(arg: U): U => arg;

const pipe = <U,V>(init: PipeEntry<U,V>): PipeBuilder<U,V> => {
    if(init === pipeEnd) return (init as unknown) as PipeBuilder<U,V>;
    return <T>(entry: PipeEntry<V,T>): PipeBuilder<U,T> => 
        entry === pipeEnd ?
        (init as unknown) as PipeBuilder<U,T>:
        pipe((arg: U) => entry(init(arg)));
}

const resolve = <U,V>(builder: PipeBuilder<U,V>): PipeEntry<U,V> =>
    (builder(pipeEnd) as unknown) as PipeEntry<U,V>;




const add1 = (n: number): number => {
    const res = n+1;
    console.log("called add1 to "+n+" => "+res);
    return res;
}
const add3 = (n: number): number => {
    const res = n+3;
    console.log("called add3 to "+n+" => "+res);
    return res;
}
const mult2 = (n: number): number => {
    const res = n*2;
    console.log("called mult2 to "+n+" => "+res);
    return res;
}
const minus9 = (n: number): number => {
    const res = n-9;
    console.log("called minus9 to "+n+" => "+res);
    return res;
}

const process = resolve(pipe(add1)(add3)(mult2)(minus9)(console.log));
console.log("\nProcessing for 6:");
process(6);
console.log("\nProcessing for 10:");
process(10);
console.log("\nProcessing for 0:");
process(0);
console.log("\nProcessing for 5:");
process(5);