package ai.comma.plus.offroad

import android.os.Bundle
import android.view.View
import android.widget.LinearLayout

import com.facebook.react.ReactActivity
import kotlin.math.roundToInt

class MainActivity : ReactActivity() {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    override fun getMainComponentName(): String? {
        return "baseui"
    }

    override fun onBackPressed() {

    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val density = applicationContext.getResources().getDisplayMetrics().density
        val view = this.findViewById<View>(android.R.id.content)
        view.setPadding(110*density.roundToInt(), 10*density.roundToInt(), 10*density.roundToInt(), 10*density.roundToInt())
    }
}
