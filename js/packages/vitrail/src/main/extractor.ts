import { resolve } from "https://deno.land/std@0.217.0/path/resolve.ts";
import { existsSync } from "https://deno.land/std@0.224.0/fs/exists.ts";

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

export const getTokens = (files: string[], filters: string[]): string[] | null => files.reduce(
    (tokens: string[] | null, current) => getTokensFromFile(current, filters, tokens),
    []
);
