
const generateCode = (htmlString) => {
  
  const supportedTags = [
    'address',  'article', 'aside',      'b',        'em',
    'footer',   'header',  'hgroup',     'i',        'nav',
    's',        'section', 'a',          'area',     'audio',
    'br',       'base',    'button',     'canvas',   'data',
    'datalist', 'dialog',  'div',        'dl',       'embed',
    'fieldset', 'form',    'hr',         'head',     'h1',
    'h2',       'h3',      'h4',         'h5',       'h6',
    'iframe',   'img',     'input',      'li',       'label',
    'legend',   'link',    'map',        'menu',     'meter',
    'del',      'ins',     'ol',         'object',   'optgroup',
    'option',   'output',  'p',          'picture',  'pre',
    'progress', 'q',       'blockquote', 'cite',     'select',
    'slot',     'source',  'span',       'caption',  'th',
    'td',       'col',     'colgroup',   'table',    'tr',
    'thead',    'tfoot',   'tbody',      'template', 'textarea',
    'time',     'title',   'track',      'ul',       'video'
  ];
  
  //https://developer.mozilla.org/en-US/docs/Glossary/Void_element
  const emptyTags = [
    "area", "base",   "br",     "col",  "embed",
    "hr",   "img",    "input",  "link", "meta",
    "para", "source", "track",  "wbr"
  ];
  
  const attributeNameMap = {
    id: 'id', tabIndex: 'tabIndex', lang: 'lang', dir: 'dir',
    class: 'className', title: 'titleAttr'
  }
  
  const getTokens = (htmlStr) => 
    htmlStr.replace(/((<\w+\/?>?)|(<\/\w+>)|(\w(\w|:|-|\.|\(|\)|@|\[|\]|\{|\})*(="[^"]*")?(?=([\s\n]*.*>)))|((?<=>)[^<]+(?=(<\/))))/g, "\n$1\n")
          .split("\n")
          .map(line => line.trim())
          .filter(line => line.length > 0);
  
  const getScript = (tokens) => {
    let element = readElement(tokens, 0);
    const blocs = [element.script];
    const elements = element.elements;
    const adapters = element.adapters;
    while((element.nextIndex < tokens.length - 1)){
      element = readElement(tokens, element.nextIndex);
      blocs.push(element.script);
      element.elements.forEach(elt => {
        if(elements.indexOf(elt) < 0) elements.push(elt);
      })
      element.adapters.forEach(adapter => {
        if(adapters.indexOf(adapter) < 0) adapters.push(adapter);
      })
    }
    return  'import { '+elements.join(', ')+' } from "fwd-vitrail/elements"\n' + 
            'import { '+adapters.join(', ')+' } from "fwd-vitrail/adapters"\n\n' + 
            blocs.map((bloc, index) => 'const view'+index+' = '+bloc).join('\n\n');
  }
  
  const readElement = (tokens, index) => {
    const currentToken = tokens[index];
    let nextIndex = index+1;
  
    if(currentToken.match(/^<\w+/)){
      //get tagName
      const tagName = currentToken.replace(/[<>\/]/g,'');
      const isCustomElement = supportedTags.indexOf(tagName) < 0;
      const hasAttributes = (!currentToken.endsWith('>')) && (['>','/>'].indexOf(tokens[nextIndex]) < 0);
      const elements = [isCustomElement ? 'customElement' : tagName];
      const adapters = [];
      let script = isCustomElement ? 'customElement("'+tagName+'", ' : ( tagName+"(" );
      if(hasAttributes){
        let attr = readAttribute(tokens, nextIndex);
        const attrList = [attr.script];
        adapters.push(attr.adapter);
        while((attr.nextIndex < tokens.length - 1) && (['>','/>'].indexOf(tokens[attr.nextIndex]) < 0)){
          attr = readAttribute(tokens, attr.nextIndex);
          attrList.push(attr.script);
          if(adapters.indexOf(attr.adapter) < 0) adapters.push(attr.adapter);
        }
        script += attrList.join(', ');
        nextIndex = attr.nextIndex;
      }
  
      const endTag = '</'+tagName+'>';
      const hasChilds = (['/>', endTag].indexOf(tokens[nextIndex]) < 0) && (emptyTags.indexOf(tagName) < 0);
      if(['>', '/>', endTag].indexOf(tokens[nextIndex]) >= 0) nextIndex++;
  
      if(hasChilds){
        //assumed composite element, read child elements
        if(tokens[nextIndex] == endTag) 
          return { script: script+')', nextIndex: nextIndex + 1, elements: elements, adapters: adapters };

        let child = readElement(tokens, nextIndex);
        const childList = [child.script];
        child.elements.forEach(element => {
          if(elements.indexOf(element) < 0) elements.push(element);
        });
        child.adapters.forEach(adapter => {
          if(adapters.indexOf(adapter) < 0) adapters.push(adapter);
        });
  
        while((child.nextIndex < tokens.length - 1) && tokens[child.nextIndex] !== endTag){
          child = readElement(tokens, child.nextIndex);
          childList.push(child.script);
          child.elements.forEach(element => {
            if(elements.indexOf(element) < 0) elements.push(element);
          });
          child.adapters.forEach(adapter => {
            if(adapters.indexOf(adapter) < 0) adapters.push(adapter);
          });
        }
  
        script += (hasAttributes ? ',\n' : '\n') + 
                  childList.map(bloc => bloc.split('\n').map(line => '\t'+line).join('\n')).join(',\n') + 
                  '\n';
        nextIndex = child.nextIndex + 1;
      }
  
      return { script: script+')', nextIndex: nextIndex, elements: elements, adapters: adapters };
    }
    
    let text = currentToken;
    while(nextIndex < tokens.length - 1 && (!tokens[nextIndex].match(/^((<\w+)|(<\/\w+))/))){
      text += ' '+tokens[nextIndex];
      nextIndex++;
    }

    return { script: 'text("'+text.replaceAll('"','\\"')+'")', nextIndex: nextIndex, elements: ['text'], adapters: [] };
  }
  
  const readAttribute = (tokens, index) => {
    const name = tokens[index].split('=')[0];
    const value = tokens[index].indexOf("=") < 0 ? '' : tokens[index].replace(name+'="','').slice(0,-1);
    const adapter = attributeNameMap[name] == null ? 'attr' : attributeNameMap[name];
    return {
      script: adapter + (attributeNameMap[name] == null ? '("'+name+'", "'+value+'")' : '("'+value+'")'), 
      nextIndex: index+1,
      adapter: adapter
    };
  }
  
  return getScript(getTokens(htmlString));
}