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
        subTitle: this.getExistingEventInitialsTitle()
      })
    }

    let today = new Date();
    this.options = {
      from: new Date(2017, 0, 1),
      //until 6 month from now
      to: new Date(today.setMonth(today.getMonth() + 6)),
      daysConfig: _daysConfig
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
