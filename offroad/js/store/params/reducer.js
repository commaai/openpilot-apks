import {
    ACTION_PARAM_CHANGED,
    ACTION_PARAM_DELETED,
} from './actions';

const initialParamsState = {
    params: {}
};

export default (state = initialParamsState, action) => {
  switch (action.type) {
    case ACTION_PARAM_CHANGED:
        return {
            ...state,
            params: {
                ...state.params,
                [action.payload.param]: action.payload.value
            }
        }
    case ACTION_PARAM_DELETED:
        delete state.params[action.payload.param];
        return {
            ...state,
            params: {
                ...state.params
            }
        }
    default:
      return state;
  }
}
