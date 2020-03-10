import { onTrainingRouteCompleted } from '../../utils/version';
import { resetToLaunch } from '../../store/nav/actions';
import ChffrPlus from '../../native/ChffrPlus';

export function completeTrainingStep(route, dispatch) {
  return function() {
    onTrainingRouteCompleted(route);
    dispatch(resetToLaunch());
    ChffrPlus.emitHomePress();
  }
}
