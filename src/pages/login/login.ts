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
    let valid = true;
    if (this.disableLogin) {
      valid = false;
    }

    if (!this.validateName(this.loginData.fullName)) {
      errorMessage += `<li>Name must contain at least 2 characters</li>`;
      valid = false;
    }

    if (!this.validatePhoneNumber(this.loginData.phone)) {
      errorMessage += `<li>Phone must contain 10 digits, starting with 0</li>`;
      valid = false;
    }

    if (!this.validateEmail(this.loginData.email)) {
      errorMessage += `<li>Email format is not valid</li>`;
      valid = false;
    }

    if (!this.validatePassword(this.loginData.password)) {
      errorMessage += `<li>Password must contain at least 8 characters:
                          <ul>
                            <li>Number</li>
                            <li>Lowercase OR uppercase character</li>
                            <li>One of the following ! @ # _ -</li>
                          </ul>
                       </li>`;
      valid = false;
    }

    if (errorMessage) {
      errorMessage = `<ul class="login-validation-alert-container">${errorMessage}</ul>`;
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
    const re = /(0[0-9]).{8}/;
    return re.test(phone);
  }

  validateName(name) {
    // only numbers and (lowercase or uppercase), _ - letter
    // at least 2 characters
    const re = /([a-zA-Z _-]).{1,}/;
    return re.test(name);
  }

  validatePassword(password) {
    // at least one number, one lowercase OR one uppercase letter, one of the following !@#_-
    // at least 8 characters
    const re = /((?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#_-])).{8,}/;
    return re.test(password);
  }

}
