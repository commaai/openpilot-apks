package ai.comma.messaging;

public class Poller {
  static {
    Loader.loadLibrary();
  }

  private long mNativeObjAddress = 0;

  public Poller() {
    this(new SubSocket[0]);
  }

  public Poller(SubSocket[] sockets) {
    long[] socketAddrs = new long[sockets.length];

    for(int i = 0; i < sockets.length; i++) {
      socketAddrs[i] = sockets[i].getNativeAddress();
    }

    mNativeObjAddress = create(socketAddrs);
  }

  public SubSocket[] poll(int timeout) {
    long[] socketAddresses = nativePoll(mNativeObjAddress, timeout);
    SubSocket[] sockets = new SubSocket[socketAddresses.length];
    for(int i = 0; i < socketAddresses.length; i++) {
      sockets[i] = new SubSocket(socketAddresses[i]);
    }

    return sockets;
  }

  public void registerSocket(SubSocket socket) {
    nativeRegisterSocket(mNativeObjAddress, socket.getNativeAddress());
  }

  public long getNativeAddress() {
    return mNativeObjAddress;
  }

  private native void nativeRegisterSocket(long pollerAddr, long socketAddr);
  private native long[] nativePoll(long pollerAddr, int timeout);
  public static native long create(long[] sockets);
}
