import { Component , ViewChild } from '@angular/core';
import { ProfilePage } from '../profile/profile';
import { HomePage } from '../home/home';
import { EventsPage } from '../events/events';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ProfilePage;
  tab2Root = HomePage;
  tab3Root = EventsPage;

  //get referance to tabs child in the tabs view
  @ViewChild('myTabs') tabRef: any;

  constructor() {}

  //select the home tab on load (ionic select the first by default)
  ionViewDidEnter() {
    this.tabRef.select(1);
  }
}
