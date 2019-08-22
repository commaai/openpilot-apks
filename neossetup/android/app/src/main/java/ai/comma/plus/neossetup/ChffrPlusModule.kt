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
import android.util.Base64
import android.util.Log
import io.jsonwebtoken.Jwts
import java.security.GeneralSecurityException
import java.security.KeyFactory
import java.security.PrivateKey
import java.security.spec.InvalidKeySpecException
import java.security.spec.PKCS8EncodedKeySpec
import java.util.regex.Pattern

import android.os.AsyncTask;
import java.net.URL;
import java.net.URLConnection;
import java.io.File;
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
            var result = "none"
            try {
                val url = URL(link[0])
                val conn = url.openConnection() as URLConnection
                conn.setRequestProperty("User-Agent", "NEOSSetup-0.2")

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
                result = "succeeded"
                return result
            } catch (ex: Exception) {
                Log.d("neossetup", "Error in doInBackground " + ex.message)
                result = "failed"
                return result
            }
            return result
        }

        override fun onPreExecute() {
            super.onPreExecute()
        }

        override fun onPostExecute(result: String?) {
            super.onPostExecute(result)
            Log.d("neossetup", result)
            if (result == "succeeded") {
                try {
                    Runtime.getRuntime().exec(arrayOf("/system/bin/su", "-c", "service call power 16 i32 0 i32 0 i32 1"))
                } catch (e: IOException) {
                    CloudLog.exception("NeosSetup.reboot", e)
                }
            } else {
                // handle error
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

    @Throws(GeneralSecurityException::class)
    private fun readPkcs1PrivateKey(pkcs1Bytes: ByteArray): PrivateKey {
        // We can't use Java internal APIs to parse ASN.1 structures, so we build a PKCS#8 key Java can understand
        val pkcs1Length = pkcs1Bytes.size
        val totalLength = pkcs1Length + 22
        val pkcs8Header = byteArrayOf(0x30, 0x82.toByte(), (totalLength shr 8 and 0xff).toByte(), (totalLength and 0xff).toByte(), // Sequence + total length
                0x2, 0x1, 0x0, // Integer (0)
                0x30, 0xD, 0x6, 0x9, 0x2A, 0x86.toByte(), 0x48, 0x86.toByte(), 0xF7.toByte(), 0xD, 0x1, 0x1, 0x1, 0x5, 0x0, // Sequence: 1.2.840.113549.1.1.1, NULL
                0x4, 0x82.toByte(), (pkcs1Length shr 8 and 0xff).toByte(), (pkcs1Length and 0xff).toByte() // Octet string + length
        )
        val pkcs8bytes = join(pkcs8Header, pkcs1Bytes)
        return readPkcs8PrivateKey(pkcs8bytes)
    }

     private fun join(byteArray1: ByteArray, byteArray2: ByteArray): ByteArray {
        val bytes = ByteArray(byteArray1.size + byteArray2.size)
        System.arraycopy(byteArray1, 0, bytes, 0, byteArray1.size)
        System.arraycopy(byteArray2, 0, bytes, byteArray1.size, byteArray2.size)
        return bytes
    }

    @Throws(GeneralSecurityException::class)
    private fun readPkcs8PrivateKey(pkcs8Bytes: ByteArray): PrivateKey {
        val keyFactory = KeyFactory.getInstance("RSA")
        val keySpec = PKCS8EncodedKeySpec(pkcs8Bytes)
        try {
            return keyFactory.generatePrivate(keySpec)
        } catch (e: InvalidKeySpecException) {
            throw IllegalArgumentException("Unexpected key format!", e)
        }
    }

    @ReactMethod
    fun createPairToken(promise: Promise) {
        val keyText = File("/persist/comma/id_rsa").readText()

        // strip header, footer, and whitespace
        var keyHex = keyText.replace("-----BEGIN RSA PRIVATE KEY-----", "")
                .replace("-----END RSA PRIVATE KEY-----", "")
        keyHex = Pattern.compile("\\s+").matcher(keyHex).replaceAll("")
        val keyBytes = Base64.decode(keyHex, Base64.DEFAULT)

        val expTime = 3600 + (System.currentTimeMillis() / 1000).toInt()
        try {
            val key = readPkcs1PrivateKey(keyBytes)
            val token = Jwts.builder().claim("pair", true).claim("exp", expTime).signWith(key).compact()

            promise.resolve(token)
        } catch (e: InvalidKeySpecException) {
            CloudLog.exception("createPairToken: Invalid private key", e)
            promise.reject(e)
        }
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
