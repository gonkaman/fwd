

//template, name, key, targetType, constraints, parameters
type AdapterData = [string, string, string, string, any, any];

const templates: Record<string, (data: AdapterData) => string> = {
    html: (data: AdapterData) => `export const ${data[1]} = createDOMAdapter<Document, ${data[3]}, ${data[4]+''}, string>('${data[2]}', htmlElementFactory, ${data[4] === undefined ? 'noConnector' : 'appendConnector'}, formatAdapterArgs);`,
    svg: (data: AdapterData) => `export const ${data[1]} = createDOMAdapter<Document, ${data[3]}, ${data[4]+''}, string>('${data[2]}', svgElementFactory, ${data[4] === undefined ? 'noConnector' : 'appendConnector'}, formatAdapterArgs);`,
    mathml: (data: AdapterData) => `export const ${data[1]} = createDOMAdapter<Document, ${data[3]}, ${data[4]+''}, string>('${data[2]}', mathElementFactory, ${data[4] === undefined ? 'noConnector' : 'appendConnector'}, formatAdapterArgs);`
};

const adapters : AdapterData[] = [
    ['html','a','a','HTMLAElement','HTMLElement | Text',undefined]
];

console.log(adapters.map(data => templates[data[0]](data)).join("\n\n"));

