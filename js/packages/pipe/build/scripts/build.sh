#!/bin/bash

dir=`dirname $0`
dist_dir="${dir}/../../dist"
src_dir="${dir}/../src"

echo "cleaning last build ..."
rm -Rf $dist_dir/*


echo "building distribution files ..."
cat $src_dir/* | sed '/\/\/.*/d' > $dist_dir/index.ts \
&& tsc --target es2020 $dist_dir/index.ts \
&& mv $dist_dir/index.js $dist_dir/index.mjs \
&& tsc --target es2020 --module commonjs --declaration $dist_dir/index.ts \
&& cp $dist_dir/index.js $dist_dir/index.cjs

ls -l $dist_dir