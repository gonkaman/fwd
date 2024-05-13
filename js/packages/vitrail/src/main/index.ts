import { parse } from "https://deno.land/std@0.217.0/flags/mod.ts";
import { resolve } from "https://deno.land/std@0.217.0/path/resolve.ts";
import { EntryMap, generateLibSource } from "./engine.ts";

//ugo output_file_path
//ugo --quiet/--verbose --directory scope_dir --name key_name  ouput_file_path 
//ugo --help


const flags = parse(Deno.args, {
    boolean: ["help","verbose", "quiet"],
    string: [ "directory", "name"],
    alias: {  
        "name": "n",
        "directory": "d",
        "help": "h", 
        "quiet": "q", 
        "verbose": "v"
    },
    default: { 
        "quiet": false,
        "verbose": false,
        "help": false
    }
});

const entryMap: EntryMap = {/*entrymap*/};
await Deno.writeTextFile(flags._[0]+'', generateLibSource(entryMap));