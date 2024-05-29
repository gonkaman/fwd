//serenia --html <html_source_files | url> --directory <output_dir> --clone --translate-stylesheets <lib_file>
//serenia --prune <keys> --file <source_files> <lib_file>
//serenia <lib_file>





type ElementEntry = {
    tagName: string,
    isEmpty: boolean,
    isCustom: boolean,
    isText: boolean,
    attrs: [string, string, boolean][],
    childs: number[],
    parent?: number,
    index: number,
    value: string
}

type RegularKeyMap = Record<string, Record<string,string>>;

const createNewToken = (index: number, parent?: number): ElementEntry => {
    return { index: index, tagName: "", isEmpty: false, isCustom: false, isText: false, parent: parent, childs: [], attrs: [], value: "" };
}

const isBlank = (char: string): boolean => /\s/g.test(char);

const parseHtmlSource = (source: string): ElementEntry[] => {
    const empty_tags: string[] = ["empty_tags"];
    const regular_keys: string[] = ["regular_keys"];
    const elements: ElementEntry[] = [];
    ///states
    const s_start = "start";
    const s_opening_tag = "opening_tag";
    const s_reading_tagName = "reading_tagName";
    const s_tagName_read = "tagName_read";
    const s_reading_attr = "reading_attr";
    const s_assigning_attr = "assigning_attr";
    const s_reading_attr_value = "reading_attr_value";
    const s_reading_attr_sqvalue = "reading_attr_sqvalue";
    const s_reading_attr_dqvalue = "reading_attr_dqvalue";
    const s_tag_opened = "tag_opened";
    const s_closing_tag = "closing_tag";
    const s_close_tagName_read = "s_close_tagName_read";
    const s_reading_text = "reading_text";
    const s_reading_comment = "reading_comment";

    let state = s_start, index = 0, token = createNewToken(0), cc = source[index], can = "", cav="", close_tagName = "";

    while(index < source.length){
        switch(state){
            case s_start:
                if(cc === '<'){
                    state = s_opening_tag;
                }else{
                    state = s_reading_text;
                    token.isText = true;
                    token.value += cc;
                }
                break;
            case s_opening_tag:
                if(cc === '/'){
                    state = s_closing_tag;
                }else if(cc === '!' && source[index+1] === '-' && source[index+2] === '-'){
                    state = s_reading_comment;
                    index+=2;
                }else if(!isBlank(cc)){
                    state = s_reading_tagName;
                    token.tagName += cc;
                }
                break;
            case s_reading_tagName:
                if(cc === '>'){
                    if(empty_tags.indexOf(token.tagName) >= 0){
                        state = s_start;
                        token.isEmpty = true;
                        // token.isCustom = regular_keys.indexOf(token.tagName) < 0;
                        elements.push(token);
                        if(token.parent != null){
                            elements[token.parent].childs.push(elements.length - 1);
                        }
                        token = createNewToken(elements.length, token.parent);
                    }else{
                        state = s_tag_opened;
                        // token.isCustom = regular_keys.indexOf(token.tagName) < 0;
                        elements.push(token);
                        if(token.parent != null){
                            elements[token.parent].childs.push(elements.length - 1);
                        }
                        token = createNewToken(elements.length - 1);
                    }
                }else if(!isBlank(cc)){
                    token.tagName += cc;
                }else{
                    state = s_tagName_read;
                }
                break;
            case s_tagName_read:
                if(cc === '>'){
                    if(empty_tags.indexOf(token.tagName) >= 0){
                        state = s_start;
                        token.isEmpty = true;
                        // token.isCustom = regular_keys.indexOf(token.tagName) < 0;
                        elements.push(token);
                        if(token.parent != null){
                            elements[token.parent].childs.push(elements.length - 1);
                        }
                        token = createNewToken(elements.length, token.parent);
                    }else{
                        state = s_tag_opened;
                        // token.isCustom = regular_keys.indexOf(token.tagName) < 0;
                        elements.push(token);
                        if(token.parent != null){
                            elements[token.parent].childs.push(elements.length - 1);
                        }
                        token = createNewToken(elements.length, elements.length - 1);
                    }
                }else if(!isBlank(cc) && cc !== '/'){
                    state = s_reading_attr;
                    can += cc;
                }
                break;
            case s_reading_attr:
                if(isBlank(cc)){
                    state = s_tagName_read;
                    // token.attrs.push([can, can, regular_keys.indexOf(can) < 0]);
                    can = '';
                }else if(cc === '='){
                    state = s_assigning_attr;
                }else{
                    can += cc;
                }
                break;
            case s_assigning_attr:
                if(cc === '"'){
                    state = s_reading_attr_dqvalue;
                }else if(cc === "'"){
                    state = s_reading_attr_sqvalue;
                }else if(!isBlank(cc)){
                    state = s_reading_attr_value;
                    cav += cc;
                }
                break;
            case s_reading_attr_sqvalue:
                if(cc === "'" && source[index-1] != "\\"){
                    state = s_tagName_read;
                    // token.attrs.push([can, cav, regular_keys.indexOf(can) < 0]);
                    can = '';
                    cav = '';
                }else{
                    cav += cc;
                }
                break;
            case s_reading_attr_dqvalue:
                if(cc === '"' && source[index-1] != "\\"){
                    state = s_tagName_read;
                    // token.attrs.push([can, cav, regular_keys.indexOf(can) < 0]);
                    can = '';
                    cav = '';
                }else{
                    cav += cc;
                }
                break;
            case s_reading_attr_value:
                if(isBlank(cc)){
                    state = s_tagName_read;
                    // token.attrs.push([can, cav, regular_keys.indexOf(can) < 0]);
                    can = '';
                    cav = '';
                }else{
                    cav += cc;
                }
                break;
            case s_tag_opened:
                if(cc === '<'){
                    state = s_opening_tag;
                }else if(!isBlank(cc)){
                    state = s_reading_text;
                    token.isText = true;
                    token.value += cc;
                }
                break;
            case s_reading_text:
                if(cc === '<'){
                    state = s_opening_tag;
                    elements.push(token);
                    if(token.parent != null){
                        elements[token.parent].childs.push(elements.length - 1);
                    }
                    token = createNewToken(elements.length, token.parent);
                }else{
                    token.value += cc;
                }
                break;
            case s_closing_tag:
                if(cc === '>'){
                    state = s_start;
                    if(token.parent){
                        if(elements[token.parent].tagName === close_tagName){
                            token = createNewToken(elements.length, elements[token.parent].parent);
                        }
                    }
                    close_tagName = '';
                }else if(!isBlank(cc)){
                    close_tagName += cc;
                }else{
                    state = s_close_tagName_read;
                }
                break;
            case s_close_tagName_read:
                if(cc === '>'){
                    state = s_start;
                    if(token.parent){
                        if(elements[token.parent].tagName === close_tagName){
                            token = createNewToken(elements.length, elements[token.parent].parent);
                        }
                    }
                    close_tagName = '';
                }
                break;
            case s_reading_comment:
                if(cc === '-' && source[index+1] === '-' && source[index+2] === '>'){
                    state = s_start;
                    index+=2;
                }
                break;
            default:
                break;
        }
        index++;
        cc = source[index];
    }
    return elements;
}




const getElementScript = (entrySet: ElementEntry[], entry: ElementEntry, context: string): [string[], string[]] => {

    if(entry.isText) return [[`text("${entry.value.replace('"','\\"')}")`],["text"]];

    const import_list: string[] = [], lines: string[] = [];

    const currentContext = entry.tagName.toLowerCase() === "svg" ? 
        "svg" : 
        (entry.tagName.toLowerCase() === "math" ? 
            "mathml" :
            context)

    let main_line: string = "";
    if(entry.isCustom){
        main_line+= `element(["${entry.tagName}", "${currentContext}"]`;
        import_list.push("element");
    }else{
        main_line+= `${entry.tagName}(`;
        import_list.push(entry.tagName);
    }

    entry.attrs.forEach(attr => {
        if(attr[2]){ //is custom attribute
            main_line+=`, setAttr("${attr[0]}", "${attr[1]}")`;
            import_list.push("setAttr");
        }else{
            main_line+=`, ${attr[0]}("${attr[1]}")`;
            import_list.push(attr[0]);
        }
    })

    if(entry.isEmpty || entry.childs.length == 0){
        main_line+= ")";
        lines.push(main_line);
    }else{
        main_line+= entry.childs.length > 0 ? "," : "";
        lines.push(main_line);
        entry.childs.forEach(child => {
            const childScript = getElementScript(entrySet, entrySet[child], currentContext);
            childScript[0].forEach((line, index) => lines.push(
                "\t"+line+(index == childScript[0].length-1 ? "" : ",")
            ));
            childScript[1].forEach(key => import_list.push(key));
        });
        lines.push(`)`);
    }
    
    return [lines,import_list];
}

const generate_script = (entries: ElementEntry[], libPath: string): string => {
    const script = entries.filter(entry => entry.parent == null)
            .reduce((acc: [string, string[]], entry, index) => {
                const eltScript = getElementScript(entries, entry, "html");
                acc[0]+= `const branch${index+1} = ${eltScript[0].join("\n")};\n`;
                eltScript[1].forEach(key => {
                    if(acc[1].indexOf(key) < 0) acc[1].push(key);
                })
                return acc;
            }, ["",[]]);

    return `import { ${script[1].join(", ")} } from "${libPath}";\n\n${script[0]}`;
}
