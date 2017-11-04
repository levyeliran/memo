import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AppConstants} from '../../api/constants/appConstants'
import {AppUtils} from '../../api/appUtils'
import {Event} from '../../api/constants/appTypes'

@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage implements OnInit {

  AppConst = AppConstants;
  AppUtils = AppUtils;
  calendarEvents: [Event] = [];

  //https://www.npmjs.com/package/ion2-calendar
  calendarOptions: any;
  selectedDate: any;

  constructor(public navCtrl: NavController) {
  }

  ngOnInit() {

    let _daysConfig: any[] = [];
    this.calendarEvents.forEach((e: Event) => {
      _daysConfig.push({
        date: e.startDate,
        subTitle: e.initials,
        marked: this.AppUtils.isCurrentDate(e.endDate),
        disable: this.AppUtils.isPassedDate(e.endDate)
      })
    });

    //disable passed dates


    //disable the last date
    _daysConfig.push({
      date: this.AppUtils.getFutureDate(6),
      disable: true
    })

    this.calendarOptions = {
      from: new Date(2017, 10, 1),
      to: this.AppUtils.getFutureDate(6),
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
