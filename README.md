# openpilot-apks

The source code for the APKs that run inside openpilot.

[![CircleCI](https://circleci.com/gh/commaai/openpilot-apks.svg?style=svg)](https://circleci.com/gh/commaai/openpilot-apks)

## offroad

offroad is the interactive UI displayed while your car is off. Its main features are device setup, comma account pairing, and settings management.

## frame

frame contains the sidebar and manages the background color behind openpilot UI.

## black

black draws a box behind the openpilot `ui.c` while driving.

## setup

NEOS setup compatible with the `openpilot.comma.ai` installation configuration server. Based on CyanogenOS setup.

## Shared Dependencies

Ubuntu 16.04:

```
Android SDK:
sudo apt install openjdk-8-jdk openjdk-8-jre android-sdk
sudo chown -R $(whoami): /usr/lib/android-sdk
echo 'export ANDROID_HOME=/usr/lib/android-sdk' >> ~/.bashrc
echo 'export PATH="$PATH:/usr/lib/android-sdk/tools/bin"' >> ~/.bashrc
source ~/.bashrc

Android SDK Tools:
curl -o sdk-tools.zip "https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip"
unzip -o sdk-tools.zip -d "/usr/lib/android-sdk/"
chmod +x /usr/lib/android-sdk/tools/bin/*
sdkmanager "platform-tools" "platforms;android-23" "platforms;android-27" "ndk-bundle"
sdkmanager "extras;android;m2repository"
sdkmanager "extras;google;m2repository"
sdkmanager --licenses
```

### Offroad Dependencies
```
Node:
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs

Yarn:
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn

Install capnpc-java:
git clone https://github.com/capnproto/capnproto-java.git
cd capnproto-java/
make
sudo make install
```

## Build

Clone or move this repository under the [openpilot](https://github.com/commaai/openpilot) repository before building.  If you have not generated the capnp java files in the openpilot/cereal/ director you need to run "make" in that directory to generate the files needed for building Offroad.  This only needs to be done once.

See build.sh in project directories.

