import {  Action } from '@ngrx/store';
import { PhotoActions } from "./photoActions";
import { PhotoStore } from "../../common/appTypes";
import {AppLogger} from "../../utilities/appLogger";

export const photoReducer = (state: PhotoStore = new PhotoStore(), action: Action) => {
  const logger: AppLogger = new AppLogger();
  logger.log(action);

  switch (action.type) {
    case PhotoActions.getEventPhotos:
      state.photos = action.payload;
      return Object.assign({}, state);
    case PhotoActions.saveEventPhoto:
      //state.events = [...action.payload];
      //state.currentEvent = null;
      return Object.assign({}, state);
    default:
      return state;
  }

};


