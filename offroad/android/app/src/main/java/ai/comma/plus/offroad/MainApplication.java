package ai.comma.plus.offroad;

import android.app.Application;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

import com.crashlytics.android.Crashlytics;
import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import com.pusherman.networkinfo.RNNetworkInfoPackage;

import io.fabric.sdk.android.Fabric;
import io.sentry.RNSentryPackage;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new HomePackage(),
              new LinearGradientPackage(),
              new RNFetchBlobPackage(),
              new ReactVideoPackage(),
              new CookieManagerPackage(),
              new RNSentryPackage(MainApplication.this),
              new RNNetworkInfoPackage(),
              new SvgPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    if (BuildConfig.DEBUG) {
      SharedPreferences.Editor editor = PreferenceManager.getDefaultSharedPreferences(getApplicationContext()).edit();
      editor.putString("debug_http_host", BuildConfig.RN_DEBUG_HOST);
      editor.apply();
    }

    super.onCreate();

    Fabric.with(this, new Crashlytics());
    SoLoader.init(this, /* native exopackage */ false);
  }
}
