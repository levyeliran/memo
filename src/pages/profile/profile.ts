import {Component, OnDestroy, OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserProfile} from "../../api/common/appTypes";
import {EventDispatcherService} from "../../api/dispatcher/appEventDispathcer.service";
import {BaseComponent} from "../../api/common/baseComponent/baseComponent";
import {ProfileActions} from "../../api/store/profile/profileActions";
import {AppStoreService} from "../../api/store/appStore.service";


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage extends BaseComponent implements OnInit, OnDestroy {

  profile:UserProfile;
  profileStoreSubscription: any;
  defaultPhotoURL = "assets/images/avatarCardBG.png";

  constructor(public navCtrl: NavController,
              public appStoreService: AppStoreService,
              public eventDispatcherService: EventDispatcherService) {
    super(eventDispatcherService);
  }

  ngOnInit() {
    //update the calender each time the store has been changed
    this.profileStoreSubscription = this.appStoreService._profileStore().subscribe((_store) => {
      if (_store && _store.profile) {
        this.profile = _store.profile;
      }
    });
  }

  ngOnDestroy() {
    //unregister to events
    this.profileStoreSubscription.unsubscribe();
  }

  onValidateProfile(){
    return !this.profile.fullName || !this.profile.phone;
  }

  onSaveProfile(){
    this.eventDispatcherService.emit({type: ProfileActions.updateUserProfile, payload: this.profile});
  }

}

