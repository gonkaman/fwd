import { Result, success } from "fwd-result";
import { forkSuccess, RPipeEntry } from "fwd-result-pipe";

// const loginPage = section(
//     attr('className', "ftco-section"),
//     div(
//         attr('className','container'),
//         div(
//             attr('className','row justify-content-center'),
//             div(
//                 attr('className','col-md-6 text-center mb-5'),
//                 h2(
//                     attrMap({
//                         className: 'heading-section',
//                         textContent: "Login #08" 
//                     }),
// 		    createAdapter(
// 			resultingAdapter => handle(resultingAdapter), //handler ---> spotSetter
// 			adapter1, adapter1, adapter1, ... //effect
// 		    ),
// 		    createQuery(
// 			resultingQuery => handle(resultingQuery), //handler ----> spotSetter
// 			query1, query2, query3, ...//query
// 		    )
//                 )
//             )
//         )
//     )
// )


// query = [r<t,e>, [key, value][]] => [r<t,e>, [key, value][]]

// query = [t, [key, value][]] => [t, [key, value][]]

// (elt => [key, value][])

// [declareLoginData, collectLoginData] = useQuery()

// getUsername = declareLoginData('username')
// getPassword = declareLoginData('password')

// getLoginData = declare('loginData')



export const render = <T extends Element,E>(target: T | string, update: RPipeEntry<T,E,T,E>) => typeof target === 'string' ?
    () => update(success(document.querySelector(target) as T)) :
    () => update(success(target as T));


// export type Adapter<TBase> = <T extends TBase, E>(...args: any) => RPipeEntry<T,E,T,E>;

//Adapter<EventTarget>
export const subscribe = <T extends EventTarget,E>(
    eventType: string, 
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): RPipeEntry<T,E,T,E> =>
    forkSuccess<T,E>(elt => elt.addEventListener(eventType, listener, options));

//Adapter<EventTarget>
export const subscribeMap = <T extends EventTarget,E>(
    listenerMap: Record<string, EventListenerOrEventListenerObject | {
                    listener: EventListenerOrEventListenerObject,
                    options?: boolean | AddEventListenerOptions
                }>
): RPipeEntry<T,E,T,E> => {
    const updaters = Object.entries(listenerMap).map(
        entry => typeof entry[1] === 'function' ?
            (elt: EventTarget) => elt.addEventListener(entry[0], entry[1] as EventListener) :
            (
                typeof entry[1]['handleEvent'] === 'function' ?
                (elt: EventTarget) => elt.addEventListener(entry[0], entry[1] as EventListenerObject) :
                (elt: EventTarget) => elt.addEventListener(
                    entry[0], 
                    entry[1]['listener'] as EventListenerOrEventListenerObject,
                    entry[1]['options'] as boolean | AddEventListenerOptions
                ) 
            )
    );
    return (res: Result<T,E>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

//Adapter<EventTarget>
export const unsubscribe = <T extends EventTarget,E>(
    eventType: string, 
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
): RPipeEntry<T,E,T,E> =>
    forkSuccess<T,E>(elt => elt.removeEventListener(eventType, listener, options));

//Adapter<EventTarget>
export const unsubscribeMap = <T extends EventTarget,E>(
    listenerMap: Record<string, EventListenerOrEventListenerObject | {
                    listener: EventListenerOrEventListenerObject,
                    options?: boolean | AddEventListenerOptions
                }>
): RPipeEntry<T,E,T,E> => {
    const updaters = Object.entries(listenerMap).map(
        entry => typeof entry[1] === 'function' ?
            (elt: EventTarget) => elt.removeEventListener(entry[0], entry[1] as EventListener) :
            (
                typeof entry[1]['handleEvent'] === 'function' ?
                (elt: EventTarget) => elt.removeEventListener(entry[0], entry[1] as EventListenerObject) :
                (elt: EventTarget) => elt.removeEventListener(
                    entry[0], 
                    entry[1]['listener'] as EventListenerOrEventListenerObject,
                    entry[1]['options'] as boolean | AddEventListenerOptions
                ) 
            )
    );
    return (res: Result<T,E>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

//Adapter<EventTarget>
export const dispatch = <T extends EventTarget,E>(event: Event): RPipeEntry<T,E,T,E> =>
    forkSuccess<T,E>(elt => elt.dispatchEvent(event));




//Adapter<Element>
export const attach = <T extends Element,E>(
    target: T | string
): RPipeEntry<T,E,T,E> => 
    typeof target === 'string' ?
        forkSuccess<T,E>(elt => document.querySelector(target)?.append(elt)) :
        forkSuccess<T,E>(elt => target.append(elt));

//Adapter<Element>
export const dettach = <T extends Element,E>(): RPipeEntry<T,E,T,E> => 
        forkSuccess<T,E>(elt => elt.remove());

//Adapter<Element>
export const attr = <T extends Element,E>(
    name: string,
    value: string | ((previousValue: string | null) => string)
): RPipeEntry<T,E,T,E> => 
    typeof value === 'function' ?
        forkSuccess<T,E>(elt => elt.setAttribute(name, value(elt.getAttribute(name)))) :
        forkSuccess<T,E>(elt => elt.setAttribute(name, value));

//Adapter<Element>
export const attrMap  = <T extends Element,E>(
    attributes: Record<string, E>
): RPipeEntry<T,E, T,E> => {
    const updaters = Object.entries(attributes).map(
        entry => typeof entry[1] === 'function' ?
            (elt: Element) => elt.setAttribute(
                entry[0], 
                (entry[1] as ((currentValue: string | null) => string))(elt.getAttribute(entry[0]))
            ) :
            (elt: Element) => elt.setAttribute(entry[0], entry[1]+"")
    );
    return (res: Result<T,E>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

//Adapter<Element>
export const removeAttr = <T extends Element,E>(name: string): RPipeEntry<T,E, T,E> => 
    forkSuccess<T,E>(elt => elt.removeAttribute(name));

//Adapter<Element>
export const removeAttrMap  = <T extends Element,E>(
    attributes: string[]
): RPipeEntry<T,E, T,E> => {
    const updaters = attributes.map(attr => (elt: Element) => elt.removeAttribute(attr));
    return (res: Result<T,E>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

//Adapter<Element>
export const aria = <T extends Element,E>(
    name: string,
    value: string | ((previousValue: string | null) => string)
): RPipeEntry<T,E, T,E> => 
    typeof value === 'function' ?
        forkSuccess<T,E>(elt => elt.setAttribute('aria-'+name, value(elt.getAttribute('aria-'+name)))) :
        forkSuccess<T,E>(elt => elt.setAttribute('aria-'+name, value));

//Adapter<Element>
export const ariaMap = <T extends Element,E>(
    attributes: Record<string, E>
): RPipeEntry<T,E, T,E> => {
    const updaters = Object.entries(attributes).map(
        entry => typeof entry[1] === 'function' ?
            (elt: Element) => elt.setAttribute(
                'aria-'+entry[0], 
                (entry[1] as ((currentValue: string | null) => string))(elt.getAttribute('aria-'+entry[0]))
            ) :
            (elt: Element) => elt.setAttribute('aria-'+entry[0], entry[1]+"")
    );
    return (res: Result<T,E>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

//Adapter<Element>
export const removeAria = <T extends Element,E>(name: string): RPipeEntry<T,E, T,E> => 
    forkSuccess<T,E>(elt => elt.removeAttribute('aria-'+name));

//Adapter<Element>
export const removeAriaMap = <T extends Element,E>(
    attributes: string[]
): RPipeEntry<T,E, T,E> => {
    const updaters = attributes.map(attr => (elt: Element) => elt.removeAttribute('aria-'+attr));
    return (res: Result<T,E>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}




//Adapter<HTMLElement>
export const dataAttr = <T extends HTMLElement, E>(
    name: string,
    value: string | ((previousValue: string | null) => string)
): RPipeEntry<T,E, T,E> => 
    typeof value === 'function' ?
        forkSuccess<T,E>(elt => { elt.dataset[name] = value(elt.getAttribute(name)); }) :
        forkSuccess<T,E>(elt => { elt.dataset[name] = value; });

//Adapter<HTMLElement>
export const dataMap = <T extends HTMLElement, E>(
    attributes: Record<string, E>
): RPipeEntry<T,E, T,E> => {
    const updaters = Object.entries(attributes).map(
        entry => typeof entry[1] === 'function' ?
            (elt: HTMLElement) => {
                elt.dataset[entry[0]] = (entry[1] as ((currentValue: string | undefined) => string))(elt.dataset[entry[0]]); 
            } :
            (elt: HTMLElement) => elt.setAttribute(entry[0], entry[1]+"")
    );
    return (res: Result<T,E>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

//Adapter<HTMLElement>
export const removeDataAttr = <T extends HTMLElement, E>(name: string): RPipeEntry<T,E, T,E> => 
    forkSuccess<T,E>(elt => {delete elt.dataset[name];} );

export const removeDataMap = <T extends HTMLElement, E>(
    attributes: string[]
): RPipeEntry<T,E, T,E> => {
    const updaters = attributes.map(name => (elt: HTMLElement) => {delete elt.dataset[name];});
    return (res: Result<T,E>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

//Adapter<HTMLElement>
export const styleAttr = <T extends HTMLElement, E>(
    name: string,
    value: string | ((previousValue: string | null) => string)
): RPipeEntry<T,E, T,E> => 
    typeof value === 'function' ?
        forkSuccess<T,E>(elt => { elt.style[name] = value(elt.getAttribute(name)); }) :
        forkSuccess<T,E>(elt => elt.setAttribute(name, value));

//Adapter<HTMLElement>
export const cssText = <T extends HTMLElement, E>(
    css: string
): RPipeEntry<T,E, T,E> => 
    forkSuccess<T,E>(elt => {elt.style.cssText = css;})

//Adapter<HTMLElement>
export const styleMap = <T extends HTMLElement, E>(
    attributes: Record<string, E>
): RPipeEntry<T,E, T,E> => {
    const updaters = Object.entries(attributes).map(
        entry => typeof entry[1] === 'function' ?
            (elt: HTMLElement) => elt.style[entry[0]] =
                (entry[1] as ((currentValue: string) => string))(elt.style[entry[0]]) :
            (elt: HTMLElement) => elt.style[entry[0]] = entry[1]+""
    );
    return (res: Result<T,E>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}

//Adapter<HTMLElement>
export const removeStyleAttr = <T extends HTMLElement, E>(name: string): RPipeEntry<T,E, T,E> => 
    forkSuccess<T,E>(elt => { elt.style[name] = null; });

//Adapter<HTMLElement>
export const removeStyleMap = <T extends HTMLElement, E>(
    attributes: string[]
): RPipeEntry<T,E, T,E> => {
    const updaters = attributes.map(name => (elt: HTMLElement) => { elt.style[name] = null; });
    return (res: Result<T,E>) => {
        updaters.forEach(updater => res.forkSuccess(updater));
        return res;
    }
}
