package ai.comma.plus.offroad;

import android.os.SystemClock;

import ai.comma.openpilot.cereal.Log;
import org.capnproto.MessageBuilder;

public class LogEvent {
    public MessageBuilder msg;
    public Log.Event.Builder root;

    public LogEvent() {
        msg = new MessageBuilder();
        root = msg.initRoot(Log.Event.factory);
        root.setLogMonoTime(SystemClock.elapsedRealtimeNanos());
    }
}
