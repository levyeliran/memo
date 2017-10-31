import { Component , ViewChild } from '@angular/core';
import { ProfilePage } from '../profile/profile';
import { HomePage } from '../home/home';
import { EventsPage } from '../events/events';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  profileTabRoot = ProfilePage;
  homeTabRoot = HomePage;
  eventsTabRoot:any = EventsPage;
  eventsTabBadgeCount:any;

  //get referance to tabs child in the tabs view
  @ViewChild('myTabs') tabRef: any;

  constructor() {}

  //select the home tab on load (ionic select the first by default)
  ionViewDidEnter() {
    this.tabRef.select(2);

    //add badge when there is an event "now"
    this.eventsTabBadgeCount = 1;
  }
}
