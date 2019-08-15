package ai.comma.plus.neossetup

import com.facebook.react.bridge.NativeArray
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeArray

/**
 * Created by batman on 9/4/17.
 */

fun List<Any?>.toNativeArray(): WritableArray {
    val array = WritableNativeArray()
    this.forEach { el ->
        when(el) {
            is Int -> array.pushInt(el as Int)
            is String -> array.pushString(el as String)
            is Boolean -> array.pushBoolean(el as Boolean)
            is WritableMap -> array.pushMap(el as WritableMap)
            is WritableArray -> array.pushArray(el as WritableArray)
            is Double -> array.pushDouble(el as Double)
            else -> {
                if (el == null) {
                    array.pushNull()
                } else {
                    throw TypeCastException("Could not typecast value: ${el}")
                }
            }
        }
    }

    return array
}
