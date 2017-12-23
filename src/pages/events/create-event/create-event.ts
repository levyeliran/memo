import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Slides} from 'ionic-angular';
import {Event} from "../../../api/common/appTypes";
import {EventCrud} from "../../../api/store/events/eventCrud.service";
import {EventActions } from "../../../api/store/events/eventActions";
import {BaseComponent} from "../../../api/common/baseComponent/baseComponent";
import {EventDispatcherService} from "../../../api/dispatcher/appEventDispathcer.service";
import { AppLocalStorage } from "../../../api/utilities/appLocalStorage.service";

@Component({
  selector: 'page-create-event',
  templateUrl: 'create-event.html',
})
export class CreateEventPage extends BaseComponent {

  event:Event;
  invitedFriends:any[];
  eventStartHour:any = "12:00";
  selectedDate:any;

  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public eventDispatcherService: EventDispatcherService,
              public appLocalStorage: AppLocalStorage,
              public eventCrud: EventCrud) {

    super(eventDispatcherService);
    this.event = this.navParams.get('event');
    this.selectedDate = this.navParams.get('selectedDate');
    this.invitedFriends = [];
    this.eventStartHour = "12:00";
  }

  onSkipSlide(){
    this.slides.slideNext(1000);
  }


  onInviteFriendsChanged(){
    if(this.invitedFriends.length > 10){
      //alert here
      this.invitedFriends.pop();
    }
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

    this.prepareForSave();

    //lock the create button
    this.eventCrud.createEvent(this.event);

    //event was created successfully
    this.registerToEvent(EventActions.createEvent).subscribe(() => {
      //navigate "back"
      this.navCtrl.pop();
    });
  }

  prepareForSave(){
    const h = this.eventStartHour.split(":");
    let startDate: any;
    if(!h.length){
      startDate = new Date(this.selectedDate).setHours(12, 0, 0);
    }
    else {
      startDate = new Date(this.selectedDate).setHours(h[0], h[1], 0);
    }
    this.event.startDate = startDate;
    this.event.endDate = new Date(this.selectedDate).setHours(24, 0, 0);
    this.appLocalStorage.readKey(this.appConst.userDetails.name).then((payload)=>{
      this.event.creatorName = payload;
    });
    this.event.numOfParticipates = this.invitedFriends.length;
  }

}
