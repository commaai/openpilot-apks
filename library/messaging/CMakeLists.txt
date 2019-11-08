cmake_minimum_required(VERSION 3.4.1)

set(MESSAGING_DIR ${CMAKE_SOURCE_DIR}/src/main/cpp/messaging)

include_directories(${MESSAGING_DIR}/lib/${ANDROID_ABI}/include)

add_library(
             messaging_jni

             SHARED

             src/main/cpp/messaging.cpp )


find_library(
              log-lib

              log )

SET(CMAKE_SHARED_LINKER_FLAGS "-Wl,--exclude-libs,libgcc.a -Wl,--exclude-libs,libatomic.a -static-libstdc++ -Wl,--build-id -Wl,--warn-shared-textrel -Wl,--fatal-warnings -Qunused-arguments -Wl,-z,noexecstack")

target_link_libraries(
                       messaging_jni

                       ${log-lib} )
