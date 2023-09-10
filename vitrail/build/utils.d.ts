import { PipeBuilder } from "fwd-pipe";
export type SlotGetter<T, E> = () => PipeBuilder<T, E>;
export type SlotSetter<T, E> = (builder: PipeBuilder<T, E>) => void;
export declare const useSlot: <T, E>(builder?: PipeBuilder<T, E>) => [SlotSetter<T, E>, SlotGetter<T, E>];
