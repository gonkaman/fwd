#!/bin/bash

echo "cleaning last build ..."
rm $1/lib/*
rm $1/builders/*
rm $1/adapters/*
rm -Rf $1/build/*

echo "building commonjs packages ..."
echo "building adapters ..."
cat $1/src/*Adapters.ts > $1/build/adapters.ts \
&& npx tsc --target es2020 --module commonjs --declaration $1/build/adapters.ts \
&& cat $1/scripts/license.txt $1/build/adapters.js > $1/adapters/index.js \
&& cat $1/scripts/license.txt $1/build/adapters.ts > $1/adapters/index.ts \
&& cat $1/scripts/license.txt $1/build/adapters.d.ts > $1/adapters/index.d.ts

echo "building builders ..."
cat $1/src/*Builders.ts > $1/build/builders.ts \
&& npx tsc --target es2020 --module commonjs --declaration $1/build/builders.ts \
&& cat $1/scripts/license.txt $1/build/builders.js > $1/builders/index.js \
&& cat $1/scripts/license.txt $1/build/builders.ts > $1/builders/index.ts \
&& cat $1/scripts/license.txt $1/build/builders.d.ts > $1/builders/index.d.ts

echo "building core ..."
cat $1/src/utils.ts > $1/build/utils.ts \
&& npx tsc --target es2020 --module commonjs --declaration $1/build/utils.ts \
&& cat $1/scripts/license.txt $1/build/utils.js > $1/adapters/utils.js \
&& cat $1/scripts/license.txt $1/build/utils.ts > $1/adapters/utils.ts \
&& cat $1/scripts/license.txt $1/build/utils.d.ts > $1/adapters/utils.d.ts

echo "building es6 packages ..."
echo "building adapters ..."
mkdir -p $1/build/es6 \
&& cp $1/build/adapters.ts $1/build/es6/ \
&& npx tsc --target es2020 --moduleResolution nodenext --module nodenext $1/build/es6/adapters.ts
cat $1/scripts/license.txt $1/build/es6/adapters.js > $1/adapters/index.mjs 

echo "building html ..."
cp $1/build/html.ts $1/build/es6/ \
&& npx tsc --target es2020 --moduleResolution nodenext --module nodenext $1/build/es6/html.ts
cat $1/scripts/license.txt $1/build/es6/html.js > $1/builders/index.mjs

echo "building core ..."
cp $1/build/utils.ts $1/build/es6/ \
&& npx tsc --target es2020 $1/build/es6/utils.ts
cat $1/scripts/license.txt $1/build/es6/utils.js > $1/adapters/utils.mjs 
