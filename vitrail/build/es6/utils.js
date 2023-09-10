import { pipe } from "fwd-pipe";
import { success } from "fwd-result";
const empty = pipe(() => success(undefined));
export const useSlot = (builder) => {
    let _builder = (builder == null ? builder : empty);
    return [
        ((p) => { _builder = p; }),
        (() => _builder)
    ];
};
