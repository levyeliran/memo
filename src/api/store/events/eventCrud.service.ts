import {Injectable, OnDestroy, OnInit} from "@angular/core";
import {EventDispatcherService} from "../../dispatcher/appEventDispathcer.service";
import {Store} from "@ngrx/store";
import {AngularFireDatabase} from "angularfire2/database";
import {AppStore} from "../appStore.interface";
import {EventActions} from "./eventActions";
import {Event} from "../../common/appTypes";
import {FirebaseApp} from 'angularfire2';
import {AppUtils} from "../../utilities/appUtils";
import {Observable} from 'rxjs/Rx'
import {Action} from '@ngrx/store';
import {AppLogger} from "../../utilities/appLogger";

@Injectable()
export class EventCrud implements OnInit, OnDestroy{

  logger: AppLogger;
  storeTreeNode = 'events';
  eventCrudSubscriptions: any[];

  constructor(public eventDispatcherService: EventDispatcherService,
              public store: Store<AppStore>,
              public fb: FirebaseApp,
              public db: AngularFireDatabase) {
    this.eventCrudSubscriptions = [];
  }

  ngOnInit() {
    console.log("EventCrud OnInit");

    const getEventSub = this.eventDispatcherService.on(EventActions.getEvent);
    getEventSub.subscribe(this.getEvent);

    const getEventsSub = this.eventDispatcherService.on(EventActions.getEvents);
    getEventsSub.subscribe(this.getEvents);

    const createEventSub = this.eventDispatcherService.on(EventActions.createEvent);
    createEventSub.subscribe(this.createEvent);

    const updateEventSub = this.eventDispatcherService.on(EventActions.updateEvent);
    createEventSub.subscribe(this.updateEvent);

    //add all subjects to list - we unsubscribe to them when close the app
    this.eventCrudSubscriptions.push(getEventSub);
    this.eventCrudSubscriptions.push(getEventsSub);
    this.eventCrudSubscriptions.push(createEventSub);
    this.eventCrudSubscriptions.push(updateEventSub);
  }

  ngOnDestroy() {
    console.log("EventCrud OnDestroy");
    this.eventCrudSubscriptions.forEach(s => s.unsubscribe());
  }

  private getEvent(eventId: string) {
    this.db.list<Event>(`${this.storeTreeNode}/${eventId}`).valueChanges().subscribe((payload) => {
      //update the store with the retrieved event
      this.store.dispatch({type: EventActions.getEvent, payload});

      //dispatch an ack
      this.dispatchAck({type: EventActions.eventReceived});
    });
  }

  private getEvents() {

    Observable.combineLatest<any[], Event[]>(
      this.db.list(`userToEvent/${AppUtils.userKey}`).valueChanges(),
      this.db.list<Event>(`${this.storeTreeNode}`).valueChanges())
      .subscribe(([userEvents, events]) => {

        //get the user relevant events
        const _events: Event[] = [];
        events.forEach((event) => {
          const _ue = userEvents.find((ue: any) => ue.eventKey === event.key)
          //add the status to the
          if (_ue) {
            event.status = _ue.status;
            _events.push(event);
          }
        });

        //update the store with the retrieved events
        this.store.dispatch({type: EventActions.getEvents, payload: _events});

        //dispatch an ack
        this.dispatchAck({type: EventActions.eventsReceived});
      });
  }

  private createEvent(event: Event) {
    event = this.removeUIProperties(event);

    const pushRef = this.fb.database().ref().child(`${this.storeTreeNode}`).push();
    event.key = pushRef.key;
    event.creationDate = new Date();

    pushRef.set(event).then((e) => {
      //dispatch an ack
      this.dispatchAck({type: EventActions.eventCreated});
    });
  }

  private updateEvent(event: Event) {
    event = this.removeUIProperties(event);
    this.db.list<Event>(`${this.storeTreeNode}`).update(event.key, event).then((event) => {
      //dispatch an ack
      this.dispatchAck({type: EventActions.eventUpdated});
    });
  }

  private removeUIProperties(event: Event) {
    event.status = null;
    return event;
  }

  private dispatchAck(action: Action) {
    //dispatch an ack
    this.eventDispatcherService.emit(action);
  }

}
