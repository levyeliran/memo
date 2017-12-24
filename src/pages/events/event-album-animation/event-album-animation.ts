import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-event-album-animation',
  templateUrl: 'event-album-animation.html',
})
export class EventAlbumAnimationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventAlbumAnimationPage');
  }

}
