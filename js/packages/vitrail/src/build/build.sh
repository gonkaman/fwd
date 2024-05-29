#/bin/bash
rm -Rf ./tmp
mkdir ./tmp
cp -r ../main/* ./tmp/
deno run --allow-read --allow-write --allow-sys merge.ts || exit 0
rm -Rf ../../dist/*
deno compile --allow-write --allow-read --allow-sys --target x86_64-unknown-linux-gnu -o serenia ./tmp/index.ts && \
tar -czvf ../../dist/serenia-linux-preview-1.tar.gz serenia
deno compile --allow-write  --allow-read --allow-sys --target x86_64-pc-windows-msvc -o serenia.exe ./tmp/index.ts && \
zip ../../dist/serenia-win-preview-1.zip serenia.exe
rm serenia*

#deno compile --allow-write --target x86_64-unknown-linux-gnu -o ../../dist/serenia-linux ./tmp/index.ts
#deno compile --allow-write --target x86_64-pc-windows-msvc -o ../../dist/serenia-win ./tmp/index.ts