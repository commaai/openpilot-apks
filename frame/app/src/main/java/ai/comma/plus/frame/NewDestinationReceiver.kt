package ai.comma.plus.frame

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.util.Log

/**
 * Created by batman on 11/29/17.
 */
interface NewDestinationReceiverDelegate {
    fun onNewDestination()
}

class NewDestinationReceiver(val delegate: NewDestinationReceiverDelegate) : BroadcastReceiver() {
    companion object {
        val ACTION_NEW_DESTINATION = "ai.comma.plus.frame.NEW_DESTINATION"
        val newDestIntentFilter = IntentFilter(ACTION_NEW_DESTINATION)

    }

    override fun onReceive(context: Context?, intent: Intent?) {
        Log.d("frame", "receive broadcast ${intent?.action}")
        if (intent?.action == ACTION_NEW_DESTINATION) {
            delegate.onNewDestination()
        }
    }
}
