import {Injectable} from "@angular/core";
import {EventDispatcherService} from "../dispatcher/appEventDispathcer.service";
import {EventActions} from "./events/eventActions";
import {Observable} from "rxjs/Rx";
import {EventStore, PhotoStore} from "../common/appTypes";
import {Store} from "@ngrx/store";
import {AppStore} from "./appStore.interface";
import { AppUtils } from "../utilities/appUtils";

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

  public initAppStore(userKey:string): Promise<any>{
    AppUtils.userKey = userKey;

    //init the store with all relevant events
    //todo get by month & userId?
    this.eventDispatcherService.emit({type: EventActions.getEvents});

    return Promise.all([
      this.eventDispatcherService.on(EventActions.eventsReceived)
    ]);
  }
}
