import {Component, OnDestroy, OnInit} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {EventDispatcherService} from "../../../api/dispatcher/appEventDispathcer.service";
import {BaseComponent} from "../../../api/common/baseComponent/baseComponent";
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-event-album-animation',
  templateUrl: 'event-album-animation.html',
})
export class EventAlbumAnimationPage extends BaseComponent implements OnInit, OnDestroy {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public eventDispatcherService: EventDispatcherService,
              private iab: InAppBrowser) {
    super(eventDispatcherService);
    //set animation events
    this.registerToEvents();
  }

  ngOnInit() {

    const browser = this.iab.create('https://us-central1-memo-11ade.cloudfunctions.net/animation?eventKey=1223');
    browser.show();
  }

  //http://cssslider.com/wordpress-slider-15.html

  startAnimationMusic(){

  }

  stopAnimationMusic(){

  }

  registerToEvents(){

  }

  ngOnDestroy() {
    //unregister to events
  }
}
