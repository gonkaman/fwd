import { append, appendAll, className, createQuery, createRef, detach, div, fromElement, getElement, getValue, h2, input, 
    li, onChange, onClick, placeholder, prepend, query, ref, render, span, toggleClass, type, ul, value } from "./serenia.ts";

const [todoItemsRef, todoItems] = createRef<HTMLUListElement>();
const [todoInputRef, todoInput] = createRef<HTMLInputElement>();
const [todoInputQueryRef, todoInputQuery] = createQuery();


const todoItem = (task: string) => li(
    task, 
    onClick(e => render(fromElement(e.target as HTMLLIElement), toggleClass("checked"))()),
    span("\u00D7", className("close"),
        onClick(e => render(
            fromElement((e.target as Element).parentElement as HTMLLIElement), 
            detach()
        )())
    )
);

const todoList = div(className("todo-container"),
    div(className("todo-header"),
        h2("My todo list"),
        input(type("text"), placeholder("Next task ..."), 
            query(todoInputQueryRef, getValue()),
            ref(todoInputRef),
            onChange(e => appendNewItem())
        ),
        span(className("todo-add-btn"), "Add", 
            onClick(e => appendNewItem())
        )
    ),
    ul(
        className("todo-items"), 
        ref(todoItemsRef),
        appendAll(...Array.from({ length: 10 }, (_, i) => i + 1).map(
            value => todoItem("Auto generated task "+value)
        ))
    )
);

const appendNewItem = () => {
    const newTask = todoInputQuery("value")+"";
    if(newTask.trim().length == 0) return;
    render(todoItems, prepend(todoItem(newTask)))();
    render(todoInput, value(""))();
}


const renderTodo = render(
    getElement("body", document),
    prepend(todoList)
)

renderTodo();
