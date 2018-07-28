import {Injectable} from "@angular/core";
import {EventDispatcherService} from "../../dispatcher/appEventDispathcer.service";
import {Store} from "@ngrx/store";
import {AngularFireDatabase} from "angularfire2/database";
import {AppStore} from "../appStore.interface";
import {Action} from '@ngrx/store';
import {AppLogger} from "../../utilities/appLogger";
import {AnimationActions} from "./animationActions";
import {EventAnimation, EventAnimationConfiguration} from "../../common/appTypes";

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

    const getEventAnimationSub = this.eventDispatcherService.on(AnimationActions.getEventAnimationConfiguration);
    getEventAnimationSub.subscribe(this.getEventAnimation.bind(this));

    const createEventAnimationSub = this.eventDispatcherService.on(AnimationActions.createEventAnimation);
    createEventAnimationSub.subscribe(this.createEventAnimation.bind(this));

/*
    const updateEventAnimationCountersSub = this.eventDispatcherService.on(AnimationActions.updateEventAnimationCounters);
    updateEventAnimationCountersSub.subscribe(this.updateEventAnimationCounters.bind(this));
*/


    //add all subjects to list - we unsubscribe to them when close the app
    this.animationCrudSubscriptions.push(getEventAnimationSub);
    this.animationCrudSubscriptions.push(createEventAnimationSub);
    //this.animationCrudSubscriptions.push(updateEventAnimationCountersSub);
  }

  unsubscribeEvents() {
    console.log("AnimationCrud OnDestroy");
    this.animationCrudSubscriptions.forEach(s => s.unsubscribe());
  }


  private getEventAnimation(eventKey: string) {
    this.db.object(`eventAnimation/${eventKey}`)
      .valueChanges()
      .subscribe((animation: EventAnimationConfiguration) => {
      //update the store with the retrieved event animation
      this.store.dispatch({type: AnimationActions.getEventAnimationConfiguration, payload: animation});

      //dispatch an ack
      this.dispatchAck({type: AnimationActions.eventAnimationConfigurationReceived, payload: animation});
    });
  }

  private createEventAnimation(animation: EventAnimation) {
    animation = this.removeUIProperties(animation);
    this.db.list<EventAnimation>('pendingEventAnimation')
      .update(animation.eventKey, animation)
      .then((_animation) => {
        //dispatch an ack
        this.dispatchAck({type: AnimationActions.eventAnimationCreated});
      });
  }

/*
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
*/

  private removeUIProperties(animation: EventAnimation) {
    animation.creationDate = null;
    return animation;
  }

  private dispatchAck(action: Action) {
    //dispatch an ack
    this.eventDispatcherService.emit(action);
  }

}
