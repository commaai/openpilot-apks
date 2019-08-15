package ai.comma.plus.neossetup

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.telephony.PhoneStateListener
import android.telephony.ServiceState
import android.telephony.SignalStrength
import android.telephony.TelephonyManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactMethod



/**
 * Created by batman on 12/7/17.
 */
class CellularModule(ctx: ReactApplicationContext) : ReactContextBaseJavaModule(ctx) {
    private val EVENT_SERVICE_STATE_CHANGED = "onCellularServiceStateChange"
    private val EVENT_SIM_STATE_CHANGED = "onSimStateChange"
    private val simMonitor = SimMonitor()

    override fun getName() = "ChffrCellularModule"

    override fun initialize() {
        super.initialize()

        val cellStateListener = CellStateListener()
        val teleManager = reactApplicationContext.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
        teleManager.listen(cellStateListener, PhoneStateListener.LISTEN_SERVICE_STATE)

        val simIntentFilter = IntentFilter("android.intent.action.SIM_STATE_CHANGED")
        reactApplicationContext.registerReceiver(simMonitor, simIntentFilter)
    }

    override fun onCatalystInstanceDestroy() {
        reactApplicationContext.unregisterReceiver(simMonitor)
        super.onCatalystInstanceDestroy()
    }


    @ReactMethod
    fun getSimState(promise: Promise) {
        val tm = reactApplicationContext.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
        val simState = tm.simState
        when (simState) {
            TelephonyManager.SIM_STATE_ABSENT -> promise.resolve("ABSENT")
            TelephonyManager.SIM_STATE_READY -> promise.resolve("READY")

            else -> promise.resolve("UNKNOWN")
        }
    }

    @ReactMethod
    fun getNetworkState(promise: Promise) {
        val tm = reactApplicationContext.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
        var networkName = tm.getNetworkOperatorName()
        if (networkName != null && networkName.length == 0 ){
            networkName = null
        }

        val isInService = tm.allCellInfo.any { it.isRegistered }

        val serviceStateMap = WritableNativeMap()
        serviceStateMap.putString("networkName", networkName)
        serviceStateMap.putBoolean("isInService", isInService)

        promise.resolve(serviceStateMap)
    }

    fun emit(name: String, map: WritableMap) {
        reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit(name, map)
    }

    inner class SimMonitor : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            when (intent?.action) {
                "android.intent.action.SIM_STATE_CHANGED" -> {
                    val payload = WritableNativeMap()
                    payload.putString("simState", intent.getStringExtra("ss"))
                    emit(EVENT_SIM_STATE_CHANGED, payload)
                }
            }
        }
    }

    inner class CellStateListener: PhoneStateListener() {
        override fun onServiceStateChanged(serviceState: ServiceState?) {
            super.onServiceStateChanged(serviceState)

            val serviceStateMap = WritableNativeMap()
            serviceStateMap.putString("networkName", serviceState?.operatorAlphaLong)
            serviceStateMap.putBoolean("isInService", serviceState?.state == ServiceState.STATE_IN_SERVICE)

            emit(EVENT_SERVICE_STATE_CHANGED , serviceStateMap)
        }
    }
}
