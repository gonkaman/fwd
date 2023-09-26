const pipeEnd = (arg) => arg;
const pipe = (init) => {
    if (init === pipeEnd)
        return init;
    return (entry) => entry === pipeEnd ?
        init :
        pipe((arg) => entry(init(arg)));
};
const pipeAsync = (init) => {
    if (init === pipeEnd)
        return init;
    return (entry, onRejected) => entry === pipeEnd ?
        init :
        pipeAsync((arg) => Promise.resolve(init(arg)).then(value => entry(value), onRejected));
};
const resolve = (builder) => builder(pipeEnd);
const fork = (handle) => (arg) => { handle(arg); return arg; };

const nodeValue = (value) => typeof value === 'function' ?
    fork(node => { node.nodeValue = value(node.nodeValue); }) :
    fork(node => { node.nodeValue = value; });
const text = (...entries) => {
    return fork((parent) => resolve(entries.reduce((p, entry) => p(typeof entry === 'string' ? nodeValue(entry) : entry), pipe(() => document.createTextNode("")))(fork(elt => parent.append(elt))))(undefined));
};
const createBuilder = (tagName) => {
    return (...entries) => {
        return fork((parent) => resolve(entries.reduce((p, entry) => p(typeof entry === 'string' ? text(entry) : entry), pipe(() => document.createElement(tagName)))(fork(elt => parent.append(elt))))(undefined));
    };
};
const section = createBuilder('section');
const a = createBuilder('a');
const button = createBuilder('button');
const div = createBuilder('div');
const form = createBuilder('form');
const h2 = createBuilder('h2');
const h3 = createBuilder('h3');
const input = createBuilder('input');
const label = createBuilder('label');
const span = createBuilder('span');

const className = (value) => attr('class', value);
const sync = (handle) => fork(target => handle((() => target)));
const createSync = () => {
    let innerEffect = () => undefined;
    return [
        (handle) => { innerEffect = handle; },
        () => innerEffect()
    ];
};
const createQuery = () => {
    const queries = [];
    return [
        query => queries.push(query),
        () => queries.reduce((entries, query) => entries.concat(query()), [])
    ];
};
const query = (handle, ...components) => fork(target => handle(() => components.reduce((entries, query) => entries.concat(query(target)), [])));
const render = (target, update) => typeof target === 'string' ?
    () => update(document.querySelector(target)) :
    () => update(target);
const attr = (name, value) => value === undefined ? fork(elt => elt.removeAttribute(name)) :
    (typeof value === 'function' ?
        fork(elt => elt.setAttribute(name, value(elt.getAttribute(name)))) :
        fork(elt => elt.setAttribute(name, value)));
const prop = (name, value) => value === undefined ? fork(elt => { elt[name] = null; }) :
    (typeof value === 'function' ?
        fork(elt => { elt[name] = value(elt[name]); }) :
        fork(elt => { elt[name] = value; }));
const getProp = (name, key) => (target) => [[key || name, target[name]]];
const style = (name, value) => value === undefined ? fork(elt => { elt.style[name] = null; }) :
    (typeof value === 'function' ?
        fork(elt => { elt.style[name] = value(elt.style[name]); }) :
        fork(elt => { elt.style[name] = value; }));
const subscribe = (eventType, listener, options) => fork(elt => elt.addEventListener(eventType, listener, options));
const onClick = (listener, options) => subscribe('click', listener, options);
const textContent = (value) => prop('textContent', value);
const [loginData, getLoginData] = createQuery();
const [loginResultSync, loginResult] = createSync();
const onLoginSuccess = resolve(pipe(loginResult)(style("display", "block"))(style("color", "green"))(style("border", "1px solid green"))(textContent("Authentication OK")));
const onLoginFailure = resolve(pipe(loginResult)(style("display", "block"))(style("color", "red"))(style("border", "1px solid red"))(textContent("Authentication failed!")));
const handleLogin = resolve(pipe(getLoginData)(entries => Object.fromEntries(entries))(data => (data['username'] == 'admin' && data['password'] == 'admin') ?
    onLoginSuccess(undefined) :
    onLoginFailure(undefined)));
const showApp = render('#app-root', section(className('ftco-section'), div(className('container'), div(className('row justify-content-center'), div(className('col-md-6 text-center mb-5'), h2(className('heading-section'), "Login #08")))), div(className('row justify-content-center'), div(className("col-md-6 col-lg-5"), div(className("login-wrap p-4 p-md-5"), div(className("icon d-flex align-items-center justify-content-center"), span(className("fa fa-user-o"))), h3("Have an account?"), form(className("login-form"), attr("action", "#"), div(className("form-group"), input(className("form-control rounded-left"), attr("type", "text"), attr("required", "true"), attr("placeholder", "Username"), query(loginData, getProp("value", "username")))), div(className("form-group d-flex"), input(className("form-control rounded-left"), attr("type", "password"), attr("required", "true"), attr("placeholder", "Password"), query(loginData, getProp("value", "password")))), div(className("form-group d-md-flex"), div(className("w-50"), label(className("checkbox-wrap checkbox-primary"), span("Remember Me"), input(attr("type", "checkbox"), attr("checked", "true"), span(className("checkmark"))))), div(className("w-50 text-md-right"), a("Forgot Password", attr("href", "#")))), div(className("form-group d-md-flex"), div(className("text-md-center"), a(style("display", "none"), sync(loginResultSync)))), div(className("form-group"), button("Get Started", className("btn btn-primary rounded submit p-3 px-5"), attr("type", "submit"), onClick(() => handleLogin(undefined))))))))));
showApp();
