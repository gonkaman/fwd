const htmlComposers = [
    //html elements
    ['a','a','HTMLElement','HTMLAnchorElement'],
    ['abbr','abbr','HTMLElement','HTMLElement'],
    ['address','address','HTMLElement','HTMLElement'],
    ['area','area','HTMLElement','HTMLAreaElement'],
    ['article','article','HTMLElement','HTMLElement'],
    ['aside','aside','HTMLElement','HTMLElement'],
    ['audio','audio','HTMLElement','HTMLAudioElement'],
    ['b','b','HTMLElement','HTMLElement'],
    ['base','base','HTMLElement','HTMLBaseElement'],
    ['bdi','bdi','HTMLElement','HTMLElement'],
    ['bdo','bdo','HTMLElement','HTMLElement'],
    ['blockquote','blockquote','HTMLElement','HTMLQuoteElement'],
    ['body','body','HTMLElement','HTMLElement'],
    ['br','br','HTMLElement','HTMLBRElement'],
    ['button','button','HTMLElement','HTMLButtonElement'],
    ['canvas','canvas','HTMLElement','HTMLCanvasElement'],
    ['caption','caption','HTMLElement','HTMLTableCaptionElement'],
    ['cite','cite','HTMLElement','HTMLQuoteElement'],
    ['code','code','HTMLElement','HTMLElement'],
    ['col','col','HTMLElement','HTMLTableColElement'],
    ['colgroup','colgroup','HTMLElement','HTMLTableColElement'],
    ['data','data','HTMLElement','HTMLDataElement'],
    ['datalist','datalist','HTMLElement','HTMLDataListElement'],
    ['dd','dd','HTMLElement','HTMLElement'],
    ['del','del','HTMLElement','HTMLModElement'],
    ['details','details','HTMLElement','HTMLElement'],
    ['dfn','dfn','HTMLElement','HTMLElement'],
    ['dialog','dialog','HTMLElement','HTMLDialogElement'],
    ['div','div','HTMLElement','HTMLDivElement'],
    ['dl','dl','HTMLElement','HTMLDListElement'],
    ['dt','dt','HTMLElement','HTMLElement'],
    ['em','em','HTMLElement','HTMLElement'],
    ['embed','embed','HTMLElement','HTMLEmbedElement'],
    ['fieldset','fieldset','HTMLElement','HTMLFieldSetElement'],
    ['figcaption','figcaption','HTMLElement','HTMLElement'],
    ['figure','figure','HTMLElement','HTMLElement'],
    ['footer','footer','HTMLElement','HTMLElement'],
    ['form','form','HTMLElement','HTMLFormElement'],
    ['h1','h1','HTMLElement','HTMLHeadingElement'],
    ['h2','h2','HTMLElement','HTMLHeadingElement'],
    ['h3','h3','HTMLElement','HTMLHeadingElement'],
    ['h4','h4','HTMLElement','HTMLHeadingElement'],
    ['h5','h5','HTMLElement','HTMLHeadingElement'],
    ['h6','h6','HTMLElement','HTMLElement'],
    ['head','head','HTMLElement','HTMLHeadElement'],
    ['header','header','HTMLElement','HTMLElement'],
    ['hgroup','hgroup','HTMLElement','HTMLElement'],
    ['hr','hr','HTMLElement','HTMLHRElement'],
    ['html','html','void','HTMLElement'],
    ['i','i','HTMLElement','HTMLElement'],
    ['iframe','iframe','HTMLElement','HTMLIFrameElement'],
    ['img','img','HTMLElement','HTMLImageElement'],
    ['input','input','HTMLElement','HTMLInputElement'],
    ['ins','ins','HTMLElement','HTMLModElement'],
    ['kbd','kbd','HTMLElement','HTMLElement'],
    ['label','label','HTMLElement','HTMLLabelElement'],
    ['legend','legend','HTMLElement','HTMLLegendElement'],
    ['li','li','HTMLElement','HTMLLIElement'],
    ['link','link','HTMLElement','HTMLLinkElement'],
    ['main','main','HTMLElement','HTMLElement'],
    ['map','map','HTMLElement','HTMLMapElement'],
    ['mark','mark','HTMLElement','HTMLElement'],
    ['menu','menu','HTMLElement','HTMLMenuElement'],
    ['meta','meta','HTMLElement','HTMLElement'],
    ['meter','meter','HTMLElement','HTMLMeterElement'],
    ['nav','nav','HTMLElement','HTMLElement'],
    ['noscript','noscript','HTMLElement','HTMLElement'],
    ['object','object','HTMLElement','HTMLObjectElement'],
    ['ol','ol','HTMLElement','HTMLOListElement'],
    ['optgroup','optgroup','HTMLElement','HTMLOptGroupElement'],
    ['option','option','HTMLElement','HTMLOptionElement'],
    ['output','output','HTMLElement','HTMLOutputElement'],
    ['p','p','HTMLElement','HTMLParagraphElement'],
    ['param','param','HTMLElement','HTMLElement'],
    ['picture','picture','HTMLElement','HTMLPictureElement'],
    ['pre','pre','HTMLElement','HTMLPreElement'],
    ['progress','progress','HTMLElement','HTMLProgressElement'],
    ['q','q','HTMLElement','HTMLQuoteElement'],
    ['rp','rp','HTMLElement','HTMLElement'],
    ['rt','rt','HTMLElement','HTMLElement'],
    ['ruby','ruby','HTMLElement','HTMLElement'],
    ['s','s','HTMLElement','HTMLElement'],
    ['samp','samp','HTMLElement','HTMLElement'],
    ['script','script','HTMLElement','HTMLElement'],
    ['search','search','HTMLElement','HTMLElement'],
    ['section','section','HTMLElement','HTMLElement'],
    ['select','select','HTMLElement','HTMLSelectElement'],
    ['slot','slot','HTMLElement','HTMLSlotElement'],
    ['small','small','HTMLElement','HTMLElement'],
    ['source','source','HTMLElement','HTMLSourceElement'],
    ['span','span','HTMLElement','HTMLSpanElement'],
    ['strong','strong','HTMLElement','HTMLElement'],
    ['style','style','HTMLElement','HTMLElement'],
    ['sub','sub','HTMLElement','HTMLElement'],
    ['summary','summary','HTMLElement','HTMLElement'],
    ['sup','sup','HTMLElement','HTMLElement'],
    ['table','table','HTMLElement','HTMLTableElement'],
    ['tbody','tbody','HTMLElement','HTMLTableSectionElement'],
    ['td','td','HTMLElement','HTMLTableCellElement'],
    ['template','template','HTMLElement','HTMLTemplateElement'],
    ['textarea','textarea','HTMLElement','HTMLTextAreaElement'],
    ['tfoot','tfoot','HTMLElement','HTMLTableSectionElement'],
    ['th','th','HTMLElement','HTMLTableCellElement'],
    ['thead','thead','HTMLElement','HTMLTableSectionElement'],
    ['time','time','HTMLElement','HTMLTimeElement'],
    ['title','title','HTMLElement','HTMLTitleElement'],
    ['tr','tr','HTMLElement','HTMLTableRowElement'],
    ['track','track','HTMLElement','HTMLTrackElement'],
    ['u','u','HTMLElement','HTMLElement'],
    ['ul','ul','HTMLElement','HTMLUListElement'],
    ['var','htmlvar','HTMLElement','HTMLElement'],
    ['video','video','HTMLElement','HTMLVideoElement'],
    ['wbr','wbr','HTMLElement','HTMLElement'],


    //svg element
    ['a','svga','SVGElement','SVGAElement'],
    ['animate','animate','SVGElement','SVGAnimateElement'],
    ['animateMotion','animateMotion','SVGElement','SVGAnimateMotionElement'],
    ['animateTransform','animateTransform','SVGElement','SVGAnimateTransformElement'],
    ['circle','circle','SVGElement','SVGCircleElement'],
    ['clipPath','clipPath','SVGElement','SVGClipPathElement'],
    ['defs','defs','SVGElement','SVGDefsElement'],
    ['desc','desc','SVGElement','SVGDescElement'],
    ['ellipse','ellipse','SVGElement','SVGEllipseElement'],
    ['feBlend','feBlend','SVGElement','SVGFEBlendElement'],
    ['feColorMatrix','feColorMatrix','SVGElement','SVGFEColorMatrixElement'],
    ['feComponentTransfer','feComponentTransfer','SVGElement','SVGFEComponentTransferElement'],
    ['feComposite','feComposite','SVGElement','SVGFECompositeElement'],
    ['feConvolveMatrix','feConvolveMatrix','SVGElement','SVGFEConvolveMatrixElement'],
    ['feDiffuseLighting','feDiffuseLighting','SVGElement','SVGFEDiffuseLightingElement'],
    ['feDisplacementMap','feDisplacementMap','SVGElement','SVGFEDisplacementMapElement'],
    ['feDistantLight','feDistantLight','SVGElement','SVGFEDistantLightElement'],
    ['feDropShadow','feDropShadow','SVGElement','SVGFEDropShadowElement'],
    ['feFlood','feFlood','SVGElement','SVGFEFloodElement'],
    ['feFuncA','feFuncA','SVGElement','SVGFEFuncAElement'],
    ['feFuncB','feFuncB','SVGElement','SVGFEFuncBElement'],
    ['feFuncG','feFuncG','SVGElement','SVGFEFuncGElement'],
    ['feFuncR','feFuncR','SVGElement','SVGFEFuncRElement'],
    ['feGaussianBlur','feGaussianBlur','SVGElement','SVGFEGaussianBlurElement'],
    ['feImage','feImage','SVGElement','SVGFEImageElement'],
    ['feMerge','feMerge','SVGElement','SVGFEMergeElement'],
    ['feMergeNode','feMergeNode','SVGElement','SVGFEMergeNodeElement'],
    ['feMorphology','feMorphology','SVGElement','SVGFEMorphologyElement'],
    ['feOffset','feOffset','SVGElement','SVGFEOffsetElement'],
    ['fePointLight','fePointLight','SVGElement','SVGFEPointLightElement'],
    ['feSpecularLighting','feSpecularLighting','SVGElement','SVGFESpecularLightingElement'],
    ['feSpotLight','feSpotLight','SVGElement','SVGFESpotLightElement'],
    ['feTile','feTile','SVGElement','SVGFETileElement'],
    ['feTurbulence','feTurbulence','SVGElement','SVGFETurbulenceElement'],
    ['filter','filter','SVGElement','SVGFilterElement'],
    ['foreignObject','foreignObject','SVGElement','SVGForeignObjectElement'],
    ['g','g','SVGElement','SVGGElement'],
    ['image','image','SVGElement','SVGImageElement'],
    ['line','line','SVGElement','SVGLineElement'],
    ['linearGradient','linearGradient','SVGElement','SVGLinearGradientElement'],
    ['marker','marker','SVGElement','SVGMarkerElement'],
    ['mask','mask','SVGElement','SVGMaskElement'],
    ['metadata','metadata','SVGElement','SVGMetadataElement'],
    ['mpath','mpath','SVGElement','SVGMPathElement'],
    ['path','path','SVGElement','SVGPathElement'],
    ['pattern','pattern','SVGElement','SVGPatternElement'],
    ['polygon','polygon','SVGElement','SVGPolygonElement'],
    ['polyline','polyline','SVGElement','SVGPolylineElement'],
    ['radialGradient','radialGradient','SVGElement','SVGRadialGradientElement'],
    ['rect','rect','SVGElement','SVGRectElement'],
    ['script','svgscript','SVGElement','SVGScriptElement'],
    ['set','set','SVGElement','SVGSetElement'],
    ['stop','stop','SVGElement','SVGStopElement'],
    ['style','svgstyle','SVGElement','SVGStyleElement'],
    ['svg','svg','SVGElement','SVGSVGElement'],
    ['switch','svgswitch','SVGElement','SVGSwitchElement'],
    ['symbol','svgsymbol','SVGElement','SVGSymbolElement'],
    ['text','svgtext','SVGElement','SVGTextElement'],
    ['textPath','textPath','SVGElement','SVGTextPathElement'],
    ['title','svgtitle','SVGElement','SVGTitleElement'],
    ['tspan','tspan','SVGElement','SVGTSpanElement'],
    ['use','use','SVGElement','SVGUseElement'],
    ['view','view','SVGElement','SVGViewElement']
];
  
console.log(htmlComposers.map(entry => `
export const ${entry[1]} = createComposer<string, Node, ${entry[2]}, ${entry[3]}>(
    getElementFactory('${entry[0]}', ${entry[3].toLowerCase().startsWith('svg')}), elementConverter
);`).join('\n'));

