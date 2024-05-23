const source = `
import {
    Component
  } from '@angular2/core';
  import defaultMember from "module-name";
  import   *    as name from "module-name  ";
  import   {  member }   from "  module-name";
  import { member as alias } from "module-name";
  import { member1 , member2 } from "module-name";
  import { member1 , member2 as alias2 , member3 as alias3 } from "module-name";
  import {
    Component
  } from '@angular2/core';
  import defaultMember from "$module-name";
  import defaultMember, { member, member } from "module-name";
  import defaultMember, * as name from "module-name";
  
  import   *    as name from "module-name  "
  import   {  member }   from "  module-name"
  import { member as alias } from "module-name"
  import { member1 , member2 } from "module-name"
  import { member1 , member2 as alias2 , member3 as alias3 } from "module-name"
  import {
    Component
  } from '@angular2/core'
  import defaultMember from "$module-name"
  import defaultMember, { member, member } from "module-name"
  import defaultMember, * as name from "module-name"
  
  import "module-name";
  import React from "react"
  import { Field } from "redux-form"
  import "module-name";
  
  import {
      PlaneBufferGeometry,
      OctahedronGeometry,
      TorusBufferGeometry
  } from '../geometries/Geometries.js';
  
  import {
      PlaneBufferGeometry,
      OctahedronGeometry,
      TorusBufferGeometry
  } from '../geometries/Geometries.js'
  
  import("whatever.js");
  import("whatever.js")
  
  import { Field } from "redux-form";
  import MultiContentListView from "./views/ListView";
  import MultiContentAddView from "./views/AddView";
  import MultiContentEditView from "./views/EditView";
  
  import { Field } from "redux-form"
  import MultiContentListView from "./views/ListView"
  import MultiContentAddView from "./views/AddView"
  import MultiContentEditView from "./views/EditView"
  
  
  <MenuItem value="^$" primaryText="Não exibir importados" />
  <MenuItem value="\\w+" primaryText="Exibir importados" />
  
  // *Add all needed dependency to this module
  // *app requires those import modules to function
  
  
  */
  
  /**
  * 
   *Add all needed dependency to this module
   *app requires those import modules to function
   * 
  **/
  
  let modules = [];
  
  
  import defaultExport from "module-name";
  import * as name from "module-name";
  import { export1 } from "module-name";
  import { export1 as alias1 } from "module-name";
  import { default as alias } from "module-name";
  import { export1, export2 } from "module-name";
  import { export1, export2 as alias2, /* … */ } from "module-name";
  import { "string name" as alias } from "module-name";
  import defaultExport, { export1, /* … */ } from "module-name";
  import defaultExport, * as name from "module-name";
  import "module-name";
  import { "a-b" as a } from "/modules/my-module.js";
  import myDefault from "/modules/my-module.js";
  import myDefault, * as myModule from "/modules/my-module.js";
  
`;

// const importRegex = /import\s+({.+}|[\w,\*\s\{\}\.]+|.+)\s+from\s+['"]\s*([@\w\/\.\-\$]+)\s*['"];?/gm;

// const importAliasRegex = /import\s+({.+}|[\w,\*\s\{\}\.]+|.+)\s+from\s+['"]\s*([@\w\/\.\-\$]*angular2\/core(\.ts|\.js)?)\s*['"];?/gm;

// const result = [...source.matchAll(importRegex)];
// console.log(result);

// regexp\((.+)\)

const preffixPattern = "[@\\w\\.\\-\\$\\/]*";
// const keys : string[] = ["@angular2/core","View"]
const keys : string[] = Deno.args
                        .map(key => key.replace('/','\\/')
                                        .replace('.','\\.')
                                        .replace('-','\\-')
                                        .replace(' ','\\s'))
                        .map(key => key.startsWith('\\/') ? preffixPattern+key : `(${preffixPattern}\\/${key}|${key})`);


const tokens : string[] = [], namedImportRegex = /(.*,\s+)?\{([\s\w,\-\.\*\/'"]+|.+)\}/gm; 
let render_all = false;
keys.forEach(key => {
    const r = new RegExp(`import\\s+({.+}|[\\w,\\*\\s\\{\\}\\.'"]+|.+)\\s+from\\s+['"]\\s*(${key}(\\.ts|\\.js)?)\\s*['"];?`, "gm");
    // console.log(`
    // --------------------------------------------------------------------
    // ------------- +[ Search key = ${key} ]  >>>>>>>>>>>>>>>>>>>>>
    // --------------------------------------------------------------------
    // `);
    Array.from(source.matchAll(r), m => m[1]).forEach(imported => {
        if(!render_all){
            if(namedImportRegex.test(imported)){
                imported.split('{')[1].split('}')[0]
                        .split(',')
                        .map(str => str.split('as')[0].trim())
                        .forEach(t => {
                            if(tokens.indexOf(t) < 0) tokens.push(t);
                        });
            }else if(imported.indexOf("*") >= 0){
                render_all = true;
            }
        }
    })
    // console.log([...source.matchAll(r)]);
});

console.info(tokens);