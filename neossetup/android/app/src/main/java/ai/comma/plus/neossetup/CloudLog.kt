package ai.comma.plus.neossetup

/**
 * Created by batman on 5/8/17.
 */


import java.io.*

import org.json.*

import android.content.Context
import android.util.Log

import com.logentries.logger.AsyncLoggingWorker
import com.logentries.misc.Utils

object CloudLog {
    internal var worker: AsyncLoggingWorker? = null
    internal var ctx = JSONObject()

    @Synchronized
    fun init(appCtx: Context, token: String) {
        if (worker != null) return

        //        String leToken = "e53e6e1d-2b4a-46ae-847a-ff8e8e835f38";
        try {
            worker = AsyncLoggingWorker(appCtx, true, false, token, null, 0, true)
        } catch (e: IOException) {
        }

        bind("host", Utils.getHostName())
        bind("trace_id", Utils.getTraceID())
        bind("pkg", appCtx.packageName)
    }

    @Synchronized
    fun bind(obj: JSONObject) {
        // Merges provided obj into ctx. Will overwrite key
        // if already exists in ctx.

        val objKeys = obj.keys()
        while (objKeys.hasNext()) {
            val key = objKeys.next()
            try {
                bind(key, obj.get(key))
            } catch (e: JSONException) {
                CloudLog.exception("CloudLog.bind", e)
            }

        }
    }

    @Synchronized
    fun bind(key: String, value: Any) {
        try {
            ctx.put(key, value)
        } catch (e: JSONException) {
            e.printStackTrace()
        }

    }

    @Synchronized internal fun emit(msg: Any) {
        if (worker == null) {
            return
        }

        try {
            val obj = JSONObject()
            obj.put("msg", msg)

            obj.put("ctx", ctx)

            val ts = System.currentTimeMillis() / 1000.0
            obj.put("created", "" + ts)

            obj.put("src", "JCloudLog")

            val line = obj.toString()
            worker!!.addLineToQueue(line)

        } catch (e: JSONException) {
            e.printStackTrace()
        }

    }

    fun log(message: String) {
        Log.v("chffrc", message)
        emit(message)
    }

    fun event(event: String, mapInfo: JSONObject) {
        try {
            Log.v("chffrc", "event: ${event}")
            val evt = JSONObject()
            evt.put("event", event)
            mapInfo.keys().forEach {
                evt.put(it, mapInfo.get(it))
            }

            emit(evt)
        } catch(e: JSONException) {
            e.printStackTrace()
        }
    }

    fun event(event: String, vararg mapInfo: Any) {
        val evt = JSONObject()
        try {
            Log.v("chffrc", "event: ${event}")
            evt.put("event", event)
            if (mapInfo.size % 2 != 0) {
                evt.put("error", "event arguments not event")
            }

            var i = 0
            while (i < mapInfo.size) {
                val o1 = mapInfo[i]
                if (o1 !is String) {
                    evt.put("error", "argument not a string: " + o1.toString())
                    i += 2
                    continue
                }
                val o2 = mapInfo[i + 1]
                try {
                    evt.put(o1, o2)
                } catch (e: JSONException) {
                    evt.put(o1, o2.toString())
                }

                i += 2
            }

            Log.v("chffrc", evt.toString())
            emit(evt)
        } catch (e: JSONException) {
            e.printStackTrace()
        }

    }

    fun exception(message: String, exception: Throwable) {
        Log.v("chffrc", "exception: " + message)

        val writer = StringWriter()
        val printWriter = PrintWriter(writer)
        exception.printStackTrace(printWriter)
        printWriter.flush()

        val stackTrace = writer.toString()

        Log.v("chffrc", "stacktrace:\n" + stackTrace)

        try {
            val msg = JSONObject()
            msg.put("exception", message)
            msg.put("info", exception.toString())
            msg.put("stacktrace", stackTrace)

            emit(msg)
        } catch (e: JSONException) {
            e.printStackTrace()
        }

    }

}