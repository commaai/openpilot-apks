#!/bin/bash
set -e

cd android
./gradlew assembleDebug

APK=../ai.comma.plus.neossetup.apk

scp "$APK" vphone:/sdcard/
ssh vphone "mount -o remount,rw /system && (mkdir -p /system/priv-app/plusneossetup && cp /sdcard/ai.comma.plus.neossetup.apk /system/priv-app/plusneossetup/neossetup.apk && chmod 755 /system/priv-app//plusneossetup && chmod 644 /system/priv-app/plusneossetup/neossetup.apk); mount -o remount,ro /system"
# ssh vphone "pm install /system/priv-app/PlusFrame/PlusFrame.apk"
# ssh vphone "tmux send-keys -t comma:0.0 C-c; sleep 5; tmux send-keys -t comma:0.0 C-c; tmux send -t comma:0.0 ./continue.sh ENTER"
ssh vphone "pm install -r -d /sdcard/ai.comma.plus.neossetup.apk"
ssh vphone "am start -n ai.comma.plus.neossetup/.MainActivity"
