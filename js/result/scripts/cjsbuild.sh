#!/bin/bash

rm $1/lib/*
rm $1/build/*
cat $1/src/* | sed /import/d | sed /'export type'/d > $1/build/index.ts \
&& npx tsc --target es2018 --module commonjs --declaration $1/build/index.ts \
&& cp $1/build/index.js $1/build/index.d.ts $1/lib/