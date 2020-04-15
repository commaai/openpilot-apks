import { onTrainingRouteCompleted } from '../../utils/version';
import { resetToLaunch } from '../../store/nav/actions';
import Layout from '../../native/Layout';

export function completeTrainingStep(route, dispatch) {
  return function() {
    onTrainingRouteCompleted(route);
    dispatch(resetToLaunch());
    Layout.emitHomePress();
  }
}
