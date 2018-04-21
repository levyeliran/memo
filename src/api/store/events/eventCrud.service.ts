import {Injectable} from "@angular/core";
import {EventDispatcherService} from "../../dispatcher/appEventDispathcer.service";
import {Store} from "@ngrx/store";
import {AngularFireDatabase} from "angularfire2/database";
import {AppStore} from "../appStore.interface";
import {EventActions} from "./eventActions";
import {Event} from "../../common/appTypes";
import {FirebaseApp} from 'angularfire2';
import {AppUtils} from "../../utilities/appUtils";
import {Action} from '@ngrx/store';
import {AppLogger} from "../../utilities/appLogger";

@Injectable()
export class EventCrud{

  logger: AppLogger;
  eventCrudSubscriptions: any[];

  constructor(public eventDispatcherService: EventDispatcherService,
              public store: Store<AppStore>,
              public fb: FirebaseApp,
              public db: AngularFireDatabase) {
    this.eventCrudSubscriptions = [];
    this.logger = new AppLogger();
  }

  registerToEvents() {
    this.logger.log("EventCrud OnInit");

    const getEventSub = this.eventDispatcherService.on(EventActions.getEvent);
    getEventSub.subscribe(this.getEvent.bind(this));

    const getEventsSub = this.eventDispatcherService.on(EventActions.getEvents);
    getEventsSub.subscribe(this.getEvents.bind(this));

    const createEventSub = this.eventDispatcherService.on(EventActions.createEvent);
    createEventSub.subscribe(this.createEvent.bind(this));

    const updateEventSub = this.eventDispatcherService.on(EventActions.updateEvent);
    updateEventSub.subscribe(this.updateEvent);

    //add all subjects to list - we unsubscribe to them when close the app
    this.eventCrudSubscriptions.push(getEventSub);
    this.eventCrudSubscriptions.push(getEventsSub);
    this.eventCrudSubscriptions.push(createEventSub);
    this.eventCrudSubscriptions.push(updateEventSub);
  }

  unsubscribeEvents() {
    this.logger.log("EventCrud OnDestroy");
    this.eventCrudSubscriptions.forEach(s => s.unsubscribe());
  }

  private getEvent(eventKey: string) {
    this.db.list<Event>(`events/${eventKey}`).valueChanges().subscribe((payload) => {
      //update the store with the retrieved event
      this.store.dispatch({type: EventActions.getEvent, payload});

      //dispatch an ack
      this.dispatchAck({type: EventActions.eventReceived});
    });
  }

  private getEvents() {

      this.db.list(`userToEvent/${AppUtils.userKey}`).valueChanges()
      .subscribe(userEvents => {

        //update the store with the retrieved events
        this.store.dispatch({type: EventActions.getEvents, payload: userEvents});

        //dispatch an ack
        this.dispatchAck({type: EventActions.eventsReceived});
      });
  }

  private createEvent(event: Event) {
    const self = this;
    event = this.removeUIProperties(event);

    const pushRef = this.fb.database().ref().child('events').push();
    event.key = pushRef.key;
    event.creationDate = (new Date()).toString();
    event.creatorKey = AppUtils.userKey;
    event.creatorName = AppUtils.fullName;

    pushRef.set(event).then((e) => {
      //dispatch an ack
      self.dispatchAck({type: EventActions.eventCreated});
    });
  }

  private updateEvent(event: Event) {
    event = this.removeUIProperties(event);
    this.db.list<Event>('events').update(event.key, event).then((event) => {
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
