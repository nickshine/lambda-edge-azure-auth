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
cd -

npx webpack
zip -q -j ./dist/lambda-edge-azure-auth-${version}.zip dist/index.js
