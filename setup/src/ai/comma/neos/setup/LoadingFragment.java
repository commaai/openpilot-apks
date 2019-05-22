/*
 * Copyright (C) 2015 The CyanogenMod Project
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

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.os.Bundle;

import android.util.Log;
//import com.cyanogenmod.setupwizard.R;

public class LoadingFragment extends SetupPageFragment {

    private StartActivityForResultRunnable mStartActivityForResultRunnable;

    private static final String TAG = "LoadingFragment";

    @Override
    public void startActivityForResult(Intent intent, int requestCode, Bundle options) {
        if (isResumed()) {
            super.startActivityForResult(intent, requestCode, options);
        } else {
            mStartActivityForResultRunnable =
                    new StartActivityForResultRunnable(this, intent, requestCode, options);
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        if (mStartActivityForResultRunnable != null) {
            mStartActivityForResultRunnable.run();
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        mStartActivityForResultRunnable = null;
    }

    @Override
    protected void initializePage() {}

    @Override
    protected int getLayoutResource() {
        return R.layout.setup_loading_page;
    }

    private static class StartActivityForResultRunnable implements Runnable {

        private final LoadingFragment mLoadingFragment;
        private final Intent mIntent;
        private final int mRequestCode;
        private final Bundle mOptions;

        private StartActivityForResultRunnable(LoadingFragment loadingFragment,
                                               Intent intent, int requestCode, Bundle options) {
            mLoadingFragment = loadingFragment;
            mIntent = intent;
            mRequestCode = requestCode;
            mOptions = options;
        }

        @Override
        public void run() {
            try {
                mLoadingFragment.startActivityForResult(mIntent, mRequestCode, mOptions);
            }
            catch(ActivityNotFoundException e) {
                Log.e(TAG,"Activity not found to handle intent "+ mIntent.getDataString());
            }
        }
    }
}
