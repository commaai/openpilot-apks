package ai.comma.plus.frame

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.IBinder
import android.util.Log

/**
 * Created by batman on 4/24/18.
 */
interface UiLayoutReceiverDelegate {
    fun uiLayoutOnSidebarExpanded()
    fun uiLayoutOnSidebarCollapsed()
    fun uiLayoutOnEngagedMocked()
    fun uiLayoutOnEngagedUnmocked()
    fun uiLayoutOnShowStartCar()
}

class UiLayoutReceiver(val delegate: UiLayoutReceiverDelegate) : BroadcastReceiver() {
    companion object {
        val ACTION_SIDEBAR_EXPANDED = "ai.comma.plus.frame.ACTION_SIDEBAR_EXPANDED"
        val ACTION_SIDEBAR_COLLAPSED = "ai.comma.plus.frame.ACTION_SIDEBAR_COLLAPSED"
        val ACTION_ENGAGED_MOCKED = "ai.comma.plus.frame.ACTION_ENGAGED_MOCKED"
        val ACTION_ENGAGED_UNMOCKED = "ai.comma.plus.frame.ACTION_ENGAGED_UNMOCKED"
        val ACTION_SHOW_START_CAR = "ai.comma.plus.frame.ACTION_SHOW_START_CAR"
        val uiLayoutIntentFilter = IntentFilter()
    }

    init {
        uiLayoutIntentFilter.addAction(ACTION_SIDEBAR_EXPANDED)
        uiLayoutIntentFilter.addAction(ACTION_SIDEBAR_COLLAPSED)
        uiLayoutIntentFilter.addAction(ACTION_ENGAGED_MOCKED)
        uiLayoutIntentFilter.addAction(ACTION_ENGAGED_UNMOCKED)
        uiLayoutIntentFilter.addAction(ACTION_SHOW_START_CAR)
    }

    override fun onReceive(context: Context?, intent: Intent?) {
        Log.d("frame", "receive broadcast ${intent?.action}")
        when (intent?.action) {
            ACTION_SIDEBAR_EXPANDED ->
                delegate.uiLayoutOnSidebarExpanded()
            ACTION_SIDEBAR_COLLAPSED ->
                delegate.uiLayoutOnSidebarCollapsed()
            ACTION_ENGAGED_MOCKED ->
                delegate.uiLayoutOnEngagedMocked()
            ACTION_ENGAGED_UNMOCKED ->
                delegate.uiLayoutOnEngagedUnmocked()
            ACTION_SHOW_START_CAR ->
                delegate.uiLayoutOnShowStartCar()
        }
    }
}
