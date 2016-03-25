#!/bin/bash

LAST_TAG="$(git describe --abbrev=0 --tags)" &&

git submodule init &&
git submodule update &&

cd docs &&
git fetch &&
git checkout gh-pages &&

rm -rf ./* &&
npm run jsdoc &&

git add . --all &&
git commit -a -m $LAST_TAG &&
git push origin HEAD