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

import android.text.TextUtils;

import java.util.LinkedHashMap;

public class PageList extends LinkedHashMap<String, Page> {

    public PageList(Page... pages) {
        for (Page page : pages) {
            put(page.getKey(), page);
        }
    }

    public Page getPage(String key) {
        return get(key);
    }

    public int getPageIndex(String key) {
        int i=0;
        for (Page page : values()) {
            if (TextUtils.equals(page.getKey(), key)) {
                return i;
            }
            i++;
        }
        return i;
    }

    public Page getPage(int index) {
        int i=0;
        for (Page page : values()) {
            if (i == index) {
                return page;
            }
            i++;
        }
        return null;
    }

}
