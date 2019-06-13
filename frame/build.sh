#!/bin/bash

set -e
APK_OUT=${1:-out.apk}
TOOLS="$PWD/../tools"
CEREAL="$PWD/../../cereal"

if [ ! -d $CEREAL ]; then
  git clone https://github.com/commaai/cereal.git $CEREAL
fi

pushd $CEREAL
make
popd


./gradlew clean
./gradlew assembleRelease

java -jar $TOOLS/signapk/signapk.jar $TOOLS/signapk/platform.x509.pem $TOOLS/signapk/platform.pk8 app/build/outputs/apk/release/app-release-unsigned.apk "$APK_OUT" 

