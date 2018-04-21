import {Injectable} from "@angular/core";
import {EventDispatcherService} from "../../dispatcher/appEventDispathcer.service";
import {Store} from "@ngrx/store";
import {AngularFireDatabase} from "angularfire2/database";
import {AppStore} from "../appStore.interface";
import {Action} from '@ngrx/store';
import {AppLogger} from "../../utilities/appLogger";
import {AnimationActions} from "./animationActions";
import {EventAnimation} from "../../common/appTypes";

@Injectable()
export class AnimationCrud {

  logger: AppLogger;
  animationCrudSubscriptions: any[];

  constructor(public eventDispatcherService: EventDispatcherService,
              public store: Store<AppStore>,
              public db: AngularFireDatabase) {
    this.animationCrudSubscriptions = [];
    this.logger = new AppLogger();
  }

  registerToEvents() {
    console.log("AnimationCrud OnInit");

    const getEventAnimationSub = this.eventDispatcherService.on(AnimationActions.getEventAnimation);
    getEventAnimationSub.subscribe(this.getEventAnimation.bind(this));

    const updateEventAnimationSub = this.eventDispatcherService.on(AnimationActions.updateEventAnimation);
    updateEventAnimationSub.subscribe(this.updateEventAnimation.bind(this));

    const updateEventAnimationCountersSub = this.eventDispatcherService.on(AnimationActions.updateEventAnimationCounters);
    updateEventAnimationCountersSub.subscribe(this.updateEventAnimationCounters.bind(this));


    //add all subjects to list - we unsubscribe to them when close the app
    this.animationCrudSubscriptions.push(getEventAnimationSub);
    this.animationCrudSubscriptions.push(updateEventAnimationSub);
    this.animationCrudSubscriptions.push(updateEventAnimationCountersSub);
  }

  unsubscribeEvents() {
    console.log("AnimationCrud OnDestroy");
    this.animationCrudSubscriptions.forEach(s => s.unsubscribe());
  }

  private getEventAnimation(eventKey: string) {
    this.db.list<Event>(`eventAnimation/${eventKey}`).valueChanges().subscribe((payload) => {
      //update the store with the retrieved event animation
      this.store.dispatch({type: AnimationActions.getEventAnimation, payload});

      //dispatch an ack
      this.dispatchAck({type: AnimationActions.eventAnimationReceived});
    });
  }

  private updateEventAnimation(animation: EventAnimation) {
    animation = this.removeUIProperties(animation);
    this.db.list<EventAnimation>('eventAnimation')
      .update(animation.key, animation)
      .then((animation) => {
        //dispatch an ack
        this.dispatchAck({type: AnimationActions.eventAnimationUpdated});
      });
  }

  private updateEventAnimationCounters(payload: any) {

    const self = this;
    if (payload.photosIncrement) {
      this.db.database
        .ref(`eventAnimation/${payload.eventKey}/photosCount`)
        .transaction(phC => {
          return phC + 1;
        }).then(() => {
        self.logger.log(`Event ${payload.eventKey} Photos count was updated!`);
        //dispatch an ack
        this.dispatchAck({type: AnimationActions.eventAnimationCountersUpdated});
      });
    }

    if (payload.tagsIncrement) {
      this.db.database
        .ref(`eventAnimation/${payload.eventKey}/tagsCount`)
        .transaction(tc => {
          return tc + 1;
        }).then(() => {
        self.logger.log(`Event ${payload.eventKey} Tags count was updated!`);
        //dispatch an ack
        this.dispatchAck({type: AnimationActions.eventAnimationCountersUpdated});
      });
    }
  }

  private removeUIProperties(animation: EventAnimation) {
    animation.lastCreationDate = null;
    animation.tagsCount = null;
    animation.photosCount = null;
    return animation;
  }

  private dispatchAck(action: Action) {
    //dispatch an ack
    this.eventDispatcherService.emit(action);
  }

}