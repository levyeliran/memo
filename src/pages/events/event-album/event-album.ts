import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Event} from "../../../api/common/appTypes";

@Component({
  selector: 'page-event-album',
  templateUrl: 'event-album.html',
})
export class EventAlbumPage {

  event:Event;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

}
