#!/bin/bash
set -x

# deploy server
cd ./server
git fetch
if [ ! -z $1 ]
then
    git checkout $1
fi
git pull --rebase
npm i
pm2 restart server

#deploy client
cd /var/www/planning-poker.alexniarchos.com/planningpoker/client
git fetch
if [ ! -z $1 ]
then
    git checkout $1
fi
git pull --rebase
npm i
npm run build
