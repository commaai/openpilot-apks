import { ACTION_UPLOAD_SUMMARY_UPDATED } from './actions';

const initialUploadsState = {
    files: [],
    txSpeedKbps: 0,
    bytesRemaining: 0,
}

export default (state = initialUploadsState, action) => {
    switch (action.type) {
        case ACTION_UPLOAD_SUMMARY_UPDATED:
            return {
                files: action.files,
                txSpeedKbps: action.txSpeedKbps,
                bytesRemaining: action.bytesRemaining,
            }
        default:
            return state
    }
}