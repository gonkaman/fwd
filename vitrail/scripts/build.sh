#!/bin/bash

echo "cleaning last build ..."
rm $1/elements/*
rm $1/adapters/*
rm -Rf $1/temp/*

echo "building commonjs packages ..."
echo "building elements ..."
cat $1/src/*Elements.ts > $1/temp/elements.ts \
&& npx tsc --target es2020 --module commonjs --declaration $1/temp/elements.ts \
&& cat $1/scripts/license.txt $1/temp/elements.js > $1/elements/index.js \
&& cat $1/scripts/license.txt $1/temp/elements.ts > $1/elements/index.ts \
&& cat $1/scripts/license.txt $1/temp/elements.d.ts > $1/elements/index.d.ts

echo "building adapters ..."
echo 'import { PipeEntry, fork, pipe, resolve } from "fwd-pipe";' > $1/temp/adapters.ts \
&& cat $1/src/*Adapters.ts | sed /import/d >> $1/temp/adapters.ts \
&& npx tsc --target es2020 --module commonjs --declaration $1/temp/adapters.ts \
&& cat $1/scripts/license.txt $1/temp/adapters.js > $1/adapters/index.js \
&& cat $1/scripts/license.txt $1/temp/adapters.ts > $1/adapters/index.ts \
&& cat $1/scripts/license.txt $1/temp/adapters.d.ts > $1/adapters/index.d.ts


echo "building es6 packages ..."
echo "building es6 elements ..."
mkdir -p $1/temp/es6 \
&& cp $1/temp/elements.ts $1/temp/es6/ \
&& npx tsc --target es2020 $1/temp/es6/elements.ts
cat $1/scripts/license.txt $1/temp/es6/elements.js > $1/elements/index.mjs 

echo "building es6 adapters ..."
cp $1/temp/adapters.ts $1/temp/es6/ \
&& npx tsc --target es2020 $1/temp/es6/adapters.ts
cat $1/scripts/license.txt $1/temp/es6/adapters.js > $1/adapters/index.mjs
