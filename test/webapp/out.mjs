(()=>{var m=o=>o,u=o=>o===m?o:e=>e===m?o:u(n=>e(o(n)));var p=o=>o(m);var c=o=>e=>(o(e),e);var v=o=>c(typeof o=="function"?e=>{e.nodeValue=o(e.nodeValue)}:e=>{e.nodeValue=o}),w=(...o)=>c(e=>p(o.reduce((n,i)=>n(typeof i=="string"?v(i):i),u(()=>document.createTextNode("")))(c(n=>e.append(n))))(void 0)),t=o=>(...e)=>c(n=>p(e.reduce((i,l)=>i(typeof l=="string"?w(l):l),u(()=>document.createElement(o)))(c(i=>n.append(i))))(void 0)),G=t("address"),H=t("article"),Q=t("aside"),R=t("b"),W=t("em"),z=t("footer"),J=t("header"),X=t("hgroup"),Y=t("i"),Z=t("nav"),$=t("s"),C=t("section"),h=t("a"),tt=t("area"),ot=t("audio"),et=t("br"),nt=t("base"),L=t("button"),st=t("canvas"),ct=t("data"),rt=t("datalist"),dt=t("dialog"),r=t("div"),it=t("dl"),at=t("embed"),ut=t("fieldset"),E=t("form"),lt=t("hr"),pt=t("head"),ft=t("h1"),M=t("h2"),S=t("h3"),gt=t("h4"),mt=t("h5"),ht=t("h6"),yt=t("iframe"),bt=t("img"),f=t("input"),xt=t("li"),q=t("label"),kt=t("legend"),At=t("link"),vt=t("map"),wt=t("menu"),Ct=t("meter"),Lt=t("del"),Et=t("ins"),Mt=t("ol"),St=t("object"),qt=t("optgroup"),Dt=t("option"),Pt=t("output"),Tt=t("p"),jt=t("picture"),It=t("pre"),Ft=t("progress"),Ot=t("q"),Kt=t("blockquote"),Vt=t("cite"),Ut=t("select"),_t=t("slot"),Bt=t("source"),g=t("span"),Nt=t("caption"),Gt=t("th"),Ht=t("td"),Qt=t("col"),Rt=t("colgroup"),Wt=t("table"),zt=t("tr"),Jt=t("thead"),Xt=t("tfoot"),Yt=t("tbody"),Zt=t("template"),$t=t("textarea"),to=t("time"),oo=t("title"),eo=t("track"),no=t("ul"),so=t("video");var s=o=>d("class",o);var D=o=>c(e=>o(()=>e)),P=()=>{let o=()=>{};return[e=>{o=e},()=>o()]},T=()=>{let o=[];return[e=>o.push(e),()=>o.reduce((e,n)=>e.concat(n()),[])]},y=(o,...e)=>c(n=>o(()=>e.reduce((i,l)=>i.concat(l(n)),[])));var j=(o,...e)=>typeof o=="string"?()=>e.forEach(n=>n(document.querySelector(o))):()=>e.forEach(n=>n(o));var d=(o,e)=>c(e===void 0?n=>n.removeAttribute(o):typeof e=="function"?n=>n.setAttribute(o,e(n.getAttribute(o))):n=>n.setAttribute(o,e));var I=(o,e)=>c(e===void 0?n=>{n[o]=null}:typeof e=="function"?n=>{n[o]=e(n[o])}:n=>{n[o]=e});var b=(o,e)=>n=>[[e||o,n[o]]];var a=(o,e)=>c(e===void 0?n=>{n.style[o]=null}:typeof e=="function"?n=>{n.style[o]=e(n.style[o])}:n=>{n.style[o]=e});var F=(o,e,n)=>c(i=>i.addEventListener(o,e,n));var O=(o,e)=>F("click",o,e);var k=o=>I("textContent",o);var[x,K]=T(),[V,A]=P(),U=p(u(A)(a("display","block"))(a("color","green"))(a("border","1px solid green"))(k("Authentication OK"))),_=p(u(A)(a("display","block"))(a("color","red"))(a("border","1px solid red"))(k("Authentication failed!"))),B=p(u(K)(o=>Object.fromEntries(o))(o=>o.username=="admin"&&o.password=="admin"?U(void 0):_(void 0))),N=j("#app-root",C(s("ftco-section"),r(s("container"),r(s("row justify-content-center"),r(s("col-md-6 text-center mb-5"),M(s("heading-section"),"Login #08")))),r(s("row justify-content-center"),r(s("col-md-6 col-lg-5"),r(s("login-wrap p-4 p-md-5"),r(s("icon d-flex align-items-center justify-content-center"),g(s("fa fa-user-o"))),S("Have an account?"),E(s("login-form"),d("action","#"),r(s("form-group"),f(s("form-control rounded-left"),d("type","text"),d("required","true"),d("placeholder","Username"),y(x,b("value","username")))),r(s("form-group d-flex"),f(s("form-control rounded-left"),d("type","password"),d("required","true"),d("placeholder","Password"),y(x,b("value","password")))),r(s("form-group d-md-flex"),r(s("w-50"),q(s("checkbox-wrap checkbox-primary"),g("Remember Me"),f(d("type","checkbox"),d("checked","true"),g(s("checkmark"))))),r(s("w-50 text-md-right"),h("Forgot Password",d("href","#")))),r(s("form-group d-md-flex"),r(s("text-md-center"),h(a("display","none"),D(V)))),r(s("form-group"),L("Get Started",s("btn btn-primary rounded submit p-3 px-5"),d("type","submit"),O(()=>B(void 0))))))))));N();})();
