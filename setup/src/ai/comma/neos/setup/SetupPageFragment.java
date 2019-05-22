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
import android.app.Fragment;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

//import ai.comma.neos.setup.R;
//import ai.comma.neos.setup.Page;
//import ai.comma.neos.setup.SetupDataCallbacks;

public abstract class SetupPageFragment extends Fragment {

    protected SetupDataCallbacks mCallbacks;
    protected String mKey;
    protected Page mPage;
    protected View mRootView;
    protected TextView mTitleView;
    protected ViewGroup mHeaderView;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRetainInstance(true);
        //SetupStats.addEvent(SetupStats.Categories.PAGE_LOAD, SetupStats.Action.PAGE_LOADED,
        //        mKey, String.valueOf(System.currentTimeMillis()));
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        mRootView = inflater.inflate(getLayoutResource(), container, false);
        mTitleView = (TextView) mRootView.findViewById(android.R.id.title);
        mHeaderView = (ViewGroup )  mRootView.findViewById(R.id.header);
        initializePage();
        return mRootView;
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        Bundle args = getArguments();
        mKey = args.getString(Page.KEY_PAGE_ARGUMENT);
        if (mKey == null) {
            throw new IllegalArgumentException("No KEY_PAGE_ARGUMENT given");
        }
        if (!(activity instanceof SetupDataCallbacks)) {
            throw new ClassCastException("Activity implement SetupDataCallbacks");
        }
        mCallbacks = (SetupDataCallbacks) activity;
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mCallbacks = null;
    }

    @Override
    public void onResume() {
        super.onResume();
        mPage = mCallbacks.getPage(mKey);
        if (mTitleView != null) {
            mTitleView.setText(mPage.getTitleResId());
        }
        mCallbacks.onPageLoaded(mPage);
        getActivity().startPostponedEnterTransition();
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        // On low mem devices, this fragment might get destroyed by
        // fragment manager while we are in another activity.
        if (mPage == null) {
            mPage = mCallbacks.getPage(mKey);
        }
        mPage.onActivityResult(requestCode, resultCode, data);
    }

    protected abstract void initializePage();
    protected abstract int getLayoutResource();

}
