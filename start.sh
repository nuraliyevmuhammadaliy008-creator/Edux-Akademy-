#!/bin/sh
cd "$(dirname "$0")"
[ -d server/node_modules ] || npm run install:all
[ -d client/dist ] || npm run build
[ -f server/.env ] || npm run setup
npm start
