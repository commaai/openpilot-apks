package ai.comma.messaging;

public class PubSocket {
    static {
        Loader.loadLibrary();
    }

    private long mNativeObjAddress = 0;

    public PubSocket(Context ctx, String endpoint) {
        mNativeObjAddress = nativeCreate(ctx.getNativeAddress(), endpoint);
    }

    public int send(byte[] data) {
        return nativeSend(mNativeObjAddress, data);
    }

    public void close() {
        nativeClose(mNativeObjAddress);
    }

    private static native int nativeSend(long sockAddress, byte[] data);

    private static native long nativeCreate(long ctxAddress, String endpoint);

    private static native void nativeClose(long sockAddress);
}
