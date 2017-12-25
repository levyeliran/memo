import {Component, ViewChild} from '@angular/core';
import {Nav, NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-event-album-tabs',
  templateUrl: 'event-album-tabs.html',
})
export class EventAlbumTabsPage {

  //create references to html elements
  @ViewChild(Nav) nav: Nav;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventAlbumTabsPage');
  }

}
