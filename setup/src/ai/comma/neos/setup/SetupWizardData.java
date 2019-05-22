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

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.ConnectivityManager;
//import android.os.SystemProperties;
import android.telephony.SubscriptionManager;
import android.telephony.TelephonyManager;

import android.util.Log;
//import com.android.internal.telephony.TelephonyIntents;
//import com.cyanogenmod.setupwizard.R;
//import com.cyanogenmod.setupwizard.util.SetupWizardUtils;

import java.util.ArrayList;

public class SetupWizardData extends AbstractSetupData {

    private static final String TAG = SetupWizardData.class.getSimpleName();

    private boolean mTimeSet = false;
    private boolean mTimeZoneSet = false;
    private boolean mMobileDataEnabled;

    public SetupWizardData(Context context) {
        super(context);
        mMobileDataEnabled = SetupWizardUtils.isMobileDataEnabled(context);
    }

    @Override
    protected PageList onNewPageList() {
        ArrayList<Page> pages = new ArrayList<Page>();
//        if (SetupWizardUtils.hasLeanback(mContext)) {
//            pages.add(new BluetoothSetupPage(mContext, this));
//        }
//        pages.add(new WelcomePage(mContext, this));
//
//        if (SetupWizardUtils.hasTelephony(mContext)) {
          pages.add(new SimCardMissingPage(mContext, this).setHidden(isSimInserted()));
          //pages.add(new MobileDataPage(mContext, this));
//                    .setHidden(isSimInserted()));
          pages.add(new WifiSetupPage(mContext, this));
          pages.add(new InstallPage(mContext, this));
//        }
//        if (SetupWizardUtils.isMultiSimDevice(mContext)) {
//            pages.add(new ChooseDataSimPage(mContext, this)
//                    .setHidden(!allSimsInserted()));
//        }
//        if (SetupWizardUtils.hasTelephony(mContext)) {
//            pages.add(new MobileDataPage(mContext, this)
//                    .setHidden(!isSimInserted() || mMobileDataEnabled));
//        }
//        final boolean hasGMS = SetupWizardUtils.hasGMS(mContext);
//        if (hasGMS) {
//            pages.add(new GmsAccountPage(mContext, this));
//        }
//        if (!SetupWizardUtils.hasLeanback(mContext) &&
//                SetupWizardUtils.isPackageInstalled(mContext,
//                        mContext.getString(R.string.cm_account_package_name))) {
//            pages.add(new CyanogenServicesPage(mContext, this).setHidden(true));
//        }
//        if (SetupWizardUtils.hasFingerprint(mContext) && SetupWizardUtils.isOwner()) {
//            pages.add(new FingerprintSetupPage(mContext, this));
//        } else if (SetupWizardUtils.frpEnabled(mContext)) {
//            pages.add(new ScreenLockSetupPage(mContext, this));
//        }
//        pages.add(new CyanogenSettingsPage(mContext, this));
//        pages.add(new OtherSettingsPage(mContext, this).setHidden(!hasGMS));
//        pages.add(new DateTimePage(mContext, this));
//        pages.add(new FinishPage(mContext, this));
        return new PageList(pages.toArray(new SetupPage[pages.size()]));
    }


    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction().equals("android.intent.action.SIM_STATE_CHANGED")) {
            showHideSimMissingPage();
        }
//        if (intent.getAction().equals(TelephonyIntents.ACTION_SIM_STATE_CHANGED)) {
//            showHideDataSimPage();
//            showHideSimMissingPage();
//            showHideMobileDataPage();
//            updateWelcomePage();
//        } else if (intent.getAction()
//                .equals(ConnectivityManager.CONNECTIVITY_ACTION)) {
//            showHideMobileDataPage();
//            showHideAccountPages();
//        } else  if (intent.getAction()
//                .equals(TelephonyIntents.ACTION_ANY_DATA_CONNECTION_STATE_CHANGED)) {
//            showHideMobileDataPage();
//            showHideAccountPages();
//        } else if (intent.getAction().equals(Intent.ACTION_TIMEZONE_CHANGED) ||
//                intent.getAction().equals(TelephonyIntents.ACTION_NETWORK_SET_TIMEZONE)) {
//            mTimeZoneSet = true;
//            showHideDateTimePage();
//        } else if (intent.getAction().equals(Intent.ACTION_TIME_CHANGED) ||
//                intent.getAction().equals(TelephonyIntents.ACTION_NETWORK_SET_TIME)) {
//            mTimeSet = true;
//            showHideDateTimePage();
//        }
    }

    private void showHideAccountPages() {
//        boolean isConnected = SetupWizardUtils.isNetworkConnected(mContext);
//        CyanogenServicesPage cyanogenServicesPage =
//                (CyanogenServicesPage) getPage(CyanogenServicesPage.TAG);
//        if (cyanogenServicesPage != null) {
//            cyanogenServicesPage.setHidden(!isConnected);
//        }
    }

    private void showHideSimMissingPage() {
        SimCardMissingPage simCardMissingPage =
                (SimCardMissingPage) getPage(SimCardMissingPage.TAG);
        if (simCardMissingPage != null) {
            if (isSimInserted()) {
                simCardMissingPage.setHidden(true);
                if (isCurrentPage(simCardMissingPage)) {
                    onNextPage();
                }
            } else {
                simCardMissingPage.setHidden(false);
            }
        }
    }

//    private void showHideDataSimPage() {
//        ChooseDataSimPage chooseDataSimPage =
//                (ChooseDataSimPage) getPage(ChooseDataSimPage.TAG);
//        if (chooseDataSimPage != null) {
//            chooseDataSimPage.setHidden(!allSimsInserted());
//        }
//    }

//    private void showHideMobileDataPage() {
//        MobileDataPage mobileDataPage =
//                (MobileDataPage) getPage(MobileDataPage.TAG);
//        if (mobileDataPage != null) {
//            mobileDataPage.setHidden(!isSimInserted() || mMobileDataEnabled);
//        }
//    }

//    private void showHideDateTimePage() {
//        DateTimePage dateTimePage = (DateTimePage) getPage(DateTimePage.TAG);
//        if (dateTimePage != null) {
//            dateTimePage.setHidden(mTimeZoneSet & mTimeSet);
//        }
//    }

//    private void updateWelcomePage() {
//        WelcomePage welcomePage = (WelcomePage) getPage(WelcomePage.TAG);
//        if (welcomePage != null) {
//            welcomePage.simChanged();
//        }
//    }

    public IntentFilter getIntentFilter() {
        IntentFilter filter = new IntentFilter();
        filter.addAction("android.intent.action.SIM_STATE_CHANGED");
//        if (SetupWizardUtils.hasTelephony(mContext)) {
//            filter.addAction(TelephonyIntents.ACTION_SIM_STATE_CHANGED);
//            filter.addAction(TelephonyIntents.ACTION_ANY_DATA_CONNECTION_STATE_CHANGED);
//        }
//        filter.addAction(ConnectivityManager.CONNECTIVITY_ACTION);
//        filter.addAction(Intent.ACTION_TIMEZONE_CHANGED);
//        filter.addAction(Intent.ACTION_TIME_CHANGED);
//        filter.addAction(TelephonyIntents.ACTION_NETWORK_SET_TIME);
//        filter.addAction(TelephonyIntents.ACTION_NETWORK_SET_TIMEZONE);
        return filter;
    }

    // We only care that one sim is inserted
    private boolean isSimInserted() {
//        TelephonyManager tm = TelephonyManager.from(mContext);
//        int simSlotCount = tm.getSimCount();
//        for (int i = 0; i < simSlotCount; i++) {
//            int state;
//            try {
//                state = tm.getSimState(i);
//            } catch (IllegalStateException ise) {
//                Log.e(TAG, "Unable to get sim state from TelephonyManager");
//                continue;
//            }
//            if (state != TelephonyManager.SIM_STATE_ABSENT
//                    && state != TelephonyManager.SIM_STATE_UNKNOWN
//                    && state != TelephonyManager.SIM_STATE_NOT_READY) {
//                return true;
//            }
//        }
//        return false;
        TelephonyManager tm = (TelephonyManager)mContext.getSystemService(Context.TELEPHONY_SERVICE);
        return tm.getSimState() == TelephonyManager.SIM_STATE_READY;
    }

    // We only care that each slot has a sim
//    private boolean allSimsInserted() {
//        TelephonyManager tm = TelephonyManager.from(mContext);
//        int simSlotCount = tm.getSimCount();
//        for (int i = 0; i < simSlotCount; i++) {
//            int state = tm.getSimState(i);
//            if (state == TelephonyManager.SIM_STATE_ABSENT) {
//                return false;
//            }
//        }
//        return simSlotCount == SubscriptionManager.from(mContext).getActiveSubscriptionInfoCount();
//    }

}
