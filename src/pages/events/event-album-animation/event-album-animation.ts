import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {EventDispatcherService} from "../../../api/dispatcher/appEventDispathcer.service";
import {BaseComponent} from "../../../api/common/baseComponent/baseComponent";
import {AppStoreService} from "../../../api/store/appStore.service";
import {Event, EventAnimationConfiguration, HeaderButton} from "../../../api/common/appTypes";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import * as $ from "jquery";
import * as _ from 'lodash';

@Component({
  selector: 'page-event-album-animation',
  templateUrl: 'event-album-animation.html',
})
export class EventAlbumAnimationPage extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

  baseURL = "https://us-central1-memo-11ade.cloudfunctions.net/animation";
  animationURL: SafeResourceUrl;
  event: Event;
  headerButtons: HeaderButton[];
  animationAudio: any;
  volumeIcon: string;
  //animationStoreSubscription: any;
  animationConfiguration: EventAnimationConfiguration;
  animationLoopInterval:any;
  animationGifsInterval:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public appStoreService: AppStoreService,
              public eventDispatcherService: EventDispatcherService,
              public sanitizer: DomSanitizer) {
    super(eventDispatcherService);

    this.event = this.navParams.get('event');
    this.animationConfiguration = this.navParams.get('animationConfiguration');
    this.logger.log(this.animationConfiguration);
    this.volumeIcon = 'volume-up';
    const animationAudioBtn = new HeaderButton(this.volumeIcon, this.onAnimationAudioChanged.bind(this), false);
    this.headerButtons = [
      animationAudioBtn
    ];

    //set animation events
    this.registerToEvents();
  }

  ngAfterViewInit() {
    this.runAnimation();
  }

  //upload music to FB - run it from there!!!!


  ngOnInit() {
    //https://www.photo-mark.com/notes/image-preloading/
    //A better way to preload images for web galleries

    this.animationURL = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.baseURL}?eventKey=${this.event.key}`);
    console.log(this.animationURL);

    //create animation audio instance in a loop
    this.animationAudio = new Audio('assets/sounds/animationMusic.mp3');
    this.animationAudio.controls = true;
    this.animationAudio.addEventListener('ended', this.loopAnimationAudio.bind(this), false);
    this.animationAudio.play();
  }

  runAnimation(){
    const totalAnimationTime = _.get(this, "animationConfiguration.animationData.appCompletion.totalTimeInMillisecond", 0) +
      _.get(this, "animationConfiguration.animationData.appCompletion.delayTimeInMillisecond", 0);

    $(document).ready(()=>{
      const iframe:any = document.getElementById('animationIframe');
      const gifImg:any = document.getElementById('gifImg');
      const gifsSrcs = [
        "assets/images/gifs/fireworks4.gif",
        "assets/images/gifs/coolBeerCup.gif",
        "assets/images/gifs/dancingBanana.gif",
        "assets/images/gifs/fireworks1.gif",
        "assets/images/gifs/floatingDancer.gif",
        "assets/images/gifs/filledUpTwoBeerCups.gif",
        "assets/images/gifs/greenWinkMan.gif",
        "assets/images/gifs/happyColoredDancer.gif",
        "assets/images/gifs/happyHampster.gif",
        "assets/images/gifs/hotdogWithPartyBall.gif",
        "assets/images/gifs/loveHeartSticker.gif",
        "assets/images/gifs/partySticker.gif",
        "assets/images/gifs/pinkWineBottle.gif",
        "assets/images/gifs/powSticker.gif",
        "assets/images/gifs/rainbowCake.gif",
        "assets/images/gifs/spongeBobLove.gif",
        "assets/images/gifs/teenagerDancer.gif",
        "assets/images/gifs/twinkledStar.gif",
        "assets/images/gifs/twistedPinkCandy.gif",
        "assets/images/gifs/yasssSticker.gif",
        "assets/images/gifs/yellowLight.gif"
      ];
      const gifsClass = [
      "topLeft1",
      "topLeft2",
      "topRight1",
      "topRight2",
      "btmLeft1",
      "btmLeft2",
      "btmRight1",
      "btmRight2"
      ];

      this.animationGifsInterval = setInterval(()=>{
        if(gifImg && gifImg.src){
          gifImg.src = gifsSrcs[Math.floor((Math.random() * gifsSrcs.length))]
          gifImg.className = gifsClass[Math.floor((Math.random() * gifsClass.length))]
        }
      }, 5000)

      this.animationLoopInterval = setInterval(()=>{
        if(iframe && iframe.src){
          iframe.src = iframe.src;
        }

      }, totalAnimationTime + 2000);
    });
  }


  loopAnimationAudio() {
    this.animationAudio.currentTime = 0;
    this.animationAudio.play();
  }

  onAnimationAudioChanged() {
    if (this.animationAudio.muted) {
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
    if(this.animationLoopInterval){
      clearInterval(this.animationLoopInterval);
    }
    if(this.animationGifsInterval){
      clearInterval(this.animationGifsInterval);
    }
    this.animationAudio.pause();
    this.animationAudio.currentTime = 0;
    this.animationAudio.removeEventListener('ended', this.loopAnimationAudio)
  }
}
