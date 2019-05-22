#!/bin/bash
set -e

if [[ "`uname -s`" == "Darwin" ]]; then
  ANDROID_SDK="$HOME/Library/Android/sdk"
else
  ANDROID_SDK="/opt/android-sdk"
fi

ANDROID_LIB="${ANDROID_SDK}/platforms/android-23"
DX="$ANDROID_SDK/build-tools/23.0.3/dx"

rm -rf build
mkdir build
"$DX" --dex --output=build/classes.dex signapk.jar
pushd build
    touch Manifest.txt
    jar cvfm ../signapk.android.jar Manifest.txt classes.dex
popd
rm -rf build

