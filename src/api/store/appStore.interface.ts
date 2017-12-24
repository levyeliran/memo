import {EventStore, PhotoStore} from "../common/appTypes";

export interface AppStore {
  eventStore: EventStore;
  photoStore: PhotoStore;
}

