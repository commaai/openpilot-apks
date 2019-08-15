package ai.comma.plus.neossetup

import android.net.TrafficStats
import android.os.SystemClock
import android.util.Log
import java.util.*

/**
 * Created by andyhaden on 5/3/17.
 */
interface NetworkSpeedSamplerCallback {
    fun onSpeedMeasured(kbps: Double)
}

object NetworkSpeedSampler {
    fun requestSample(callback: NetworkSpeedSamplerCallback, durationMillis: Int) {
        val start = SystemClock.elapsedRealtimeNanos()
        val timer = Timer()
        timer.schedule(object: TimerTask() {
            var lastTxSample: Long = TrafficStats.getTotalTxBytes()
            var bytesSent: Long = 0

            override fun run() {
                val newTxSample: Long = TrafficStats.getTotalTxBytes()
                bytesSent += (newTxSample - lastTxSample)
                lastTxSample = newTxSample

                val elapsed = SystemClock.elapsedRealtimeNanos() - start
                if(elapsed > durationMillis * 1e6) {
                    val elapsedSeconds = elapsed / 1e9
                    val kbps = (bytesSent / elapsedSeconds) / 128

                    callback.onSpeedMeasured(kbps)
                    cancel()
                }


            }
        }, 0, 500)
    }
}