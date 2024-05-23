export const displayVersion = (): void => console.info("serenia preview-1");

export const displayHelp = (): void => console.info(`
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