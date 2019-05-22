#!/bin/bash

set -e

TOOLS="$PWD/../tools"

./gradlew assembleRelease

java -jar $TOOLS/signapk/signapk.jar $TOOLS/signapk/certificate.pem $TOOLS/signapk/key.pk8 app/build/outputs/apk/release/app-release-unsigned.apk out.apk


#adb install -r out.apk
