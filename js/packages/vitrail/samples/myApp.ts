import { a, className, getElement, nav, prepend, render, setAttr, div, text } from "./myLib"


const mainView = nav(className("site-nav"), div(
    className("trigger"), 
    a(
        className("page-link"), 
        setAttr("href","/blog/"), 
        text("Blog")
    ),
    a(
        className("page-link"), 
        setAttr("href","https://docs.genieacs.com/"), 
        setAttr("target", "_blank"),
        text("Docs")
    ),
    a(
        className("page-link"), 
        setAttr("href","https://forum.genieacs.com/"), 
        setAttr("target", "_blank"),
        text("Community")
    ),
    a(
        className("page-link"), 
        setAttr("href","/support/"), 
        text("Support")
    )
)); 



const renderApp = render<HTMLElement,Document>(
    getElement("body", document), 
    prepend(mainView)
);

renderApp();