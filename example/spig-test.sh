#!/usr/bin/env bash

rm -rf out

echo "BUILDING"
yarn build

echo
echo "TESTING"
diff --brief --recursive out/ out-test/
