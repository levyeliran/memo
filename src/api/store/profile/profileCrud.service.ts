import {Injectable} from "@angular/core";
import { EventDispatcherService } from "../../dispatcher/appEventDispathcer.service";
import {Action, Store} from "@ngrx/store";
import { AngularFireDatabase } from "angularfire2/database";
import {AppStore} from "../appStore.interface";
import {UserProfile} from "../../common/appTypes";
import { FirebaseApp } from 'angularfire2';
import { AppUtils } from "../../utilities/appUtils";
import 'firebase/storage';
import {AppLogger} from "../../utilities/appLogger";
import {AppConstants} from "../../common/appConstants";
import {ProfileActions} from "./profileActions";

@Injectable()
export class ProfileCrud{

  appUtils = AppUtils;
  appConst = AppConstants;
  logger: AppLogger;
  photoCrudSubscriptions:any[];

  constructor(public eventDispatcherService: EventDispatcherService,
              public store: Store<AppStore>,
              public fb:FirebaseApp,
              public db: AngularFireDatabase) {
    this.logger = new AppLogger();
    this.photoCrudSubscriptions = [];
  }

  registerToEvents() {
    console.log("PhotoCrud OnInit");

    const getUserProfileSub = this.eventDispatcherService.on(ProfileActions.getUserProfile);
    getUserProfileSub.subscribe(this.getUserProfile.bind(this));

    const updateUserProfileSub = this.eventDispatcherService.on(ProfileActions.updateUserProfile);
    updateUserProfileSub.subscribe(this.updateUserProfile.bind(this));

    //add all subjects to list - we unsubscribe to them when close the app
    this.photoCrudSubscriptions.push(getUserProfileSub);
    this.photoCrudSubscriptions.push(updateUserProfileSub);
  }

  unsubscribeEvents() {
    console.log("PhotoCrud OnDestroy");
    this.photoCrudSubscriptions.forEach(s => s.unsubscribe());
  }

  private getUserProfile(){
    this.db.object(`userProfile/${this.appUtils.userKey}`).valueChanges()
      .subscribe((user:UserProfile) => {
      if(user){
        //update the store with the retrieved profile
        AppUtils.fullName = user.fullName;
        this.store.dispatch({type: ProfileActions.getUserProfile, payload: user});
      }
      else {
        //update the store with Initial profile
        const profile: UserProfile = new UserProfile()
        profile.key = this.appUtils.userKey;
        profile.fullName = this.appUtils.fullName;
        profile.userName = this.appUtils.userName;
        profile.email = this.appUtils.userEmail;

        this.store.dispatch({type: ProfileActions.getUserProfile, payload : profile});
      }

      //dispatch an ack
      this.dispatchAck({type: ProfileActions.userProfileReceived});
    });
  }

  private updateUserProfile(profile: UserProfile){
    profile = this.removeUIProperties(profile);
    this.fb.database().ref().child(`userProfile/${profile.key}`)
      .update(profile).then((payload)=>{
      //dispatch an ack
      this.dispatchAck({type: ProfileActions.userProfilePhotoSaved});
    });

  }

  private removeUIProperties(profile: UserProfile){
    if(profile.photo){
      profile.photo.eventKey = null;
      profile.photo.fileThumbnailURL = null;
      profile.photo.storageMetadata = null;
      profile.photo.tagsMetaData = null;
      profile.photo.myEmojiTagKey = null;
      profile.photo.base64ImageData = null;
      profile.photo.photoImage = null;
    }
    profile.defaultPhotoURL = null;
    return profile;
  }

  private dispatchAck(action: Action){
    //dispatch an ack
    this.eventDispatcherService.emit(action);
  }

}
