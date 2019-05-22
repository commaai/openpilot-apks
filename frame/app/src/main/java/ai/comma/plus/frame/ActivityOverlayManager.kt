package ai.comma.plus.frame

import android.os.Handler
import android.os.Looper
import android.view.View
import android.widget.TextView

interface ActivityOverlayManagerDelegate {
    fun onActivityOverlayDismissed()
}

class ActivityOverlayManager(val activityOverlay: View, val delegate: ActivityOverlayManagerDelegate) {
    companion object {
        val OVERLAY_START_CAR = OverlayMessage("Start your car to begin", dismiss = "Go back")
        val OVERLAY_THERMAL_WARNING = OverlayMessage("Ride completed", "Continue", "Keep EON away from sunlight", timeoutMillis = 30000)
    }

    var timerHandler = Handler(Looper.getMainLooper())
    var titleText = activityOverlay.findViewById(R.id.activity_overlay_text) as TextView
    var bodyText = activityOverlay.findViewById(R.id.activity_overlay_body) as TextView
    var dismissText = activityOverlay.findViewById(R.id.activity_overlay_back) as TextView

    init {
        dismissText.setOnClickListener {
            hide()
            delegate.onActivityOverlayDismissed()
        }
    }

    fun show(overlay: OverlayMessage) {
        timerHandler.removeCallbacksAndMessages(null)

        titleText.text = overlay.title
        dismissText.text = overlay.dismiss
        bodyText.text = overlay.body ?: ""
        activityOverlay.visibility = View.VISIBLE
        dismissText.visibility = if (overlay.showBackButton) View.VISIBLE else View.INVISIBLE

        if (bodyText.text != "") {
          bodyText.visibility = View.VISIBLE
        } else {
          bodyText.visibility = View.GONE
        }

        if (overlay.timeoutMillis != null) {
            timerHandler.postDelayed( {
                hide()
                delegate.onActivityOverlayDismissed()
            }, overlay.timeoutMillis.toLong())
        }
    }

    fun hide() {
        timerHandler.removeCallbacksAndMessages(null)

        activityOverlay.visibility = View.INVISIBLE
    }
}

data class OverlayMessage(val title: String,
                          val dismiss: String,
                          val body: String? = null,
                          val showBackButton: Boolean = true,
                          val timeoutMillis: Int? = null)
