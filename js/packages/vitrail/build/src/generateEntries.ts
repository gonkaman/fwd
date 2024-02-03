
const getEntries = (data: [string, string, string, string, any]): [string, any][] => {
    
    if(data[0] === "adapter") return [[data[1], {
        "template":"adapter",
        "key": data[2],
        "type": (data[4][0]+'').toUpperCase(),
        "target": data[3],
        "parent": data[4][1],
        "childs": data[4][2]
    }]];

    if(data[0] === "prop"){
        const res: [string, any][] = [];
        if(data[4] != null){
            res.push([data[1], {
                "template":"property",
                "key": data[2],
                "type": data[4] === false ? 'Attr' : 'Prop',
                "target": data[3]
            }]);
        }
        res.push(['get'+data[1][0].toUpperCase()+data[1].slice(1), {
            "template":"query",
            "key": data[2],
            "type": data[4] === false ? 'Attr' : 'Prop',
            "target": data[3]
        }]);
        return res;
    }

    if(data[0] === "action") return [[data[1], {
        "template":"action",
        "target": data[3],
        "callPath": data[2],
        "arguments": data[4]
    }]];

    if(data[0] === "event") return [[data[1], {
        "template":"event",
        "key": data[2],
        "target": data[3]
    }]];

    return [];
}


const dataArr : [string, string, string, string, any][] = [
    //adapters (element/tag)
    //[template, name, key, target,[type, parentConstraint, childConstraint]]

    //html adapters
    ['adapter','a','a','HTMLAnchorElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','abbr','abbr','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','address','address','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','area','area','HTMLAreaElement',['html','HTMLElement',undefined]],
    ['adapter','article','article','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','aside','aside','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','audio','audio','HTMLAudioElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','b','b','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','base','base','HTMLBaseElement',['html','HTMLElement',undefined]],
    ['adapter','bdi','bdi','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','bdo','bdo','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','blockquote','blockquote','HTMLQuoteElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','body','body','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','br','br','HTMLBRElement',['html','HTMLElement',undefined]],
    ['adapter','button','button','HTMLButtonElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','canvas','canvas','HTMLCanvasElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','caption','caption','HTMLTableCaptionElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','cite','cite','HTMLQuoteElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','code','code','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','col','col','HTMLTableColElement',['html','HTMLTableColElement',undefined]],
    ['adapter','colgroup','colgroup','HTMLTableColElement',['html','HTMLTableElement','HTMLTableColElement']],
    ['adapter','data','data','HTMLDataElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','datalist','datalist','HTMLDataListElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','dd','dd','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','del','del','HTMLModElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','details','details','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','dfn','dfn','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','dialog','dialog','HTMLDialogElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','div','div','HTMLDivElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','dl','dl','HTMLDListElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','dt','dt','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','em','em','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','embed','embed','HTMLEmbedElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','fieldset','fieldset','HTMLFieldSetElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','figcaption','figcaption','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','figure','figure','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','footer','footer','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','form','form','HTMLFormElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','h1','h1','HTMLHeadingElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','h2','h2','HTMLHeadingElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','h3','h3','HTMLHeadingElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','h4','h4','HTMLHeadingElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','h5','h5','HTMLHeadingElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','h6','h6','HTMLHeadingElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','head','head','HTMLHeadElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','header','header','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','hgroup','hgroup','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','hr','hr','HTMLHRElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','html','html','HTMLElement',['html',undefined,'HTMLElement | Text']],
    ['adapter','i','i','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','iframe','iframe','HTMLIFrameElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','img','img','HTMLImageElement',['html','HTMLElement',undefined]],
    ['adapter','input','input','HTMLInputElement',['html','HTMLElement',undefined]],
    ['adapter','ins','ins','HTMLModElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','kbd','kbd','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','label','label','HTMLLabelElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','legend','legend','HTMLLegendElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','li','li','HTMLLIElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','link','link','HTMLLinkElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','main','main','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','mark','mark','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','menu','menu','HTMLMenuElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','meta','meta','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','meter','meter','HTMLMeterElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','nav','nav','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','noscript','noscript','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','object','object','HTMLObjectElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','ol','ol','HTMLOListElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','optgroup','optgroup','HTMLOptGroupElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','option','option','HTMLOptionElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','output','output','HTMLOutputElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','p','p','HTMLParagraphElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','param','param','HTMLParagraphElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','picture','picture','HTMLPictureElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','pre','pre','HTMLPreElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','progress','progress','HTMLProgressElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','q','q','HTMLQuoteElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','rp','rp','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','rt','rt','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','ruby','ruby','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','s','s','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','samp','samp','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','script','script','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','search','search','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','section','section','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','select','select','HTMLSelectElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','htmlslot','slot','HTMLSlotElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','small','small','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','source','source','HTMLSourceElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','span','span','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','strong','strong','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','style','style','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','sub','sub','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','summary','summary','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','sup','sup','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','table','table','HTMLTableElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','tbody','tbody','HTMLTableSectionElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','td','td','HTMLTableCellElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','template','template','HTMLTemplateElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','textarea','textarea','HTMLTextAreaElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','tfoot','tfoot','HTMLTableSectionElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','th','th','HTMLTableCellElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','thead','thead','HTMLTableSectionElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','time','time','HTMLTimeElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','htmltitle','title','HTMLTitleElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','tr','tr','HTMLTableRowElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','track','track','HTMLTrackElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','u','u','HTMLTrackElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','ul','ul','HTMLUListElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','htmlvar','var','HTMLElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','video','video','HTMLVideoElement',['html','HTMLElement','HTMLElement | Text']],
    ['adapter','wbr','wbr','HTMLElement',['html','HTMLElement','HTMLElement | Text']],

    //svg adapters

    //mathml adapters


    //properties
    //[template, name, key, target, writeAsProp]
    ['prop','id','id','Element', false],
    ['prop','title','title','HTMLElement', false],
    ['prop','tabIndex','tabIndex','HTMLElement', false],
    ['prop','lang','lang','HTMLElement', false],
    ['prop','dir','dir','HTMLElement', false],
    ['prop','accesskey','accesskey','Element', false],
    ['prop','autocapitalize','autocapitalize','Element', false],
    ['prop','autofocus','autofocus','Element', false],
    ['prop','contenteditable','contenteditable','Element', false],
    ['prop','draggable','draggable','HTMLElement', false],
    ['prop','enterkeyhint','enterkeyhint','Element', false],
    ['prop','exportparts','exportparts','Element', false],
    ['prop','hidden','hidden','Element', false],
    ['prop','inert','inert','Element', false],
    ['prop','inputmode','inputmode','Element', false],
    ['prop','is','is','Element', false],
    ['prop','itemid','itemid','HTMLElement', false],
    ['prop','itemprop','itemprop','HTMLElement', false],
    ['prop','itemref','itemref','HTMLElement', false],
    ['prop','itemscope','itemscope','HTMLElement', false],
    ['prop','itemtype','itemtype','HTMLElement', false],
    ['prop','nonce','nonce','Element', false],
    ['prop','part','part','Element', false],
    ['prop','popover','popover','Element', false],
    ['prop','slot','slot','Element', false],
    ['prop','spellcheck','spellcheck','Element', false],
    ['prop','translate','translate','Element', false],
    ['prop','accept','accept','HTMLInputElement', false],
    ['prop','autocomplete','autocomplete','HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLFormElement', false],
    ['prop','capture','capture','HTMLInputElement', false],
    ['prop','crossorigin','crossorigin','HTMLElement', false],
    ['prop','dirname','dirname','HTMLInputElement | HTMLTextAreaElement', false],
    ['prop','disabled','disabled','HTMLElement', false],
    ['prop','elementtiming','elementtiming','HTMLElement', false],
    ['prop','$for','$for','HTMLLabelElement | HTMLOutputElement', false],
    ['prop','max','max','HTMLElement', false],
    ['prop','min','min','HTMLElement', false],
    ['prop','maxlength','maxlength','HTMLInputElement | HTMLTextAreaElement', false],
    ['prop','minlength','minlength','HTMLInputElement | HTMLTextAreaElement', false],
    ['prop','multiple','multiple','HTMLInputElement | HTMLSelectElement', false],
    ['prop','pattern','pattern','HTMLInputElement', false],
    ['prop','placeholder','placeholder','HTMLInputElement', false],
    ['prop','readonly','readonly','HTMLInputElement | HTMLTextAreaElement', false],
    ['prop','rel','rel','HTMLAnchorElement | HTMLAreaElement | HTMLLinkElement | HTMLFormElement', false],
    ['prop','required','required','HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement', false],
    ['prop','size','size','HTMLInputElement | HTMLSelectElement', false],
    ['prop','step','step','HTMLInputElement', false],
    ['prop','type','type','HTMLInputElement', false],
    ['prop','className','class','Element', false],

    ['prop','nodeValue','nodeValue','Node', true],
    ['prop','textContent','textContent','Node', true],
    ['prop','innerHTML','innerHTML','Element', true],
    ['prop','outerHTML','outerHTML','Element', true],

    ['prop','nodeName','nodeName','Node', undefined],
    ['prop','nodeType','nodeType','Node', undefined],
    ['prop','clientHeight','clientHeight','Element', undefined],
    ['prop','clientLeft','clientLeft','Element', undefined],
    ['prop','clientTop','clientTop','Element', undefined],
    ['prop','clientWidth','clientWidth','Element', undefined],
    ['prop','tagName','tagName','Element', undefined],


    //actions
    //[template, name, callPath, target, [...[paramName, paramType]]]
    ['action','addClass','classList.add','Element', [['name','string']]],
    ['action','removeClass','classList.remove','Element', [['name','string']]],
    ['action','toggleClass','classList.toggle','Element', [['name','string']]],
    ['action','dispatch','dispatchEvent','EventTarget', [['event','Event']]],


    //events
    ['event','onClick','click','EventTarget',undefined],
    ['event','onDbClick','dbclick','EventTarget',undefined],
    ['event','onBlur','blur','EventTarget',undefined],
    ['event','onFocus','focus','EventTarget',undefined],
    ['event','onChange','change','EventTarget',undefined],
    ['event','onMouseDown','mousedown','EventTarget',undefined],
    ['event','onMouseEnter','mouseenter','EventTarget',undefined],
    ['event','onMouseLeave','mouseleave','EventTarget',undefined],
    ['event','onMouseMove','mousemove','EventTarget',undefined],
    ['event','onMouseOut','mouseout','EventTarget',undefined],
    ['event','onMouseOver','mouseover','EventTarget',undefined],
    ['event','onMouseUp','mouseup','EventTarget',undefined],
    ['event','onWheel','wheel','EventTarget',undefined],
    ['event','onScroll','scroll','EventTarget',undefined],
    ['event','onKeyDown','keydown','EventTarget',undefined],
    ['event','onKeypress','keyPress','EventTarget',undefined],
    ['event','onKeyup','keyUp','EventTarget',undefined],
    ['event','onCopy','copy','EventTarget',undefined],
    ['event','onCut','cut','EventTarget',undefined],
    ['event','onPaste','paste','EventTarget',undefined],
    ['event','onSelect','select','EventTarget',undefined],
    ['event','onFocusIn','focusin','EventTarget',undefined],
    ['event','onFocusOut','focusout','EventTarget',undefined],


];



console.log(JSON.stringify(
    Object.fromEntries(
        dataArr.reduce((prev, curr) => prev.concat(getEntries(curr)), [] as [string, any][]),
    ),
    null, 2
));


