import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {BaseComponent} from "../../api/common/baseComponent/baseComponent";
import {EventDispatcherService} from "../../api/dispatcher/appEventDispathcer.service";
import {AppDispatchTypes} from "../../api/common/dispatchTypes";
import {ProfileActions} from "../../api/store/profile/profileActions";
import {UserProfile} from "../../api/common/appTypes";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage extends BaseComponent implements OnInit {

  loginData: UserProfile;
  disableLogin = false;

  @ViewChild('animationWrapper') animationWrapperRef: any;
  @ViewChild('loginWrapper') loginWrapperRef: any;

  constructor(private angAuth: AngularFireAuth,
              public eventDispatcherService: EventDispatcherService) {
    super(eventDispatcherService);
  }


  ngOnInit() {
    this.loginData = new UserProfile();
    const animationHeight = (window.screen.height - this.appConst.appTopMenuHeight) * 0.45;
    const loginHeight = (window.screen.height - this.appConst.appTopMenuHeight) * 0.5;

    this.animationWrapperRef.nativeElement.setAttribute("style", `height:${animationHeight}px;`);
    this.loginWrapperRef.nativeElement.setAttribute("style", `height:${loginHeight}px;`);
  }

  onLogin() {
    // Login Code here
    this.disableLogin = true;
    this.angAuth.auth
      .signInWithEmailAndPassword(this.loginData.email, this.loginData.password)
      .then(auth => {
/*        //dispatch the  event
        this.dispatchAnEvent({
          type: AppDispatchTypes.registration.onUserFirstLogin,
          payload: auth
        });*/
      })
      .catch(err => {

        /*// Handle error
        let toast = this.toastCtrl.create({
          message: err.message,
          duration: 1000
        });
        toast.present();*/

        this.doSignUp();

      });
  }

  doSignUp() {
    this.angAuth.auth
      .createUserWithEmailAndPassword(this.loginData.email, this.loginData.password)
      .then(auth => {

        const newProfile = {
          key: auth.uid,
          fullName: this.loginData.fullName,
          email: this.loginData.email,
          phone: this.loginData.phone,
          creationDate: (new Date()).toString()
        };

        //dispatch the  event
        this.dispatchAnEvent({
          type: AppDispatchTypes.registration.onUserFirstLogin,
          payload: newProfile
        });

        //update the user profile into db
        this.eventDispatcherService.emit({type: ProfileActions.updateUserProfile, payload: newProfile});
      })
      .catch(err => {
        this.disableLogin = false;
        // Handle error
      });
  }

  disableLoginOnValidateCredentials() {
    if (this.disableLogin) {
      return true;
    }

    if (!this.loginData.fullName) {
      return true;
    }

    if (!this.loginData.phone) {
      return true;
    }

    if (!this.loginData.email) {
      return true;
    }

    if (!this.loginData.password) {
      return true;
    }

    return false;
  }

}
