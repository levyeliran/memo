import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AppConstants} from '../../api/common/appConstants'
import {AppUtils} from '../../api/utilities/appUtils'
import {Event} from "../../api/common/appTypes";
import {AppStore} from "../../api/store/appStore";
import {Store} from "@ngrx/store";

@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage implements OnInit {


  appConst = AppConstants;
  appUtils = AppUtils;
  calendarEvents:Event[] = [];

  //https://www.npmjs.com/package/ion2-calendar
  calendarOptions: any;
  selectedDate: any;

  constructor(public navCtrl: NavController,
              public store: Store<AppStore>) {
  }

  ngOnInit() {
    //update the
    this.store.select(store => store.eventsStore.events).subscribe((events)=>{
      this.calendarEvents = events;
      this.setEventsToCalender();
    });
    this.setEventsToCalender();
  }

  setEventsToCalender(){
    let _daysConfig: any[] = [];
    this.calendarEvents.forEach((e: Event) => {
      _daysConfig.push({
        date: e.startDate,
        subTitle: e.initials,
        marked: this.appUtils.isCurrentDate(e.endDate),
        disable: this.appUtils.isPassedDate(e.endDate)
      })
    });

    //disable passed dates


    //disable the last date
    _daysConfig.push({
      date: this.appUtils.getFutureDate(6),
      disable: true
    })

    this.calendarOptions = {
      from: new Date(2017, 10, 1),
      to: this.appUtils.getFutureDate(6),
      daysConfig: _daysConfig,
      defaultDate: new Date(),
    };
  }

  onDateChange(event: any) {
    if (event) {
      this.selectedDate = event

      //available date
      if (!event.subTitle && !event.disable) {
        //display create button
        if(event.marked){
          //today's date
        }
        else {
          //future date
        }
      }
      //occupied future/present date
      if (event.subTitle && !event.disable) {
        //display event preview
        //display event status + navigation button
      }
      //occupied passed date
      if (event.subTitle && event.disable) {
        //display event preview
      }
      //empty passed date
      if (event.disable) {
        //display empty state
      }
    }
  }

}
