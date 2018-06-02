import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Event, HeaderButton} from "../../../api/common/appTypes";
import {EventAlbumPage} from "../event-album/event-album";
import {EventDispatcherService} from "../../../api/dispatcher/appEventDispathcer.service";
import {PhotoActions} from "../../../api/store/photos/photoActions";
import {EventActions} from "../../../api/store/events/eventActions";
import {BaseComponent} from "../../../api/common/baseComponent/baseComponent";
import {AnimationActions} from "../../../api/store/animation/animationActions";

@Component({
  selector: 'page-event-details',
  templateUrl: 'event-details.html',
})
export class EventDetailsPage extends BaseComponent implements OnInit, OnDestroy {

  event: Event;
  headerButtons: HeaderButton[];
  isCreatorEvent = false;

  constructor(public navCtrl: NavController,
              public eventDispatcherService: EventDispatcherService,
              public navParams: NavParams) {
    super(eventDispatcherService);

    this.event = this.navParams.get('event');
    this.event.startDate = this.appUtils.getDateStrFormat(this.event.startDate);


    this.event.title = "fgf jgfhg fhj jgf hgf";
    this.event.description = "sdf sdf sdf sdf sdf sdf sfd sfd sf sfd sdf sfd  sdf sdf sdfdsfdsf sf ehy dgvfd osihgowrhgiurwhgsdgshv jsv lsigf wiygwir gvgsilvg sf;ig sgu s;iug wriugt hw oughw8uty43086 7823[921ytuaegf zvxc,vb x.;kjh d;oiuhgsgf iuwqegf df;.ks";
    this.event.description += "sdf sdf sdf sdf sdf sdf sfd sfd sf sfd sdf sfd  sdf sdf sdfdsfdsf sf ehy dgvfd osihgowrhgiurwhgsdgshv jsv lsigf wiygwir gvgsilvg sf;ig sgu s;iug wriugt hw oughw8uty43086 7823[921ytuaegf zvxc,vb x.;kjh d;oiuhgsgf iuwqegf df;.ks";
    this.isCreatorEvent = true;//this.event.creatorKey === this.appUtils.userKey;


    //check if need to display album icon?
    const viewAlbumBtn = new HeaderButton('images', this.onNavigateToAlbum.bind(this), !this.event.isActive);
    this.headerButtons = [
      viewAlbumBtn
    ];
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }


  onNavigateToAlbum() {
    this.eventDispatcherService.emit({type: PhotoActions.getEventPhotos, payload: this.event.key});
    this.eventDispatcherService.emit({type: AnimationActions.getEventAnimation, payload: this.event.key});
    this.navCtrl.push(EventAlbumPage, {event: this.event});
  }

  onStartEvent() {
    this.event.isActive = true;
    //update the event
    this.eventDispatcherService.emit({type: EventActions.updateEvent, payload: this.event});
  }

}
