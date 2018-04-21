import {Component, OnDestroy, OnInit} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {EventDispatcherService} from "../../../api/dispatcher/appEventDispathcer.service";
import {BaseComponent} from "../../../api/common/baseComponent/baseComponent";
import { InAppBrowser } from '@ionic-native/in-app-browser';
import {AppStoreService} from "../../../api/store/appStore.service";
import {Event} from "../../../api/common/appTypes";

@Component({
  selector: 'page-event-album-animation',
  templateUrl: 'event-album-animation.html',
})
export class EventAlbumAnimationPage extends BaseComponent implements OnInit, OnDestroy {

  animationURL = "https://us-central1-memo-11ade.cloudfunctions.net/animation";
  event: Event;
  animationStoreSubscription:any;
  lastCreationDate:any;
  needRefreshAnimation = false;
  browser: any;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public appStoreService: AppStoreService,
              public eventDispatcherService: EventDispatcherService,
              private iab: InAppBrowser) {
    super(eventDispatcherService);

    this.event = this.navParams.get('event');
    //set animation events
    this.registerToEvents();
  }


  //upload music to FB - run it from there!!!!


  ngOnInit() {
    const self = this;
    //https://www.photo-mark.com/notes/image-preloading/
    //A better way to preload images for web galleries

    //send Event Key!!!!

    //update the animation icon
    this.animationStoreSubscription = this.appStoreService._animationStore().subscribe((_store) => {
      if (_store && _store.animation && _store.animation.lastCreationDate) {
        self.lastCreationDate = _store.animation.lastCreationDate;
        self.needRefreshAnimation = self.appUtils.isDateGraterThan(_store.animation.lastCreationDate, self.lastCreationDate);
      }

      if(!self.browser){
        //https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-inappbrowser/
        self.browser = this.iab.create(`${self.animationURL}?eventKey=${_store.animation.key}`);
        self.browser.show();
      }

      if(self.needRefreshAnimation && self.browser){
        //reload the animation when needed.
        self.browser.reload();
        self.needRefreshAnimation = false;
      }
    });

  }

  //http://cssslider.com/wordpress-slider-15.html
  registerToEvents(){

  }

  ngOnDestroy() {
    //unregister to events
    this.animationStoreSubscription.unsubscribe();
  }
}
