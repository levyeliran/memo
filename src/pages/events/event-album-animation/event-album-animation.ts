import {Component, OnInit} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {EventDispatcherService} from "../../../api/dispatcher/appEventDispathcer.service";
import {BaseComponent} from "../../../api/common/baseComponent/baseComponent";

@Component({
  selector: 'page-event-album-animation',
  templateUrl: 'event-album-animation.html',
})
export class EventAlbumAnimationPage extends BaseComponent implements OnInit {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public eventDispatcherService: EventDispatcherService) {
    super(eventDispatcherService);

  }

  ngOnInit() {
    //set animation events
    this.registerToEvents();

  }

  startAnimationMusic(){

  }

  stopAnimationMusic(){

  }

  registerToEvents(){

  }

}
