const pipeEnd = (arg) => arg;
export const pipe = (init) => {
    if (init === pipeEnd)
        return init;
    return (entry) => entry === pipeEnd ?
        init :
        pipe((arg) => entry(init(arg)));
};
export const pipeAsync = (init) => {
    if (init === pipeEnd)
        return init;
    return (entry, onRejected) => entry === pipeEnd ?
        init :
        pipeAsync((arg) => Promise.resolve(init(arg)).then(value => entry(value), onRejected));
};
export const resolve = (builder) => builder(pipeEnd);
export const flow = (init, ...entries) => resolve(entries.reduce((p, entry) => p(entry), pipe(init)));
export const fork = (handle) => (arg) => { handle(arg); return arg; };
export const forkAsync = (handle) => (arg) => { handle(arg); return arg; };
