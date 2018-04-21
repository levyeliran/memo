import {  Action } from '@ngrx/store';
import { AppSettingsStore } from "../../common/appTypes";
import {AppLogger} from "../../utilities/appLogger";
import {AppSettingsActions} from "./appSettingsActions";

export const AppSettingsReducer = (state: AppSettingsStore = new AppSettingsStore(), action: Action) => {
  const logger: AppLogger = new AppLogger();

  switch (action.type) {
    case AppSettingsActions.getAppSettings:
      logger.log(action);
      state.settings = action.payload;
      //state.events = [];
      return Object.assign({}, state);
    default:
      return state;
  }
};


