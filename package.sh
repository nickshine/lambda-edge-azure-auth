#!/usr/bin/env bash

set -euo pipefail

version=${1?"Usage: $0 VERSION"}

rm -rf dist
mkdir -p dist

cp ./authz/microsoft.js ./dist/auth.js 
cp ./authn/openid.index.js ./dist/index.js
cp ./nonce.js ./dist/nonce.js
cp package.json package-lock.json ./dist/

cd dist && npm ci --production;

zip_path="./lambda-edge-azure-auth-${version}.zip"
zip -q -j $zip_path ./{*.js,*.json}
zip -q -r $zip_path ./node_modules
cd -
