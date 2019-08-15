export const formatSize = (bytes) => {
    let suffix = ' bytes';
    if (bytes >= 1024) {
        suffix = 'KB';
        bytes /= 1024;
        if (bytes >= 1024) {
            suffix = 'MB';
            bytes /= 1024;
            if (bytes >= 1024) {
                suffix = 'GB';
                bytes /= 1024;
            }
        }
    }
    let bytesStr = suffix === 'GB' ? bytes.toFixed(2) : parseInt(bytes);

    return `${bytesStr}${suffix}`;
}