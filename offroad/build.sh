#!/bin/bash -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cd $DIR

APK_OUT=${1:-$PWD/ai.comma.plus.offroad.apk}
TOOLS="$PWD/../tools"
CEREAL="$PWD/../../cereal"
export SENTRY_SKIP_UPLOAD=${SENTRY_SKIP_UPLOAD:-1}

export ANDROID_NDK_HOME="/usr/lib/android-sdk/ndk/19.2.5345600"

if [ ! -d $CEREAL ]; then
  git clone https://github.com/commaai/cereal.git $CEREAL
fi

pushd $CEREAL
scons -i -j$(nproc)
popd

export SENTRY_WIZARD_INTEGRATION=reactNative

yarn

mkdir -p android/app/src/main/assets
rm android/app/src/main/assets/index.android.bundl* || true
rm -r android/build android/app/build || true

echo "android/app/src/main/res/drawable-mdpi
android/app/src/main/res/drawable-hdpi
android/app/src/main/res/drawable-xhdpi
android/app/src/main/res/drawable-xxhdpi
android/app/src/main/res/drawable-xxxhdpi"| xargs rm -r || true

cd android

if [ -z "$NOCLEAN" ]; then
  ./gradlew clean
fi
if [ -z "$DEBUG" ]; then
  APK_PATH=app/build/outputs/apk/release/app-release-unsigned.apk
  ./gradlew assembleRelease
else
  APK_PATH=app/build/outputs/apk/debug/app-debug.apk
  ./gradlew assembleDebug
fi

java -jar $TOOLS/signapk/signapk.jar $TOOLS/signapk/certificate.pem $TOOLS/signapk/key.pk8 $APK_PATH $APK_OUT
echo "build complete"
