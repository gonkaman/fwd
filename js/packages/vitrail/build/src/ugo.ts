import { parse } from "https://deno.land/std@0.216.0/flags/mod.ts";

const flags = parse(Deno.args, {
    boolean: ["help","optimize"],
    string: [ "name", "module", "dir", "file", "output", "help"],
    alias: { 
        "help": "h", 
        "name": "n", 
        "module": "m", //commonjs, amd, esm, mixed
        "dir": "d", 
        "file": "f",
        "output": "o",
        "optimize": "x"
    },
    default: { 
        "module": "esm"
    }
});


const printHelp = () => {
    console.log('help');
}

const getAbsolutePath = (path: string): string => {
    return '';
}

const extractTokenFromESMSource = (source: string, moduleName: string): string[] => {
    return [];
}

const extractTokenFromCJSSource = (source: string, moduleName: string): string[] => {
    return [];
}

const extractTokensFromFile = (filePath: string, moduleName: string, moduleType: string): string[] => {
    return [];
}

const extractTokensFromDir = (dirPath: string, moduleName: string, moduleType: string): string[] => {
    return [];
}


console.dir(flags);