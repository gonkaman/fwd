#!/bin/bash

echo "cleaning last build ..."
rm $1/lib/*
rm -Rf $1/build/*

echo "building commonjs packages ..."
cat $1/src/* | sed /import/d | sed '/^export {.*$/,/^.*from.*$/d' > $1/build/index.ts \
&& npx tsc --target es2020 --module commonjs --declaration $1/build/index.ts \
&& cat $1/scripts/license.txt $1/build/index.js > $1/lib/index.js \
&& cat $1/scripts/license.txt $1/build/index.ts > $1/lib/index.ts \
&& cat $1/scripts/license.txt $1/build/index.d.ts > $1/lib/index.d.ts

echo "building es6 packages ..."
mkdir -p $1/build/es6 \
&& cp $1/build/index.ts $1/build/es6/ \
&& npx tsc --target es2020 $1/build/es6/index.ts \
&& cat $1/scripts/license.txt $1/build/es6/index.js > $1/lib/index.mjs 

#echo "generating docs ..."
#cd $1/build/ && npx jsdoc -c ../jsdoc.json index.ts \
#&& cp -r out/* ../docs/ 
