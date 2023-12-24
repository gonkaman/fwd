#!/bin/bash

test -d $1 && exit 1
npm install -g lerna
npm install -g typescript
npm install -g tsc

mkdir -p $1 && cd $1
lerna init
lerna bootstrap

cat > .init-package.sh << EOL
#!/bin/bash

test -d packages/\$1 && exit 1

mkdir -p packages/\$1 && cd packages/\$1

npm set init-author-email "gonkaman225@gmail.com"
npm set init-author-name "Joël GONKAMAN"
npm set init-author-url "https://github.com/gonkaman"
npm set init-license "MIT"
npm init --scope=@gonkaman --yes

sed '/"main": "index.js"/Q' package.json > temp.txt

cat << 'CONFIG' >> temp.txt
  "types": "dist/index.d.ts",
  "files": [
    "dist/**/*.{js,cjs,mjs,ts,mts,cts}"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/gonkaman/"
  },
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.mts",
        "default": "./dist/index.mjs"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      },
      "default": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    }
  },
CONFIG

grep -A 9999 '"main": "index.js"' package.json >> temp.txt
mv temp.txt package.json

mkdir -p build/src
mkdir -p build/scripts
mkdir -p build/tests
mkdir dist
mkdir docs

cat > README.md << README_FILE
# \$1

*Description: Todo*

## Usage

*Todo*
README_FILE

year=\$(date +%Y)

cat > LICENSE << LICENSE_FILE
MIT License

Copyright (c) \${year} Joël GONKAMAN

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
LICENSE_FILE
  
EOL

shift
for i
do
  /bin/bash .init-package.sh $i
done

lerna bootstrap
