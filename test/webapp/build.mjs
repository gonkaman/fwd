import * as esbuild from 'esbuild'

// await esbuild.build({
//   entryPoints: ['index.ts'],
//   bundle: true,
//   treeShaking: true,
//   outfile: 'index.js'
// })

await esbuild.build({
    entryPoints: ['index.mjs'],
    bundle: true,
    treeShaking: true,
    // minify: true,
    // sourcemap: true,
    //target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
    outfile: 'out.js'
})