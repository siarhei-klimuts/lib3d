#!/bin/bash

LAST_TAG="$(git describe --abbrev=0 --tags)" &&
echo "gh-pages: LAST_TAG=$LAST_TAG" &&

git submodule init &&
git submodule update &&
echo "gh-pages: submodule init and update" &&

cd docs &&
git fetch &&
git checkout gh-pages &&
echo "gh-pages: fetch && checkout" &&

rm -rf ./* &&
echo "gh-pages: cleanup" &&

npm run jsdoc &&

git add . --all &&
git commit -a -m $LAST_TAG &&
echo "gh-pages: commited" &&

git push origin HEAD &&
echo "gh-pages: pushed"