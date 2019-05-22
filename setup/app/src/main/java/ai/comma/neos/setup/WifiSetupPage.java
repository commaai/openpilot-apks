/*
 * Copyright (C) 2013 The CyanogenMod Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package ai.comma.neos.setup;

import android.app.Activity;
import android.app.ActivityOptions;
import android.app.FragmentManager;
import android.content.Context;
import android.content.Intent;
import android.net.CaptivePortal;
import android.net.ConnectivityManager;
//import android.net.ICaptivePortal;
import android.os.Bundle;
import android.os.Handler;
import android.provider.Settings;
import android.util.Log;


import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Random;

public class WifiSetupPage extends SetupPage {

    public static final String TAG = "WifiSetupPage";

    private static final String DEFAULT_SERVER = "clients3.google.com";
    private static final int CAPTIVE_PORTAL_SOCKET_TIMEOUT_MS = 10000;

    private LoadingFragment mLoadingFragment;

    private URL mCaptivePortalUrl;

    private boolean mIsCaptivePortal = false;

    private final Handler mHandler = new Handler();

    private String mResponseToken;

//    private Runnable mFinishCaptivePortalCheckRunnable = new Runnable() {
//        @Override
//        public void run() {
//            if (mIsCaptivePortal) {
//                try {
//                    mResponseToken = String.valueOf(new Random().nextLong());
//                    final Intent intent = new Intent(
//                            ConnectivityManager.ACTION_CAPTIVE_PORTAL_SIGN_IN);
//                    intent.putExtra(Intent.EXTRA_TEXT, mResponseToken);
//                    intent.putExtra(ConnectivityManager.EXTRA_NETWORK,
//                            ConnectivityManager.from(mContext)
//                                    .getNetworkForType(ConnectivityManager.TYPE_WIFI));
//                    intent.putExtra(ConnectivityManager.EXTRA_CAPTIVE_PORTAL,
//                            new CaptivePortal(new ICaptivePortal.Stub() {
//                                @Override
//                                public void appResponse(int response) {}
//                            }));
//                    intent.putExtra("status_bar_color",
//                            mContext.getResources().getColor(R.color.primary_dark));
//                    intent.putExtra("action_bar_color", mContext.getResources().getColor(
//                            R.color.primary_dark));
//                    intent.putExtra("progress_bar_color", mContext.getResources().getColor(
//                            R.color.accent));
//                    ActivityOptions options =
//                            ActivityOptions.makeCustomAnimation(mContext,
//                                    android.R.anim.fade_in,
//                                    android.R.anim.fade_out);
//                    SetupStats.addEvent(SetupStats.Categories.EXTERNAL_PAGE_LOAD,
//                            SetupStats.Action.EXTERNAL_PAGE_LAUNCH,
//                            SetupStats.Label.PAGE,  SetupStats.Label.CAPTIVE_PORTAL_LOGIN);
//                    mLoadingFragment.startActivityForResult(intent,
//                            SetupWizardApp.REQUEST_CODE_SETUP_CAPTIVE_PORTAL,
//                            options.toBundle());
//                } catch (Exception e) {
//                    //Oh well
//                    Log.e(TAG, "No captive portal activity found" + e);
//                    if (getCallbacks().isCurrentPage(WifiSetupPage.this)) {
//                        getCallbacks().onNextPage();
//                    }
//                }
//            } else {
//                if (getCallbacks().isCurrentPage(WifiSetupPage.this)) {
//                    getCallbacks().onNextPage();
//                }
//            }
//        }
//    };

    public WifiSetupPage(Context context, SetupDataCallbacks callbacks) {
        super(context, callbacks);
        String server = Settings.Global.getString(context.getContentResolver(), "captive_portal_server");
        if (server == null) server = DEFAULT_SERVER;
        try {
            mCaptivePortalUrl = new URL("http://" + server + "/generate_204");
        } catch (MalformedURLException e) {
            Log.e(TAG, "Not a valid url" + e);
        }
    }

    @Override
    public SetupPageFragment getFragment(FragmentManager fragmentManager, int action) {
        mLoadingFragment = (LoadingFragment)fragmentManager.findFragmentByTag(getKey());
        if (mLoadingFragment == null) {
            Bundle args = new Bundle();
            args.putString(Page.KEY_PAGE_ARGUMENT, getKey());
            args.putInt(Page.KEY_PAGE_ACTION, action);
            mLoadingFragment = new LoadingFragment();
            mLoadingFragment.setArguments(args);
        }
        return mLoadingFragment;
    }

    @Override
    public int getNextButtonTitleResId() {
        return R.string.skip;
    }

    @Override
    public String getKey() {
        return TAG;
    }

    @Override
    public int getTitleResId() {
        return R.string.loading;
    }


    @Override
    public void doLoadAction(FragmentManager fragmentManager, int action) {
        super.doLoadAction(fragmentManager, action);
        launchWifiSetup();
    }

    @Override
    public boolean onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == SetupWizardApp.REQUEST_CODE_SETUP_WIFI) {
            if (resultCode == Activity.RESULT_CANCELED) {
//                SetupStats.addEvent(SetupStats.Categories.EXTERNAL_PAGE_LOAD,
//                        SetupStats.Action.EXTERNAL_PAGE_RESULT,
//                        SetupStats.Label.WIFI_SETUP, "canceled");
                getCallbacks().onPreviousPage();
            } else if (resultCode == Activity.RESULT_OK) {
//                SetupStats.addEvent(SetupStats.Categories.EXTERNAL_PAGE_LOAD,
//                        SetupStats.Action.EXTERNAL_PAGE_RESULT,
//                        SetupStats.Label.WIFI_SETUP, "success");
//                checkForCaptivePortal();
                getCallbacks().onNextPage();
            } else {
//                SetupStats.addEvent(SetupStats.Categories.EXTERNAL_PAGE_LOAD,
//                        SetupStats.Action.EXTERNAL_PAGE_RESULT,
//                        SetupStats.Label.WIFI_SETUP, "skipped");
                getCallbacks().onNextPage();
            }
        } else if (requestCode == SetupWizardApp.REQUEST_CODE_SETUP_CAPTIVE_PORTAL) {
            if (data == null) {
                launchWifiSetup();
                return true;
            }
            String token = data.getStringExtra("response_token");
            if (token != null && !token.equals(mResponseToken)) {
//                SetupStats.addEvent(SetupStats.Categories.EXTERNAL_PAGE_LOAD,
//                        SetupStats.Action.EXTERNAL_PAGE_RESULT,
//                        SetupStats.Label.CAPTIVE_PORTAL_LOGIN, "token_mismatch");
                launchWifiSetup();
            } else {
                if (resultCode == Activity.RESULT_CANCELED) {
//                    SetupStats.addEvent(SetupStats.Categories.EXTERNAL_PAGE_LOAD,
//                            SetupStats.Action.EXTERNAL_PAGE_RESULT,
//                            SetupStats.Label.CAPTIVE_PORTAL_LOGIN, "canceled");
                    launchWifiSetup();
                } else {
//                    SetupStats.addEvent(SetupStats.Categories.EXTERNAL_PAGE_LOAD,
//                            SetupStats.Action.EXTERNAL_PAGE_RESULT,
//                            SetupStats.Label.CAPTIVE_PORTAL_LOGIN, "success");
                    getCallbacks().onNextPage();
                }
            }
        }  else {
            return false;
        }
        return true;
    }

//    private void checkForCaptivePortal() {
//        new Thread() {
//            @Override
//            public void run() {
//                mIsCaptivePortal = isCaptivePortal();
//                mHandler.post(mFinishCaptivePortalCheckRunnable);
//            }
//        }.start();
//    }

    // Don't run on UI thread
//    private boolean isCaptivePortal() {
//        if (mCaptivePortalUrl == null) return false;
//        HttpURLConnection urlConnection = null;
//        try {
//            urlConnection = (HttpURLConnection) mCaptivePortalUrl.openConnection();
//            urlConnection.setInstanceFollowRedirects(false);
//            urlConnection.setConnectTimeout(CAPTIVE_PORTAL_SOCKET_TIMEOUT_MS);
//            urlConnection.setReadTimeout(CAPTIVE_PORTAL_SOCKET_TIMEOUT_MS);
//            urlConnection.setUseCaches(false);
//            urlConnection.getInputStream();
//            // We got a valid response, but not from the real google
//            final int responseCode = urlConnection.getResponseCode();
//            if (responseCode == 408 || responseCode == 504) {
//                // If we timeout here, we'll try and go through captive portal login
//                return true;
//            }
//            return urlConnection.getResponseCode() != 204;
//        } catch (IOException e) {
//            Log.e(TAG, "Captive portal check - probably not a portal: exception "
//                    + e);
//            return false;
//        } finally {
//            if (urlConnection != null) {
//                urlConnection.disconnect();
//            }
//        }
//    }

    private void launchWifiSetup() {
        SetupWizardUtils.tryEnablingWifi(mContext);
        Intent intent = new Intent(SetupWizardApp.ACTION_SETUP_WIFI);
//        if (SetupWizardUtils.hasLeanback(mContext)) {
//            intent.setComponent(SetupWizardUtils.mTvwifisettingsActivity);
//        }
        intent.putExtra(SetupWizardApp.EXTRA_FIRST_RUN, true);
        intent.putExtra(SetupWizardApp.EXTRA_ALLOW_SKIP, true);
        intent.putExtra(SetupWizardApp.EXTRA_USE_IMMERSIVE, true);
        intent.putExtra(SetupWizardApp.EXTRA_THEME, SetupWizardApp.EXTRA_MATERIAL_LIGHT);
        intent.putExtra(SetupWizardApp.EXTRA_AUTO_FINISH, false);
        ActivityOptions options =
                ActivityOptions.makeCustomAnimation(mContext,
                        android.R.anim.fade_in,
                        android.R.anim.fade_out);
//        SetupStats.addEvent(SetupStats.Categories.EXTERNAL_PAGE_LOAD,
//                SetupStats.Action.EXTERNAL_PAGE_LAUNCH,
//                SetupStats.Label.PAGE,  SetupStats.Label.WIFI_SETUP);
        mLoadingFragment.startActivityForResult(intent,
                SetupWizardApp.REQUEST_CODE_SETUP_WIFI, options.toBundle());
    }
}
