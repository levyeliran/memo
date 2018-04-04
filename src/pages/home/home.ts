import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AppStoreService} from "../../api/store/appStore.service";
import {Event, EventStatus} from "../../api/common/appTypes";
import {AppUtils} from "../../api/utilities/appUtils";
import {EventAlbumPage} from "../events/event-album/event-album";
import {PhotoActions} from "../../api/store/photos/photoActions";
import {EventDispatcherService} from "../../api/dispatcher/appEventDispathcer.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {

  eventStoreSubscription: any;
  cardsEvents: Event[];
  appUtils = AppUtils;
  displaySpinner = false;

  constructor(public navCtrl: NavController,
              public eventDispatcherService: EventDispatcherService,
              public appStoreService: AppStoreService) {
    this.cardsEvents = [];
    this.displaySpinner = true;
    this.setEventsToCards();
  }


  ngOnInit() {

    const self = this;
    //update the calender each time the store has been changed
    this.eventStoreSubscription = this.appStoreService._eventStore().subscribe((_store) => {
      if (_store && _store.events && _store.events.length) {
        self.cardsEvents = _store.events;
        self.displaySpinner = false;
        self.setEventsToCards();
      }
    });
  }

  ngOnDestroy() {
    //unregister to events
    this.eventStoreSubscription.unsubscribe();
  }

  setEventsToCards() {
    this.cardsEvents.forEach((event) => {
      event.defaultIntroPhotoURL = this.getDefaultCardBg();
      event.startDateStr = this.appUtils.getDateStrFormat(event.startDate);
    })
  }

  getDefaultCardBg() {
    const rnd = Math.floor((Math.random() * 7) + 1);
    return "assets/images/eventDefaultCardBG" + rnd + ".jpg";
  }

  onCreateNewEvent() {
    //navigate to events tab
    this.navCtrl.parent.select(2);
  }

  isEventViewAvailable(event: Event) {
    return (!!event.isPast &&
      (event.status == EventStatus.joined ||
        event.status == EventStatus.own));
  }

  isEventUpdateAvailable(event: Event) {
    return (!!event.isActive &&
      (event.status == EventStatus.joined ||
        event.status == EventStatus.own));
  }

  onEventOpen(event: Event) {
    //navigate to event album - if its exist
    //get the event photos
    this.eventDispatcherService.emit({type: PhotoActions.getEventPhotos, payload: event.key});
    //navigate to album (over the main-tabs)
    this.navCtrl.parent.parent.push(EventAlbumPage, {event});
  }

}
