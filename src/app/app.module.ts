import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MemoApp } from './app.component';

import { ProfilePage } from '../pages/profile/profile';
import { HomePage } from '../pages/home/home';
import { EventsPage } from '../pages/events/events';
import { LoginPage } from "../pages/login/login";
import { MainTabsPage } from "../pages/main-tabs/main-tabs";
import {AboutPage } from "../pages/about/about";
import {AppSettingsPage } from "../pages/app-settings/app-settings";
import { CreateEventPage } from "../pages/events/create-event/create-event";
import { EventAlbumPage } from "../pages/events/event-album/event-album";
import {EventDetailsPage} from "../pages/events/event-details/event-details";
import {SelectFriendsPage} from "../pages/events/select-friends/select-friends";

//import { StatusBar } from '@ionic-native/status-bar';
//import { SplashScreen } from '@ionic-native/splash-screen';
import { CalendarModule } from "ion2-calendar";
import { PageHeaderComponent } from '../components/pageHeader/pageHeader.component'
import {EventDispatcherService} from "../api/dispatcher/appEventDispathcer.service";

//import { IonicStorageModule } from '@ionic/storage';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule} from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
//IMPORTANT!
//https://github.com/angular/angularfire2/blob/master/docs/version-5-upgrade.md

//https://aaronczichon.de/2017/03/07/ionic-firebase-authentication/
//http://tphangout.com/ionic-2-authentication-using-firebase/ - facebook auth
//https://devdactic.com/google-sign-in-ionic-firebase/

import { Camera } from "@ionic-native/camera";
import { Contacts } from '@ionic-native/contacts';
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { NativeAudio } from '@ionic-native/native-audio';
//import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BackgroundMode } from '@ionic-native/background-mode';
import { StoreModule } from '@ngrx/store';
import { eventReducer } from "../api/store/events/event.reducer";
import {AppStoreService} from "../api/store/appStore.service";
import {EventCrud} from "../api/store/events/eventCrud.service";
import {AppLocalStorage} from "../api/utilities/appLocalStorage.service";
import {AppPermission} from "../api/utilities/appPermission.service";
import {photoReducer} from "../api/store/photos/photo.reducer";
import {PhotoCrud} from "../api/store/photos/photoCrud.service";
import {EventAlbumAnimationPage} from "../pages/events/event-album-animation/event-album-animation";
import {EventAlbumPhotoPage} from "../pages/events/event-album-photo/event-album-photo";
import {profileReducer} from "../api/store/profile/profile.reducer";
import {ProfileCrud} from "../api/store/profile/profileCrud.service";
//https://medium.com/beautiful-angular/angular-2-with-redux-using-ngrx-store-2f93a8ad0dd


//import {GoogleMaps} from '@ionic-native/google-maps';

import {animationReducer} from "../api/store/animation/animation.reducer";
import {AppSettingsReducer} from "../api/store/app/appSettings.reducer";
import {AnimationCrud} from "../api/store/animation/animationCrud.service";
import {AppSettingsCrud} from "../api/store/app/appSettingsCrud.service";

// Initialize Firebase configuration
const FBConfig = {
  apiKey: "AIzaSyDzgudY6933I48sr8be-TzjHpLGNXI6o5A",
  authDomain: "memo-11ade.firebaseapp.com",
  databaseURL: "https://memo-11ade.firebaseio.com",
  projectId: "memo-11ade",
  storageBucket: "memo-11ade.appspot.com",
  messagingSenderId: "148472888029"
};

@NgModule({
  declarations: [//components for use in THIS module
    MemoApp,
    ProfilePage,
    HomePage,
    EventsPage,
    AboutPage,
    AppSettingsPage,
    LoginPage,
    MainTabsPage,
    CreateEventPage,
    EventAlbumPage,
    EventAlbumAnimationPage,
    EventAlbumPhotoPage,
    EventDetailsPage,
    SelectFriendsPage,
    PageHeaderComponent
  ],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MemoApp, {
      scrollAssist: false
    }),
    //private modules
    StoreModule.provideStore({ //store api
      //reducers place
      eventStore: eventReducer,
      photoStore: photoReducer,
      profileStore: profileReducer,
      animationReducer: animationReducer,
      AppSettingsReducer: AppSettingsReducer
    }),
    IonicStorageModule, //local storage api
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(FBConfig), //fire base api
    AngularFireAuthModule, //fire base authentication api
    CalendarModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MemoApp,
    ProfilePage,
    HomePage,
    EventsPage,
    AboutPage,
    AppSettingsPage,
    LoginPage,
    MainTabsPage,
    CreateEventPage,
    EventAlbumPage,
    EventAlbumAnimationPage,
    EventAlbumPhotoPage,
    EventDetailsPage,
    SelectFriendsPage,
    PageHeaderComponent
  ],
  providers: [ // SINGLETON services
    IonicStorageModule,
    EventDispatcherService,
    EventCrud,
    PhotoCrud,
    ProfileCrud,
    AnimationCrud,
    AppSettingsCrud,
    AppStoreService,
    AppLocalStorage,
    AppPermission,
    StoreModule,
    AndroidPermissions,
    NativeAudio,
    Camera,
    Contacts,
    BackgroundMode,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ],
  exports: [] //components that we want to make available
})
export class AppModule {}
