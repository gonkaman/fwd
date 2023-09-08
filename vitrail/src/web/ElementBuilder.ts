import { Result, failure, isResultInstance, success } from "fwd-result";
import { PipeEntry, pipe, resolve } from "fwd-pipe";

export const createHTMLElement = <T extends HTMLElement>(target: string | T): () => Result<T,unknown> => 
    typeof target === 'string' ? 
        //create a new element based corresponding to the provided tagName (target)
        () => success(document.createElement(target) as T) : 
        //select the provided element
        () => success(target);


type ElementBuilderArg<T extends Element, TParent extends Element, E> = T | string | Result<TParent, E> | undefined;

type ElementBuilderReturn<T extends Element, TParent extends Element, E> = T extends Result<TParent, E> ? Result<TParent, E> : Result<T, E>;

type ElementBuilderEntry<T extends Element, TParent extends Element, E> = PipeEntry<ElementBuilderArg<T, TParent, E>, ElementBuilderReturn<T, TParent, E>>;

type ElementBuilder<T extends Element, E> = <TParent extends Element>(...args: (ElementBuilderEntry<T, TParent, E> | ElementBuilderEntry<any, T, E>)[]) => ElementBuilderEntry<T, any, E>;


const getHTMLElementContructor = <T extends HTMLElement, E>(tagName: string): () => Result<T,E> => {
    if(!getHTMLElementContructor[tagName]) 
        getHTMLElementContructor[tagName] = () => success(document.createElement(tagName));

    return getHTMLElementContructor[tagName];
}

const querySelectElement = <T extends HTMLElement, E>(querySelector: string): Result<T,E> =>{
    const element = document.querySelector(querySelector);
    if(element == null) return failure("" as E);
    return success(element as T);
}

const createHTMLElementBuilder = <T extends HTMLElement, E>(tagName: string): ElementBuilder<T, E> => {
    return (...entries: (ElementBuilderEntry<T, any, E> | ElementBuilderEntry<any, T, E>)[]): ElementBuilderEntry<T, any, E> => {
        return (arg: ElementBuilderArg<T, any, E>): ElementBuilderReturn<T, any, E> => {
            if(isResultInstance(arg)){
                
            }else{

            }
            //if arg is result
            //else

        }
        //get constructor
        //pipe(constructor)
        //entries.forEach(entry => pipe = pipe(entry))
        //return res => resolve(pipe)(res)
    } 
}

