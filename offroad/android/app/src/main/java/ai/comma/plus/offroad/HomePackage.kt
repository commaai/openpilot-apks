package ai.comma.plus.offroad

import com.facebook.react.bridge.ModuleSpec
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.shell.MainReactPackage

/**
 * Created by batman on 11/2/17.
 */

class HomePackage : MainReactPackage() {
    override fun getNativeModules(context: ReactApplicationContext?): MutableList<ModuleSpec> {
        val modules = super.getNativeModules(context)
        val ourModules = mutableListOf(
                ModuleSpec(ChffrPlusModule::class.java, {
                    ChffrPlusModule(context!!)
                }),
                ModuleSpec(OfflineGeocoderModule::class.java, {
                    OfflineGeocoderModule(context!!)
                }),
                ModuleSpec(LoggingModule::class.java, {
                    LoggingModule(context!!, BuildConfig.MIXPANEL_PROJECT_TOKEN, BuildConfig.LOGENTRIES_PROJECT_TOKEN)
                }),
                ModuleSpec(WifiModule::class.java, {
                    WifiModule(context!!)
                }),
                ModuleSpec(CellularModule::class.java, {
                    CellularModule(context!!)
                })
        )

        return (modules + ourModules).toMutableList()
    }
}