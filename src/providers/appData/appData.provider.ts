import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Firebase} from "@ionic-native/firebase";

@Injectable()
export class AppDataProvider {

  private _db:any;

  constructor(public http: Http, private firebase: Firebase) {
    console.log('Hello AppDataProvider Provider');
    // https://www.pluralsight.com/guides/front-end-javascript/ionic-2-and-firebase#eBK545JagldouCy6.99
    //this._db = firebase.database().ref('/'); // Get a firebase reference to the root
  }

}
