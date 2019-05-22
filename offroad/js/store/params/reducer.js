import {
    ACTION_PARAM_CHANGED,
} from './actions';

const initialPlusSettingsState = {
    params: {}
};

export default (state = initialPlusSettingsState, action) => {
  switch (action.type) {
    case ACTION_PARAM_CHANGED:
        return {
            ...state,
            params: {
                ...state.params,
                [action.payload.param]: action.payload.value
            }
        }
    default:
      return state;
  }
}
