import { div, id, h2, text, render, getElement, prepend} from "./myLib"

const mainView = div(id("main"), 
    h2(text("Hello, World!"))
); 

const renderApp = render<HTMLElement,Document>(
    getElement("body", document), 
    prepend(mainView)
);

renderApp();