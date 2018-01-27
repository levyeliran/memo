import {Injectable} from "@angular/core";
import { EventDispatcherService } from "../../dispatcher/appEventDispathcer.service";
import {Action, Store} from "@ngrx/store";
import { AngularFireDatabase } from "angularfire2/database";
import {AppStore} from "../appStore.interface";
import {Photo, PhotoTagsMetaData} from "../../common/appTypes";
import { FirebaseApp } from 'angularfire2';
import { AppUtils } from "../../utilities/appUtils";
import * as firebase from 'firebase/app';
import 'firebase/storage';
import {Observable} from 'rxjs/Rx'
import {PhotoActions} from "./photoActions";
import {AppLogger} from "../../utilities/appLogger";

@Injectable()
export class PhotoCrud{

  appUtils = AppUtils;
  logger: AppLogger;

  constructor(public eventDispatcherService: EventDispatcherService,
              public store: Store<AppStore>,
              public fb:FirebaseApp,
              public db: AngularFireDatabase) {
    this.logger = new AppLogger();
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
      this.dispatchAck({type: PhotoActions.getEventPhotos});
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
        this.logger.log('upload progress: ' + (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        //save the metadata of the image storage at the end
        if(snapshot.bytesTransferred === snapshot.totalBytes){
          photo.storageMetadata = snapshot.metadata;
          this.logger.log(photo.storageMetadata);
        }
      },
      (error) => {
        // upload failed
        this.logger.log(error);
        this.dispatchAck({type: PhotoActions.uploadEventPhotoFailed});
      },
      () => {
        this.logger.log('upload completed');
        this.dispatchAck({type: PhotoActions.uploadEventPhoto, payload: photo});
      }
    );
  }

  addPhotoToAlbum(photo: Photo){

    const pushRef = this.fb.database().ref().child(`photoToEvent/${photo.eventKey}`).push();
    photo.key = pushRef.key;
    photo.creatorKey = this.appUtils.userKey;
    //photo.creatorName = this.appUtils.userName;
    photo.creationDate = new Date();
    photo.fileURL = photo.storageMetadata.downloadURLs[0];
    photo.size = photo.storageMetadata.size;
    photo.width = photo.photoImage.width;
    photo.height = photo.photoImage.height;

    photo = this.removeUIProperties(photo);
    pushRef.set(photo).then((p)=>{
      //update the store with the created photo
      this.store.dispatch({type: PhotoActions.saveEventPhoto, payload: p});

      //dispatch an ack
      this.dispatchAck({type: PhotoActions.saveEventPhoto});
    });


  }


/*
  tagPhoto(photo: Photo){

  }




*/

  removeUIProperties(photo: Photo){
    photo.base64ImageData = null;
    photo.photoImage = null;
    photo.storageMetadata = null;
    return photo;
  }

  dispatchAck(action: Action){
    //dispatch an ack
    this.eventDispatcherService.emit(action);
  }

}
