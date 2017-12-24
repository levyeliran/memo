import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-event-album-tabs',
  templateUrl: 'event-album-tabs.html',
})
export class EventAlbumTabsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventAlbumTabsPage');
  }

}
