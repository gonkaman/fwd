(()=>{var g=e=>e,p=e=>e===g?e:t=>t===g?e:p(o=>t(e(o)));var f=e=>e(g),r=e=>t=>(e(t),t),A=e=>r(typeof e=="function"?t=>{t.nodeValue=e(t.nodeValue)}:t=>{t.nodeValue=e}),L=(...e)=>r(t=>f(e.reduce((o,d)=>o(typeof d=="string"?A(d):d),p(()=>document.createTextNode("")))(r(o=>t.append(o))))(void 0)),i=e=>(...t)=>r(o=>f(t.reduce((d,l)=>d(typeof l=="string"?L(l):l),p(()=>document.createElement(e)))(r(d=>o.append(d))))(void 0)),q=i("section"),y=i("a"),E=i("button"),c=i("div"),S=i("form"),j=i("h2"),P=i("h3"),a=i("input"),V=i("label"),m=i("span"),n=e=>s("class",e),C=e=>r(t=>e(()=>t)),R=()=>{let e=()=>{};return[t=>{e=t},()=>e()]},D=()=>{let e=[];return[t=>e.push(t),()=>e.reduce((t,o)=>t.concat(o()),[])]},b=(e,...t)=>r(o=>e(()=>t.reduce((d,l)=>d.concat(l(o)),[]))),F=(e,t)=>typeof e=="string"?()=>t(document.querySelector(e)):()=>t(e),s=(e,t)=>r(t===void 0?o=>o.removeAttribute(e):typeof t=="function"?o=>o.setAttribute(e,t(o.getAttribute(e))):o=>o.setAttribute(e,t)),N=(e,t)=>r(t===void 0?o=>{o[e]=null}:typeof t=="function"?o=>{o[e]=t(o[e])}:o=>{o[e]=t}),h=(e,t)=>o=>[[t||e,o[e]]],u=(e,t)=>r(t===void 0?o=>{o.style[e]=null}:typeof t=="function"?o=>{o.style[e]=t(o.style[e])}:o=>{o.style[e]=t}),O=(e,t,o)=>r(d=>d.addEventListener(e,t,o)),B=(e,t)=>O("click",e,t),w=e=>N("textContent",e),[x,G]=D(),[H,k]=R(),K=f(p(k)(u("display","block"))(u("color","green"))(u("border","1px solid green"))(w("Authentication OK"))),M=f(p(k)(u("display","block"))(u("color","red"))(u("border","1px solid red"))(w("Authentication failed!"))),Q=f(p(G)(e=>Object.fromEntries(e))(e=>e.username=="admin"&&e.password=="admin"?K(void 0):M(void 0))),T=F("#app-root",q(n("ftco-section"),c(n("container"),c(n("row justify-content-center"),c(n("col-md-6 text-center mb-5"),j(n("heading-section"),"Login #08")))),c(n("row justify-content-center"),c(n("col-md-6 col-lg-5"),c(n("login-wrap p-4 p-md-5"),c(n("icon d-flex align-items-center justify-content-center"),m(n("fa fa-user-o"))),P("Have an account?"),S(n("login-form"),s("action","#"),c(n("form-group"),a(n("form-control rounded-left"),s("type","text"),s("required","true"),s("placeholder","Username"),b(x,h("value","username")))),c(n("form-group d-flex"),a(n("form-control rounded-left"),s("type","password"),s("required","true"),s("placeholder","Password"),b(x,h("value","password")))),c(n("form-group d-md-flex"),c(n("w-50"),V(n("checkbox-wrap checkbox-primary"),m("Remember Me"),a(s("type","checkbox"),s("checked","true"),m(n("checkmark"))))),c(n("w-50 text-md-right"),y("Forgot Password",s("href","#")))),c(n("form-group d-md-flex"),c(n("text-md-center"),y(u("display","none"),C(H)))),c(n("form-group"),E("Get Started",n("btn btn-primary rounded submit p-3 px-5"),s("type","submit"),B(()=>Q(void 0))))))))));T();})();
