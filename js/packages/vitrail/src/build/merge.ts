
const keywords = await Deno.readTextFile("../resources/keywords.json")
const coreLib = await Deno.readTextFile("../resources/lib.ts");
const baseEntryData = await Deno.readTextFile("../resources/baseEntries.json");
const htmlEntryData = await Deno.readTextFile("../resources/htmlEntries.json");
const svgEntryData = await Deno.readTextFile("../resources/svgEntries.json");
const mathmlEntryData = await Deno.readTextFile("../resources/mathmlEntries.json");

const generated_source = await Deno.readTextFile("./tmp/libData.ts")
                        .then(content => content.replace(/"";\/\/corelib/g, `\`${coreLib}\`;`)
                                                .replace(/\{\};\/\/base/g, `${baseEntryData};`)
                                                .replace(/\{\};\/\/html/g, `${htmlEntryData};`)
                                                .replace(/\{\};\/\/svg/g, `${svgEntryData};`)
                                                .replace(/\{\};\/\/mathml/g, `${mathmlEntryData};`)
                                                .replace(/\[\];\/\/keywords/g, `${keywords};`));
await Deno.writeTextFile("./tmp/libData.ts", generated_source);
console.log("reference build source generated !");