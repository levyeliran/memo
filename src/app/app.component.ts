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
import {AppPermission} from "../api/utilities/appPermission.service";
import {EventCrud} from "../api/store/events/eventCrud.service";
import {PhotoCrud} from "../api/store/photos/photoCrud.service";

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
              public appPermission: AppPermission,
              private eventCrud: EventCrud,
              private photoCrud: PhotoCrud,
              public eventDispatcherService: EventDispatcherService) {
    super(eventDispatcherService);
  }

  ngOnInit() {
    this.eventCrud.registerToEvents();
    this.photoCrud.registerToEvents();

    //init the app menu
    this.menuPages = [
      {title: 'Settings', component: AppSettingsPage},
      {title: 'About App', component: AboutPage},
      {title: 'Sign out', component: this}
    ];

    //set homepage events
    this.registerToEvents();

    this.platform.ready().then(() => {
      //this.appPermission.getPermission(this.appConst.permissions.INTERNET).then(result=>{
        //login on app ready
        this.loginToApp();
      //}, reject =>{
        //this.logger.log('User did not allow internet access');
        //display the animation page.
      //})
    });
  }

  registerToEvents() {
    //after the user first time logged in
    this.registerToEvent(AppDispatchTypes.registration.onUserLogin).subscribe((payload) => {
      //set the user key to local storage - for app internal use
      //payload.getIdToken().then((token) =>{
        this.appLocalStorage.setKey(this.appConst.registration.userKey, payload.uid);
      //});
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
        this.fetchDataAndInitApp(payload.uid);
      }
    });

  }

  fetchDataAndInitApp(userKey:string){
    //hide login page
    this.appLoginRequired = false;

    //fetch data and init store, when done - init home page
    this.appStoreService.initAppStore(userKey).then((results)=>{
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
    this.eventCrud.unsubscribeEvents();
    this.photoCrud.unsubscribeEvents();
    //un-subscribe to all registered events
    //WE USE THIS ONLY HERE, THIS WILL CLEAR ALL EVENTS FOR ENTIRE APP ON CLOSE!!!
    this.eventDispatcherService.clearAllAppEvents();
  }

}
