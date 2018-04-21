import {Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {Platform, Nav, Menu} from 'ionic-angular';
import {AboutPage} from '../pages/about/about';
import {LoginPage} from "../pages/login/login";
import {MainTabsPage} from "../pages/main-tabs/main-tabs";
import {AppSettingsPage} from "../pages/app-settings/app-settings";
import {EventDispatcherService} from "../api/dispatcher/appEventDispathcer.service";
import {AppDispatchTypes} from "../api/common/dispatchTypes";
import {BaseComponent} from "../api/common/baseComponent/baseComponent";
import {AngularFireAuth} from 'angularfire2/auth';
import {AppStoreService} from "../api/store/appStore.service";
import {AppLocalStorage} from "../api/utilities/appLocalStorage.service";
import {EventCrud} from "../api/store/events/eventCrud.service";
import {PhotoCrud} from "../api/store/photos/photoCrud.service";
import {ProfileCrud} from "../api/store/profile/profileCrud.service";
import {AnimationCrud} from "../api/store/animation/animationCrud.service";
import {AppSettingsCrud} from "../api/store/app/appSettingsCrud.service";

@Component({
  templateUrl: 'app.html',
  providers: [AngularFireAuth]
})
export class MemoApp extends BaseComponent implements OnInit, OnDestroy {

  appLoginRequired = false;
  appStoreReady = false;
  rootPage: any;
  menuPages: Array<{ title: string, component: any }>;

  //create references to nav & menu html elements
  @ViewChild(Nav) nav: Nav;
  @ViewChild(Menu) menu: Menu;

  constructor(public platform: Platform,
              private appAuth: AngularFireAuth,
              private appStoreService: AppStoreService,
              public appLocalStorage: AppLocalStorage,
              private eventCrud: EventCrud,
              private photoCrud: PhotoCrud,
              private profileCrud: ProfileCrud,
              private animationCrud: AnimationCrud,
              private appSettingsCrud: AppSettingsCrud,
              public eventDispatcherService: EventDispatcherService) {
    super(eventDispatcherService);
  }

  ngOnInit() {

    //start services listeners
    this.eventCrud.registerToEvents();
    this.photoCrud.registerToEvents();
    this.profileCrud.registerToEvents();
    this.animationCrud.registerToEvents();
    this.appSettingsCrud.registerToEvents();

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
    //after the user first time logged in
    this.registerToEvent(AppDispatchTypes.registration.onUserFirstLogin).subscribe((payload) => {
      //set the user key to local storage - for app internal use
      this.appLocalStorage.setKey(this.appConst.registration.userKey, payload.key);
    });
  }

  loginToApp(){
    //check if the user is authenticated
    this.appAuth.authState.subscribe(payload => {
      if(!payload)
      {
        //display login page
        this.rootPage = LoginPage;
        this.appLoginRequired = true;
      }
      else {
        this.appLocalStorage.setKey(this.appConst.registration.userKey, payload.uid);
        this.fetchDataAndInitApp(payload);
      }
    });
  }

  fetchDataAndInitApp(authData:any){
    //hide login page
    this.appLoginRequired = false;

    //fetch data and init store, when done - init home page
    this.appStoreService.initAppStore(authData).then((results)=>{
      this.rootPage = MainTabsPage;
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
    this.nav.push(page.component);// setRoot(page.component);
  }

  ngOnDestroy() {
    //unregister to events
    this.unregisterToEvent(AppDispatchTypes.registration.onUserFirstLogin);

    this.eventCrud.unsubscribeEvents();
    this.photoCrud.unsubscribeEvents();
    this.profileCrud.unsubscribeEvents();
    this.animationCrud.unsubscribeEvents();
    this.appSettingsCrud.unsubscribeEvents();
    //un-subscribe to all registered events
    //WE USE THIS ONLY HERE, THIS WILL CLEAR ALL EVENTS FOR ENTIRE APP ON CLOSE!!!
    this.eventDispatcherService.clearAllAppEvents();
  }

}
