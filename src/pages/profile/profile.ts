import {Component, OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';
import {Photo, UserProfile} from "../../api/common/appTypes";
import {EventDispatcherService} from "../../api/dispatcher/appEventDispathcer.service";
import {PhotoActions} from "../../api/store/photos/photoActions";
import {BaseComponent} from "../../api/common/baseComponent/baseComponent";
import {ProfileActions} from "../../api/store/profile/profileActions";
import {AppStoreService} from "../../api/store/appStore.service";

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage extends BaseComponent implements OnInit {

  profile:UserProfile;
  userPhoto:Photo;
  profileStoreSubscription: any;

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

    //set album events
    this.registerToEvents();
  }

  onUploadUserPhoto(){
    //open uploader


    //update the profile photo
    this.profile.photo = this.userPhoto;
  }


  onValidateProfile(){
    return !this.profile.fullName;
  }

  onSaveProfile(){
    if(this.userPhoto){
      //save the photo
      this.eventDispatcherService.emit({type: PhotoActions.savePhotoToStorage, payload: this.userPhoto});
    }
    else {
      //update the profile
      this.eventDispatcherService.emit({type: ProfileActions.updateUserProfile, payload: this.profile});
    }
  }

  registerToEvents() {
    this.registerToEvent(PhotoActions.photoUploadedToStorage).subscribe(() => {
      //update the profile
      this.eventDispatcherService.emit({type: ProfileActions.updateUserProfile, payload: this.profile});
    });

    this.registerToEvent(PhotoActions.photoUploadToStorageFailed).subscribe(() => {
      //display error
    });

    this.registerToEvent(ProfileActions.userProfilePhotoSaved).subscribe(() => {
      //navigate back to the album
      this.userPhoto = null;
    });
  }
}

