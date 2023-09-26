import { PipeEntry } from "fwd-pipe";
import { subscribe } from "./BaseAdapters";

export const onClick = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('click', listener, options);

export const onDbClick = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('dbclick', listener, options);

export const onBlur = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('blur', listener, options);

export const onFocus = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('focus', listener, options);

export const onChange = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('change', listener, options);

export const onMouseDown = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('mousedown', listener, options);

export const onMouseEnter = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('mouseenter', listener, options);

export const onMouseLeave = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('mouseleave', listener, options);

export const onMouseMove = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('mousemove', listener, options);

export const onMouseOut = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('mouseout', listener, options);

export const onMouseOver = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('mouseover', listener, options);

export const onMouseUp = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('mouseup', listener, options);

export const onMouseWheel = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('mousewheel', listener, options);

export const onScroll = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('scroll', listener, options);

export const onKeyDown = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('keydown', listener, options);

export const onKeyPress = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('keypress', listener, options);

export const onKeyUp = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('keyup', listener, options);

export const onCopy = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('copy', listener, options);

export const onCut = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('cut', listener, options);

export const onPaste = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('paste', listener, options);

export const onSelect = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('select', listener, options);

export const onFocusIn = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('focusin', listener, options);

export const onFocusOut = <T extends EventTarget>(
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): PipeEntry<T,T> => subscribe('focusout', listener, options);
