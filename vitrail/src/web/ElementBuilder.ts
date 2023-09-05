import { Result, success } from "fwd-result";

export const createHTMLElement = <T extends HTMLElement>(target: string | T): () => Result<T,unknown> => 
    typeof target === 'string' ? 
        //create a new element based corresponding to the provided tagName (target)
        () => success(document.createElement(target) as T) : 
        //select the provided element
        () => success(target);






