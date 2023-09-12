#!/bin/bash

echo "cleaning last build ..."
rm $1/effect/*
rm $1/builder/*
rm $1/query/*
rm -Rf $1/temp/*

echo "building commonjs packages ..."
echo "building effects ..."
cat $1/src/*Effects.ts > $1/temp/effects.ts \
&& npx tsc --target es2020 --module commonjs --declaration $1/temp/effects.ts \
&& cat $1/scripts/license.txt $1/temp/effects.js > $1/effect/index.js \
&& cat $1/scripts/license.txt $1/temp/effects.ts > $1/effect/index.ts \
&& cat $1/scripts/license.txt $1/temp/effects.d.ts > $1/effect/index.d.ts

echo "building builders ..."
cat $1/src/*Builders.ts > $1/temp/builders.ts \
&& npx tsc --target es2020 --module commonjs --declaration $1/temp/builders.ts \
&& cat $1/scripts/license.txt $1/temp/builders.js > $1/builder/index.js \
&& cat $1/scripts/license.txt $1/temp/builders.ts > $1/builder/index.ts \
&& cat $1/scripts/license.txt $1/temp/builders.d.ts > $1/builder/index.d.ts

echo "building queries ..."
cat $1/src/*Queries.ts > $1/temp/queries.ts \
&& npx tsc --target es2020 --module commonjs --declaration $1/temp/queries.ts \
&& cat $1/scripts/license.txt $1/temp/queries.js > $1/query/index.js \
&& cat $1/scripts/license.txt $1/temp/queries.ts > $1/query/index.ts \
&& cat $1/scripts/license.txt $1/temp/queries.d.ts > $1/query/index.d.ts

echo "building es6 packages ..."
echo "building effects ..."
mkdir -p $1/temp/es6 \
&& cp $1/temp/effects.ts $1/temp/es6/ \
&& npx tsc --target es2020 $1/temp/es6/effects.ts
cat $1/scripts/license.txt $1/temp/es6/effects.js > $1/effect/index.mjs 

echo "building builders ..."
cp $1/temp/builders.ts $1/temp/es6/ \
&& npx tsc --target es2020 $1/temp/es6/builders.ts
cat $1/scripts/license.txt $1/temp/es6/builders.js > $1/builder/index.mjs

echo "building queries ..."
cp $1/temp/queries.ts $1/temp/es6/ \
&& npx tsc --target es2020 $1/temp/es6/queries.ts
cat $1/scripts/license.txt $1/temp/es6/queries.js > $1/query/index.mjs 
