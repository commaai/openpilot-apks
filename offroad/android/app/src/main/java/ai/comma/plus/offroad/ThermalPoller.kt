package ai.comma.plus.offroad

import ai.comma.openpilot.cereal.Log
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import org.capnproto.MessageReader
import org.capnproto.Serialize
import org.zeromq.ZMQ
import java.io.IOException
import java.nio.ByteBuffer

/**
 * Created by batman on 12/4/17.
 */

data class ThermalSample(
        val freeSpace: Float,
        val started: Boolean
) {
    fun toWritableMap(): WritableMap {
        val map = WritableNativeMap()
        map.putInt("freeSpace", (freeSpace*100).toInt())
        map.putBoolean("started", started)
        return map
    }

    companion object {
        fun readFromThermalEvent(reader: Log.ThermalData.Reader): ThermalSample {
            return ThermalSample(
                    reader.freeSpace,
                    reader.started
            )
        }
    }
}

interface ThermalPollerDelegate {
    fun onThermalDataChanged(thermalSample: ThermalSample)
}

class ThermalPoller(val delegate: ThermalPollerDelegate) {
    val zmqCtx: ZMQ.Context
    val thermalThreadHandle: Thread
    var thermalSock: ZMQ.Socket? = null
    var running: Boolean = false
    var lastThermal: ThermalSample? = null

    init {
        thermalThreadHandle = Thread(Runnable {
            thermalThread()
        })
        zmqCtx = ZMQ.context(1)
    }

    fun thermalThread() {
        while (true) {
            if (!running) break

            val msg = thermalSock!!.recv()
            if (msg == null || msg.size < 4) {
                continue
            }
            val msgbuf = ByteBuffer.wrap(msg)
            var reader: MessageReader
            try {
                reader = Serialize.read(msgbuf)
            } catch (e: IOException) {
                android.util.Log.e("offroad", "read")
                continue
            }

            val log = reader.getRoot(Log.Event.factory)
            assert(log.isNavStatus)

            val thermalEvent = log.thermal
            try {
                val thermal = ThermalSample.readFromThermalEvent(thermalEvent)
                if (thermal != lastThermal) {
                    delegate.onThermalDataChanged(thermal)
                }

                lastThermal = thermal
            } catch(e: IOException) {
                android.util.Log.e("offroad", "bad thermal", e)
            }
        }
    }

    fun start() {
        running = true
        thermalSock = zmqCtx.socket(ZMQ.SUB)
        thermalSock!!.connect("tcp://127.0.0.1:8005")
        thermalSock!!.subscribe("")
        thermalThreadHandle.start()
    }

    fun stop() {
        running = false
        thermalSock!!.disconnect("tcp://127.0.0.1:8005")
    }
}
