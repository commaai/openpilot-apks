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

//package com.cyanogenmod.setupwizard.setup;
package ai.comma.neos.setup;

import android.app.Fragment;
import android.app.FragmentManager;
import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.telephony.PhoneStateListener;
import android.telephony.ServiceState;
import android.telephony.SignalStrength;
import android.telephony.SubscriptionManager;
import android.telephony.TelephonyManager;
import android.text.TextUtils;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.Switch;
import android.widget.TextView;

//import com.cyanogenmod.setupwizard.R;
//import com.cyanogenmod.setupwizard.SetupWizardApp;
//import com.cyanogenmod.setupwizard.cmstats.SetupStats;
//import com.cyanogenmod.setupwizard.ui.SetupPageFragment;
//import com.cyanogenmod.setupwizard.util.SetupWizardUtils;

public class MobileDataPage extends SetupPage {

    public static final String TAG = "MobileDataPage";

    private static final int DC_READY_TIMEOUT = 20 * 1000;

    public MobileDataPage(Context context, SetupDataCallbacks callbacks) {
        super(context, callbacks);
    }

    @Override
    public Fragment getFragment(FragmentManager fragmentManager, int action) {
        Fragment fragment = fragmentManager.findFragmentByTag(getKey());
        if (fragment == null) {
            Bundle args = new Bundle();
            args.putString(Page.KEY_PAGE_ARGUMENT, getKey());
            args.putInt(Page.KEY_PAGE_ACTION, action);
            fragment = new MobileDataFragment();
            fragment.setArguments(args);
        }
        return fragment;
    }

    @Override
    public String getKey() {
        return TAG;
    }

    @Override
    public int getTitleResId() {
        return R.string.setup_mobile_data;
    }

    public static class MobileDataFragment extends SetupPageFragment {

        private ViewGroup mPageView;
        private ProgressBar mProgressBar;
        private View mEnableDataRow;
//        private Switch mEnableMobileData;
        private ImageView mSignalView;
        private TextView mNameView;
        private Button mNextButton;

        private TelephonyManager mPhone;
        private SignalStrength mSignalStrength;
        private ServiceState mServiceState;

        private boolean mIsAttached = false;

        private Context mContext;

        private final Handler mHandler = new Handler();

        private final Runnable mRadioReadyRunnable = new Runnable() {
            @Override
            public void run() {
                hideWaitForRadio();
            }
        };

        private final Runnable mDataConnectionReadyRunnable = new Runnable() {
            @Override
            public void run() {
                onDataStateReady();
            }
        };

        private PhoneStateListener mPhoneStateListener =
//                new PhoneStateListener(SubscriptionManager.getDefaultDataSubId()) {
                new PhoneStateListener() {

                    @Override
                    public void onSignalStrengthsChanged(SignalStrength signalStrength) {
                        mSignalStrength = signalStrength;
                        updateSignalStrength();
                    }

                    @Override
                    public void onServiceStateChanged(ServiceState state) {
                        if (SetupWizardUtils.isRadioReady(mContext, state)) {
                            hideWaitForRadio();
                        }
                        mServiceState = state;
                        updateSignalStrength();
                    }

                    @Override
                    public void onDataConnectionStateChanged(int state) {
                        if (state == TelephonyManager.DATA_CONNECTED) {
                            onDataStateReady();
                        }
                    }

                };

//        private View.OnClickListener mEnableDataClickListener = new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                boolean checked = !mEnableMobileData.isChecked();
//                SetupWizardUtils.setMobileDataEnabled(getActivity(), checked);
//                mEnableMobileData.setChecked(checked);
//                if (checked && !SetupWizardUtils.isWifiConnected(mContext)) {
//                    waitForData();
//                } else {
//                    onDataStateReady();
//                }
////                SetupStats.addEvent(SetupStats.Categories.SETTING_CHANGED,
////                        SetupStats.Action.ENABLE_MOBILE_DATA,
////                        SetupStats.Label.CHECKED, String.valueOf(checked));
//            }
//        };

        @Override
        protected void initializePage() {
            mPageView = (ViewGroup)mRootView.findViewById(R.id.page_view);
            mProgressBar = (ProgressBar) mRootView.findViewById(R.id.progress);
//            mEnableDataRow = mRootView.findViewById(R.id.data);
//            mEnableDataRow.setOnClickListener(mEnableDataClickListener);
//            mEnableMobileData = (Switch) mRootView.findViewById(R.id.data_switch);
            mSignalView =  (ImageView) mRootView.findViewById(R.id.signal);
            mNameView =  (TextView) mRootView.findViewById(R.id.enable_data_title);
            mNextButton = (Button) getActivity().findViewById(R.id.next_button);
            updateDataConnectionStatus();
            updateSignalStrength();
        }

        @Override
        protected int getLayoutResource() {
            return R.layout.mobile_data_settings;
        }

        @Override
        public void onResume() {
            super.onResume();
            mIsAttached = true;
            mContext = getActivity().getApplicationContext();
            mPhone = (TelephonyManager)getActivity().getSystemService(Context.TELEPHONY_SERVICE);
            mPhone.listen(mPhoneStateListener,
                    PhoneStateListener.LISTEN_SERVICE_STATE
                            | PhoneStateListener.LISTEN_SIGNAL_STRENGTHS
                            | PhoneStateListener.LISTEN_DATA_CONNECTION_STATE);
            updateDataConnectionStatus();
            updateSignalStrength();
            if (SetupWizardUtils.isRadioReady(mContext, null)) {
                hideWaitForRadio();
            } else if (mTitleView != null) {
                mTitleView.setText(R.string.loading);
                mHandler.postDelayed(mRadioReadyRunnable, SetupWizardApp.RADIO_READY_TIMEOUT);
            }
        }

        @Override
        public void onPause() {
            super.onPause();
            mIsAttached = false;
            mPhone.listen(mPhoneStateListener, PhoneStateListener.LISTEN_NONE);
        }

        private void hideWaitForRadio() {
            if (getUserVisibleHint() && mProgressBar.isShown()) {
                mHandler.removeCallbacks(mRadioReadyRunnable);
                if (mTitleView != null) {
                    mTitleView.setText(mPage.getTitleResId());
                }
                // Something else, like data enablement, may have grabbed
                // the "hold" status. Kill it only if "Next" is active
                if (mNextButton.isEnabled()) {
                    mProgressBar.setVisibility(View.INVISIBLE);
                    mPageView.setVisibility(View.VISIBLE);
                    mPageView.startAnimation(
                            AnimationUtils.loadAnimation(getActivity(), R.anim.translucent_enter));
                }
            }
        }

        private void waitForData() {
            if (getUserVisibleHint() && !mProgressBar.isShown()) {
                mProgressBar.setVisibility(View.VISIBLE);
                mProgressBar.startAnimation(
                        AnimationUtils.loadAnimation(getActivity(), R.anim.translucent_enter));
                mEnableDataRow.setEnabled(false);
                mNextButton.setEnabled(false);
                mHandler.postDelayed(mDataConnectionReadyRunnable, DC_READY_TIMEOUT);
            }
        }

        private void onDataStateReady() {
            mHandler.removeCallbacks(mDataConnectionReadyRunnable);
            if ((getUserVisibleHint() && mProgressBar.isShown()) ||
                    !mNextButton.isEnabled()) {
                mProgressBar.startAnimation(
                        AnimationUtils.loadAnimation(getActivity(), R.anim.translucent_exit));
                mProgressBar.setVisibility(View.INVISIBLE);
                mEnableDataRow.setEnabled(true);
                mNextButton.setEnabled(true);
            }
        }

        private void updateCarrierText() {
            if (mIsAttached) {
//                String name =
//                        mPhone.getSimOperatorNameForSubscription(SubscriptionManager.getDefaultDataSubId());
                String name = mPhone.getSimOperatorName();
                if (TextUtils.isEmpty(name)) {
//                    name = mPhone.getNetworkOperatorName(SubscriptionManager.getDefaultDataSubId());
                    name = mPhone.getNetworkOperatorName();
                }
                if (TextUtils.isEmpty(name)) {
//                    if (mServiceState != null && mServiceState.isEmergencyOnly()) {
//                        name = getString(R.string.setup_mobile_data_emergency_only);
//                    } else {
                        name = getString(R.string.setup_mobile_data_no_service);
//                    }
                }
                mNameView.setText(name);
            }
        }

        private void updateSignalStrength() {
            if (mIsAttached) {
                if (!hasService()) {
                    mSignalView.setImageResource(R.drawable.ic_signal_no_signal);
                } else {
                    if (mSignalStrength != null) {
                        int resId;
                        switch (mSignalStrength.getLevel()) {
                            case 4:
                                resId = R.drawable.ic_signal_4;
                                break;
                            case 3:
                                resId = R.drawable.ic_signal_3;
                                break;
                            case 2:
                                resId = R.drawable.ic_signal_2;
                                break;
                            case 1:
                                resId = R.drawable.ic_signal_1;
                                break;
                            default:
                                resId = R.drawable.ic_signal_0;
                                break;
                        }
                        mSignalView.setImageResource(resId);
                    }
                }
                updateCarrierText();
            }
        }

        private void updateDataConnectionStatus() {
//            mEnableMobileData.setChecked(SetupWizardUtils.isMobileDataEnabled(getActivity()));
        }

        private boolean hasService() {
            boolean retVal;
            if (mServiceState != null) {
                // Consider the device to be in service if either voice or data service is available.
                // Some SIM cards are marketed as data-only and do not support voice service, and on
                // these SIM cards, we want to show signal bars for data service as well as the "no
                // service" or "emergency calls only" text that indicates that voice is not available.

//                switch(mServiceState.getVoiceRegState()) {
//                    case ServiceState.STATE_POWER_OFF:
//                        retVal = false;
//                        break;
//                    case ServiceState.STATE_OUT_OF_SERVICE:
//                    case ServiceState.STATE_EMERGENCY_ONLY:
//                        retVal = mServiceState.getDataRegState() == ServiceState.STATE_IN_SERVICE;
//                        break;
//                    default:
//                        retVal = true;
//                }
                retVal = false;
            } else {
                retVal = false;
            }
            return retVal;
        }

    }
}
