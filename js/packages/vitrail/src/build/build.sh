#/bin/bash
rm -Rf ./tmp
mkdir ./tmp
cp ../main/engine.ts ./tmp/
deno run --allow-read --allow-write merge.ts
rm -Rf ../../dist/*
deno compile --allow-write --target x86_64-unknown-linux-gnu -o ../../dist/vcli-linux ./tmp/index.ts
deno compile --allow-write --target x86_64-pc-windows-msvc -o ../../dist/vcli-win ./tmp/index.ts