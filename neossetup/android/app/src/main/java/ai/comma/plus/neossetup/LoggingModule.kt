package ai.comma.plus.neossetup

import com.facebook.react.bridge.*
import com.mixpanel.android.mpmetrics.MixpanelAPI
import org.json.JSONException
import org.json.JSONObject

/**
 * Created by batman on 9/12/17.
 */
class LoggingModule(reactContext: ReactApplicationContext, mixpanelToken: String, logentriesToken: String) : ReactContextBaseJavaModule(reactContext) {
    var mixpanel: MixpanelAPI? = null

    init {
        mixpanel = MixpanelAPI.getInstance(reactApplicationContext, mixpanelToken)
        CloudLog.init(reactApplicationContext, logentriesToken)
    }

    override fun getName(): String = "LoggingModule"

    @ReactMethod
    fun bind(dongleId: String, email: String) {
        val dongle = JSONObject()
        try {
            dongle.put("id", dongleId)
            dongle.put("email", email)
            CloudLog.bind("dongle", dongle)
        } catch (e: JSONException) {
            e.printStackTrace()
            CloudLog.exception("ChffrJavaModule.onLogIn", e)
        }
    }

    @ReactMethod
    fun cloudLog(log: String) {
        CloudLog.log(log)
    }

    @ReactMethod
    fun cloudLogWithProperties(log: String, properties: ReadableMap) {
        val eventArgs = JSONObject(properties.toHashMap())

        CloudLog.event(log, eventArgs)
    }

    @ReactMethod
    fun mixpanelTrack(event: String) {
        mixpanel?.track(event)
    }

    @ReactMethod
    fun mixpanelTrackWithProperties(event: String, properties: ReadableMap) {
        mixpanel?.track(event, JSONObject(properties.toHashMap()))
    }
}