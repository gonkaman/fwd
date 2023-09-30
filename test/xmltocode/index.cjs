const convert = require("xml-js");
const fs = require('fs');
path = require('path');

function generateCodeFromHTML(htmlText){
    const ast = convert.xml2js(htmlText, {compact: false, spaces: 4});
    return ast["elements"].map(eltData => generateElementCode(eltData))
    .filter(entry => entry.length > 0)
    .map(
        (code, index) => "const view"+index+" = "+code
    ).join("\n\n");
}

function generateElementCode(data){
    if(["element","text"].indexOf(data['type']) < 0) return "";
    if(data['type'] == 'text') return "text('"+data['text'].replace(/'/g,'\\\'')+"')";
    let result = data["name"].indexOf('-') >= 0 ? ('customElement("'+data["name"]+'", ') : data["name"]+"(";
    if(data["attributes"]){
        result+= Object.entries(data["attributes"])
            .map(attr => getAttributeAdapter(attr[0], attr[1]))
            .join(", ");
    }
    if(data["elements"]){
        result += (data["attributes"] != null ? "," : "")+"\n"+data["elements"].map(
            eltData => generateElementCode(eltData).split("\n").map(line => "\t"+line).join("\n")
        ).join(",\n")+"\n";
    }
    result+=")";    
    return result;
}


function getAttributeAdapter(name, value){
    if(name == 'class') return 'className("'+value+'")';
    if(["title","data"].indexOf(name) >= 0) return name+'Attr("'+value+'")';
    if(["id","tabIndex","lang","dir"].indexOf(name) >= 0) return name+'("'+value+'")';
    return 'attr("'+name+'","'+value+'")';
}

const formatHTML = (htmlStr) => 
    Array.from(htmlStr.matchAll(/<(area|base|br|col|embed|hr|img|input|link|meta|para|source|track|wbr)(\s\w*(=".*")?)*>/g))
        .map(item => [item[0], item[0].slice(0,-1)+"/>"])
        .reduce((output, entry) => output.replace(entry[0], entry[1]), htmlStr);


if(process.argv[2]){
    fs.readFile(process.argv[2], {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            fs.writeFile("./code.js", generateCodeFromHTML(formatHTML(data)), function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
        }else{
            console.log(err);
        }
    })
}
