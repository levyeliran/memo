import { Component } from '@angular/core';
//import { NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
//import { AuthProviders, AuthMethods, AngularFire } from 'angularfire2';
import {BaseComponent} from "../../api/common/baseComponent/baseComponent";
import {EventDispatcherService} from "../../api/dispatcher/appEventDispathcer.service";
import {AppDispatchTypes} from "../../api/common/dispatchTypes";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage extends BaseComponent  {

  loginData: any = {
    email: '',
    password: ''
  };
  disableLogin = false;

  constructor(//public navCtrl: NavController,
              private angAuth: AngularFireAuth,
              //public angFire: AngularFire,
              public eventDispatcherService: EventDispatcherService) {
    super(eventDispatcherService);
  }


  onLogin() {
    // Login Code here
    this.disableLogin = true;
    this.angAuth.auth
      .signInWithEmailAndPassword(this.loginData.email, this.loginData.password)
      .then(auth => {
        //dispatch the  event
        this.dispatchAnEvent({
          type: AppDispatchTypes.registration.onUserLogin,
          payload: auth
        });
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

  doSignUp(){
    this.angAuth.auth
      .createUserWithEmailAndPassword(this.loginData.email, this.loginData.password)
      .then(auth => {

        //dispatch the  event
        this.dispatchAnEvent({
          type: AppDispatchTypes.registration.onUserLogin,
          payload: auth
        });
      })
      .catch(err => {
        this.disableLogin = false;

        // Handle error
      });
  }

  onValidateCredentials(){
    //need to add validation
    return (!this.loginData.email || !this.loginData.password) || this.disableLogin;
  }


  /*  login() {
      this.angFire.auth.login({
          email: this.loginData.email,
          password: this.loginData.password
        },
        {
          provider: AuthProviders.Password,
          method: AuthMethods.Password
        }).then((response) => {
        this.logger.log('Login success' + JSON.stringify(response));
        let currentuser = {
          email: response.auth.email,
          picture: response.auth.photoURL
        };

        //write to local storage the object
        //window.localStorage.setItem('currentuser', JSON.stringify(currentuser));

      }).catch((error) => {
        this.logger.log(error);
      })
    }*/


/*  onGoogleLogin() {

  }*/

 /* onFacebookLogin() {
    this.angFire.auth.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Popup
    }).then((response) => {
      this.logger.log('Login success with facebook' + JSON.stringify(response));
      let currentuser = {
        email: response.auth.displayName,
        picture: response.auth.photoURL
      };
      window.localStorage.setItem('currentuser', JSON.stringify(currentuser));
      this.navCtrl.pop();
    }).catch((error) => {
      this.logger.log(error);
    })

  }*/



}
