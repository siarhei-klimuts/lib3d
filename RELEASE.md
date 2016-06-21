#  git config --global push.followTags true

git checkout master
git merge dev
npm version patch
git push origin master --follow-tags

# jsdoc-publish.sh

***
docs commit push
master commit push
checkout dev
merge master