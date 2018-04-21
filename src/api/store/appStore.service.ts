import {Injectable} from "@angular/core";
import {EventDispatcherService} from "../dispatcher/appEventDispathcer.service";
import {EventActions} from "./events/eventActions";
import {Observable} from "rxjs/Rx";
import {AnimationStore, AppSettingsStore, EventStore, PhotoStore, ProfileStore} from "../common/appTypes";
import {Store} from "@ngrx/store";
import {AppStore} from "./appStore.interface";
import {ProfileActions} from "./profile/profileActions";
import {AppUtils} from "../utilities/appUtils";
import {AppSettingsActions} from "./app/appSettingsActions";

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

  public _animationStore(): Observable<AnimationStore>{
    return this.store.select(store => store.animationStore);
  }

  public _appSettingsStore(): Observable<AppSettingsStore>{
    return this.store.select(store => store.appSettingsStore);
  }

  public initAppStore(authData:any): Promise<any>{
    AppUtils.userKey = authData.uid;

    //init the store with all relevant events
    this.eventDispatcherService.emit({type: EventActions.getEvents});
    this.eventDispatcherService.emit({type: ProfileActions.getUserProfile});
    this.eventDispatcherService.emit({type: AppSettingsActions.getAppSettings});

    return Promise.all([
      this.eventDispatcherService.on(EventActions.eventsReceived),
      this.eventDispatcherService.on(ProfileActions.userProfileReceived),
      this.eventDispatcherService.on(AppSettingsActions.appSettingsReceived)
    ]);
  }
}
