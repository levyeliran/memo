import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Event, HeaderButton} from "../../../api/common/appTypes";
import {EventAlbumPage} from "../event-album/event-album";
import {EventDispatcherService} from "../../../api/dispatcher/appEventDispathcer.service";
import {PhotoActions} from "../../../api/store/photos/photoActions";

@Component({
  selector: 'page-event-details',
  templateUrl: 'event-details.html',
})
export class EventDetailsPage {

  event: Event;
  headerButtons: HeaderButton[];


  constructor(public navCtrl: NavController,
              public eventDispatcherService: EventDispatcherService,
              public navParams: NavParams) {
    this.event = this.navParams.get('event');
    const viewAlbumBtn = new HeaderButton('images', this.onNavigateToAlbum.bind(this), !this.event.isActive);
    this.headerButtons = [
      viewAlbumBtn
    ];
  }

  onNavigateToAlbum() {
    //get the event photos
    this.eventDispatcherService.emit({type: PhotoActions.getEventPhotos, payload: this.event.key});
    this.navCtrl.push(EventAlbumPage, {event: this.event});
  }

}
