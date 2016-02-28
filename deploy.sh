#!/bin/bash

git checkout gh-pages
git merge master -m "Merge master and prepare to deploy."
git add build --force
git commit -m "Deploy to gh-pages."
git subtree push --prefix build origin gh-pages
git checkout master
