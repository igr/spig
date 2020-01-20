#!/usr/bin/env bash

set -e

clear

(
  cd ..
  npm run build
)

yarn build
