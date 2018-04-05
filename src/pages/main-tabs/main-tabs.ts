import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ProfilePage } from '../profile/profile';
import { HomePage } from '../home/home';
import { EventsPage } from '../events/events';
import {AppStoreService} from "../../api/store/appStore.service";
import {AppUtils} from "../../api/utilities/appUtils";

@Component({
  templateUrl: 'main-tabs.html'
})
export class MainTabsPage implements OnInit, OnDestroy, AfterViewInit {

  profileTabRoot = ProfilePage;
  homeTabRoot = HomePage;
  eventsTabRoot:any = EventsPage;
  eventsTabBadgeCount:any;
  eventStoreSubscription:any;

  //get reference to tabs child in the tabs view
  @ViewChild('mainTabs') tabRef: any;

  constructor(public appStoreService: AppStoreService) {}

  ngOnInit() {

    const self = this;
    //update the calender each time the store has been changed
    this.eventStoreSubscription = this.appStoreService._eventStore().subscribe((_store) => {
      if (_store && _store.events && _store.events.length) {
        if(_store.events.find(e => AppUtils.isCurrentDate(e.startDate))){
          self.eventsTabBadgeCount = 1;
        }
      }
    });
  }

  ngOnDestroy() {
    //unregister to events
    this.eventStoreSubscription.unsubscribe();
  }

  ngAfterViewInit(){
    //select the home tab on load (ionic select the first by default)
    this.tabRef.select(1);
  }
}
