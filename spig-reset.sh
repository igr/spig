#!/usr/bin/env bash

echo "Clean..."
rm -rf out
find . -name 'node_modules' -type d -prune -print -exec rm -rf '{}' \;

echo "Install"
yarn install

(
  cd netlify || exit
  yarn install
)

echo "Done"
