#!/usr/bin/env bash

set -euo pipefail

version=${1?"Usage: $0 VERSION"}

mkdir -p dist

cp ./authz/microsoft.js ./dist/auth.js 
cp ./authn/openid.index.js ./dist/index.js
cp ./nonce.js ./dist/nonce.js

zip -q -j ./dist/lambda-edge-azure-auth-${version}.zip ./dist/*.js
