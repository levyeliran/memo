import {  Action } from '@ngrx/store';
import { EventActions } from './eventActions'
import { EventStore } from "../../common/appTypes";
import {AppLogger} from "../../utilities/appLogger";

export const eventReducer = (state: EventStore = new EventStore(), action: Action) => {
  const logger: AppLogger = new AppLogger();

  switch (action.type) {
    case EventActions.getEvent:
      logger.log(action);
      state.currentEvent = action.payload;//[...state.events, ...action.payload]
      //state.events = [];
      return Object.assign({}, state);
    case EventActions.getEvents:
      logger.log(action);
      state.events = action.payload;
      return Object.assign({}, state);
    /*case EventActions.createEvent:
      logger.log(action);
      state.events = [...state.events, action.payload];
      //state.currentEvent = null;
      return Object.assign({}, state);*/
    default:
      return state;
  }

};


