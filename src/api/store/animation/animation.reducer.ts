import {  Action } from '@ngrx/store';
import { AnimationActions } from './animationActions'
import {AnimationStore} from "../../common/appTypes";
import {AppLogger} from "../../utilities/appLogger";

export const animationReducer = (state: AnimationStore = new AnimationStore(), action: Action) => {
  const logger: AppLogger = new AppLogger();

  switch (action.type) {
    case AnimationActions.getEventAnimationConfiguration:
      logger.log(action);
      state.animation = action.payload;
      return Object.assign({}, state);
    default:
      return state;
  }
};


