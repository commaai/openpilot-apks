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

import android.app.Fragment;
import android.app.FragmentManager;
import android.content.Intent;
import android.os.Bundle;

public interface Page {

    public static final String KEY_PAGE_ARGUMENT = "key_arg";
    public static final String KEY_PAGE_ACTION= "action";

    public static final int ACTION_NEXT = 1;
    public static final int ACTION_PREVIOUS = 2;

    public String getKey();
    public int getTitleResId();
    public int getButtonBarBackgroundColorId();
    public int getPrevButtonTitleResId();
    public int getNextButtonTitleResId();
    public Fragment getFragment(FragmentManager fragmentManager, int action);
    public Bundle getData();
    public void resetData(Bundle data);
    public boolean isRequired();
    public Page setRequired(boolean required);
    public boolean isHidden();
    public Page setHidden(boolean hidden);
    public boolean doPreviousAction();
    public boolean doNextAction();
    public void doLoadAction(FragmentManager fragmentManager, int action);
    public void onFinishSetup();
    public boolean onActivityResult(int requestCode, int resultCode, Intent data);
    public SetupDataCallbacks getCallbacks();
}
