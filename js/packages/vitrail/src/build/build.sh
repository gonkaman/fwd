#/bin/bash
rm -Rf ./tmp
mkdir ./tmp
cp -r ../main/* ./tmp/
deno run --allow-read --allow-write merge.ts
rm -Rf ../../dist/*
deno compile --allow-write --target x86_64-unknown-linux-gnu -o ../../dist/serenia-linux ./tmp/index.ts
deno compile --allow-write --target x86_64-pc-windows-msvc -o ../../dist/serenia-win ./tmp/index.ts