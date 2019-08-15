/**
 * Created by batman on 12/7/17.
 */
package ai.comma.plus.neossetup

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.wifi.ScanResult
import android.net.wifi.WifiInfo
import android.net.wifi.WifiManager

/**
 * Created by batman on 5/3/17.
 */

interface WifiScanListener {
    fun onReceiveScanResults(results: List<ScanResult>, wifiInfo: WifiInfo)
}

class WifiScanner(val ctx: Context,
                  val wifiScanListener: WifiScanListener): BroadcastReceiver() {
    val wifi_manager = ctx.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
    val filter = IntentFilter()

    init {
        filter.addAction("android.net.wifi.SCAN_RESULTS")
    }

    fun startScan(): Boolean {
        android.util.Log.v("chffr", "WifiLogger start_scan")
        try {
            ctx.registerReceiver(this, filter, null, null)
            return wifi_manager.startScan()
        } catch(e: NullPointerException) {
            CloudLog.exception("WifiLogger.startScan", e)
            return false
        }

    }

    override fun onReceive(ctx: Context, intent: Intent) {
        if (intent.action != "android.net.wifi.SCAN_RESULTS") {
            return
        }

        android.util.Log.v("chffr", "WifiLogger onReceive")
        try {
            val results = wifi_manager.scanResults
            if (results != null) {
                wifiScanListener.onReceiveScanResults(results, wifi_manager.connectionInfo)
            }
            try {
                ctx.unregisterReceiver(this)
            } catch (e: IllegalArgumentException) {
                android.util.Log.e("chffr", "Sensors.stop could not unregister receiver" + e.toString())
            }
        } catch(e: SecurityException) {
            wifiScanListener.onReceiveScanResults(listOf(), wifi_manager.connectionInfo)
        }
    }
}
