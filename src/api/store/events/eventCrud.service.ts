import {Injectable} from "@angular/core";
import { EventDispatcherService } from "../../dispatcher/appEventDispathcer.service";
import { Store } from "@ngrx/store";
import { AngularFireDatabase } from "angularfire2/database";
import {AppStore} from "../appStore.interface";
import {EventActions} from "./eventActions";
import {Event} from "../../common/appTypes";
import { FirebaseApp } from 'angularfire2';
import { AppUtils } from "../../utilities/appUtils";
import {Observable} from "rxjs/Observable";

@Injectable()
export class EventCrud{

  storeTreeNode = 'events';

  constructor(public eventDispatcherService: EventDispatcherService,
              public store: Store<AppStore>,
              public fb:FirebaseApp,
              public db: AngularFireDatabase) {
  }

  getEvents(){

    Observable.combineLatest<any[], Event[]>(
      this.db.list(`userToEvent/${AppUtils.userKey}`).valueChanges(),
      this.db.list<Event>(`${this.storeTreeNode}`).valueChanges())
      .subscribe(( [userEvents, events] )=>{

        //get the user relevant events
        const _events: Event[] =[];
        events.forEach((event)=>{
          const _ue = userEvents.find((ue:any)=> ue.eventKey === event.key)
          //add the status to the
          if(_ue) {
            event.status = _ue.status;
            _events.push(event);
          }
        });

        //update the store with the retrieved events
        this.store.dispatch({type: EventActions.getEvents, payload: _events});

        //dispatch an ack
        this.dispatchAck(EventActions.getEvents);
      });
  }
/*
  private getUserEvents():Observable<any[]>{
    return this.db.list(`userToEvent/${AppUtils.userKey}`).valueChanges();
  }*/

  getEvent(eventId: string){
    this.db.list<Event>(`${this.storeTreeNode}/${eventId}`).valueChanges().subscribe((event)=>{
      //update the store with the retrieved event
      this.store.dispatch({type: EventActions.getEvent, payload: event});

      //dispatch an ack
      //dispatch an ack
      this.dispatchAck(EventActions.getEvent);
    });
  }

  createEvent(event: Event){
    event = this.removeUIProperties(event);

    const pushRef = this.fb.database().ref().child(`${this.storeTreeNode}`).push();
    event.key = pushRef.key;
    event.creationDate = new Date();

    pushRef.set(event).then((e)=>{
      //update the store with the created event
      this.store.dispatch({type: EventActions.createEvent, payload: event});

      //dispatch an ack
      this.dispatchAck(EventActions.createEvent);
    });
  }

  updateEvent(event: Event){
    event = this.removeUIProperties(event);
    this.db.list<Event>(`${this.storeTreeNode}`).update(event.key, event).then((event)=>{
      //update the store with the updated event
      this.store.dispatch({type: EventActions.updateEvent, payload: event});

      //dispatch an ack
      this.dispatchAck(EventActions.updateEvent);
    });
  }

  removeUIProperties(event: Event){
    event.status = null;
    return event;
  }

  dispatchAck(eventName:string){
    //dispatch an ack
    this.eventDispatcherService.emit({
      eventName: eventName });
  }


}
