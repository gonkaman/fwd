import { parse } from "https://deno.land/std@0.217.0/flags/mod.ts";
import { displayHelp, displayVersion } from "./info.ts";
import { getTokens } from "./extractor.ts";
import { generateSource } from "./generator.ts";

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

// const entryMap: EntryMap = {/*entrymap*/};

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


const handleCommand = async (command: BuildCommand) => {
    switch(command.type){
        case BuildCommandType.help:
            displayHelp();
            break;
        case BuildCommandType.version:
            displayVersion();
            break;
        case BuildCommandType.render:
            await Deno.writeTextFile(command.output+"", generateSource());
            break;
        case BuildCommandType.optimize:
            if(command.options != null){
                await Deno.writeTextFile(
                    getOuputWithExtension(getOutputFileName(command.output)), 
                    generateSource(getTokens(command.options.files, command.options.filters))
                );
            }else{
                await Deno.writeTextFile(
                    getOuputWithExtension(getOutputFileName(command.output)), 
                    generateSource()
                );
            }
            
            break;
        default:
            displayHelp();
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

