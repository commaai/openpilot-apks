package ai.comma.plus.offroad

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.ConnectivityManager
import android.net.NetworkInfo
import android.net.wifi.*
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

/**
 * Created by batman on 12/7/17.
 */
class WifiModule (ctx: ReactApplicationContext) : ReactContextBaseJavaModule(ctx){
    val networkMonitor = NetworkMonitor()

    override fun getName() = "ChffrWifiModule"

    override fun initialize() {
        super.initialize()
        val filter = IntentFilter(WifiManager.NETWORK_STATE_CHANGED_ACTION)
        filter.addAction(WifiManager.SUPPLICANT_STATE_CHANGED_ACTION)
        reactApplicationContext.registerReceiver(networkMonitor, filter)
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        reactApplicationContext.unregisterReceiver(networkMonitor)
    }

    @ReactMethod
    fun listAvailableNetworks(promise: Promise) {
        val scanner = WifiScanner(reactApplicationContext, object : WifiScanListener {
            override fun onReceiveScanResults(results: List<ScanResult>, wifiInfo: WifiInfo) {
                val networks = results
                        .filter {
                            it.SSID != ""
                        }.fold(listOf<ScanResult>(), { acc, result ->
                    // deduplicates results by SSID, choosing highest signal strength result for dupes

                    val existingResult = acc.find { it.SSID == result.SSID }
                    if ((existingResult?.level ?: -5000) < result.level) {
                        acc.filter { it.SSID != result.SSID } + result
                    } else {
                        acc
                    }
                }).map {
                    val network = WritableNativeMap()
                    val security = if (it.capabilities.contains("WPA")) "WPA" else if (it.capabilities.contains("WEP")) "WEP" else "Unsecured"

                    network.putString("ssid", it.SSID)
                    network.putString("security", security)
                    network.putInt("level", WifiManager.calculateSignalLevel(it.level, 4))
                    network.putBoolean("isConnected", it.SSID == wifiInfo.ssid.replace("\"", "") && wifiInfo.supplicantState.equals(SupplicantState.COMPLETED))

                    network
                }.toNativeArray()

                promise.resolve(networks)
            }
        })

        if (!scanner.startScan()) {
            promise.reject("ESCAN", "WifiScanner did not start")
        }
    }

    @ReactMethod
    fun connect(ssid: String, password: String?, promise: Promise) {
        val ssidQuoted = "\"" + ssid + "\""
        val conf = WifiConfiguration()
        conf.SSID = ssidQuoted

        if (password != null) {
            conf.preSharedKey = "\"" + password + "\""
        } else {
            conf.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.NONE);
        }
        val wifiManager = reactApplicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
        if(wifiManager.isWifiEnabled == false) {
            wifiManager.setWifiEnabled(true)
        }
        var netId: Int = -1
        var existingNetworkIds = listOf<Int>()

        if(wifiManager.configuredNetworks != null) {
            existingNetworkIds = wifiManager.configuredNetworks.filter { it.SSID == ssidQuoted || it.SSID == ssid }.map { it.networkId }
            // Filter existing network IDs to those that could not be removed
            existingNetworkIds = existingNetworkIds.filter { !wifiManager.removeNetwork(it) }
            if (existingNetworkIds.size == 0) {
                // Add new network if we could remove all
                netId = wifiManager.addNetwork(conf)
            }
        }

        if (netId.equals(-1)) {
            val existingNetworkId = existingNetworkIds.firstOrNull()
            if (existingNetworkId != null) {
                // network matching SSID already exists, use it
                netId = existingNetworkId
            } else {
                // addNetwork failed and no network already exists
                promise.reject("E_WIFI_ERR", "WifiManager could not add network. Are the SSID and password proper?")
                return
            }
        }

        val didEnable = wifiManager.enableNetwork(netId, true)
        if (didEnable) {
            wifiManager.saveConfiguration()
            wifiManager.reconnect()
            promise.resolve(null)
        } else {
            promise.reject("E_WIFI_ERR", "WifiManager could not enable the network ${netId}.")
        }
    }

    @ReactMethod
    fun disable(promise: Promise) {
        val wifiManager = reactApplicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
        val connection = wifiManager.connectionInfo
        if (connection != null) {
            wifiManager.disableNetwork(connection.networkId)
            promise.resolve(true);
        } else {
            promise.resolve(false);
        }
    }

    @ReactMethod
    fun disconnect(promise: Promise) {
        val wifiManager = reactApplicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
        val didDisconnect = wifiManager.disconnect()
        if (didDisconnect) {
            promise.resolve(true)
        } else {
            promise.reject("EDISCONNECT", "wifiManager.disconnect failed. See logcat for details")
        }
    }

    fun onNetworkStateChange(wifiInfo: WifiInfo, isConnected: Boolean, hasAuthProblem: Boolean) {
        val wifiState = WritableNativeMap()

        wifiState.putBoolean("isConnected", isConnected)
        wifiState.putString("connectedSsid", wifiInfo.ssid.removePrefix("\"").removeSuffix("\""))
        wifiState.putBoolean("hasAuthProblem", hasAuthProblem)

        emit("onWifiStateChange", wifiState)
    }

    fun emit(name: String, map: WritableMap) {
        reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit(name, map)
    }

    inner class NetworkMonitor : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            when (intent.action) {
                WifiManager.NETWORK_STATE_CHANGED_ACTION -> {
                    val wifiInfo = intent.getParcelableExtra<WifiInfo>(WifiManager.EXTRA_WIFI_INFO)
                    val networkInfo = intent.getParcelableExtra<NetworkInfo>(WifiManager.EXTRA_NETWORK_INFO)

                    if (wifiInfo != null) {
                        onNetworkStateChange(wifiInfo, networkInfo?.isConnected ?: false, false)
                    }
                }

                WifiManager.SUPPLICANT_STATE_CHANGED_ACTION -> {
                    val hasAuthProblem = intent.getIntExtra(WifiManager.EXTRA_SUPPLICANT_ERROR, -1) == WifiManager.ERROR_AUTHENTICATING
                    if (hasAuthProblem) {
                        val wm = reactApplicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
                        val wifiInfo = wm.connectionInfo
                        val cm = reactApplicationContext.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

                        if (wifiInfo != null) {
                            onNetworkStateChange(wifiInfo, cm.activeNetworkInfo?.isConnected ?: false, hasAuthProblem)
                        }
                    }
                }
            }
        }
    }
}
