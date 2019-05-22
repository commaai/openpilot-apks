package ai.comma.neos.setup;

import android.app.Fragment;
import android.app.FragmentManager;
import android.content.Context;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.net.URLConnection;

public class InstallPage extends SetupPage {

    public static final String TAG = "InstallPage";

    private InstallFragment mInstallFragment;

    public InstallPage(Context context, SetupDataCallbacks callbacks) {
        super(context, callbacks);
    }

    @Override
    public Fragment getFragment(FragmentManager fragmentManager, int action) {
        mInstallFragment = (InstallFragment)fragmentManager.findFragmentByTag(getKey());
        if (mInstallFragment == null) {
            Bundle args = new Bundle();
            args.putString(Page.KEY_PAGE_ARGUMENT, getKey());
            args.putInt(Page.KEY_PAGE_ACTION, action);
            mInstallFragment = new InstallFragment();
            mInstallFragment.setArguments(args);
        }
        return mInstallFragment;
    }

    @Override
    public String getKey() {
        return TAG;
    }

    @Override
    public int getTitleResId() {
        return R.string.install_page_title;
    }

    @Override
    public int getNextButtonTitleResId() {
        return R.string.done;
    }

    @Override
    public boolean doNextAction() {
        final Page thisPage = this;
        String url = mInstallFragment.urlEntry.getText().toString();
        new DownloadAppTask() {
            protected void onPostExecute(Boolean result) {
                boolean res = result.booleanValue();
                if (res) {
                    getCallbacks().onFinish();
                } else {
                    Toast.makeText(mInstallFragment.getActivity(),
                            "Download failed", Toast.LENGTH_LONG).show();
                    getCallbacks().onPageLoaded(thisPage);
                }
            }
        }.execute(url);
        return true;
    }

    class DownloadAppTask extends AsyncTask<String, Integer, Boolean> {
        protected Boolean doInBackground(String... url) {
            String outputPath = "/data/data/ai.comma.neos.setup/installer";
            try {
                URL u = new URL(url[0]);
                URLConnection conn = u.openConnection();
                conn.setRequestProperty("User-Agent", "NEOSSetup-0.1");

                int contentLength = conn.getContentLength();

                DataInputStream stream = new DataInputStream(conn.getInputStream());

                byte[] buffer = new byte[contentLength];
                stream.readFully(buffer);
                stream.close();

                String tmpPath = outputPath+".tmp";

                DataOutputStream fos = new DataOutputStream(new FileOutputStream(tmpPath));
                fos.write(buffer);
                fos.flush();
                fos.close();

                (new File(tmpPath)).renameTo(new File(outputPath));

                return true;
            } catch(Exception e) {
                Log.e(e.getClass().getName(), e.getMessage(), e);
                return false;
            }
        }
    }

    public static class InstallFragment extends SetupPageFragment {

        public EditText urlEntry;

        @Override
        protected void initializePage() {
            urlEntry = (EditText)mRootView.findViewById(R.id.editText);
            urlEntry.setEnabled(true);
            urlEntry.setText("");
            urlEntry.append("https://");
        }

        @Override
        protected int getLayoutResource() {
            return R.layout.install_page;
        }

    }

}
