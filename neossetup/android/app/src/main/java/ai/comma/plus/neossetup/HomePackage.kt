package ai.comma.plus.neossetup

import com.facebook.react.bridge.ModuleSpec
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.shell.MainReactPackage

/**
 * Created by batman on 8/9/19.
 */

class HomePackage : MainReactPackage() {
    override fun getNativeModules(context: ReactApplicationContext?): MutableList<ModuleSpec> {
        val modules = super.getNativeModules(context)
        val ourModules = mutableListOf(
                ModuleSpec(ChffrPlusModule::class.java, {
                    ChffrPlusModule(context!!)
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
