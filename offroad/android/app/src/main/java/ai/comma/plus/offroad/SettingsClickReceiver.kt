package ai.comma.plus.offroad

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.IBinder
import android.provider.Settings
import android.util.Log

/**
 * Created by batman on 11/29/17.
 */
interface SettingsClickReceiverDelegate {
    fun onSettingsClicked()
}

class SettingsClickReceiver(val delegate: SettingsClickReceiverDelegate) : BroadcastReceiver() {
    companion object {
        val ACTION_TOUCH_UP_INSIDE = "ai.comma.plus.SidebarSettingsTouchUpInside"
        val pressIntentFilter = IntentFilter(ACTION_TOUCH_UP_INSIDE)
    }

    override fun onReceive(context: Context?, intent: Intent?) {
        Log.d("chffr", "receive broadcast ${intent?.action}")
        if (intent?.action == ACTION_TOUCH_UP_INSIDE) {
            delegate.onSettingsClicked()
        }
    }
}
