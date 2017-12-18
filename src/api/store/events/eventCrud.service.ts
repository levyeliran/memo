import {Injectable} from "@angular/core";
import { EventDispatcherService } from "../../dispatcher/appEventDispathcer.service";
import { Store } from "@ngrx/store";
import { AngularFireDatabase } from "angularfire2/database";
import {AppStore} from "../appStore";
import {EventActions} from "./eventActions";
import {Event} from "../../common/appTypes";


@Injectable()
export class EventCrud{

  storeTreeNode = 'events'

  constructor(public eventDispatcherService: EventDispatcherService,
              public store: Store<AppStore>,
              public db: AngularFireDatabase) {
  }

  getEvents(){
    this.db.list<Event>(`${this.storeTreeNode}`).valueChanges().subscribe((events)=>{
      //update the store with the retrieved events
      this.store.dispatch({type: EventActions.getEvents, payload: events});

      //dispatch an ack (Initial app store use)
      this.eventDispatcherService.emit({
        eventName: EventActions.getEvents})
    })
  }

  getEvent(eventId: string){
    this.db.list<Event>(`${this.storeTreeNode}/${eventId}`).valueChanges().subscribe((event)=>{
      //update the store with the retrieved event
      this.store.dispatch({type: EventActions.getEvent, payload: event});
    });
  }

  createEvent(event: Event){
    this.db.list<Event>(`${this.storeTreeNode}`).push(event).then((event)=>{
      //update the store with the created event
      this.store.dispatch({type: EventActions.createEvent, payload: event});
    })
  }


}
