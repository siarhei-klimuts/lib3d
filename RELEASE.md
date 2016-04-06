checkout master
merge dev
version patch
master push --follow-tags
***
docs commit push
master commit push
checkout dev
merge master