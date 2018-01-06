import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AppConstants} from '../../api/common/appConstants'
import {AppUtils} from '../../api/utilities/appUtils'
import {Event, EventStatus} from "../../api/common/appTypes";
import {AppStoreService} from "../../api/store/appStore.service";
import { CreateEventPage } from "./create-event/create-event";
import {EventCrud} from "../../api/store/events/eventCrud.service";
import {EventDetailsPage} from "./event-details/event-details";

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
  isCreationValidDate:boolean;
  selectedDateEvent: Event;

  constructor(public navCtrl: NavController,
              public eventCrud: EventCrud,
              public appStoreService: AppStoreService) {
    this.calendarEvents = [];
    this.selectedDateEvent = new Event();
    this.isCreationValidDate = false;
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
    this.selectedDate = null;
    this.selectedDateEvent = new Event();
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

      e.isPast = this.appUtils.isPastDate(e.endDate);
      const isCurrent = this.appUtils.isCurrentDate(e.endDate);
      _daysConfig.push({
        date: new Date(e.startDate),
        subTitle: e.initials,
        marked: isCurrent,
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
    this.isCreationValidDate = this.appUtils.isFutureDate(e);
    const event = this.calendarEventsToDateMap[eventDateKey];

    //find the event if exist on the selected date
    if(event) {
        this.selectedDateEvent = event;
        this.isCreationValidDate = false;
        return;
    }

    this.selectedDateEvent = new Event();
  }

  onCreateEvent(){
    const d = this.appUtils.getDateStrFormat(this.selectedDate);
    this.selectedDateEvent.startDate = d;

    this.navCtrl.parent.parent.push(CreateEventPage,
      {
        event: this.selectedDateEvent,
        selectedDate: this.selectedDate
      });
  }

  onJoinToEvent(){
    //update the status & save to db
    this.selectedDateEvent.status = EventStatus.joined;
    this.eventCrud.updateEvent(this.selectedDateEvent);
  }

  onViewEvent(){
/*
    if((this.selectedDateEvent.status == EventStatus.joined ||
        this.selectedDateEvent.status == EventStatus.own)){*/
      //navigate to event detail page
      this.navCtrl.parent.parent.push(EventDetailsPage, {event: this.selectedDateEvent});
/*    }
    else if (this.selectedDateEvent.status == EventStatus.rejected){
      //display event details card (or small div in this page)
      //navigate to album (over the main-tabs)
      //this.navCtrl.parent.parent.push(EventAlbumPage, {event: this.selectedDateEvent});
    }*/
  }

}
