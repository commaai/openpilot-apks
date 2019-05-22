package ai.comma.plus.frame;

import java.io.*;
import java.util.Iterator;

import org.json.*;

import android.content.Context;
import android.os.Build;
import android.util.Log;

import com.logentries.misc.Utils;
import com.logentries.logger.AsyncLoggingWorker;

public class CloudLog {
    static AsyncLoggingWorker worker;
    static JSONObject ctx = new JSONObject();

    public static synchronized void init(Context appCtx) {
        if (worker != null) return;

        String leToken = "8b1ad95b-6ebc-4ef7-99f3-992c9d1aa41d";
        try {
            worker = new AsyncLoggingWorker(appCtx, true, false, leToken, null, 0, true);
        } catch (IOException e) {}
        bind("host", Utils.getHostName());
        bind("trace_id", Utils.getTraceID());
        bind("pkg", appCtx.getPackageName());
        bind("manufacturer", Build.MANUFACTURER);
        bind("model", Build.MODEL);
    }

    public static synchronized void bind(JSONObject obj) {
        // Merges provided obj into ctx. Will overwrite key
        // if already exists in ctx.

        Iterator<String> objKeys = obj.keys();
        while(objKeys.hasNext()) {
            String key = objKeys.next();
            try {
                bind(key, obj.get(key));
            } catch(JSONException e) {
                CloudLog.exception("CloudLog.bind", e);
            }
        }
    }

    public static synchronized void bind(String key, Object value) {
        try {
            ctx.put(key, value);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    static synchronized void emit(Object msg) {
        if (worker == null) {
            return;
        }

        try {
            JSONObject obj = new JSONObject();
            obj.put("msg", msg);

            obj.put("ctx", ctx);

            double ts = System.currentTimeMillis() / 1000.0;
            obj.put("created", "" + ts);

            obj.put("src", "JCloudLog");

            String line = obj.toString();
            worker.addLineToQueue(line);

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public static void log(String message) {
        Log.v("chffrc", message);
        emit(message);
    }

    public static void event(String event, JSONObject map) {
        try {
            map.put("event", event);
            Log.v("chffrc", map.toString());

            emit(map);
        } catch(JSONException e) {
            e.printStackTrace();
            CloudLog.exception("CloudLog.event", e);
        }
    }


    public static void event(String event, Object... mapInfo) {
        JSONObject evt = new JSONObject();
        try {
            evt.put("event", event);
            if (mapInfo.length % 2 != 0) {
                evt.put("error", "event arguments not event");
            }

            for (int i=0; i<mapInfo.length; i += 2) {
                Object o1 = mapInfo[i];
                if (!(o1 instanceof String)) {
                    evt.put("error", "argument not a string: "+o1.toString());
                    continue;
                }
                String s = (String)o1;
                Object o2 = mapInfo[i+1];
                try {
                    evt.put(s, o2);
                } catch (JSONException e) {
                    evt.put(s, o2.toString());
                }
            }

            Log.v("chffrc", evt.toString());
            emit(evt);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public static void exception(String message, Throwable exception) {
        Log.v("chffrc", "exception: "+message);

        StringWriter writer = new StringWriter();
        PrintWriter printWriter = new PrintWriter(writer);
        exception.printStackTrace(printWriter);
        printWriter.flush();

        String stackTrace = writer.toString();

        Log.v("chffrc", "stacktrace:\n"+stackTrace);

        try {
            JSONObject msg = new JSONObject();
            msg.put("exception", message);
            msg.put("info", exception.toString());
            msg.put("stacktrace", stackTrace);

            emit(msg);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

}