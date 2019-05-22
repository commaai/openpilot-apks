#!/bin/bash
set -e

./gradlew assembleDebug

APK=./app/build/outputs/apk/debug/app-debug.apk

scp "$APK" ophone:/sdcard/
ssh ophone "am force-stop ai.comma.neos.setup && mount -o remount,rw /system && (mkdir -p /system/priv-app/NEOSSetup && cp /sdcard/app-debug.apk /system/priv-app/NEOSSetup/NEOSSetup.apk && chmod 755 /system/priv-app//NEOSSetup && chmod 644 /system/priv-app/NEOSSetup/NEOSSetup.apk); mount -o remount,ro /system"
# ssh ophone "pm install /system/priv-app/PlusFrame/PlusFrame.apk"
# ssh ophone "tmux send-keys -t comma:0.0 C-c; sleep 5; tmux send-keys -t comma:0.0 C-c; tmux send -t comma:0.0 ./continue.sh ENTER"
ssh ophone "am start ai.comma.neos.setup/.SetupWizardActivity"
