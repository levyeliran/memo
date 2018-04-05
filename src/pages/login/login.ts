import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {BaseComponent} from "../../api/common/baseComponent/baseComponent";
import {EventDispatcherService} from "../../api/dispatcher/appEventDispathcer.service";
import {AppDispatchTypes} from "../../api/common/dispatchTypes";
import {ProfileActions} from "../../api/store/profile/profileActions";
import {UserProfile} from "../../api/common/appTypes";
import {AlertController} from "ionic-angular";

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
              public eventDispatcherService: EventDispatcherService,
              private alertCtrl: AlertController) {
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
    if (this.onValidateCredentials()) {
      // Login Code here
      this.disableLogin = true;
      this.angAuth.auth
        .signInWithEmailAndPassword(this.loginData.email, this.loginData.password)
        .then(auth => {
          this.logger.log(`user ${this.loginData.email} was signed IN`);
        })
        .catch(err => {
          this.logger.log(`user ${this.loginData.email} was signed UP to Memo app`);
          this.doSignUp();
        });
    }

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

  disableLoginButton() {

    return this.disableLogin ||
      !(this.loginData.fullName &&
        this.loginData.phone &&
        this.loginData.email &&
        this.loginData.password);
  }


  onValidateCredentials() {

    let errorMessage = '';
    let valid = false;
    if (this.disableLogin) {
      valid = true;
    }

    if (!this.validateName(this.loginData.fullName)) {
      errorMessage += `<div>Name must contain at least 2 characters</div>`;
      valid = true;
    }

    if (!this.validatePhoneNumber(this.loginData.phone)) {
      errorMessage += `<div>Phone must contain 10 digits, starting with 0</div>`;
      valid = true;
    }

    if (!this.validateEmail(this.loginData.email)) {
      errorMessage += `<div>Email format is not valid</div>`;
      valid = true;
    }

    if (!this.validatePassword(this.loginData.password)) {
      errorMessage += `<div>Password must contain at least 8 characters (at least one number, one lowercase and one uppercase letter)</div>`;
      valid = true;
    }

    if (errorMessage) {
      errorMessage = `<div class="login-validation-alert-container">${errorMessage}</div>`;
      this.presentAlert(errorMessage);
    }

    return valid;
  }

  presentAlert(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'Validation Error',
      subTitle: 'Please fix the following errors:',
      message: errorMessage,
      buttons: ['Dismiss']
    });
    alert.present();
  }


  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  validatePhoneNumber(phone) {
    // exactly 10 digits, starts with 0
    const re = /(^[0]\d).{10}/;
    return re.test(phone);
  }

  validateName(name) {
    // only numbers and (lowercase or uppercase), _ - letter
    // at least 2 characters
    const re = /(\d[a-z][A-Z] _-).{2,}/;
    return re.test(name);
  }

  validatePassword(password) {
    // at least one number, one lowercase and one uppercase letter
    // at least 8 characters
    const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    return re.test(password);
  }

}
