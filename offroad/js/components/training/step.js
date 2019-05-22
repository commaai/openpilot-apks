import { onTrainingRouteCompleted } from '../../utils/version';
import { resetToLaunch } from '../../store/nav/actions';

export function completeTrainingStep(route, dispatch) {
  return function() {
    onTrainingRouteCompleted(route);

    dispatch(resetToLaunch());
  }
}