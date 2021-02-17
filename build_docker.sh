#!/bin/bash

if [ ! -z "$BUILD_IMAGE" ]; then
  docker pull docker.io/commaai/openpilot-apks:latest
  docker build --cache-from docker.io/commaai/openpilot-apks:latest -t apks -f Dockerfile .
fi

exit 0

docker run --name apks apks /bin/sh -c "cd offroad && ./build.sh"
docker cp apks:/tmp/openpilot/apks/offroad/ai.comma.plus.offroad.apk ai.comma.plus.offroad.apk
docker rm apks
