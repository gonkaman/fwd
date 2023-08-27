#!/bin/bash

test -d $1/build/es6 && rm -Rf $1/build/es6
mkdir -p $1/build/es6

cat $1/scripts/license.txt > $1/build/es6/index.ts \
&& cat $1/src/* | sed /import/d | sed '/^export {.*$/,/^.*from.*$/d' >> $1/build/es6/index.ts  \
&& npx tsc --target es2020 --moduleResolution nodenext --declaration $1/build/es6/index.ts \
&& cd $1/build/es6/ && npx jsdoc -c ../../jsdoc.json index.ts


# && sed -i '/^(\*|\/\*)/{H;$!d} ; s/</\&lt;/ ; s/>/\&gt;/ ; s/\\n/<br\/>/' $1/build/es6/index.ts \

# && cat $1/scripts/license.txt $1/scripts/jsdoc.js $1/build/es6/index.js >> temp && mv temp $1/build/es6/index.js

# && npx jsdoc index.js -t ../../node_modules/better-docs