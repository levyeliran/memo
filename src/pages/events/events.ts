import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppConstants } from '../../api/constants/appConstants'

@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {

  //https://www.npmjs.com/package/ion2-calendar
  date: string;
  options:any;
  AppConst = AppConstants;

  constructor(public navCtrl: NavController) {

    let _daysConfig: any[] = [];
    for (let i = 0; i < 31; i++) {
      _daysConfig.push({
        date: new Date(2017, 9, i + 1),
        subTitle: (i == 10 || i == 15) ? this.getExistingEventInitialsTitle() : '',
        marked: (i == 20 || i == 5),
        disable: (i == 25)
      })
    }

    let today = new Date();
    //until 6 month from now
    let endDate = new Date(today.setMonth(today.getMonth() + 6));

    //disable the last date
    _daysConfig.push({
      date: endDate,
      disable: true
    })

    this.options = {
      from: new Date(2017, 0, 1),
      to: endDate,
      daysConfig: _daysConfig,
      defaultDate: today,
      //color: this.AppConst.calendar.colors.secondary
    };

    //console.log(this.options);

  }

  getExistingEventInitialsTitle(){
    return 'Y&R';
  }

  onChange(event) {
    console.log(event);
  }

}
