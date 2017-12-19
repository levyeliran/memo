import {Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {Platform, Nav, Menu} from 'ionic-angular';
import {AboutPage} from '../pages/about/about';
import {LoginPage} from "../pages/login/login";
import {TabsPage} from '../pages/tabs/tabs';
import {AppSettingsPage} from "../pages/app-settings/app-settings";
import {EventDispatcherService} from "../api/dispatcher/appEventDispathcer.service";
import {AppDispatchTypes} from "../api/common/dispatchTypes";
import {BaseComponent} from "../api/common/baseComponent/baseComponent";
import {AngularFireAuth} from 'angularfire2/auth';
import {AppStoreService} from "../api/store/appStore.service";

@Component({
  templateUrl: 'app.html',
  providers: [AngularFireAuth]
})
export class MemoApp extends BaseComponent implements OnInit, OnDestroy {

  appLoginRequired = false;
  appStoreReady = false;
  rootPage: any;
  menuPages: Array<{ title: string, component: any }>;

  //create references to html elements
  @ViewChild(Nav) nav: Nav;
  @ViewChild(Menu) menu: Menu;

  constructor(public platform: Platform,
              private appAuth: AngularFireAuth,
              private appStoreService: AppStoreService,
              public eventDispatcherService: EventDispatcherService) {
    super(eventDispatcherService);
  }

  ngOnInit() {
    //init the app menu
    this.menuPages = [
      {title: 'Settings', component: AppSettingsPage},
      {title: 'About App', component: AboutPage},
      {title: 'Sign out', component: this}
    ];

    //set homepage events
    this.registerToEvents();

    this.platform.ready().then(() => {
      //login on app ready
      this.loginToApp();

    });
  }

  registerToEvents() {
    //menu page close button click
    this.registerToEvent(AppDispatchTypes.pageHeader.onCloseClick).subscribe(() => {
      this.nav.setRoot(this.rootPage);
    });

    //after the user first time logged in
    this.registerToEvent(AppDispatchTypes.registration.onUserLogin).subscribe((payload:any) => {
      //this.fetchDataAndInitApp();

    });
  }

  loginToApp(){
    //check if the user is authenticated
    this.appAuth.authState.subscribe(auth => {
      if(!auth)
      {
        //display login page
        this.rootPage = LoginPage;
        this.appLoginRequired = true;
      }
      else {


/*        let event: Event = new Event();
        event.creationDate = new Date();
        event.description = "test event";
        event.creatorKey = auth.uid;
        event.startDate = (new Date()).setMonth(1);
        event.title = "R&T Wedding";
        event.creatorName = auth.displayName;
        event.initials = "R&T";
        event.isActive = false;
        event.location = null;
        event.typeKey = null;
        event.typeName = null;

        this.appStoreService.addEvent(event);*/

        this.fetchDataAndInitApp();
      }
    });

  }

  fetchDataAndInitApp(){
    //hide login page
    this.appLoginRequired = false;

    //fetch data and init store, when done - init home page
    this.appStoreService.initAppStore().then((results)=>{
      this.rootPage = TabsPage;
      this.appStoreReady = true;
    });
  }

  onMenuPage(page) {
    //close the menu
    this.menu.toggle();

    //in case we sign-out - display login page
    if(page.title == 'Sign out'){
      this.appAuth.auth.signOut().then(val =>{
        this.rootPage = LoginPage;
      });
      return;
    }

    //display the selected page from the menu
    this.nav.setRoot(page.component);
  }

  ngOnDestroy() {
    //un-subscribe to all registered events
    //WE USE THIS ONLY HERE, THIS WILL CLEAR ALL EVENTS FOR ENTIRE APP ON CLOSE!!!
    this.eventDispatcherService.clearAllAppEvents();
  }

}
