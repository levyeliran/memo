import {Injectable} from "@angular/core";
import {EventDispatcherService} from "../dispatcher/appEventDispathcer.service";
import {EventActions} from "./events/eventActions";
import {Observable} from "rxjs/Rx";
import {EventStore, PhotoStore, ProfileStore} from "../common/appTypes";
import {Store} from "@ngrx/store";
import {AppStore} from "./appStore.interface";
import { AppUtils } from "../utilities/appUtils";
import {ProfileActions} from "./profile/profileActions";

@Injectable()
export class AppStoreService{

  constructor(public store: Store<AppStore>,
              public eventDispatcherService: EventDispatcherService){
  }

  public _eventStore(): Observable<EventStore>{
    return this.store.select(store => store.eventStore);
  }

  public _photoStore(): Observable<PhotoStore>{
    return this.store.select(store => store.photoStore);
  }

  public _profileStore(): Observable<ProfileStore>{
    return this.store.select(store => store.profileStore);
  }

  public initAppStore(authData:any): Promise<any>{

    console.log(JSON.stringify(authData));

    AppUtils.userKey = authData.uid;
    AppUtils.userName = AppUtils.userEmail = authData.email;

    //init the store with all relevant events
    //todo get by month & userId?
    this.eventDispatcherService.emit({type: EventActions.getEvents});
    this.eventDispatcherService.emit({type: ProfileActions.getUserProfile});

    return Promise.all([
      this.eventDispatcherService.on(EventActions.eventsReceived),
      this.eventDispatcherService.on(ProfileActions.userProfileReceived)
    ]);
  }
}
