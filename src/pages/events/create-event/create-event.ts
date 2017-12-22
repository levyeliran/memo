import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Slides} from 'ionic-angular';
import {Event} from "../../../api/common/appTypes";
import {EventCrud} from "../../../api/store/events/eventCrud.service";
import {EventActions } from "../../../api/store/events/eventActions";
import {BaseComponent} from "../../../api/common/baseComponent/baseComponent";
import {EventDispatcherService} from "../../../api/dispatcher/appEventDispathcer.service";
import {AppUtils} from "../../../api/utilities/appUtils";

@Component({
  selector: 'page-create-event',
  templateUrl: 'create-event.html',
})
export class CreateEventPage extends BaseComponent {

  event:Event;
  invitedFriends:any[];
  appUtils = AppUtils;

  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public eventDispatcherService: EventDispatcherService,
              public eventCrud: EventCrud) {

    super(eventDispatcherService);
    this.event = this.navParams.get('event');
  }

  onSkipSlide(){
    this.slides.slideNext(1000);
  }

  onUploadEventCard(){

  }

  onAddEventLocation(){

  }

  validateEvent(): Boolean{
    return !!(this.event.title &&
      this.event.initials &&
      this.event.typeKey &&
      this.event.startDate &&
      this.event.endDate &&
    this.event.description
    //&& this.event.location
    );
  }

  onCreateEvent(){
    //lock the create button
    this.eventCrud.createEvent(this.event);

    //event was created successfully
    this.registerToEvent(EventActions.createEvent).subscribe(() => {
      //navigate "back"
      this.navCtrl.pop();
    });
  }

}
