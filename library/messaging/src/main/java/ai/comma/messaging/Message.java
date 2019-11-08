package ai.comma.messaging;

public class Message {
  static {
    Loader.loadLibrary();
  }

  private long mNativeObjectAddress;

  public Message(long nativeObjectAddress) {
    mNativeObjectAddress = nativeObjectAddress;
  }

  public long getSize() {
    return nativeGetSize(mNativeObjectAddress);
  }

  public byte[] getData() {
    return nativeGetData(mNativeObjectAddress);
  }

  private native long nativeGetSize(long messageAddr);

  private native byte[] nativeGetData(long messageAddr);

}
