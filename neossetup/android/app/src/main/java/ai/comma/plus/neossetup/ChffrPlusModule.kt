package ai.comma.plus.neossetup

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.net.wifi.WifiManager
import android.provider.Settings
import com.facebook.react.bridge.*
import java.io.IOException
import com.facebook.react.modules.core.DeviceEventManagerModule
import android.telephony.TelephonyManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactMethod
import android.content.BroadcastReceiver
import com.facebook.react.bridge.WritableNativeMap
import android.net.NetworkInfo
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.net.ConnectivityManager
import android.net.wifi.WifiInfo
import android.os.Environment
import android.os.StatFs
import android.util.Log

import android.os.AsyncTask;
import java.net.URL;
import java.net.HttpURLConnection;
import java.io.File;
import java.io.BufferedReader
import java.io.InputStream
import java.io.InputStreamReader
import java.io.FileOutputStream
import java.io.DataInputStream
import java.io.DataOutputStream


/**
 * Created by batman on 11/2/17.
 */
class ChffrPlusModule(val ctx: ReactApplicationContext) :
        ReactContextBaseJavaModule(ctx) {
    val WIFI_STATE_EVENT_NAME = "WIFI_STATE_CHANGED"
    val SIM_STATE_EVENT_NAME = "SIM_STATE_CHANGED"

    private var networkMonitor: NetworkMonitor? = null

    override fun getName(): String = "ChffrPlus"

    override fun initialize() {
        super.initialize()

        networkMonitor = NetworkMonitor()
        val filter = IntentFilter(WifiManager.NETWORK_STATE_CHANGED_ACTION)
        filter.addAction("android.intent.action.SIM_STATE_CHANGED")
        filter.addAction(ConnectivityManager.CONNECTIVITY_ACTION)
        ctx.registerReceiver(networkMonitor, filter)
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()

        Log.d("neossetup", "catalyst destroyed")
        ctx.unregisterReceiver(networkMonitor)
    }

    private fun startActivityWithIntent(intent: Intent) {
        val currentActivity = currentActivity

        if (currentActivity != null) {
            currentActivity.startActivity(intent)
        } else {
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(intent)
        }
    }

    class DownloadApp(private var module: ChffrPlusModule?) : AsyncTask<String, String, String>() {
        override fun doInBackground(vararg link: String): String {
            val outputPath = "/data/data/ai.comma.plus.neossetup/installer"
            try {
                val url = URL(link[0])
                val conn = url.openConnection() as HttpURLConnection
                conn.setRequestProperty("User-Agent", "NEOSSetup-0.1")
                conn.doOutput = true
                conn.connect()

                val responseCode: Int = conn.responseCode
                val responseMsg: String = conn.responseMessage
                Log.d("neossetup", "responseCode - " + responseCode)
                Log.d("neossetup", "responseMessage - " + responseMsg)

                if (responseCode == 200) {
                    val contentLength = conn.getContentLength()
                    val inStream = DataInputStream(conn.getInputStream())
                    val buffer = ByteArray(contentLength)
                    inStream.readFully(buffer);
                    inStream.close();

                    var tmpPath: String = outputPath + ".tmp"
                    val foStream = FileOutputStream(tmpPath)
                    val outStream = DataOutputStream(foStream)
                    outStream.write(buffer)
                    outStream.flush()
                    outStream.close()

                    File(tmpPath).renameTo(File(outputPath))
                    return "succeeded"
                }
            } catch (ex: Exception) {
                Log.d("neossetup", "Error in doInBackground " + ex.message)
                return "failed"
            }
            return ""
        }

        override fun onPreExecute() {
            super.onPreExecute()
        }

        override fun onPostExecute(result: String?) {
            super.onPostExecute(result)
            if (result == "succeeeded") {
                Log.d("neossetup", result)
            } else {
              // log network error
            }
        }
    }

    @ReactMethod
    fun startInstaller(link: String) {
        Log.d("neossetup installer", link);
        DownloadApp(this).execute(link)
    }

    @ReactMethod
    fun sendBroadcast(action: String) {
        val intent = Intent(action)
        currentActivity?.sendBroadcast(intent)
    }

    @ReactMethod
    fun isNavAvailable(promise: Promise) {
        val pm = reactApplicationContext.packageManager
        val packages = pm.getInstalledApplications(PackageManager.GET_META_DATA).map { it.packageName }
        promise.resolve(packages.contains("com.waze"))
    }

    @ReactMethod
    fun getImei(promise: Promise) {
        try {
            val c = Class.forName("android.os.SystemProperties")
            val get = c.getMethod("get", String::class.java, String::class.java)
            var imei = get.invoke(c, "oem.device.imeicache", "") as String
            if (imei == "") {
                imei = "000000000000000"
            }

            promise.resolve(imei)
        } catch (e: Exception) {
            CloudLog.exception("NeosSetupReactModule.getImei", e)
            promise.reject("couldn't get imei", e)
        }
    }

    @ReactMethod
    fun getNetworkTxSpeedKbps(promise: Promise) {
        NetworkSpeedSampler.requestSample(object : NetworkSpeedSamplerCallback {
            override fun onSpeedMeasured(kbps: Double) {
                promise.resolve(kbps)
            }
        }, 1000)
    }

    @ReactMethod
    fun setSshEnabled(enabled: Boolean) {
        try {
            val c = Class.forName("android.os.SystemProperties")
            val set = c.getMethod("set", String::class.java, String::class.java)
            set.invoke(c, "persist.neos.ssh", if (enabled) "1" else "0")
        } catch(e: Exception) {
            CloudLog.exception("NeosSetupReactModule.setSshEnabled", e)
        }
    }

    @ReactMethod
    fun getSshEnabled(promise: Promise) {
        try {
            val c = Class.forName("android.os.SystemProperties")
            val get = c.getMethod("get", String::class.java, String::class.java)
            val isSshEnabled = get.invoke(c, "persist.neos.ssh", "0") as String
            promise.resolve(isSshEnabled == "1")
        } catch (e: Exception) {
            CloudLog.exception("NeosSetupReactModule.getSshEnabled", e)
            promise.reject("couldn't get ssh enabled", e)
        }
    }

    @ReactMethod
    fun getSerialNumber(promise: Promise) {
        try {
            val c = Class.forName("android.os.SystemProperties")
            val get = c.getMethod("get", String::class.java, String::class.java)
            val serialNo = get.invoke(c, "ro.serialno", "") as String
            promise.resolve(serialNo)
        } catch (e: Exception) {
            CloudLog.exception("NeosSetupReactModule.getSerialNumber", e)
            promise.reject("couldn't get serial number", e)
        }

    }

    @ReactMethod
    fun readParam(param: String, promise: Promise) {
        promise.resolve(ChffrPlusParams.readParam(param))
    }

    @ReactMethod
    fun deleteParam(key: String, promise: Promise) {
        promise.resolve(ChffrPlusParams.deleteParam(key))
    }

    @ReactMethod
    fun writeParam(key: String, value: String) {
        ChffrPlusParams.writeParam(key, value)
    }

    @ReactMethod
    fun openWifiSettings() {
        val intent = Intent(WifiManager.ACTION_PICK_WIFI_NETWORK)
        intent.putExtra("extra_prefs_show_button_bar", true)
        startActivityWithIntent(intent)
    }

    @ReactMethod
    fun openBluetoothSettings() {
        val intent = Intent(Settings.ACTION_BLUETOOTH_SETTINGS)
        intent.putExtra("extra_prefs_show_button_bar", true)
        startActivityWithIntent(intent)
    }

    @ReactMethod
    fun openTetheringSettings() {
        val intent = Intent("android.intent.action.MAIN")
        intent.component = ComponentName("com.android.settings", "com.android.settings.TetherSettings")
        intent.putExtra("extra_prefs_show_button_bar", true)
        startActivityWithIntent(intent)
    }

    @ReactMethod
    fun openCellularSettings() {
        val intent = Intent(Settings.ACTION_NETWORK_OPERATOR_SETTINGS)
        intent.putExtra("extra_prefs_show_button_bar", true)
        startActivityWithIntent(intent)
    }

    @ReactMethod
    fun openDateTimeSettings() {
        val intent = Intent(Settings.ACTION_DATE_SETTINGS)
        intent.putExtra("extra_prefs_show_button_bar", true)
        startActivityWithIntent(intent)
    }

    @ReactMethod
    fun reboot() {
        try {
            // IPowerManager.reboot(confirm=false, reason=0, wait=true)
            Runtime.getRuntime().exec(arrayOf("/system/bin/su", "-c", "service call power 16 i32 0 i32 0 i32 1"))
        } catch (e: IOException) {
            CloudLog.exception("NeosSetupReactModule.reboot", e)
        }

    }

    @ReactMethod
    fun shutdown() {
        try {
            Runtime.getRuntime().exec(arrayOf("/system/bin/su", "-c", "service call power 17 i32 0 i32 1"))
        } catch (e: IOException) {
            CloudLog.exception("NeosSetupReactModule.shutdown", e)
        }
    }

    @ReactMethod
    fun getSimState(promise: Promise) {
        promise.resolve(getCellState())
    }

    @ReactMethod
    fun getBytesUsed(promise: Promise) {
        val path = Environment.getDataDirectory()
        val stat = StatFs(path.path)
        val blockSize = stat.blockSizeLong
        val availableBlocks = stat.availableBlocksLong

        promise.resolve((availableBlocks * blockSize).toString())
    }

    fun getWifiStateMap(wifiInfo: WifiInfo? = null, networkInfo: NetworkInfo? = null): ReadableNativeMap {
        val map = WritableNativeMap()
        var isConnected: Boolean
        var state: String?
        var ssid: String?

        if (wifiInfo != null && networkInfo != null) {
            isConnected = networkInfo.isConnected
            state = networkInfo.state.toString()
            ssid = wifiInfo.ssid.removePrefix("\"").removeSuffix("\"")
        } else {
            val wifiManager = ctx.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
            val connManager = ctx.applicationContext.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
            val netInfo = connManager.activeNetworkInfo
            isConnected = (netInfo?.isConnected ?: false) && netInfo?.type == ConnectivityManager.TYPE_WIFI
            state = netInfo?.state.toString()
            ssid = wifiManager.connectionInfo?.ssid?.removePrefix("\"")?.removeSuffix("\"")
        }

        if (ssid == "<unknown ssid>") ssid = null

        map.putBoolean("isConnected", isConnected)
        map.putString("state", state)
        map.putString("ssid", ssid)

        return map
    }

    @ReactMethod
    fun getWifiState(promise: Promise) {
        promise.resolve(getWifiStateMap())
    }

    fun notifyWifiStateChange(intent: Intent?) {
        if (reactApplicationContext.hasActiveCatalystInstance()) {
            var wifiInfo: WifiInfo? = null
            var netInfo: NetworkInfo? = null
            if (intent != null) {
                wifiInfo = intent.getParcelableExtra<WifiInfo>(WifiManager.EXTRA_WIFI_INFO)
                netInfo = intent.getParcelableExtra<NetworkInfo>(WifiManager.EXTRA_NETWORK_INFO)
            }
            val params = getWifiStateMap(wifiInfo, netInfo)

            reactApplicationContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit(WIFI_STATE_EVENT_NAME, params)
        } else {
            Log.d("neossetup", "no active catalyst instance")
        }
    }

    fun getCellState(): NativeMap {
        val telManager = reactApplicationContext.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
        val simState = when (telManager.simState) {
            TelephonyManager.SIM_STATE_ABSENT -> "ABSENT"
            TelephonyManager.SIM_STATE_READY -> "READY"
            else -> "UNKNOWN"
        }

        val networkType = when (telManager.networkType) {
            TelephonyManager.NETWORK_TYPE_GPRS, TelephonyManager.NETWORK_TYPE_EDGE, TelephonyManager.NETWORK_TYPE_CDMA, TelephonyManager.NETWORK_TYPE_1xRTT, TelephonyManager.NETWORK_TYPE_IDEN ->
                "2G"
            TelephonyManager.NETWORK_TYPE_EVDO_0, TelephonyManager.NETWORK_TYPE_EVDO_A, TelephonyManager.NETWORK_TYPE_HSDPA, TelephonyManager.NETWORK_TYPE_HSUPA, TelephonyManager.NETWORK_TYPE_HSPA, TelephonyManager.NETWORK_TYPE_EVDO_B, TelephonyManager.NETWORK_TYPE_EHRPD, TelephonyManager.NETWORK_TYPE_HSPAP ->
                "3G"
            TelephonyManager.NETWORK_TYPE_LTE ->
                "LTE"
            else -> {
                if (simState == "ABSENT") {
                    "No SIM"
                } else {
                    null
                }
            }
        }

        val map = WritableNativeMap()
        map.putString("networkType", networkType)
        map.putString("simState", simState)

        return map
    }

    fun notifySimStateChange(intent: Intent) {
        if (reactApplicationContext.hasActiveCatalystInstance()) {
            val cellState = getCellState()
            reactApplicationContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit(SIM_STATE_EVENT_NAME, cellState)
        }
    }

    internal inner class NetworkMonitor : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            when (intent.action) {
                WifiManager.NETWORK_STATE_CHANGED_ACTION -> notifyWifiStateChange(intent)
                "android.intent.action.SIM_STATE_CHANGED" -> notifySimStateChange(intent)
                ConnectivityManager.CONNECTIVITY_ACTION -> notifyWifiStateChange(null)
            }
        }
    }
}
