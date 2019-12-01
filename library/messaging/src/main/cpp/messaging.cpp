#include <jni.h>
#include <string>
#include <android/log.h>
#include <libmessaging/messaging.hpp>
#include <dlfcn.h>
#include <stdlib.h>

#include "messaging.h"


typedef Context* (*fnCreateContext)();
fnCreateContext createContext;
typedef SubSocket* (*fnCreateSubSocket)(Context* context, const char* endpoint);
fnCreateSubSocket createSubSocket;
typedef PubSocket* (*fnCreatePubSocket)(Context* context, const char* endpoint);
fnCreatePubSocket createPubSocket;
typedef Poller* (*fnCreatePoller)(SubSocket** sockets, int size);
fnCreatePoller createPoller;

extern "C" JNIEXPORT void JNICALL Java_ai_comma_messaging_Loader_init(JNIEnv *env,
                                                                 jclass cls) {
    const char* pythonPath = getenv("PYTHONPATH");
    const char* messagingLibraryFile = "/cereal/libmessaging_shared.so";
    char* messagingLibraryPath = (char*)malloc(strlen(pythonPath) + strlen(messagingLibraryFile) + 1);
    strcpy(messagingLibraryPath, pythonPath);
    strcat(messagingLibraryPath, messagingLibraryFile);
    const char* libcppPath = "/system/comma/usr/lib/libc++_shared.so";
    const char* libGnustlPath = "/system/comma/usr/lib/libgnustl_shared.so";

    void* opened = dlopen(libcppPath, RTLD_NOW | RTLD_GLOBAL);
    if(!opened) {
        char *error = dlerror();
        LOGE ("Error opening libc++_shared ( %s )", (error) ? error : "");
    } else { LOGE("Opened libc++_shared.so"); }

    opened = dlopen(libGnustlPath, RTLD_NOW | RTLD_GLOBAL);
    if(!opened) {
        char *error = dlerror();
        LOGE ("Error opening libgnustl_shared ( %s )", (error) ? error : "");
    } else { LOGE("Opened libgnustl_shared.so"); }

    opened = dlopen(messagingLibraryPath, RTLD_NOW | RTLD_GLOBAL);
    if(!opened) {
        char *error = dlerror();
        LOGE ("Error opening %s ( %s )", messagingLibraryPath, (error) ? error : "");
    } else { LOGE("Opened messaging.so"); }
    free(messagingLibraryPath);

    createContext = (fnCreateContext) dlsym(opened, "messaging_context_create");
    createSubSocket = (fnCreateSubSocket) dlsym(opened, "messaging_subsocket_create");
    createPubSocket = (fnCreatePubSocket) dlsym(opened, "messaging_pubsocket_create");
    createPoller = (fnCreatePoller)  dlsym(opened, "messaging_poller_create");
}

extern "C"
JNIEXPORT jlong JNICALL
Java_ai_comma_messaging_Context_create(
        JNIEnv *env,
        jclass cls) {
    Context *ctx = createContext();
    return (jlong)ctx;
}

extern "C"
JNIEXPORT jbyteArray JNICALL
Java_ai_comma_messaging_Message_nativeGetData(
        JNIEnv *env,
        jobject obj,
        jlong messageAddr) {
    Message *msg = (Message *)messageAddr;
    size_t size = msg->getSize();
    const jbyte* data = reinterpret_cast<const jbyte*>(msg->getData());
    jbyteArray jData = env->NewByteArray(size);

    env->SetByteArrayRegion(jData, 0, size, data);
    return jData;
}

extern "C"
JNIEXPORT jlong JNICALL
Java_ai_comma_messaging_Message_nativeGetSize(
        JNIEnv *env,
        jobject obj,
        jlong messageAddr) {
    Message *msg = (Message *)messageAddr;

    return (jlong)msg->getSize();
}

extern "C"
JNIEXPORT void JNICALL
Java_ai_comma_messaging_Message_nativeRelease(
        JNIEnv *env,
        jobject obj,
        jlong messageAddr) {
    Message *msg = (Message *)messageAddr;
    delete msg;
}

std::string jStringToStdString(JNIEnv *env, jstring jStr) {
    const jclass stringClass = env->GetObjectClass(jStr);
    const jmethodID getBytes = env->GetMethodID(stringClass, "getBytes", "(Ljava/lang/String;)[B");
    const jbyteArray stringJbytes = (jbyteArray) env->CallObjectMethod(jStr, getBytes, env->NewStringUTF("UTF-8"));

    size_t length = (size_t) env->GetArrayLength(stringJbytes);
    jbyte* pBytes = env->GetByteArrayElements(stringJbytes, NULL);
    std::string ret = std::string((char *)pBytes, length);
    env->ReleaseByteArrayElements(stringJbytes, pBytes, JNI_ABORT);

    env->DeleteLocalRef(stringJbytes);
    env->DeleteLocalRef(stringClass);
    return ret;
}

extern "C"
JNIEXPORT jlong JNICALL
Java_ai_comma_messaging_SubSocket_nativeCreate(
        JNIEnv *env,
        jclass cls,
        jlong ctxAddr,
        jstring jEndpoint) {
    Context *ctx = (Context *)ctxAddr;
    const char *endpoint = env->GetStringUTFChars(jEndpoint, 0);
    SubSocket* subSocket = createSubSocket(ctx, endpoint);
    env->ReleaseStringUTFChars(jEndpoint, endpoint);
    return (jlong)subSocket;
}

extern "C"
JNIEXPORT void JNICALL
Java_ai_comma_messaging_SubSocket_nativeConnect(
        JNIEnv *env,
        jobject obj,
        jlong sockAddr,
        jlong ctxAddr,
        jstring endpoint,
        jboolean conflate) {
    Context *ctx = (Context *)ctxAddr;
    SubSocket *sock = (SubSocket*)sockAddr;
    std::string endpointStr = jStringToStdString(env, endpoint);

    sock->connect(ctx, endpointStr, conflate);
}


extern "C"
JNIEXPORT void JNICALL
Java_ai_comma_messaging_SubSocket_nativeSetTimeout(
        JNIEnv *env,
        jobject obj,
        jlong sockAddr,
        jint timeout) {
    SubSocket *sock = (SubSocket*)sockAddr;

    sock->setTimeout(timeout);
}

extern "C"
JNIEXPORT jlong JNICALL
Java_ai_comma_messaging_SubSocket_nativeReceive(
        JNIEnv *env,
        jobject obj,
        jlong sockAddr,
        jboolean nonBlocking) {
    SubSocket *sock = (SubSocket*)sockAddr;

    return (jlong)sock->receive(nonBlocking);
}

extern "C"
JNIEXPORT void JNICALL
Java_ai_comma_messaging_SubSocket_nativeClose(
        JNIEnv *env,
        jobject obj,
        jlong sockAddr) {
    SubSocket *sock = (SubSocket*)sockAddr;
    delete sock;
}

extern "C"
JNIEXPORT jlong JNICALL
Java_ai_comma_messaging_Poller_create(
        JNIEnv *env,
        jclass cls,
        jlongArray jSocketArr) {
    SubSocket** sockArr = (SubSocket**)env->GetLongArrayElements(jSocketArr, 0);
    int size = env->GetArrayLength(jSocketArr);
    Poller* poller = createPoller(sockArr, size);
    env->ReleaseLongArrayElements(jSocketArr, (jlong*)sockArr, JNI_ABORT);
    return (jlong)poller;
}

extern "C"
JNIEXPORT jlongArray JNICALL
Java_ai_comma_messaging_Poller_nativePoll(
        JNIEnv *env,
        jobject obj,
        jlong pollerAddr,
        jint timeout) {
    Poller* poller = (Poller*)pollerAddr;
    auto r = poller->poll(timeout);

    jlongArray sockets = env->NewLongArray(r.size());

    for (int i = 0; i < r.size(); i++) {
        jlong ptr = (jlong)r[i];
        env->SetLongArrayRegion(sockets, i, 1, &ptr);
    }

    return sockets;
}

extern "C"
JNIEXPORT void JNICALL
Java_ai_comma_messaging_Poller_nativeRegisterSocket(
        JNIEnv *env,
        jobject obj,
        jlong pollerAddr,
        jlong sockAddr) {
    SubSocket* sock = (SubSocket*)sockAddr;
    Poller* poller = (Poller*)pollerAddr;
    poller->registerSocket(sock);
}


extern "C"
JNIEXPORT jlong JNICALL
Java_ai_comma_messaging_PubSocket_nativeCreate(
        JNIEnv *env,
        jclass cls,
        jlong ctxAddr,
        jstring jEndpoint) {
    Context* ctx = (Context*)ctxAddr;
    const char *endpoint = env->GetStringUTFChars(jEndpoint, 0);
    PubSocket* pubSocket = createPubSocket(ctx, endpoint);
    env->ReleaseStringUTFChars(jEndpoint, endpoint);
    return (jlong)pubSocket;
}

extern "C"
JNIEXPORT jint JNICALL
Java_ai_comma_messaging_PubSocket_nativeSend(
        JNIEnv *env,
        jclass cls,
        jlong sockAddr,
        jbyteArray jData) {
    PubSocket *sock = (PubSocket *) sockAddr;
    int length = (int) env->GetArrayLength(jData);
    jbyte *bytes = env->GetByteArrayElements(jData, NULL);

    int err = (jint) sock->send((char*)bytes, length);
    env->ReleaseByteArrayElements(jData, bytes, JNI_ABORT);

    return err;
}

extern "C"
JNIEXPORT void JNICALL
Java_ai_comma_messaging_PubSocket_nativeClose(
        JNIEnv *env,
        jclass cls,
        jlong sockAddr) {
    PubSocket *sock = (PubSocket *) sockAddr;
    delete sock;
}