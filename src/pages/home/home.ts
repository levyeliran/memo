import {Component, OnDestroy, OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';
import {AppStoreService} from "../../api/store/appStore.service";
import {Event} from "../../api/common/appTypes";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {

  eventStoreSubscription:any;
  cardsEvents: Event[];

  constructor(public navCtrl: NavController,
              public appStoreService: AppStoreService) {
    this.cardsEvents = [];
    this.setEventsToCards();
  }


  ngOnInit() {

    //update the calender each time the store has been changed
    this.eventStoreSubscription = this.appStoreService._eventStore().subscribe((_store)=>{
      if(_store){
        this.cardsEvents = _store.events;
        this.setEventsToCards();
      }
    });
  }

  ngOnDestroy() {
    this.eventStoreSubscription.unsubscribe();
  }

  setEventsToCards(){

  }

  onCreateNewEvent(){
    //navigate to events tab
    this.navCtrl.parent.select(2);
  }

  onEventOpen(event:Event){
    //navigate to event album - if its exist
  }

}
