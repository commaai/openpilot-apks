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

import android.animation.Animator;
import android.app.Activity;
import android.app.WallpaperManager;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.Point;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.os.UserHandle;
import android.preference.PreferenceManager;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewAnimationUtils;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;

//import com.android.setupwizardlib.util.SystemBarHelper;
//import com.cyanogenmod.setupwizard.R;
//import com.cyanogenmod.setupwizard.SetupWizardApp;
//import com.cyanogenmod.setupwizard.cmstats.SetupStats;
//import com.cyanogenmod.setupwizard.setup.CMSetupWizardData;
//import com.cyanogenmod.setupwizard.setup.GmsAccountPage;
//import com.cyanogenmod.setupwizard.setup.Page;
//import com.cyanogenmod.setupwizard.setup.SetupDataCallbacks;
//import com.cyanogenmod.setupwizard.util.EnableAccessibilityController;
//import com.cyanogenmod.setupwizard.util.SetupWizardUtils;
//
//import cyanogenmod.providers.CMSettings;
//import cyanogenmod.themes.ThemeManager;

import java.util.ArrayList;


public class SetupWizardActivity extends Activity implements SetupDataCallbacks {

    private static final String TAG = SetupWizardActivity.class.getSimpleName();
    private static final String KEY_LAST_PAGE_TAG = "last_page_tag";


    private View mRootView;
    private View mButtonBar;
    private Button mNextButton;
    private Button mPrevButton;
    private ImageView mReveal;
    private ProgressBar mFinishingProgressBar;

//    private EnableAccessibilityController mEnableAccessibilityController;

    private SetupWizardData mSetupData;

    private final Handler mHandler = new Handler();

    private volatile boolean mIsFinishing = false;

    private static long sLaunchTime = 0;

    private final ArrayList<Runnable> mFinishRunnables = new ArrayList<Runnable>();

    private Intent mAfterFinishIntent;

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        final boolean isOwner = SetupWizardUtils.isOwner();
        if (!isOwner) {
            finish();
        }
//        SystemBarHelper.hideSystemBars(getWindow());
        if (sLaunchTime == 0) {
//            SetupStats.addEvent(SetupStats.Categories.APP_LAUNCH, TAG);
            sLaunchTime = System.nanoTime();
        }
        setContentView(R.layout.setup_main);
        mRootView = findViewById(R.id.root);
        mReveal = (ImageView)mRootView.findViewById(R.id.reveal);
        mButtonBar = findViewById(R.id.button_bar);
        mFinishingProgressBar = (ProgressBar)findViewById(R.id.finishing_bar);
        ((SetupWizardApp)getApplicationContext()).disableStatusBar();
//        mSetupData = (SetupWizardData)getLastNonConfigurationInstance();
        if (mSetupData == null) {
            mSetupData = new SetupWizardData(getApplicationContext());
        }
        mNextButton = (Button) findViewById(R.id.next_button);
        mPrevButton = (Button) findViewById(R.id.prev_button);
        if (mSetupData.isFinished()) {
            mNextButton.setVisibility(View.INVISIBLE);
            mPrevButton.setVisibility(View.INVISIBLE);
        }
        mSetupData.registerListener(this);
        mNextButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                enableButtonBar(false);
                mSetupData.onNextPage();
            }
        });
        mPrevButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                enableButtonBar(false);
                mSetupData.onPreviousPage();
            }
        });
        if (savedInstanceState == null) {
            Page page = mSetupData.getCurrentPage();
            page.doLoadAction(getFragmentManager(), Page.ACTION_NEXT);
        }
        if (savedInstanceState != null && savedInstanceState.containsKey("data")) {
            mSetupData.load(savedInstanceState.getBundle("data"));
        }

        final SharedPreferences sharedPreferences = PreferenceManager.getDefaultSharedPreferences(this);
        if (sharedPreferences.contains(KEY_LAST_PAGE_TAG)) {
            final String lastPage = sharedPreferences.getString(KEY_LAST_PAGE_TAG,
                    mSetupData.getCurrentPage().getKey());
//            final boolean backupEnabled = (Settings.Secure.getInt(getContentResolver(),
//                    Settings.Secure.BACKUP_AUTO_RESTORE, 0) == 1) ||
//                    (Settings.Secure.getInt(getContentResolver(),
//                            Settings.Secure.BACKUP_ENABLED, 0) == 1);
//            if (TextUtils.equals(lastPage, GmsAccountPage.TAG) && backupEnabled) {
//                // We probably already restored, skip ahead!
//                mSetupData.setCurrentPage(mSetupData.getNextPage(lastPage).getKey());
//            } else {
//                // else just restore
//                mSetupData.setCurrentPage(sharedPreferences.getString(KEY_LAST_PAGE_TAG,
//                        mSetupData.getCurrentPage().getKey()));
//            }
            Page page = mSetupData.getCurrentPage();
            page.doLoadAction(getFragmentManager(), Page.ACTION_NEXT);
        }

//        mEnableAccessibilityController =
//                EnableAccessibilityController.getInstance(getApplicationContext());
//        mRootView.setOnTouchListener(new View.OnTouchListener() {
//            @Override
//            public boolean onTouch(View v, MotionEvent event) {
//                boolean consumeIntercept = mEnableAccessibilityController.onInterceptTouchEvent(event);
//                boolean consumeTouch = mEnableAccessibilityController.onTouchEvent(event);
//                return consumeIntercept && consumeTouch;
//            }
//        });
        registerReceiver(mSetupData, mSetupData.getIntentFilter());
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (isFinishing()) {
            return;
        }
        if (mSetupData.isFinished()) {
            mHandler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    finishSetup();
                }
            }, 500);
        }  else {
            mSetupData.onResume();
            onPageTreeChanged();
            enableButtonBar(true);
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (mSetupData != null) {
            mSetupData.onPause();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (mSetupData != null) {
            final SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(this);
            prefs.edit().putString(KEY_LAST_PAGE_TAG, mSetupData.getCurrentPage().getKey()).apply();
            mSetupData.onDestroy();
            mSetupData.unregisterListener(this);
            unregisterReceiver(mSetupData);
        }
    }

    @Override
    public Object onRetainNonConfigurationInstance() {
        return mSetupData;
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putBundle("data", mSetupData.save());
    }

    @Override
    public void onBackPressed() {
        if (!mSetupData.isFirstPage()) {
            mSetupData.onPreviousPage();
        }
    }

    @Override
    public void onNextPage() {
        Page page = mSetupData.getCurrentPage();
        if (!isFinishing()) {
            page.doLoadAction(getFragmentManager(), Page.ACTION_NEXT);
        }
    }

    @Override
    public void onPreviousPage() {
        Page page = mSetupData.getCurrentPage();
        if (!isFinishing()) {
            page.doLoadAction(getFragmentManager(), Page.ACTION_PREVIOUS);
        }
    }

    @Override
    public void setCurrentPage(String key) {
        Page page = mSetupData.getCurrentPage();
        if (!isFinishing()) {
            page.doLoadAction(getFragmentManager(), Page.ACTION_NEXT);
        }
    }

    @Override
    public void onPageLoaded(Page page) {
        updateButtonBar();
        enableButtonBar(true);
    }

    @Override
    public void onPageTreeChanged() {
        updateButtonBar();
    }

    private void enableButtonBar(boolean enabled) {
        mNextButton.setEnabled(enabled);
        mPrevButton.setEnabled(enabled);
    }

    private void updateButtonBar() {
        Page page = mSetupData.getCurrentPage();
        mButtonBar.setBackgroundColor(getColor(page.getButtonBarBackgroundColorId()));
        if (page.getNextButtonTitleResId() != -1) {
            mNextButton.setText(page.getNextButtonTitleResId());
            mNextButton.setVisibility(View.VISIBLE);
        } else {
            mNextButton.setText("");
            mNextButton.setVisibility(View.INVISIBLE);
//            mNextButton.setCompoundDrawables(null, null, null, null);
//            mNextButton.setEnabled(false);
        }

        if (page.getPrevButtonTitleResId() != -1) {
            mPrevButton.setText(page.getPrevButtonTitleResId());
        } else {
            mPrevButton.setText("");
        }

        if (mSetupData.isFirstPage()) {
            mPrevButton.setCompoundDrawables(null, null, null, null);
//            mPrevButton.setVisibility(SetupWizardUtils.hasTelephony(this) ?
//                    View.VISIBLE : View.INVISIBLE);
            mPrevButton.setVisibility(View.VISIBLE);
        } else {
            mPrevButton.setCompoundDrawablesWithIntrinsicBounds(
                    getDrawable(R.drawable.ic_chevron_left_dark),
                    null, null, null);
        }
        final Resources resources = getResources();
//        if (mSetupData.isLastPage()) {
//            mNextButton.setCompoundDrawablesWithIntrinsicBounds(null, null,
//                    getDrawable(R.drawable.ic_chevron_right_wht), null);
//            mNextButton.setTextColor(resources.getColor(R.color.white));
//            mPrevButton.setCompoundDrawablesWithIntrinsicBounds(
//                    getDrawable(R.drawable.ic_chevron_left_wht), null,
//                    null, null);
//            mPrevButton.setTextColor(resources.getColor(R.color.white));
//        } else {
            mButtonBar.setBackgroundResource(R.color.button_bar_background);
            mNextButton.setCompoundDrawablesWithIntrinsicBounds(null, null,
                    getDrawable(R.drawable.ic_chevron_right_dark), null);
            mNextButton.setTextColor(resources.getColorStateList(R.color.button_bar_text));
            mPrevButton.setTextColor(resources.getColorStateList(R.color.button_bar_text));
//        }
    }

    @Override
    public Page getPage(String key) {
        return mSetupData.getPage(key);
    }

    @Override
    public Page getPage(int key) {
        return mSetupData.getPage(key);
    }

    @Override
    public boolean isCurrentPage(Page page) {
        return mSetupData.isCurrentPage(page);
    }

    @Override
    public void addFinishRunnable(Runnable runnable) {
        mFinishRunnables.add(runnable);
    }

    @Override
    public void onFinish() {
//        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LOCKED);
//        Animation fadeOut = AnimationUtils.loadAnimation(this, android.R.anim.fade_out);
//        mNextButton.startAnimation(fadeOut);
//        mNextButton.setVisibility(View.INVISIBLE);
//        mPrevButton.startAnimation(fadeOut);
//        mPrevButton.setVisibility(View.INVISIBLE);
//        final SetupWizardApp setupWizardApp = (SetupWizardApp)getApplication();
//        setupWizardApp.enableStatusBar();
//        setupWizardApp.enableCaptivePortalDetection();
//        Animation fadeIn = AnimationUtils.loadAnimation(this, android.R.anim.fade_in);
//        mFinishingProgressBar.setVisibility(View.VISIBLE);
//        mFinishingProgressBar.setIndeterminate(true);
//        mFinishingProgressBar.startAnimation(fadeIn);
//        final ThemeManager tm = ThemeManager.getInstance(this);
//        try {
//            tm.registerThemeChangeListener(this);
//        } catch (Exception e) {
//            Log.w(TAG, "ThemeChangeListener already registered");
//        }
//        mSetupData.finishPages();

        finish();
    }

//    @Override
//    public void onFinish(boolean isSuccess) {
//        if (isResumed()) {
//            mHandler.post(new Runnable() {
//                @Override
//                public void run() {
//                    finishSetup();
//                }
//            });
//        }
//    }

//    @Override
    public void onProgress(int progress) {
        if (progress > 0) {
            mFinishingProgressBar.setIndeterminate(false);
            mFinishingProgressBar.setProgress(progress);
        }
    }

    @Override
    public void finishSetup() {
//        if (!mIsFinishing) {
//            SetupStats.addEvent(SetupStats.Categories.APP_FINISHED, TAG,
//                    SetupStats.Label.TOTAL_TIME, String.valueOf(
//                            System.nanoTime() - sLaunchTime));
//            final SetupWizardApp setupWizardApp = (SetupWizardApp)getApplication();
//            setupWizardApp.sendStickyBroadcastAsUser(
//                    new Intent(SetupWizardApp.ACTION_FINISHED),
//                    UserHandle.getCallingUserHandle());
//            mIsFinishing = true;
//            setupRevealImage();
//        }
        finish();
    }

    @Override
    public void finish() {
        super.finish();
        overridePendingTransition(R.anim.translucent_enter, R.anim.translucent_exit);
    }

//    private void setupRevealImage() {
//        mFinishingProgressBar.setProgress(100);
//        Animation fadeOut = AnimationUtils.loadAnimation(this, android.R.anim.fade_out);
//        mFinishingProgressBar.startAnimation(fadeOut);
//        mFinishingProgressBar.setVisibility(View.INVISIBLE);
//
//        final Point p = new Point();
//        getWindowManager().getDefaultDisplay().getRealSize(p);
//        final WallpaperManager wallpaperManager =
//                WallpaperManager.getInstance(SetupWizardActivity.this);
//        wallpaperManager.forgetLoadedWallpaper();
//        final Bitmap wallpaper = wallpaperManager.getBitmap();
//        Bitmap cropped = null;
//        if (wallpaper != null) {
//            cropped = Bitmap.createBitmap(wallpaper, 0,
//                    0, Math.min(p.x, wallpaper.getWidth()),
//                    Math.min(p.y, wallpaper.getHeight()));
//        }
//        if (cropped != null) {
//            mReveal.setScaleType(ImageView.ScaleType.CENTER_CROP);
//            mReveal.setImageBitmap(cropped);
//        } else {
//            mReveal.setBackground(wallpaperManager
//                    .getBuiltInDrawable(p.x, p.y, false, 0, 0));
//        }
//        animateOut();
//    }

//    private void animateOut() {
//        int cx = (mReveal.getLeft() + mReveal.getRight()) / 2;
//        int cy = (mReveal.getTop() + mReveal.getBottom()) / 2;
//        int finalRadius = Math.max(mReveal.getWidth(), mReveal.getHeight());
//        Animator anim =
//                ViewAnimationUtils.createCircularReveal(mReveal, cx, cy, 0, finalRadius);
//        anim.setDuration(900);
//        anim.addListener(new Animator.AnimatorListener() {
//            @Override
//            public void onAnimationStart(Animator animation) {
//                mReveal.setVisibility(View.VISIBLE);
//            }
//
//            @Override
//            public void onAnimationEnd(Animator animation) {
//                mHandler.post(new Runnable() {
//                    @Override
//                    public void run() {
//                        finalizeSetup();
//                    }
//                });
//            }
//
//            @Override
//            public void onAnimationCancel(Animator animation) {}
//
//            @Override
//            public void onAnimationRepeat(Animator animation) {}
//        });
//        anim.start();
//    }

//    private void finalizeSetup() {
//        mFinishRunnables.add(new Runnable() {
//            @Override
//            public void run() {
//                Settings.Global.putInt(getContentResolver(), Settings.Global.DEVICE_PROVISIONED, 1);
//                Settings.Secure.putInt(getContentResolver(),
//                        Settings.Secure.USER_SETUP_COMPLETE, 1);
//                CMSettings.Secure.putInt(getContentResolver(),
//                        CMSettings.Secure.CM_SETUP_WIZARD_COMPLETED, 1);
//                if (mEnableAccessibilityController != null) {
//                    mEnableAccessibilityController.onDestroy();
//                }
//                final ThemeManager tm = ThemeManager.getInstance(SetupWizardActivity.this);
//                tm.unregisterThemeChangeListener(SetupWizardActivity.this);
//                SetupStats.sendEvents(SetupWizardActivity.this);
//                SetupWizardUtils.disableGMSSetupWizard(SetupWizardActivity.this);
//                final WallpaperManager wallpaperManager =
//                        WallpaperManager.getInstance(SetupWizardActivity.this);
//                wallpaperManager.forgetLoadedWallpaper();
//            }
//        });
//        new FinishTask(this, mFinishRunnables).execute();
//    }

//    private static class FinishTask extends AsyncTask<Void, Void, Boolean> {
//
//        private final SetupWizardActivity mActivity;
//        private final ArrayList<Runnable> mFinishRunnables;
//
//        public FinishTask(SetupWizardActivity activity,
//                          ArrayList<Runnable> finishRunnables) {
//            mActivity = activity;
//            mFinishRunnables = finishRunnables;
//        }
//
//        @Override
//        protected Boolean doInBackground(Void... params) {
//            for (Runnable runnable : mFinishRunnables) {
//                runnable.run();
//            }
//            SetupWizardUtils.disableSetupWizard(mActivity);
//            return Boolean.TRUE;
//        }
//
//        @Override
//        protected void onPostExecute(Boolean aBoolean) {
//            if (mActivity.mAfterFinishIntent == null) {
//                final Intent intent = new Intent(Intent.ACTION_MAIN);
//                intent.addCategory(Intent.CATEGORY_HOME);
//                mActivity.startActivity(intent);
//            } else {
//                mActivity.startActivity(mActivity.mAfterFinishIntent);
//            }
//            mActivity.finish();
//        }
//    }

    /**
     * Sets an intent to be started when the wizard finishes.
     * By default, or null, it will go Home.
     * @param intent Intent to start after wizard finishes.
     */
    public void setFinishIntent(final Intent intent) {
        mAfterFinishIntent = intent;
    }
}
