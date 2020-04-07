#!/usr/bin/env bash

set -eo pipefail

version=${1-$npm_package_version}
version=${version:?"Usage: $0 VERSION"}

rm -rf dist
mkdir -p dist

cp ./authz/microsoft.js ./dist/auth.js 
cp ./authn/openid.index.js ./dist/main.js
cp nonce.js package.json package-lock.json ./dist/

cd dist
npm ci --production
rm package*.json

cd -
npx webpack

cd dist
zip_path="./lambda-edge-azure-auth-${version}.zip"
# zip -q -j $zip_path ./{.js,*.json}
# zip -q -r $zip_path ./node_modules
zip -q -j $zip_path ./index.js
cd -
