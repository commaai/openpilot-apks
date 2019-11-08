package ai.comma.messaging;

import android.system.ErrnoException;
import android.system.Os;
import android.util.Log;

import java.io.File;
import java.io.IOException;

public class Loader {
    private static boolean loaded = false;

    public static void loadLibrary() {
        if (loaded) return;

        try {
            File file = new File("/data/pythonpath");
            Os.setenv("PYTHONPATH", file.getCanonicalPath(), false);
        } catch(IOException e) {
            Log.e("messaging", "could not resolve pythonpath", e);
        } catch (ErrnoException e) {
            Log.e("messaging", "could not resolve pythonpath", e);
        }
        System.loadLibrary("messaging_jni");
        init();
        loaded = true;
    }

    private static native void init();
}
