package ai.comma.plus.neossetup

import java.io.File
import java.io.IOException
import java.util.*

/**
 * Created by batman on 5/10/17.
 */
class ChffrPlusParams {
    companion object {
        fun pathForParam(paramName: String): String = "/data/params/d/${paramName}"
        fun createTmpFile(): File {
            val randomStr = UUID.randomUUID().toString().replace("-", "").take(6);

            val path = "/data/params/.tmp_param_" + randomStr
            val file = File(path)
            file.createNewFile()
            return file
        }

        fun lockParams() {
            try {
                Runtime.getRuntime().exec("flock -w 2 /data/params/.lock")
            } catch(e: IOException) {
                CloudLog.exception("ChffrPlusParams.lockParams", e)
            }
        }

        fun unlockParams() {
            try {
                Runtime.getRuntime().exec("flock -u /data/params/.lock")
            } catch(e: IOException) {
                CloudLog.exception("ChffrPlusParams.unlockParams", e)
            }
        }

        @JvmStatic
        fun deleteParam(paramName: String): Boolean {
            val paramPath = pathForParam(paramName);
            return File(paramPath).delete();
        }

        @JvmStatic
        fun readParam(paramName: String): String? {
            try {
                val paramPath = pathForParam(paramName)
                return File(paramPath).readText()
            } catch(e: Exception) {
                CloudLog.exception("ChffrPlusParams.readParam", e)
                return null
            }
        }

        @JvmStatic
        fun writeParam(paramName: String, value: String) {
            lockParams()
            var tmpFile: File? = null

            try {
                tmpFile = createTmpFile()
                tmpFile.writeText(value)

                val paramsFile = File(pathForParam(paramName))
                tmpFile.renameTo(paramsFile)
            } catch(e: Exception) {
                CloudLog.exception("ChffrPlusParams.writeParam", e)
                tmpFile?.delete()
            }
            unlockParams()
        }
    }
}