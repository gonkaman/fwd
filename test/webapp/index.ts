import { section, div, h2, span, h3, form, input, label, a, button } from "fwd-vitrail/elements"
import { attr, className, createQuery, render,onClick, getProp, createSync, query, style, sync, textContent } from "fwd-vitrail/adapters"
import { resolve, pipe } from "fwd-pipe";


const [loginData, getLoginData] = createQuery();
const [loginResultSync, loginResult] = createSync();

const onLoginSuccess = resolve(
    pipe(loginResult as (() => HTMLElement))
        (style("display","block"))
        (style("color","green"))
        (style("border","1px solid green"))
        (textContent("Authentication OK"))
)

const onLoginFailure = resolve(
    pipe(loginResult as (() => HTMLElement))
        (style("display","block"))
        (style("color","red"))
        (style("border","1px solid red"))
        (textContent("Authentication failed!"))
)

const handleLogin = resolve(
    pipe(getLoginData)
        (entries => Object.fromEntries(entries))
        (data => (data['username'] == 'admin' && data['password'] == 'admin') ? 
            onLoginSuccess(undefined) : 
            onLoginFailure(undefined)
        )
)

const showApp = render('#app-root', 
    section(className('ftco-section'),
        div(className('container'),
            div(className('row justify-content-center'),
                div(className('col-md-6 text-center mb-5'),
                    h2(className('heading-section'), "Login #08")
                )
            )
        ),
        div(className('row justify-content-center'),
            div(className("col-md-6 col-lg-5"),
                div(className("login-wrap p-4 p-md-5"),
                    div(className("icon d-flex align-items-center justify-content-center"),
                        span(className("fa fa-user-o"))
                    ),
                    h3("Have an account?"),
                    form(className("login-form"), attr("action","#"),
                        div(className("form-group"),
                            input(
                                className("form-control rounded-left"),
                                attr("type", "text"),
                                attr("required", "true"),
                                attr("placeholder", "Username"),
                                query(loginData, getProp("value","username"))
                            )
                        ),
                        div(className("form-group d-flex"),
                            input(
                                className("form-control rounded-left"),
                                attr("type", "password"),
                                attr("required", "true"),
                                attr("placeholder", "Password"),
                                query(loginData, getProp("value","password"))
                            )
                        ),
                        div(
                            className("form-group d-md-flex"),
                            div(className("w-50"),
                                label(
                                    className("checkbox-wrap checkbox-primary"),
                                    span("Remember Me"),
                                    input(
                                        attr("type","checkbox"),
                                        attr("checked", "true"),
                                        span(className("checkmark"))
                                    )
                                )
                            ),
                            div(className("w-50 text-md-right"),
                                a("Forgot Password", attr("href","#"))
                            )
                        ),
                        div(
                            className("form-group d-md-flex"),
                            div(className("text-md-center"),
                                a(
                                    style("display", "none"),
                                    sync(loginResultSync)
                                )
                            )
                        ),
                        div(className("form-group"),
                            button(
                                "Get Started", 
                                className("btn btn-primary rounded submit p-3 px-5"), 
                                attr("type", "submit"),
                                onClick(() => handleLogin(undefined))
                            )
                        )
                    )
                )
            )
        )
    )
);

showApp();