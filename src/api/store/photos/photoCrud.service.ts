import {Injectable} from "@angular/core";
import {EventDispatcherService} from "../../dispatcher/appEventDispathcer.service";
import {Action, Store} from "@ngrx/store";
import {AngularFireDatabase} from "angularfire2/database";
import {AppStore} from "../appStore.interface";
import {EmojiTagData, Photo, PhotoTagsMetaData} from "../../common/appTypes";
import {FirebaseApp} from 'angularfire2';
import {AppUtils} from "../../utilities/appUtils";
import * as firebase from 'firebase/app';
import 'firebase/storage';
import {PhotoActions} from "./photoActions";
import {AppLogger} from "../../utilities/appLogger";

@Injectable()
export class PhotoCrud {

  logger: AppLogger;
  photoCrudSubscriptions: any[];
  photos: Photo[] = [];
  tags: any[] = [];

  constructor(public eventDispatcherService: EventDispatcherService,
              public store: Store<AppStore>,
              public fb: FirebaseApp,
              public db: AngularFireDatabase) {
    this.logger = new AppLogger();
    this.photoCrudSubscriptions = [];
  }

  registerToEvents() {
    this.logger.log("PhotoCrud OnInit");

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
    this.logger.log("PhotoCrud OnDestroy");
    this.photoCrudSubscriptions.forEach(s => s.unsubscribe());
  }

  private getEventPhotos(eventKey: string) {
    //https://angularfirebase.com/lessons/angular-file-uploads-to-firebase-storage/
    //https://firebase.google.com/docs/storage/web/upload-files
    //convert canvas to blob & save - create thumbnail
    //https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
    //https://www.html5canvastutorials.com/advanced/html5-canvas-save-drawing-as-an-image/
    //https://aaronczichon.de/2017/04/18/ionic-firebase-storage/

    this.db.list<Photo>(`photoToEvent/${eventKey}`).valueChanges().subscribe(photos => {
      //update the store with the retrieved events
      const sortedPhotos = photos.sort((a, b) =>
        (new Date(b.creationDate)).getTime() -
        (new Date(a.creationDate)).getTime());

      //update the store with the retrieved event photos
      this.store.dispatch({type: PhotoActions.getEventPhotos, payload: sortedPhotos});

      //dispatch an ack
      this.dispatchAck({type: PhotoActions.eventPhotosReceived});
    });

    this.db.list<any>(`tagToEventPhoto/${eventKey}`).valueChanges().subscribe(photosTags => {
      //update the store with the retrieved event photos tags
      //extract all tags data
      const pt: PhotoTagsMetaData[] = [];
      photosTags.forEach(ft => {
        //for each photo - we have a list of users tags
        const usersKeys = Object.keys(ft);
        let photoData = null;
        usersKeys.forEach(uk => {
          const photoKey = ft[uk].photoKey;
          const emojiTagData = {
            creatorName: ft[uk].creatorName,
            creatorKey: ft[uk].creatorKey,
            emojiTagKey: ft[uk].emojiTagKey,
            emojiTagCategoryKey: ft[uk].emojiTagCategoryKey
          };
          if (photoData) {
            //add data to the photo tags list
            photoData.emojiTags.push(emojiTagData)
          }
          else {
            photoData = {
              photoKey: photoKey,
              emojiTags: [emojiTagData]
            };
            pt.push(photoData);
          }
        });
      });

      this.store.dispatch({type: PhotoActions.getEventPhotosTags, payload: pt});

    });

  }

  private savePhotoToStorage(photo: Photo) {
    let uploadTask = this.fb.storage().ref().child(photo.fileName).putString(photo.base64ImageData, 'data_url');
    return uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot: any) => {
        // upload in progress
        this.logger.log('upload progress: ' + (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        //save the metadata of the image storage at the end
        if (snapshot.bytesTransferred === snapshot.totalBytes && snapshot.metadata) {
          photo.storageMetadata = snapshot.metadata;
          this.logger.log("photo storageMetadata:");
          this.logger.log(photo.storageMetadata);
        }
      },
      (error) => {
        // upload failed
        this.logger.log(error);
        this.dispatchAck({type: PhotoActions.photoUploadToStorageFailed});
      },
      () => {
        this.logger.log('upload completed');
        this.dispatchAck({type: PhotoActions.photoUploadedToStorage, payload: photo});
      }
    );
  }

  private addPhotoToAlbum(photo: Photo) {

    const pushRef = this.fb.database().ref().child(`photoToEvent/${photo.eventKey}`).push();
    photo.key = pushRef.key;
    photo.creatorKey = AppUtils.userKey;
    photo.creatorName = AppUtils.fullName;
    photo.fileName = `${photo.eventKey}]${photo.creatorKey}]${pushRef.key}.png`;
    photo.creationDate = (new Date()).toString();

    photo = this.removeUIProperties(photo);
    pushRef.set(photo).then((p) => {
      //dispatch an ack
      this.dispatchAck({type: PhotoActions.eventPhotoSaved, payload: photo});
    });

  }

  private tagPhoto(payload: any) {
    const photo: Photo = payload.photo;
    const isVipUser: boolean = payload.isVipUser;
    const emojiKey: string = payload.emojiKey;

    const tagData: EmojiTagData = {
      eventKey: photo.eventKey,
      photoKey: photo.key,
      emojiTagKey: emojiKey,
      isVipUser: isVipUser,
      creatorKey: AppUtils.userKey,
      creatorName: AppUtils.fullName,
      creationDate: (new Date()).toString()
    };

    this.fb.database().ref()
      .child(`tagToEventPhoto/${photo.eventKey}/${photo.key}/${AppUtils.userKey}`)
      .update(tagData).then((t) => {
      this.dispatchAck({type: PhotoActions.photoTagged, payload: photo});
    });
  }

  private removeUIProperties(photo: Photo) {
    photo.base64ImageData = null;
    photo.photoImage = null;
    photo.storageMetadata = null;
    photo.tagsMetaData = null;
    photo.isNewTag = null;
    return photo;
  }

  private dispatchAck(action: Action) {
    //dispatch an ack
    this.eventDispatcherService.emit(action);
  }

}
