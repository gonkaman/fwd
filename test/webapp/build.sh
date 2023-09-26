#!/bin/bash
rm index.mjs \
&& cat ../node_modules/fwd-pipe/lib/index.mjs | sed s/'export '//g > index.mjs \
&& cat ../node_modules/fwd-vitrail/elements/index.mjs | sed s/'export '//g | sed /import/d >> index.mjs \
&& cat ../node_modules/fwd-vitrail/adapters/index.mjs | sed s/'export '//g | sed /import/d >> index.mjs \
&& npx tsc --target es2020 index.ts
cat index.js | sed /import/d >> index.mjs 
# && npx esbuild --bundle index.mjs --outfile=out.mjs --tree-shaking=true --minify=true