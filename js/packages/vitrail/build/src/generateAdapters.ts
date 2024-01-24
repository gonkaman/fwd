

//template, name, key, targetType, constraints, parameters
type AdapterData = [string, string, string, string, any, any];

const templates: Record<string, (data: AdapterData) => string> = {
    adapter: (data: AdapterData) => `export const ${data[1]} = createDOMAdapter<
    ${data[4][1]+''}, Document, 
    ${data[3]}, Document, 
    ${data[4][2]+''}, Document, 
    string
>('${data[2]}', ${data[4][0]}ElementFactory, ${data[4][2] === undefined ? 'noConnector' : 'appendConnector'}, formatAdapterArgs);`
};

const adapters : AdapterData[] = [
    ['adapter','a','a','HTMLAElement',['html','HTMLElement','HTMLElement | Text'],undefined],
];

console.log(adapters.map(data => templates[data[0]](data)).join("\n\n"));

