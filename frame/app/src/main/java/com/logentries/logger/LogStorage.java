package com.logentries.logger;

import android.content.Context;
import android.util.Log;

import java.io.*;
import java.util.*;

public class LogStorage {

    private static final String TAG = "LogentriesAndroidLogger";
    private static final long MAX_QUEUE_FILE_SIZE = 10 * 1024 * 1024; // 10 MBytes.

    private Context context;

    private String storageFileName;

    private File storageFilePtr = null; // We keep the ptr permanently, because frequently accessing
                                        // the file for retrieving it's size.

    public LogStorage(Context context, String fileSuffix) throws IOException {
        this.context = context;
        storageFileName = "LogentriesLogStorage-" + fileSuffix + ".log";
        storageFilePtr = create();
    }

    public void putLogToStorage(String message) throws IOException, RuntimeException {

        // Fix line endings for ingesting the log to the local storage.
        if(!message.endsWith("\n")) {
            message += "\n";
        }

        FileOutputStream writer = null;
        try {
            byte[] rawMessage = message.getBytes();
            long currSize = getCurrentStorageFileSize() + rawMessage.length;
            String sizeStr = Long.toString(currSize);
            Log.d(TAG,"Current size: " + sizeStr);
            if(currSize >= MAX_QUEUE_FILE_SIZE) {
                Log.d(TAG, "Log storage will be cleared because threshold of " + MAX_QUEUE_FILE_SIZE + " bytes has been reached");
                reCreateStorageFile();
            }

            writer = context.openFileOutput(storageFileName, Context.MODE_APPEND);
            writer.write(rawMessage);

        } finally {
            if(writer != null) {
                writer.close();
            }
        }
    }

    public Queue<String> getAllLogsFromStorage(boolean needToRemoveStorageFile) {
        Queue<String> logs = new ArrayDeque<String>();
        FileInputStream input = null;

        try {
            input = context.openFileInput(storageFileName);
            DataInputStream inputStream = new DataInputStream(input);
            BufferedReader bufReader = new BufferedReader(new InputStreamReader(inputStream));

            String logLine = bufReader.readLine();
            while(logLine != null) {
                logs.offer(logLine);
                logLine = bufReader.readLine();
            }

            if(needToRemoveStorageFile) {
                removeStorageFile();
            }

        } catch (IOException ex) {
            Log.e(TAG, "Cannot load logs from the local storage: " + ex.getMessage());
            // Basically, ignore the exception - if something has gone wrong - just return empty
            // logs list.
        } finally {
            try {
                if(input != null) {
                    input.close();
                }
            } catch (IOException ex2) {
                Log.e(TAG, "Cannot close the local storage file: " + ex2.getMessage());
            }
        }

        return logs;
    }

    public void removeStorageFile() throws IOException {
        if(!storageFilePtr.delete()) {
            throw new IOException("Cannot delete " + storageFileName);
        }
    }

    public void reCreateStorageFile() throws IOException {
        Log.d(TAG, "Log storage has been re-created.");
        if(storageFilePtr == null) {
            storageFilePtr = create();
        } else {
            removeStorageFile();
        }
        storageFilePtr = create();
    }

    private File create() throws IOException {
        return new File(context.getFilesDir(), storageFileName);
    }

    private long getCurrentStorageFileSize() throws IOException {
        if(storageFilePtr == null) {
            storageFilePtr = create();
        }

        return storageFilePtr.length();
    }
}
