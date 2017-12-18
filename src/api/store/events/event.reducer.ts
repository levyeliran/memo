import {  Action } from '@ngrx/store';
import { EventActions } from './eventActions'
import { EventStore } from "../../common/appTypes";

export function eventReducer(state: EventStore = new EventStore(), action: Action) {
  switch (action.type) {
    case EventActions.getEvent:
      state.currentEvent = action.payload//[...state.events, ...action.payload]
      return Object.assign({}, state);
    case EventActions.getEvents:
      state.events = action.payload
      return Object.assign({}, state);
    case EventActions.createEvent:
      state.events = [...state.events, action.payload]
      return Object.assign({}, state);
    default:
      return state;
  }
}


