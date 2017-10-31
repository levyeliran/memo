import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
//import { ScreenOrientation } from '@ionic-native/screen-orientation';


@Component({
  templateUrl: 'app.html'
  /*,providers: [ScreenOrientation]*/
})
export class MyApp {
  rootPage:any = TabsPage;
  appStoreReady = false;

  //constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private screenOrientation: ScreenOrientation) {
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {

    platform.ready().then(() => {

      // Set orientation to portrait on prod***
      //https://stackoverflow.com/questions/27755208/how-to-restrict-app-to-portrait-mode-only-in-ionic-for-all-platform
      //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      //fetch data and init store
      setTimeout(() =>{
        this.appStoreReady = true;
      }, 500);
    });
  }
}
