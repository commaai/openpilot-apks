#!/bin/bash

set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cd $DIR

APK_OUT=${1:-ai.comma.plus.frame.apk}
TOOLS="$PWD/../tools"
CEREAL="$PWD/../../cereal"

if [ ! -d $CEREAL ]; then
  git clone https://github.com/commaai/cereal.git $CEREAL
fi

pushd $CEREAL
scons -i
popd


./gradlew clean


if [ -z "$DEBUG" ]; then
  ./gradlew assembleRelease
  UNSIGNED_APK=app/build/outputs/apk/release/app-release-unsigned.apk
else
  ./gradlew assembleDebug
  UNSIGNED_APK=app/build/outputs/apk/debug/app-debug.apk
fi

java -jar $TOOLS/signapk/signapk.jar $TOOLS/signapk/platform.x509.pem $TOOLS/signapk/platform.pk8 "$UNSIGNED_APK" "$APK_OUT"

