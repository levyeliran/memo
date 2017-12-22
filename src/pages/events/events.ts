import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AppConstants} from '../../api/common/appConstants'
import {AppUtils} from '../../api/utilities/appUtils'
import {Event, EventStatus} from "../../api/common/appTypes";
import {AppStoreService} from "../../api/store/appStore.service";
import { CreateEventPage } from "./create-event/create-event";
import { EventAlbumPage } from "./event-album/event-album";
import {EventCrud} from "../../api/store/events/eventCrud.service";

@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage implements OnInit, OnDestroy {


  appConst = AppConstants;
  appUtils = AppUtils;
  eventStatus = EventStatus;
  eventStoreSubscription:any;
  calendarEvents: Event[];
  calendarEventsToDateMap: { [key:string]:Event; };

  //https://www.npmjs.com/package/ion2-calendar
  calendarOptions: any;
  selectedDate: any;
  selectedDateEvent: Event;

  constructor(public navCtrl: NavController,
              public eventCrud: EventCrud,
              public appStoreService: AppStoreService) {
    this.calendarEvents = [];
    this.selectedDateEvent = new Event();
    this.setEventsToCalender();

  }


  ngOnInit() {

    //update the calender each time the store has been changed
    this.eventStoreSubscription = this.appStoreService._eventStore().subscribe((_store)=>{
      if(_store){
        this.calendarEvents = _store.events;
        this.setEventsToCalender();
      }
    });
  }

  ngOnDestroy() {
    this.eventStoreSubscription.unsubscribe();
  }

  setEventsToCalender(){
    let _daysConfig: any[] = [];
    this.calendarEventsToDateMap = {};
    this.calendarEvents.forEach((e: Event) => {

      //populate the mat - for O(1) selection on calender selection changed
      const eventDateKey = this.appUtils.getDateStrFormat(e.startDate);
      this.calendarEventsToDateMap[eventDateKey] = e;

      const isPassed = this.appUtils.isPassedDate(e.endDate);
      const isCurrent = this.appUtils.isCurrentDate(e.endDate);
      _daysConfig.push({
        date: new Date(e.startDate),
        subTitle: e.initials,
        marked: isCurrent,
        disable: isPassed,
        cssClass: e.key //use the cssClass in order to hold the id
      })
    });

    //disable the last date
    _daysConfig.push({
      date: this.appUtils.getFutureDate(6),
      disable: true
    })

    this.calendarOptions = {
      from: new Date(2017, 11, 1),
      to: this.appUtils.getFutureDate(6),
      daysConfig: _daysConfig,
      defaultDate: new Date(),
    };
  }


  onDateChange(e: any) {
    this.selectedDate = e;
    const eventDateKey = this.appUtils.getDateStrFormat(e);
    const event = this.calendarEventsToDateMap[eventDateKey];

    //find the event if exist on the selected date
    if(event && event.status) {
        this.selectedDateEvent = event;
        return;
    }

    this.selectedDateEvent = new Event();
    this.selectedDateEvent.status = EventStatus.canCreateEvent;
  }

  onCreateEvent(){
    this.navCtrl.parent.parent.push(CreateEventPage, {event: this.selectedDateEvent});
  }

  onJoinToEvent(){
    //update the status & save to db
    this.selectedDateEvent.status = EventStatus.joined;
    this.eventCrud.updateEvent(this.selectedDateEvent);
  }

  onViewEvent(){
    if(this.selectedDateEvent.status === EventStatus.joined ||
      this.selectedDateEvent.status === EventStatus.rejected){

      //display details

    }
    else if(this.selectedDateEvent.status === EventStatus.active ||
      this.selectedDateEvent.status === EventStatus.passed) {

      //navigate to album
      this.navCtrl.parent.parent.push(EventAlbumPage, {event: this.selectedDateEvent});
    }

  }

}
