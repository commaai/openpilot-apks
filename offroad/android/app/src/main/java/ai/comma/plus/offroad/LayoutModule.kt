package ai.comma.plus.offroad

import ai.comma.messaging.Context
import ai.comma.messaging.SubSocket
import ai.comma.openpilot.cereal.Log
import android.os.Handler
import android.os.Looper
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import org.capnproto.MessageReader
import org.capnproto.Serialize
import java.io.ByteArrayOutputStream
import java.io.IOException
import java.nio.ByteBuffer
import java.nio.channels.Channels
import kotlin.math.roundToInt

class LayoutModule(ctx: ReactApplicationContext) : ReactContextBaseJavaModule(ctx) {
    var msgqCtx: Context? = null
    var running: Boolean = true
    var pollThread: Thread? = null
    var _mockEngaged: Boolean = false
    var activeApp: Log.UiLayoutState.App? = Log.UiLayoutState.App.HOME
    var prevActiveApp: Log.UiLayoutState.App = Log.UiLayoutState.App.HOME
    var uiLayoutSock: ai.comma.messaging.PubSocket? = null
    var sidebarCollapsed: Boolean = false

    override fun getName(): String = "LayoutModule"

    override fun initialize() {
        msgqCtx = Context()
        uiLayoutSock = msgqCtx!!.pubSocket("uiLayoutState")
        pollThread = Thread(Runnable {
            loop()
        })
        running = true
        pollThread!!.start()
    }

    fun updateUiLayoutState() {
        synchronized(this) {
            if (uiLayoutSock == null) {
                return
            }

            val log = LogEvent()
            val uiLayout = log.root.initUiLayoutState()
            uiLayout.setSidebarCollapsed(sidebarCollapsed)
            uiLayout.activeApp = activeApp
            uiLayout.mockEngaged = _mockEngaged

            val out = ByteArrayOutputStream()
            Serialize.write(Channels.newChannel(out), log.msg)
            val bytes = out.toByteArray()

            uiLayoutSock!!.send(bytes)
        }
    }

    fun setActiveAppSync(app: Log.UiLayoutState.App) {
        synchronized(this) {
            if (app != activeApp) {
                prevActiveApp = activeApp ?: Log.UiLayoutState.App.HOME
                activeApp = app
                if (activeApp == Log.UiLayoutState.App.NONE) {
                    setVisibility(View.GONE)
                } else {
                    setVisibility(View.VISIBLE)
                }
            }
        }
    }

    fun setSidebarCollapsedSync(collapsed: Boolean) {
        synchronized(this) {
            sidebarCollapsed = collapsed
            Handler(Looper.getMainLooper()).post {
                val view = reactApplicationContext.currentActivity?.findViewById<View>(android.R.id.content)

                if (view != null) {
                    val density = reactApplicationContext.getResources().getDisplayMetrics().density
                    if (sidebarCollapsed) {
                        view.setPadding((20 * density).roundToInt(), view.paddingTop, view.paddingRight, view.paddingBottom)
                    } else {
                        view.setPadding((110 * density).roundToInt(), view.paddingTop, view.paddingRight, view.paddingBottom)
                    }
                }
            }
        }
    }

    @ReactMethod
    fun setMockEngaged(mockEngaged: Boolean) {
        _mockEngaged = mockEngaged
        updateUiLayoutState()
    }

    fun onSidebarExpanded() {
        setSidebarCollapsedSync(false)
        updateUiLayoutState()
    }

    fun onSidebarCollapsed() {
        setSidebarCollapsedSync(true)
        updateUiLayoutState()
    }

    @ReactMethod
    fun goBack() {
        synchronized(this) {
            setActiveAppSync(prevActiveApp)
            updateUiLayoutState()
        }
    }

    @ReactMethod
    fun emitHomePress() {
        if (activeApp != Log.UiLayoutState.App.HOME) {
            reactApplicationContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("onHomePress", null)
            setActiveAppSync(Log.UiLayoutState.App.HOME)
            updateUiLayoutState()
        }
    }

    @ReactMethod
    fun emitSidebarCollapsed() {
        onSidebarCollapsed()
    }

    @ReactMethod
    fun emitSidebarExpanded() {
        onSidebarExpanded()
    }

    fun setVisibility(visibility: Int) {
        Handler(Looper.getMainLooper()).post {
            reactApplicationContext
                    .currentActivity
                    ?.findViewById<View>(android.R.id.content)?.visibility = visibility
        }
    }

    fun loop() {
        val sock = msgqCtx!!.subSocket("offroadLayout")
        sock.setTimeout(1000)

        while(running) {
            val msg = sock.receive()
            if (msg == null) {
                continue
            }

            val msgbuf = ByteBuffer.wrap(msg.data)
            var reader: MessageReader
            try {
                reader = Serialize.read(msgbuf)
            } catch (e: IOException) {
                android.util.Log.e("offroad", "read")
                continue
            } finally {
                msg.release()
            }

            val log = reader.getRoot(Log.Event.factory)
            val layoutState = log.uiLayoutState
            if (sidebarCollapsed == layoutState.sidebarCollapsed && activeApp == layoutState.activeApp) {
                continue
            }

            when(layoutState.activeApp) {
                Log.UiLayoutState.App.HOME -> {
                    reactApplicationContext
                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                            .emit("onHomePress", null)
                }
                Log.UiLayoutState.App.SETTINGS -> {
                    setSidebarCollapsedSync(false)
                    reactApplicationContext
                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                            .emit("onSettingsClick", null)
                }
                else -> {}
            }
            setSidebarCollapsedSync(layoutState.sidebarCollapsed)
            setActiveAppSync(layoutState.activeApp)
            updateUiLayoutState()
        }

        sock.close()
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        running = false
        uiLayoutSock!!.close()
        uiLayoutSock = null
    }
}
