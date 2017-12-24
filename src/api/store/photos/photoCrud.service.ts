import {Injectable} from "@angular/core";
import { EventDispatcherService } from "../../dispatcher/appEventDispathcer.service";
import { Store } from "@ngrx/store";
import { AngularFireDatabase } from "angularfire2/database";
import {AppStore} from "../appStore.interface";
//import {PhotoActions} from "./photoActions";
import {Photo} from "../../common/appTypes";
import { FirebaseApp } from 'angularfire2';
//import { AppUtils } from "../../utilities/appUtils";
//import {Observable} from "rxjs/Observable";
import * as firebase from 'firebase/app';

@Injectable()
export class PhotoCrud{

  storeTreeNode = 'photos';

  constructor(public eventDispatcherService: EventDispatcherService,
              public store: Store<AppStore>,
              public fb:FirebaseApp,
              public db: AngularFireDatabase) {
  }

  getEventPhotos(){

  }

  //https://angularfirebase.com/lessons/angular-file-uploads-to-firebase-storage/
  //https://firebase.google.com/docs/storage/web/upload-files

  //convert canvas to blob & save - create thumbnail
  //https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
  //https://www.html5canvastutorials.com/advanced/html5-canvas-save-drawing-as-an-image/
  savePhoto(photo: Photo){
    let uploadTask = this.fb.storage().ref().child(photo.fileName).put(photo.blob);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot:any) =>  {
        // upload in progress
        //photo.blob.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('upload progress: ' + (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        // upload failed
        console.log(error)
      },
      () => {
        console.log('upload completed');
      }
    );
  }

  tagPhoto(photo: Photo){

  }

  removeUIProperties(photo: Photo){
    return photo;
  }

  dispatchAck(eventName:string){
    //dispatch an ack
    this.eventDispatcherService.emit({
      eventName: eventName });
  }


}
