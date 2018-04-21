import {Component, OnDestroy} from '@angular/core';
import { NavController } from 'ionic-angular';
import {AppSettings} from "../../api/common/appTypes";
import {BackgroundMode} from "@ionic-native/background-mode";
import {BaseComponent} from "../../api/common/baseComponent/baseComponent";
import {EventDispatcherService} from "../../api/dispatcher/appEventDispathcer.service";
@Component({
  selector: 'page-app-settings',
  templateUrl: 'app-settings.html',
})
export class AppSettingsPage extends BaseComponent implements  OnDestroy {

  //https://ionicframework.com/docs/native/background-mode/
  appSettings: AppSettings;
  constructor(public navCtrl: NavController,
              public eventDispatcherService: EventDispatcherService,
              public backgroundMode:BackgroundMode) {
    super(eventDispatcherService);
  }

  ngOnDestroy() {
    //unregister to events
    //this.unregisterToEvent(PhotoActions.photoUploadedToStorage);
  }

  registerToEvents() {
    const self = this;
   /* this.registerToEvent(PhotoActions.photoUploadedToStorage).subscribe(() => {
      self.loader.dismiss();
      //navigate back to the album
      if (self.navCtrl.length() > 1) {
        self.navCtrl.pop();
      }
    });*/
  }


  //toggle btn for - save my images in device
  //toggle btn for "run animation hourly"

  onScheduleAnimation(){
    this.backgroundMode.enable();

    this.backgroundMode.on('activate').subscribe(() => {
      //check if the event is active, only for OWNER, run animation hourly
      //save requiredStatus = true to eventAnimation/eventKey
    });

    this.backgroundMode.on('deactivate').subscribe(() => {

    });
  }

  onStopScheduleAnimation(){
    this.backgroundMode.disable();
  }

}
