import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {EventDispatcherService} from "../../../api/dispatcher/appEventDispathcer.service";
import {BaseComponent} from "../../../api/common/baseComponent/baseComponent";
import {AppStoreService} from "../../../api/store/appStore.service";
import {Event, HeaderButton} from "../../../api/common/appTypes";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'page-event-album-animation',
  templateUrl: 'event-album-animation.html',
})
export class EventAlbumAnimationPage extends BaseComponent implements OnInit, OnDestroy {

  baseURL = "https://us-central1-memo-11ade.cloudfunctions.net/animation";
  animationURL: SafeResourceUrl;
  event: Event;
  headerButtons: HeaderButton[];
  animationAudio:any;
  volumeIcon:string;
  animationStoreSubscription: any;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public appStoreService: AppStoreService,
              public eventDispatcherService: EventDispatcherService,
              public sanitizer: DomSanitizer) {
    super(eventDispatcherService);

    this.event = this.navParams.get('event');
    this.volumeIcon = 'volume-up';
    const animationAudioBtn = new HeaderButton(this.volumeIcon, this.onAnimationAudioChanged.bind(this), false);
    this.headerButtons = [
      animationAudioBtn
    ];


    //set animation events
    this.registerToEvents();
  }


  //upload music to FB - run it from there!!!!


  ngOnInit() {
    //https://www.photo-mark.com/notes/image-preloading/
    //A better way to preload images for web galleries

    //send Event Key!!!!

/*    //update the animation icon
    this.animationStoreSubscription = this.appStoreService._animationStore().subscribe((_store) => {
      if (_store && _store.animation && _store.animation.lastCreationDate) {
        self.lastCreationDate = _store.animation.lastCreationDate;
        self.needRefreshAnimation = self.appUtils.isDateGraterThan(_store.animation.lastCreationDate, self.lastCreationDate);

        if (!self.browser) {
          //https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-inappbrowser/
          self.browser = self.iab.create(`${self.beseURL}?eventKey=${self.event.key}`,"_blank");
          self.browser.show();
        }

        if (self.needRefreshAnimation && self.browser) {
          //reload the animation when needed.
          self.browser.reload();
          self.needRefreshAnimation = false;
        }

      }
    });*/

    /*self.browser = self.iab.create(
      `${self.animationURL}?eventKey=${self.event.key}`,
      "_self",
      {
      location: "no", zoom : 'no'
    });
    self.browser.show();*/

     this.animationURL = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.baseURL}?eventKey=${this.event.key}`);
     console.log(this.animationURL);

     //create animation audio instance in a loop
    this.animationAudio = new Audio('assets/sounds/animationMusic.mp3');
    this.animationAudio.controls = true;
    this.animationAudio.addEventListener('ended', this.loopAnimationAudio.bind(this), false);
    this.animationAudio.play();
  }

  loopAnimationAudio(){
    this.animationAudio.currentTime = 0;
    this.animationAudio.play();
  }

  onAnimationAudioChanged(){
    if(this.animationAudio.muted){
      this.headerButtons[0].changeIcon('volume-up');
    }
    else {
      this.headerButtons[0].changeIcon('volume-off');
    }
    this.animationAudio.muted = !this.animationAudio.muted;
  }

  //http://cssslider.com/wordpress-slider-15.html
  registerToEvents() {

  }

  ngOnDestroy() {
    //unregister to events
    //this.animationStoreSubscription.unsubscribe();
    this.animationAudio.pause();
    this.animationAudio.currentTime = 0;
    this.animationAudio.removeEventListener('ended', this.loopAnimationAudio)
  }
}
