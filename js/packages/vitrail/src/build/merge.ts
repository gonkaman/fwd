import { getEntryNameProvider, EntryNameProvider, buildEntryMap, formatBaseEntries, formatHtmlEntries, formatSvgEntries, formatMathmlEntries } from "./format.ts";

const keys: Set<string> = new Set([]);
const coreLib = await Deno.readTextFile("../resources/lib.ts");
const keywords = await Deno.readTextFile("../resources/keywords.json")
                            .then((content: string) => JSON.parse(content), (err: any) => []);
const baseEntryData = await Deno.readTextFile("../resources/baseEntries.json")
                                .then((content: string) => JSON.parse(content), (err: any) => []);
const htmlEntryData = await Deno.readTextFile("../resources/htmlEntries.json")
                                .then((content: string) => JSON.parse(content), (err: any) => []);
const svgEntryData = await Deno.readTextFile("../resources/svgEntries.json")
                                .then((content: string) => JSON.parse(content), (err: any) => []);
const mathmlEntryData = await Deno.readTextFile("../resources/mathmlEntries.json")
                                .then((content: string) => JSON.parse(content), (err: any) => []);


const nameProvider : EntryNameProvider = getEntryNameProvider(keys, keywords);
const entryMap = buildEntryMap(
    nameProvider, coreLib,
    formatBaseEntries(baseEntryData, nameProvider),
    formatHtmlEntries(htmlEntryData, nameProvider),
    formatSvgEntries(svgEntryData, nameProvider),
    formatMathmlEntries(mathmlEntryData, nameProvider)
);

const generator_source = await Deno.readTextFile("./tmp/generator.ts").then(
    (content: string) => content.replace(/\{\}\sas\sEntryMap;/g, `${JSON.stringify(entryMap, null, 2)}`)
);

const isEmptyTag = (type: string, childs: string) => 
    ["html","svg","mathml"].indexOf(type.toLowerCase().trim()) >= 0 && childs === "undefined";

const html_source = await Deno.readTextFile("./tmp/html.ts").then(
    (content: string) => content.replace(
        /\["empty_tags"\]/g, 
        JSON.stringify(Object.values(entryMap.adapter)
            .filter(value => isEmptyTag(value.type, value.childs))
            .map(value => value.key)
        )
    )
);

await Deno.writeTextFile("./tmp/generator.ts", generator_source);
await Deno.writeTextFile("./tmp/html.ts", html_source);
console.log("reference build source generated !");

