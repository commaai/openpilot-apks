LOCAL_PATH:= $(call my-dir)
include $(CLEAR_VARS)

LOCAL_MODULE_TAGS := optional

LOCAL_SRC_FILES := $(call all-java-files-under,src)

LOCAL_RESOURCE_DIR := $(LOCAL_PATH)/res

# LOCAL_STATIC_JAVA_LIBRARIES += android-common

LOCAL_PACKAGE_NAME := NEOSSetup

LOCAL_PRIVILEGED_MODULE := true

# LOCAL_PROGUARD_FLAG_FILES := proguard.flags

include $(BUILD_PACKAGE)
