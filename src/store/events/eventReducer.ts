import { ActionReducer, Action } from '@ngrx/store';
import { EVENT_ACTIONS } from 'eventActions'

export function eventReducer(state = {}, action: Action) {
  switch (action.type) {
    case EVENT_ACTIONS.GET_EVENT:
      return Object.assign({}, state, action.payload);

    default:
      return state;
  }
}
