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
                ModuleSpec.nativeModuleSpec(ChffrPlusModule::class.java, {
                    ChffrPlusModule(context!!)
                }),
                ModuleSpec.nativeModuleSpec(OfflineGeocoderModule::class.java, {
                    OfflineGeocoderModule(context!!)
                }),
                ModuleSpec.nativeModuleSpec(LoggingModule::class.java, {
                    LoggingModule(context!!, BuildConfig.LOGENTRIES_PROJECT_TOKEN)
                }),
                ModuleSpec.nativeModuleSpec(WifiModule::class.java, {
                    WifiModule(context!!)
                }),
                ModuleSpec.nativeModuleSpec(CellularModule::class.java, {
                    CellularModule(context!!)
                }),
                ModuleSpec.nativeModuleSpec(LayoutModule::class.java, {
                    LayoutModule(context!!)
                })
        )

        return (modules + ourModules).toMutableList()
    }
}