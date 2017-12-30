import {Component, OnInit} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {BaseComponent} from "../../../api/common/baseComponent/baseComponent";
import {EventDispatcherService} from "../../../api/dispatcher/appEventDispathcer.service";
import {Photo} from "../../../api/common/appTypes";


@Component({
  selector: 'page-event-album-photo',
  templateUrl: 'event-album-photo.html',
})
export class EventAlbumPhotoPage extends BaseComponent implements OnInit  {

  photo:Photo;
  isDisplayHeartAnimation = false;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public eventDispatcherService: EventDispatcherService) {
    super(eventDispatcherService);
    this.photo = this.navParams.get('photo');
    //extract params

  }

  //!!!!!!!!!!!!!! - should be on the photo object
  //display "heart" icon if the user liked the image or "tag" icon if he did something else
  //display all emoticons on full page


  ngOnInit() {
    //set photo events
    this.registerToEvents();

  }

  registerToEvents(){

  }


  onPhotoPress(){
    //toggle the emoji icons menu
    this.isDisplayHeartAnimation = true;
    console.log('photo pressed');
  }

  onPhotoDblClick(){
    //toogle like emoji to this image (display "heart" on top)
    this.isDisplayHeartAnimation = true;
    console.log('photo dbl clicked');
  }



}
