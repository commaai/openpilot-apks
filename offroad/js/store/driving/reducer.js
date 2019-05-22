import { ACTION_DESTINATION_CHANGED } from './actions';

const initialDrivingState = {
    destination: null,
}

export default (state = initialDrivingState, action) => {
    switch (action.type) {
        case ACTION_DESTINATION_CHANGED:
            return {
                ...state,
                destination: action.destination,
            }
        default:
            return state;
    }
}