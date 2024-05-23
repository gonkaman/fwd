import { keywords, corelibData, baseWebData, htmlData, svgData, mathmlData } from "./libData.ts";
import { getEntryNameProvider, EntryNameProvider, formatBaseEntries, formatHtmlEntries, formatSvgEntries, formatMathmlEntries, buildEntryMap } from "./builder.ts";
import { renderAllEntries, renderSelectedEntries } from "./templateProcessor.ts";

export const generateSource = (tokens?: string[] | null): string => {
    const keys: Set<string> = new Set([]);
    const nameProvider : EntryNameProvider = getEntryNameProvider(keys, keywords);
    const entryMap = buildEntryMap(
        nameProvider, corelibData,
        formatBaseEntries(baseWebData, nameProvider),
        formatHtmlEntries(htmlData, nameProvider),
        formatSvgEntries(svgData, nameProvider),
        formatMathmlEntries(mathmlData, nameProvider)
    );
    if(tokens == null) return renderAllEntries(entryMap);
    if(tokens.length == 0) return renderAllEntries(entryMap);
    return renderSelectedEntries(entryMap, tokens);
}

