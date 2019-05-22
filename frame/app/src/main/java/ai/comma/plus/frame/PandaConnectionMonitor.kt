package ai.comma.plus.frame

import android.util.Log
import java.io.BufferedReader
import java.io.IOException
import java.io.InputStreamReader


/**
 * Created by batman on 12/7/17.
 */
interface PandaConnectionMonitorDelegate {
    fun pandaConnectionChanged(isConnected: Boolean)
}

class PandaConnectionMonitor(val delegate: PandaConnectionMonitorDelegate) {
    val pandaConnectionThreadHandle: Thread
    var isConnected: Boolean = false
    var isRunning: Boolean = true

    init {
        pandaConnectionThreadHandle = Thread(Runnable {
            pollPandaConnection()
        })
        pandaConnectionThreadHandle.start()
    }

    fun pollPandaConnection() {
        while (isRunning) {
            var process: Process? = null
            var newIsConnected = false

            try {
                process = Runtime.getRuntime().exec("lsusb")
                val reader = BufferedReader(InputStreamReader(process.inputStream))

                var line = reader.readLine()
                while (line != null) {
                    if (line.contains("bbaa")) {
                        newIsConnected = true
                    }
                    line = reader.readLine()
                }
            } catch (e: IOException) {
                Log.e("frame", "lsusb failed", e)
            } finally {
                process?.destroy()

                if (isConnected != newIsConnected) {
                    isConnected = newIsConnected
                    delegate.pandaConnectionChanged(isConnected)
                }
            }

            Thread.sleep(5000)
        }
    }

    fun destroy() {
        isRunning = false
    }
}