import { Component , ViewChild } from '@angular/core';
import { ProfilePage } from '../profile/profile';
import { HomePage } from '../home/home';
import { EventsPage } from '../events/events';

@Component({
  templateUrl: 'main-tabs.html'
})
export class MainTabsPage {

  profileTabRoot = ProfilePage;
  homeTabRoot = HomePage;
  eventsTabRoot:any = EventsPage;
  eventsTabBadgeCount:any;

  //get reference to tabs child in the tabs view
  @ViewChild('mainTabs') tabRef: any;

  constructor() {}

  //select the home tab on load (ionic select the first by default)
  //todo remove when done
  ionViewDidEnter() {
    this.tabRef.select(2);

    //add badge when there is an event "now"
    this.eventsTabBadgeCount = 1;
  }
}