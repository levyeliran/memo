import {  Action } from '@ngrx/store';
import { ProfileActions } from "./profileActions";
import {AppLogger} from "../../utilities/appLogger";
import {ProfileStore} from "../../common/appTypes";

export const profileReducer = (state: ProfileStore = new ProfileStore(), action: Action) => {
  const logger: AppLogger = new AppLogger();

  switch (action.type) {
    case ProfileActions.getUserProfile:
      logger.log(action);
      state.profile = action.payload;
      state.profile.defaultPhotoURL = "assets/images/avatarCardBG.png";
      return Object.assign({}, state);
    default:
      return state;
  }

};


