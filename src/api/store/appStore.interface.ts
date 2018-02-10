import {EventStore, PhotoStore, ProfileStore} from "../common/appTypes";

export interface AppStore {
  eventStore: EventStore;
  photoStore: PhotoStore;
  profileStore: ProfileStore;
}

