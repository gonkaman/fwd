import { parse } from "https://deno.land/std@0.217.0/flags/mod.ts";
// import { resolve } from "https://deno.land/std@0.217.0/path/resolve.ts";
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
    html: {
        files: string[]
    },
    ts: {
        files: string[],
        directories: string[]
    }
}
type BuildCommand = {
    type: BuildCommandType,
    output?: string,
    options?: BuildParameterType
}

type Flags = {
    _: string[],
    file?: string,
    directory?: string,
    html?: string,
    help: boolean
    version: boolean
}

const flags : Flags = parse(Deno.args, {
    boolean: ["help", "version","verbose", "quiet"],
    string: [ "directory", "file", "html"],
    alias: {  
        "file": "f",
        "directory": "d",
        "html": "H",
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

console.log(flags);

const entryMap: EntryMap = {/*entrymap*/};

const getArgValues = (arg?: string): string[] => {
    if(arg == null) return [];
    if(arg.startsWith("[")) return (JSON.parse(arg) as any[]).map(value => value+'');
    return [arg];
}

const getOutputFileName = (name?: string): string => {
    if(!name) return "serenia.ts";
    if(typeof name === 'string'){
        if(!name.endsWith(".ts")) return name+".ts";
        return name;
    }
    return getOutputFileName(name+"");
}

const getCommand = (args: Flags): BuildCommand => {
    if(args.help) return { type: BuildCommandType.help };
    if(args.version) return { type: BuildCommandType.version };
    if(args.file != null || args.directory != null || args.html != null) return { 
        type: BuildCommandType.optimize, 
        output: (args.file != null || args.directory != null) ? getOutputFileName(args._[0]) : args._[0], 
        options: {
            html: {
                files: getArgValues(args.html)
            },
            ts: {
                files: getArgValues(args.file),
                directories: getArgValues(args.directory)
            }
        } 
    };
    return { type: BuildCommandType.render, output: getOutputFileName(args._[0]) };
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
    -d, --directory [directory path]
            Optimize the generated source code to match imports from files within the indicated directory
            Only typescript files will be considered
    -H, --html [file path | url]
            Will generate a serenia equivalent to the designated html file
            if the output file is not provided, will not generate the necessary serenia lib source code
`);

const displayVersion = () => console.info("serenia preview-1");


//{command: help|render-all|optimize, options?: {html{files, fetch, convertStylesheets}, ts{files, dirs}}}

//help
//renderAll
//renderPart = convertHtml +/- renderTokens




await Deno.writeTextFile(getOutputFileName(flags._[0]), generateLibSource(entryMap));