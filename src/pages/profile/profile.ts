import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {UserProfile} from "../../api/common/appTypes";

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  public profile:UserProfile;

  constructor(public navCtrl: NavController) {
    this.profile = new UserProfile();
    this.profile.defaultPhotoURL = "assets/images/avatarCardBG.png";
  }

  onUploadUserPhoto(){
  }


  onValidateProfile(){
    return true;
  }

  onSaveProfile(){

  }
}

