package ai.comma.messaging;

public class Context {
  static {
    Loader.loadLibrary();
  }

  private long mNativeObjAddress = 0;

  public Context() {
    mNativeObjAddress = create();
  }

  public long getNativeAddress() {
    return mNativeObjAddress;
  }

  public SubSocket subSocket(String endpoint) {
    return new SubSocket(this, endpoint);
  }

  public PubSocket pubSocket(String endpoint) {
    return new PubSocket(this, endpoint);
  }


  public static native long create();
}
