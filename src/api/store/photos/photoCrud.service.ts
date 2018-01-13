import {Injectable} from "@angular/core";
import { EventDispatcherService } from "../../dispatcher/appEventDispathcer.service";
import { Store } from "@ngrx/store";
import { AngularFireDatabase } from "angularfire2/database";
import {AppStore} from "../appStore.interface";
import {Photo, PhotoTagsMetaData} from "../../common/appTypes";
import { FirebaseApp } from 'angularfire2';
import { AppUtils } from "../../utilities/appUtils";
import * as firebase from 'firebase/app';
import 'firebase/storage';
import {Observable} from 'rxjs/Rx'
import {PhotoActions} from "./photoActions";

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

            //check if the current user had tags photos
            let userKeys = Object.keys(pTags.tags);
            userKeys.forEach((key)=>{
              const tag = pTags.tags[key];
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

  //https://angularfirebase.com/lessons/angular-file-uploads-to-firebase-storage/
  //https://firebase.google.com/docs/storage/web/upload-files
  //convert canvas to blob & save - create thumbnail
  //https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
  //https://www.html5canvastutorials.com/advanced/html5-canvas-save-drawing-as-an-image/
  //https://aaronczichon.de/2017/04/18/ionic-firebase-storage/
  savePhotoToStorage(photo: Photo){
    let uploadTask = this.fb.storage().ref().child(photo.fileName).putString(photo.base64ImageData,'data_url');
    return uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot:any) =>  {
        // upload in progress
        console.log('upload progress: ' + (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        // upload failed
        console.log(error);
        this.dispatchAck(PhotoActions.uploadEventPhotoFailed);
      },
      () => {
        console.log('upload completed');
        this.dispatchAck(PhotoActions.uploadEventPhoto);
      }
    );
  }

  addPhotoToAlbum(photo: Photo){

    photo = this.removeUIProperties(photo);

    const pushRef = this.fb.database().ref().child(`photoToEvent/${photo.eventKey}`).push();
    photo.key = pushRef.key;
    photo.creatorKey = this.appUtils.userKey;
    photo.creatorName = this.appUtils.userName;
    photo.creationDate = new Date();

    pushRef.set(photo).then((p)=>{
      //update the store with the created photo
      this.store.dispatch({type: PhotoActions.saveEventPhoto, payload: p});

      //dispatch an ack
      this.dispatchAck(PhotoActions.saveEventPhoto);
    });


  }


/*
  tagPhoto(photo: Photo){

  }




*/

  removeUIProperties(photo: Photo){
    photo.base64ImageData = null;
    photo.photoImage = null;
    return photo;
  }

  dispatchAck(eventName:string){
    //dispatch an ack
    this.eventDispatcherService.emit({
      eventName: eventName });
  }

}
