import {Injectable} from "@angular/core";
import { EventDispatcherService } from "../../dispatcher/appEventDispathcer.service";
import { Store } from "@ngrx/store";
import { AngularFireDatabase } from "angularfire2/database";
import {AppStore} from "../appStore.interface";
//import {PhotoActions} from "./photoActions";
import {Photo, PhotoTagsMetaData} from "../../common/appTypes";
import { FirebaseApp } from 'angularfire2';
import { AppUtils } from "../../utilities/appUtils";
//import {Observable} from "rxjs/Observable";
//import * as firebase from 'firebase/app';
import {PhotoActions} from "./photoActions";
import {Observable} from 'rxjs/Rx'

@Injectable()
export class PhotoCrud{

  appUtils = AppUtils;

  constructor(public eventDispatcherService: EventDispatcherService,
              public store: Store<AppStore>,
              public fb:FirebaseApp,
              public db: AngularFireDatabase) {
  }

  getEventPhotos(eventKey:string){

    Observable.combineLatest<Photo[], any[]>(
      this.db.list<Photo>(`photoToEvent/${eventKey}`).valueChanges(),
      this.db.list<any>(`tagToEventPhoto/${eventKey}`).valueChanges())
      .subscribe(([photos, photosTags])=> {

        photos.forEach((photo)=>{
          const pTags = photosTags.find(pt => pt.photoKey == photo.key);
          if(pTags && pTags.tags){
            photo.tagsMetaData = [];
            Object.values(pTags.tags).forEach((tag)=>{
              if(tag.creatorKey !== this.appUtils.userKey){
                const ptMeta = new PhotoTagsMetaData();
                ptMeta.creatorKey = tag.creatorKey;
                ptMeta.creatorName = tag.creatorName;
                ptMeta.emoticonTagKey = tag.emoticonTagKey;
                photo.tagsMetaData.push(ptMeta);
              }
              else {
                photo.myEmoticonTagKey = tag.emoticonTagKey;
              }
            });
          }
        });

      //update the store with the retrieved events
      this.store.dispatch({type: PhotoActions.getEventPhotos, payload: photos});

      //dispatch an ack
      this.dispatchAck(PhotoActions.getEventPhotos);
    });

  }

/*  private getEventPhotosTags(eventKey:string){

  }*/

/*
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


*/


  dispatchAck(eventName:string){
    //dispatch an ack
    this.eventDispatcherService.emit({
      eventName: eventName });
  }

}
