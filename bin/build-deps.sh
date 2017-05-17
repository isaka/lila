#!/bin/sh
set -e

# might help some people dealing with vendor updates
git submodule update

dir=$(mktemp -d)
echo "Building in $dir"
cd "$dir"

git clone --depth 1 https://github.com/ornicar/Kamon --branch lila
cd Kamon
sbt publish-local
cd ..

git clone --depth 1 https://github.com/ornicar/scalalib
cd scalalib
sbt publish-local
cd ..

git clone https://github.com/ornicar/scala-kit --branch lichess-fork
cd scala-kit
git checkout b019b3a2522d3f1697c39ec0c79e88c18ea49a91
sbt -Dversion=1.2.11-THIB publish-local
cd ..

git clone --depth 1 https://github.com/ornicar/maxmind-geoip2-scala --branch customBuild
cd maxmind-geoip2-scala
sbt publish-local
cd ..

git clone --depth 1 https://github.com/Nycto/Hasher
cd Hasher
sbt '+ publish-local'
cd ..

rm -rf "$dir"
