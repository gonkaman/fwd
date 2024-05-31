import { a, className, getElement, nav, prepend, render, attr, div, textNode, adapters } from "./myLib"

const { p, blockquote, h2 } = adapters.html;

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
    ),
    h2("My page title"),
    p("This is a paragraph text", blockquote("Super Citation"))
); 



const renderApp = render(
    getElement("body", document), 
    prepend(mainView)
);

renderApp();