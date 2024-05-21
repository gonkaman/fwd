import { parse } from "https://deno.land/std@0.217.0/flags/mod.ts";
import { exists } from "https://deno.land/std@0.217.0/fs/mod.ts";
import { existsSync } from "https://deno.land/std@0.224.0/fs/exists.ts";
import { resolve } from "https://deno.land/std@0.217.0/path/resolve.ts";
import { EntryMap, generateLibSource } from "./generator.ts";

//serenia output_file_path
//serenia --directory scope_dir  ouput_file_path 
//serenia --file input_file  ouput_file_path 

//serenia --help

//serenia -H html_file output_file_path
//serenia --fetch-scripts --convert-stylesheets -H html_file output_file_path

enum BuildCommandType {
    help = "help",
    version = "version",
    render = "render",
    optimize = "optimize"
}
type BuildParameterType = {
    html: string[],
    files: string[],
    filters: string[]
}
type BuildCommand = {
    type: BuildCommandType,
    output?: string,
    options?: BuildParameterType
}

type Flags = {
    _: (string | number)[],
    file?: string,
    html?: string,
    match?: string,
    help: boolean
    version: boolean
}

const entryMap: EntryMap = {/*entrymap*/};

const getArgValues = (arg?: string): string[] => {
    if(arg == null) return [];
    if(arg.startsWith("[") && arg.endsWith("]")) {
        try{
            return (JSON.parse(arg) as any[]).map(value => value+'');
        }catch(e){
            return [arg];
        }
    }
    return [arg];
}

const getOutputFileName = (name?: string): string => {
    if(!name) return "serenia.ts";
    if(typeof name === 'string') return name;
    return name+"";
}

const getOuputWithExtension = (name: string): string => name.endsWith(".ts") ? name : name+'.ts';

const getCommand = (args: Flags): BuildCommand => {
    if(args.help) return { type: BuildCommandType.help };
    if(args.version) return { type: BuildCommandType.version };
    if(args.file != null || args.html != null) {
        const output = (args.file != null) ? getOutputFileName(args._[0]+"") : args._[0]+"";
        return { 
            type: BuildCommandType.optimize, 
            output: output, 
            options: {
                html: getArgValues(args.html),
                files: getArgValues(args.file),
                filters: (args.file != null && output != null && args.match == null ) ? [output] : getArgValues(args.match)
            } 
        };
    }
    return { 
        type: BuildCommandType.render, 
        output: getOuputWithExtension(getOutputFileName(args._[0]+"")) 
    };
}



const displayHelp = () => console.info(`
serenia [options] [output file]

Options:
    -h, --help
            Print help (see more with '--help')
    -V, --version
            Print version
    -f, --file [file path | url]
            Optimize the generated source code to match imports from the indicated file
            Only supports typescript files for now
    -H, --html [file path | url]
            Will generate a serenia equivalent to the designated html file
            if the output file is not provided, will not generate the necessary serenia lib source code
    -m, --match [module name | module name pattern]
            Optimize the generated source code to match imports from the indicated file
            Only supports typescript files for now
`);

const displayVersion = () => console.info("serenia preview-1");


const filterPreffix = "[@\\w\\.\\-\\$\\/]*";

const formatFilter = (filter: string): string => {
    if(/^regexp\(.+\)$/.test(filter)) return filter.slice(7).slice(0,-1);
    const key = filter.replace('/','\\/')
                    .replace('.','\\.')
                    .replace('-','\\-')
                    .replace('+','\\+')
                    .replace('*','\\*')
                    .replace(' ','\\s');
    return filter.startsWith('/') ? filterPreffix + key : `(${filterPreffix}\\/${key}|${key})`;
}

const getFilterRegex = (key: string) => new RegExp(
    `import\\s+({.+}|[\\w,\\*\\s\\{\\}\\.'"]+|.+)\\s+from\\s+['"]\\s*(${key}(\\.ts|\\.js)?)\\s*['"];?`, 
    "gm"
);


const namedImportRegex = /(.*,\s+)?\{([\s\w,\-\.\*\/\'\"]+|.+)\}/gm; 

const getTokensForFilter = (content: string, filter: string, tokens: string[] | null): string[] | null => 
    Array.from(content.matchAll(getFilterRegex(formatFilter(filter))), m => m[1]).reduce(
        (acc: string[] | null, current) => {
            if(acc == null) return null;
            if(namedImportRegex.test(current)){
                current.split('{')[1].split('}')[0]
                        .split(',')
                        .map(str => str.split('as')[0].trim())
                        .forEach(t => {
                            if(acc.indexOf(t) < 0) acc.push(t);
                        });
            }else if(current.indexOf("*") >= 0){
                return null;
            }
            return acc;
        },
        tokens
    );


const getImportedTokens = (content: string, filters: string[]): string[] | null => filters.reduce(
    (tokens: string[] | null, filter) => getTokensForFilter(content, filter, tokens),
    []
);

const combine_tokens = (existing_tokens: string[] | null, new_tokens: string[] | null): string[] | null => {
    if(existing_tokens == null || new_tokens == null) return null;
    const result: string[] = [...existing_tokens];
    new_tokens.forEach(token => {
        if(result.indexOf(token) < 0) result.push(token);
    })
    return result;

}

type DenoDirEntry = {
    name: string
}

const getTokensFromFile = (filePath: string, filters: string[], tokens: string[] | null): string[] | null => {
    if(tokens == null) return null;
    if(existsSync(filePath, { isReadable: true, isFile: true })){
        if(filePath.endsWith('.ts') || filePath.endsWith('.js')) return combine_tokens(
            tokens, getImportedTokens(Deno.readTextFileSync(filePath), filters)
        );
        return tokens;
    }
    if(existsSync(filePath, { isReadable: true, isDirectory: true })) return Array.from(Deno.readDirSync(filePath) as Iterable<DenoDirEntry>).reduce(
        (acc: string[] | null, entry) => getTokensFromFile(resolve(filePath, entry.name), filters, acc), 
        tokens
    );
    return tokens;
}

const getTokens = (files: string[], filters: string[]): string[] | null => files.reduce(
    (tokens: string[] | null, current) => getTokensFromFile(current, filters, tokens),
    []
);


const handleCommand = async (command: BuildCommand) => {
    switch(command.type){
        case BuildCommandType.help:
            displayHelp();
            break;
        case BuildCommandType.version:
            displayVersion();
            break;
        case BuildCommandType.render:
            await Deno.writeTextFile(command.output+"", generateLibSource(entryMap, null));
            break;
        case BuildCommandType.optimize:
            if(command.options != null){
                await Deno.writeTextFile(
                    getOuputWithExtension(getOutputFileName(command.output)), 
                    generateLibSource(
                        entryMap, 
                        getTokens(command.options.files, command.options.filters)
                    )
                );
            }else{
                await Deno.writeTextFile(
                    getOuputWithExtension(getOutputFileName(command.output)), 
                    generateLibSource(entryMap, null)
                );
            }
            
            break;
        default:
            break;
    }
}


//{command: help|render-all|optimize, options?: {html{files, fetch, convertStylesheets}, ts{files, dirs}}}

//help
//renderAll
//renderPart = convertHtml +/- renderTokens
//["","",""]

// await Deno.writeTextFile(getOutputFileName(flags._[0]), generateLibSource(entryMap));

const flags : Flags = parse(Deno.args, {
    boolean: ["help", "version","verbose", "quiet"],
    string: [ "file", "html", "match"],
    alias: {  
        "file": "f",
        "html": "H",
        "match": "m",
        "help": "h", 
        "version": "V",
        "quiet": "q", 
        "verbose": "v"
    },
    default: { 
        "quiet": false,
        "verbose": false,
        "help": false
    }
});

handleCommand(getCommand(flags));

