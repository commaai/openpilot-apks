import { ENV } from '../../config';
import {
  ACTION_UPDATE_DATE,
  ACTION_UPDATE_LOCATION,
} from './actions';

const initialState = {
  latitude: null,
  longitude: null,
  city: '',
};
if (ENV === 'dev') {
  initialState.city = 'San Francisco';
  initialState.latitude = 37.7749;
  initialState.longitude = -122.4194;
}

export default function(state = initialState, action) {
  switch (action.type) {
    case ACTION_UPDATE_DATE:
      return {
        ...state,
        date: action.date,
      }
      break;
    case ACTION_UPDATE_LOCATION:
      return {
        ...state,
        ...action.location,
      }
    default:
     return state;
  }
}