package ai.comma.plus.offroad

import ai.comma.plus.offroad.R
import android.content.Context.LOCATION_SERVICE
import android.location.Location
import android.location.Criteria
import android.location.LocationListener
import android.location.LocationManager
import android.os.AsyncTask
import android.os.Bundle
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import geocode.ReverseGeoCode
import java.io.InputStream

/**
 * Created by batman on 11/2/17.
 */
class OfflineGeocoderModule(val ctx: ReactApplicationContext) : ReactContextBaseJavaModule(ctx), LocationListener {
    var reverseGeocoder: ReverseGeoCode? = null
    var didFailToInitializeReverseGeocoder: Boolean = false
    private val geocoderLock = java.lang.Object()
    var locationManager: LocationManager? = null
    var provider: String? = null

    override fun getName(): String = "OfflineGeocoder"

    override fun initialize() {
        object : AsyncTask<Void, Void, Boolean>() {
            override fun doInBackground(vararg input: Void): Boolean? {
                synchronized(geocoderLock) {
                    val stream = ctx.resources.openRawResource(R.raw.cities5000)
                    try {
                        reverseGeocoder = ReverseGeoCode(stream, false)
                    } catch(e: java.lang.ArrayIndexOutOfBoundsException) {
                        CloudLog.exception("OfflineGeocoderModule: could not init ReverseGeoCode", e)
                        didFailToInitializeReverseGeocoder = true
                    } finally {
                        geocoderLock.notifyAll()
                    }
                    return true
                }
            }

            override fun onPostExecute(success: Boolean?) {}
        }.execute()
        locationManager = ctx.getSystemService(LOCATION_SERVICE) as LocationManager

        provider = locationManager?.getBestProvider(Criteria(), true)
        if (provider == null) {
            CloudLog.log("OfflineGeocoderModule: Failed to get provider")
            didFailToInitializeReverseGeocoder = true
        } else {
            locationManager?.requestSingleUpdate(provider, this, null)
            val lastLoc = locationManager?.getLastKnownLocation(provider)
            if (lastLoc != null) {
                onLocationChanged(lastLoc)
            }
        }
    }

    @ReactMethod
    fun getLastKnownLocation(promise: Promise) {
        val lastLoc = locationManager?.getLastKnownLocation(provider)
        if (lastLoc != null) {
            promise.resolve(geocodeLocation(lastLoc))
        } else {
            promise.resolve(null);
        }
    }

    @ReactMethod
    fun requestLocationUpdate() {
        locationManager?.requestSingleUpdate(provider, this, null)
    }

    fun geocodeLocation(location: Location): WritableNativeMap {
        synchronized(geocoderLock) {
            while (reverseGeocoder == null && !didFailToInitializeReverseGeocoder) {
                geocoderLock.wait()
            }
        }

        val geoname = reverseGeocoder?.nearestPlace(location.latitude, location.longitude)?.name

        val geocode = WritableNativeMap()
        geocode.putString("name", geoname)
        geocode.putDouble("lat", location.latitude)
        geocode.putDouble("lng", location.longitude)
        return geocode
    }

    override fun onLocationChanged(location: Location) {
        val geocode = geocodeLocation(location)

        ctx.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("onGeocodeChanged", geocode)
    }

    override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {
    }

    override fun onProviderEnabled(provider: String?) {
    }

    override fun onProviderDisabled(provider: String?) {
    }
}
