package ai.comma.messaging;

public class SubSocket {
  static {
    Loader.loadLibrary();
  }

  private long mNativeObjAddress = 0;

  public SubSocket(Context ctx, String endpoint) {
    mNativeObjAddress = nativeCreate(ctx.getNativeAddress(), endpoint);
  }

  public SubSocket(long nativeObjAddress) {
    mNativeObjAddress = nativeObjAddress;
  }

  public long getNativeAddress() {
    return mNativeObjAddress;
  }

  public Message receive() {
    return receive(false);
  }

  public Message receive(boolean nonBlocking) {
    long messageAddr = nativeReceive(mNativeObjAddress, nonBlocking);
    if (messageAddr == 0) {
      return null;
    }

    return new Message(messageAddr);
  }

  public void setTimeout(int timeout) {
    nativeSetTimeout(mNativeObjAddress, timeout);
  }

  public void close() {
    nativeClose(mNativeObjAddress);
  }

  private native void nativeConnect(long sockAddr, long contextAddr, String endpoint, boolean conflate);
  private native void nativeSetTimeout(long sockAddr, int timeout);
  private native long nativeReceive(long sockAddr, boolean non_blocking);
  private static native long nativeCreate(long contextAddr, String endpoint);
  private native void nativeClose(long sockAddr);
}
