import {  Action } from '@ngrx/store';
import { PhotoActions } from "./photoActions";
import { PhotoStore } from "../../common/appTypes";
import {AppLogger} from "../../utilities/appLogger";

export const photoReducer = (state: PhotoStore = new PhotoStore(), action: Action) => {
  const logger: AppLogger = new AppLogger();

  switch (action.type) {
    case PhotoActions.getEventPhotos:
      logger.log(action);
      state.photos = action.payload;
      return Object.assign({}, state);
    default:
      return state;
  }

};


