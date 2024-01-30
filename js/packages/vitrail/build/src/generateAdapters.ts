

//template, name, key, targetType, constraints, parameters
type AdapterData = [string, string, string, string, any, any];

const getActionParams = (args: any): string => {
    if(args == null) return '';
    return (args as [string, string][]).map(entry => entry[0]+': '+entry[1]).join(', ');
};
const getActionInputs = (args: any): string => {
    if(args == null) return '';
    return (args as [string, string][]).map(entry => entry[0]).join(', ');
};

const templates: Record<string, (data: AdapterData) => string> = {
    adapter: (data: AdapterData) => `export const ${data[1]} = createDOMAdapter<
    ${data[4][1]+''}, Document, 
    ${data[3]}, Document, 
    ${data[4][2]+''}, Document, 
    ${data[4][2] === undefined ? 'undefined' : 'string'}
>('${data[2]}', ${data[4][0]}ElementFactory, ${data[4][2] === undefined ? 'noConnector' : 'appendConnector'}, formatAdapterArgs);`,


    prop: (data: AdapterData) => (data[4] != null ? `export const ${data[1]} = <T extends ${data[3]}, U extends Document>(value: PropertyValueType): NodeTask<T,U> => set${data[4] === false ? 'Attr' : 'Prop'}('${data[2]}', value);
`: '') + `export const get${data[1][0].toUpperCase() + data[1].slice(1)} = <T extends ${data[3]}, U extends Document>(key?: string): Filter<[T,U],[string, unknown][]> => get${data[4] === false ? 'Attr' : 'Prop'}('${data[2]}',key);`,


    action: (data: AdapterData) => `export const ${data[1]} = <T extends ${data[3]}, U extends Document>(${getActionParams(data[4])}): NodeTask<T,U> => [
        (entry: [T,U]) => {
            entry[0].${data[2]}(${getActionInputs(data[4])});
            return entry;
        }
    ];`
};

const adapters : AdapterData[] = [
    //adapters (element/tag)
    //[template, name, key, target,[type, parentConstraint, childConstraint], meta]

    //html adapters
    ['adapter','a','a','HTMLAnchorElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','abbr','abbr','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','address','address','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','area','area','HTMLAreaElement',['html','HTMLElement',undefined],undefined],
    ['adapter','article','article','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','aside','aside','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','audio','audio','HTMLAudioElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','b','b','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','base','base','HTMLBaseElement',['html','HTMLElement',undefined],undefined],
    ['adapter','bdi','bdi','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','bdo','bdo','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','blockquote','blockquote','HTMLQuoteElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','body','body','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','br','br','HTMLBRElement',['html','HTMLElement',undefined],undefined],
    ['adapter','button','button','HTMLButtonElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','canvas','canvas','HTMLCanvasElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','caption','caption','HTMLTableCaptionElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','cite','cite','HTMLQuoteElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','code','code','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','col','col','HTMLTableColElement',['html','HTMLTableColElement',undefined],undefined],
    ['adapter','colgroup','colgroup','HTMLTableColElement',['html','HTMLTableElement','HTMLTableColElement'],undefined],
    ['adapter','data','data','HTMLDataElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','datalist','datalist','HTMLDataListElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','dd','dd','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','del','del','HTMLModElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','details','details','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','dfn','dfn','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','dialog','dialog','HTMLDialogElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','div','div','HTMLDivElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','dl','dl','HTMLDListElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','dt','dt','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','em','em','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','embed','embed','HTMLEmbedElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','fieldset','fieldset','HTMLFieldSetElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','figcaption','figcaption','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','figure','figure','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','footer','footer','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','form','form','HTMLFormElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','h1','h1','HTMLHeadingElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','h2','h2','HTMLHeadingElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','h3','h3','HTMLHeadingElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','h4','h4','HTMLHeadingElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','h5','h5','HTMLHeadingElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','h6','h6','HTMLHeadingElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','head','head','HTMLHeadElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','header','header','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','hgroup','hgroup','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','hr','hr','HTMLHRElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','html','html','HTMLElement',['html',undefined,'HTMLElement | Text'],undefined],
    ['adapter','i','i','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','iframe','iframe','HTMLIFrameElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','img','img','HTMLImageElement',['html','HTMLElement',undefined],undefined],
    ['adapter','input','input','HTMLInputElement',['html','HTMLElement',undefined],undefined],
    ['adapter','ins','ins','HTMLModElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','kbd','kbd','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','label','label','HTMLLabelElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','legend','legend','HTMLLegendElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','li','li','HTMLLIElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','link','link','HTMLLinkElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','main','main','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','mark','mark','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','menu','menu','HTMLMenuElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','meta','meta','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','meter','meter','HTMLMeterElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','nav','nav','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','noscript','noscript','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','object','object','HTMLObjectElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','ol','ol','HTMLOListElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','optgroup','optgroup','HTMLOptGroupElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','option','option','HTMLOptionElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','output','output','HTMLOutputElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','p','p','HTMLParagraphElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','param','param','HTMLParagraphElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','picture','picture','HTMLPictureElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','pre','pre','HTMLPreElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','progress','progress','HTMLProgressElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','q','q','HTMLQuoteElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','rp','rp','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','rt','rt','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','ruby','ruby','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','s','s','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','samp','samp','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','script','script','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','search','search','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','section','section','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','select','select','HTMLSelectElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','htmlslot','slot','HTMLSlotElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','small','small','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','source','source','HTMLSourceElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','span','span','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','strong','strong','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','style','style','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','sub','sub','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','summary','summary','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','sup','sup','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','table','table','HTMLTableElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','tbody','tbody','HTMLTableSectionElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','td','td','HTMLTableCellElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','template','template','HTMLTemplateElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','textarea','textarea','HTMLTextAreaElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','tfoot','tfoot','HTMLTableSectionElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','th','th','HTMLTableCellElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','thead','thead','HTMLTableSectionElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','time','time','HTMLTimeElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','htmltitle','title','HTMLTitleElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','tr','tr','HTMLTableRowElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','track','track','HTMLTrackElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','u','u','HTMLTrackElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','ul','ul','HTMLUListElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','htmlvar','var','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','video','video','HTMLVideoElement',['html','HTMLElement','HTMLElement | Text'],undefined],
    ['adapter','wbr','wbr','HTMLElement',['html','HTMLElement','HTMLElement | Text'],undefined],

    //svg adapters

    //mathml adapters


    //properties
    //[template, name, key, target, writeAsProp, meta]
    ['prop','id','id','Element', false, undefined],
    ['prop','title','title','HTMLElement', false, undefined],
    ['prop','tabIndex','tabIndex','HTMLElement', false, undefined],
    ['prop','lang','lang','HTMLElement', false, undefined],
    ['prop','dir','dir','HTMLElement', false, undefined],
    ['prop','accesskey','accesskey','Element', false, undefined],
    ['prop','autocapitalize','autocapitalize','Element', false, undefined],
    ['prop','autofocus','autofocus','Element', false, undefined],
    ['prop','contenteditable','contenteditable','Element', false, undefined],
    ['prop','draggable','draggable','HTMLElement', false, undefined],
    ['prop','enterkeyhint','enterkeyhint','Element', false, undefined],
    ['prop','exportparts','exportparts','Element', false, undefined],
    ['prop','hidden','hidden','Element', false, undefined],
    ['prop','inert','inert','Element', false, undefined],
    ['prop','inputmode','inputmode','Element', false, undefined],
    ['prop','is','is','Element', false, undefined],
    ['prop','itemid','itemid','HTMLElement', false, undefined],
    ['prop','itemprop','itemprop','HTMLElement', false, undefined],
    ['prop','itemref','itemref','HTMLElement', false, undefined],
    ['prop','itemscope','itemscope','HTMLElement', false, undefined],
    ['prop','itemtype','itemtype','HTMLElement', false, undefined],
    ['prop','nonce','nonce','Element', false, undefined],
    ['prop','part','part','Element', false, undefined],
    ['prop','popover','popover','Element', false, undefined],
    ['prop','slot','slot','Element', false, undefined],
    ['prop','spellcheck','spellcheck','Element', false, undefined],
    ['prop','translate','translate','Element', false, undefined],
    ['prop','accept','accept','HTMLInputElement', false, undefined],
    ['prop','autocomplete','autocomplete','HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLFormElement', false, undefined],
    ['prop','capture','capture','HTMLInputElement', false, undefined],
    ['prop','crossorigin','crossorigin','HTMLElement', false, undefined],
    ['prop','dirname','dirname','HTMLInputElement | HTMLTextAreaElement', false, undefined],
    ['prop','disabled','disabled','HTMLElement', false, undefined],
    ['prop','elementtiming','elementtiming','HTMLElement', false, undefined],
    ['prop','$for','$for','HTMLLabelElement | HTMLOutputElement', false, undefined],
    ['prop','max','max','HTMLElement', false, undefined],
    ['prop','min','min','HTMLElement', false, undefined],
    ['prop','maxlength','maxlength','HTMLInputElement | HTMLTextAreaElement', false, undefined],
    ['prop','minlength','minlength','HTMLInputElement | HTMLTextAreaElement', false, undefined],
    ['prop','multiple','multiple','HTMLInputElement | HTMLSelectElement', false, undefined],
    ['prop','pattern','pattern','HTMLInputElement', false, undefined],
    ['prop','placeholder','placeholder','HTMLInputElement', false, undefined],
    ['prop','readonly','readonly','HTMLInputElement | HTMLTextAreaElement', false, undefined],
    ['prop','rel','rel','HTMLAnchorElement | HTMLAreaElement | HTMLLinkElement | HTMLFormElement', false, undefined],
    ['prop','required','required','HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement', false, undefined],
    ['prop','size','size','HTMLInputElement | HTMLSelectElement', false, undefined],
    ['prop','step','step','HTMLInputElement', false, undefined],
    ['prop','type','type','HTMLInputElement', false, undefined],
    ['prop','className','class','Element', false, undefined],

    ['prop','nodeValue','nodeValue','Node', true, undefined],
    ['prop','textContent','textContent','Node', true, undefined],
    ['prop','innerHTML','innerHTML','Element', true, undefined],
    ['prop','outerHTML','outerHTML','Element', true, undefined],

    ['prop','nodeName','nodeName','Node', undefined, undefined],
    ['prop','nodeType','nodeType','Node', undefined, undefined],
    ['prop','clientHeight','clientHeight','Element', undefined, undefined],
    ['prop','clientLeft','clientLeft','Element', undefined, undefined],
    ['prop','clientTop','clientTop','Element', undefined, undefined],
    ['prop','clientWidth','clientWidth','Element', undefined, undefined],
    ['prop','tagName','tagName','Element', undefined, undefined],



    //events


    //actions
    //[template, name, callPath, target, [...[paramName, paramType]], meta]
    ['action','addClass','classList.add','Element', [['name','string']], undefined],
    ['action','removeClass','classList.remove','Element', [['name','string']], undefined],
    ['action','toggleClass','classList.toggle','Element', [['name','string']], undefined],



];


console.log(adapters.map(data => templates[data[0]](data)).join("\n\n"));


