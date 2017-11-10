import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Menu } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AboutPage } from '../pages/about/about';

import { TabsPage } from '../pages/tabs/tabs';
import {ProfilePage} from "../pages/profile/profile";
import {AppSettingsPage} from "../pages/app-settings/app-settings";
//import { ScreenOrientation } from '@ionic-native/screen-orientation';


@Component({
  templateUrl: 'app.html'
  /*,providers: [ScreenOrientation]*/
})
export class MyApp {
  appStoreReady = false;
  rootPage:any = TabsPage;
  menuPages:Array<{title: string, component: any}>;

  @ViewChild(Nav) nav: Nav;
  @ViewChild(Menu) menu: Menu;

  //constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private screenOrientation: ScreenOrientation) {
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    // used for an example of ngFor and navigation
    this.menuPages = [
      { title: 'Profile', component: ProfilePage },
      { title: 'Settings', component: AppSettingsPage },
      { title: 'About App', component: AboutPage }
    ];

    platform.ready().then(() => {

      // Set orientation to portrait on prod***
      //https://stackoverflow.com/questions/27755208/how-to-restrict-app-to-portrait-mode-only-in-ionic-for-all-platform
      //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //statusBar.styleDefault();
      splashScreen.hide();

      //fetch data and init store
      setTimeout(() =>{
        this.appStoreReady = true;
      }, 500);
    });

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
    this.menu.toggle()
  }
}
