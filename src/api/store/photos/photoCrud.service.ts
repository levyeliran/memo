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
import {AppConstants} from "../../common/appConstants";



@Injectable()
export class PhotoCrud{

  appUtils = AppUtils;
  appConst = AppConstants;
  logger: AppLogger;
  photoCrudSubscriptions:any[];

  constructor(public eventDispatcherService: EventDispatcherService,
              public store: Store<AppStore>,
              public fb:FirebaseApp,
              public db: AngularFireDatabase) {
    this.logger = new AppLogger();
    this.photoCrudSubscriptions = [];
  }

  registerToEvents() {
    console.log("PhotoCrud OnInit");

    const getEventPhotosSub = this.eventDispatcherService.on(PhotoActions.getEventPhotos);
    getEventPhotosSub.subscribe(this.getEventPhotos.bind(this));

    const savePhotoToStorageSub = this.eventDispatcherService.on(PhotoActions.savePhotoToStorage);
    savePhotoToStorageSub.subscribe(this.savePhotoToStorage.bind(this));

    const addPhotoToAlbumSub = this.eventDispatcherService.on(PhotoActions.addPhotoToAlbum);
    addPhotoToAlbumSub.subscribe(this.addPhotoToAlbum.bind(this));

    const tagPhotoSub = this.eventDispatcherService.on(PhotoActions.tagPhoto);
    tagPhotoSub.subscribe(this.tagPhoto.bind(this));

    //add all subjects to list - we unsubscribe to them when close the app
    this.photoCrudSubscriptions.push(getEventPhotosSub);
    this.photoCrudSubscriptions.push(savePhotoToStorageSub);
    this.photoCrudSubscriptions.push(addPhotoToAlbumSub);
    this.photoCrudSubscriptions.push(tagPhotoSub);

  }

  unsubscribeEvents() {
    console.log("PhotoCrud OnDestroy");
    this.photoCrudSubscriptions.forEach(s => s.unsubscribe());
  }

  private getEventPhotos(eventKey:string){
    //https://angularfirebase.com/lessons/angular-file-uploads-to-firebase-storage/
    //https://firebase.google.com/docs/storage/web/upload-files
    //convert canvas to blob & save - create thumbnail
    //https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
    //https://www.html5canvastutorials.com/advanced/html5-canvas-save-drawing-as-an-image/
    //https://aaronczichon.de/2017/04/18/ionic-firebase-storage/
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
                ptMeta.emojiTagKey = tag.emojiTagKey;
                photo.tagsMetaData.push(ptMeta);
              }
              else {
                photo.myEmojiTagKey = tag.emojiTagKey;
              }
            });
          }
        });

      //update the store with the retrieved events
      this.store.dispatch({type: PhotoActions.getEventPhotos, payload: photos});

      //dispatch an ack
      this.dispatchAck({type: PhotoActions.eventPhotosReceived});
    });
  }

  private savePhotoToStorage(photo: Photo){
    let uploadTask = this.fb.storage().ref().child(photo.fileName).putString(photo.base64ImageData,'data_url');
    return uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot:any) =>  {
        // upload in progress
        this.logger.log('upload progress: ' + (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        //save the metadata of the image storage at the end
        if(snapshot.bytesTransferred === snapshot.totalBytes && snapshot.metadata){
          photo.storageMetadata = snapshot.metadata;
          this.logger.log("photo storageMetadata:");
          this.logger.log(photo.storageMetadata);
        }
      },
      (error) => {
        // upload failed
        this.logger.log(error);
        this.dispatchAck({type: PhotoActions.eventPhotoUploadFailed});
      },
      () => {
        this.logger.log('upload completed');
        this.dispatchAck({type: PhotoActions.eventPhotoUploaded, payload: photo});
      }
    );
  }

  private addPhotoToAlbum(photo: Photo){

    const pushRef = this.fb.database().ref().child(`photoToEvent/${photo.eventKey}`).push();
    photo.key = pushRef.key;
    photo.creatorKey = this.appUtils.userKey;
    //photo.creatorName = this.appUtils.userName;
    photo.creationDate = new Date();
    /*photo.fileURL = photo.storageMetadata.downloadURLs[0];
    photo.fileThumbnailURL = photo.fileURL.replace(photo.fileName, `${this.appConst.thumbnailPrefix}${photo.fileName}`);
    */photo.size = photo.storageMetadata ? photo.storageMetadata.size : 0;
    photo.width = photo.photoImage.width;
    photo.height = photo.photoImage.height;

    photo = this.removeUIProperties(photo);
    pushRef.set(photo).then((p)=>{
      //dispatch an ack
      this.dispatchAck({type: PhotoActions.eventPhotoSaved});
    });

  }

  private tagPhoto(payload: any){
    const photo: Photo = payload.photo;
    const emojiKey: string = payload.emojiKey;

    const tagData: any = {
      emojiTagKey: emojiKey,
      creationDate: new Date()
    };

    //if the user already  tagged the photo - update, create otherwise.
    if(photo.myEmojiTagKey){
      const tegRef = this.fb.database().ref()
        .child(`tagToEventPhoto/${photo.eventKey}/${photo.key}/tags/${this.appUtils.userKey}`);
      tegRef.update(tagData).then((t)=>{
        this.onTagSuccess(photo,emojiKey);
      });
    }
    else {
      const pushRef = this.fb.database().ref()
        .child(`tagToEventPhoto/${photo.eventKey}/${photo.key}/tags/${this.appUtils.userKey}`).push();
      tagData.creatorKey = this.appUtils.userKey;
      tagData.creatorName = this.appUtils.userName;

      pushRef.set(tagData).then((t)=>{
        this.onTagSuccess(photo,emojiKey);
      });
    }
  }

  private onTagSuccess(photo: Photo, emojiKey: string){
    photo.myEmojiTagKey = emojiKey;

    //add to photo metadata
    //photo.tagsMetaData


    //dispatch an ack
    this.dispatchAck({type: PhotoActions.photoTagged});
  }

  private removeUIProperties(photo: Photo){
    photo.base64ImageData = null;
    photo.photoImage = null;
    photo.storageMetadata = null;
    return photo;
  }

  private dispatchAck(action: Action){
    //dispatch an ack
    this.eventDispatcherService.emit(action);
  }

}
