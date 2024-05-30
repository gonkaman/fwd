import { a, className, getElement, nav, prepend, render, attr, div, textNode, DOMTaskData } from "./myLib"


const mainView = nav(className("site-nav"), 
    div(className("trigger"), 
        a(className("page-link"), attr("href","/blog/"), "Blog"),
        a(
            className("page-link"), 
            attr("href","https://docs.genieacs.com/"), 
            attr("target", "_blank"),
            textNode("Docs")
        ),
        a(
            className("page-link"), 
            attr("href","https://forum.genieacs.com/"), 
            attr("target", "_blank"),
            textNode("Community")
        ),
        a(
            className("page-link"), 
            attr("href","/support/"), 
            textNode("Support")
        )
    )
); 



const renderApp = render(
    getElement("body", document), 
    prepend(mainView)
);

renderApp();