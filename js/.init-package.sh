#!/bin/bash

test -d packages/$1 && exit 1

root_dir=$PWD
mkdir -p packages/$1 && cd packages/$1

npm set init-author-email "gonkaman225@gmail.com"
npm set init-author-name "Joël GONKAMAN"
npm set init-author-url "https://github.com/gonkaman"
npm set init-license "MIT"
npm init --scope=@gonkaman --yes

mkdir -p build/src
mkdir -p build/scripts
mkdir -p build/tests
mkdir dist
mkdir docs

cat > README.md << EOL
# $1
EOL

year=$(date +%Y)
cat > LICENSE << EOL
MIT License

Copyright (c) ${year} Joël GONKAMAN

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOL


