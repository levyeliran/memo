import {Injectable} from "@angular/core";
import {EventDispatcherService} from "../../dispatcher/appEventDispathcer.service";
import {Action, Store} from "@ngrx/store";
import {AngularFireDatabase} from "angularfire2/database";
import {AppStore} from "../appStore.interface";
import {UserProfile} from "../../common/appTypes";
import {FirebaseApp} from 'angularfire2';
import {AppUtils} from "../../utilities/appUtils";
import 'firebase/storage';
import {AppLogger} from "../../utilities/appLogger";
import {AppConstants} from "../../common/appConstants";
import {ProfileActions} from "./profileActions";

@Injectable()
export class ProfileCrud {

  appUtils = AppUtils;
  appConst = AppConstants;
  logger: AppLogger;
  photoCrudSubscriptions: any[];

  constructor(public eventDispatcherService: EventDispatcherService,
              public store: Store<AppStore>,
              public fb: FirebaseApp,
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

  private getUserProfile() {
    this.db.object(`userProfile/${this.appUtils.userKey}`).valueChanges()
      .subscribe((user: UserProfile) => {
        if (user) {
          //update the store with the retrieved profile
          AppUtils.fullName = user.fullName;
          this.store.dispatch({type: ProfileActions.getUserProfile, payload: user});
        }
        else {
          //update the store with Initial profile
          const profile: UserProfile = new UserProfile();
          profile.key = this.appUtils.userKey;
          profile.fullName = this.appUtils.fullName;
          profile.phone = this.appUtils.phone;
          profile.email = this.appUtils.email;

          this.store.dispatch({type: ProfileActions.getUserProfile, payload: profile});
        }

        //dispatch an ack
        this.dispatchAck({type: ProfileActions.userProfileReceived});
      });
  }

  private updateUserProfile(profile: UserProfile) {
    //upload the photo first

    //save the profile details
    profile = this.removeUIProperties(profile);
    this.fb.database().ref().child(`userProfile/${profile.key}`)
      .update(profile).then((payload) => {

      if (payload) {
        AppUtils.fullName = payload.fullName;
        AppUtils.phone = payload.phone;
        AppUtils.email = payload.email;
        AppUtils.userKey = payload.key;

        //dispatch an ack
        /*this.dispatchAck({type: ProfileActions.userProfilePhotoSaved});*/
      }

    });
  }

  private removeUIProperties(profile: UserProfile) {
    profile.password = null;
    return profile;
  }

  private dispatchAck(action: Action) {
    //dispatch an ack
    this.eventDispatcherService.emit(action);
  }

}
