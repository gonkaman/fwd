import { PipeBuilder, pipe } from "fwd-pipe"

import { success } from "fwd-result"



const empty: PipeBuilder<unknown, unknown> = pipe(() => success(undefined));

export type SlotGetter<T,E> = () => PipeBuilder<T,E>

export type SlotSetter<T,E> = (builder: PipeBuilder<T,E>) => void

export const useSlot = <T,E>(builder?: PipeBuilder<T,E>): [SlotSetter<T,E>, SlotGetter<T,E>] => {
    let _builder: PipeBuilder<T,E> = (builder == null ? builder : empty) as PipeBuilder<T,E>;
    return [
        ((p: PipeBuilder<T,E>) => { _builder = p; }),
        (() => _builder)
    ]
}