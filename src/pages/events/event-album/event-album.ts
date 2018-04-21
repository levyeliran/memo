import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Event, HeaderButton, Photo, PhotoTagsMetaData} from "../../../api/common/appTypes";
import {EventAlbumAnimationPage} from "../event-album-animation/event-album-animation";
import {EventAlbumPhotoPage} from "../event-album-photo/event-album-photo";
import {BaseComponent} from "../../../api/common/baseComponent/baseComponent";
import {EventDispatcherService} from "../../../api/dispatcher/appEventDispathcer.service";
//import {AppDispatchTypes} from "../../../api/common/dispatchTypes";
import {Camera, CameraOptions} from '@ionic-native/camera';
import {AppStoreService} from "../../../api/store/appStore.service";
import {AppPermission} from "../../../api/utilities/appPermission.service";
import {EventActions} from "../../../api/store/events/eventActions";
import {PhotoActions} from "../../../api/store/photos/photoActions";
import {AnimationActions} from "../../../api/store/animation/animationActions";

@Component({
  selector: 'page-event-album',
  templateUrl: 'event-album.html',
  providers: [Camera]
})
export class EventAlbumPage extends BaseComponent implements OnInit, OnDestroy {

  event: Event;
  headerButtons: HeaderButton[];
  photos: Photo[];
  photosTags: PhotoTagsMetaData[];
  photosGridModel: any[];
  photoStoreSubscription: any;
  animationStoreSubscription: any;
  displaySpinner = false;
  hasAnimation = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public camera: Camera,
              public appStoreService: AppStoreService,
              public appPermission: AppPermission,
              public eventDispatcherService: EventDispatcherService) {
    super(eventDispatcherService);

    this.event = this.navParams.get('event');
    let disableNewPhoto = (!this.event.isActive || this.displaySpinner);
    if (this.appUtils.isPastDate(this.event.endDate, true)) {
      //need to update the event - only by the creator
      if (this.event.isActive && this.event.creatorKey === this.appUtils.userKey) {
        this.event.isActive = false;
        this.event.isPast = true;
        //update the event
        this.eventDispatcherService.emit({type: EventActions.updateEvent, payload: this.event});

        //disable the upload photo
        disableNewPhoto = true;
      }
    }
    const animationBtn = new HeaderButton('film', this.onViewAnimation.bind(this), !this.hasAnimation || this.displaySpinner);
    const newPhotoBtn = new HeaderButton('camera', this.onAddNewPhoto.bind(this), disableNewPhoto);
    this.headerButtons = [
      animationBtn,
      newPhotoBtn
    ];
    this.photos = [];
    this.photosTags = [];
    this.photosGridModel = [];
    this.displaySpinner = true;
    //set album events
    this.registerToEvents();
  }

  ngOnInit() {

    const self = this;
    //update the album each time the store has been changed
    this.photoStoreSubscription = this.appStoreService._photoStore().subscribe((_store) => {
      if (_store && _store.photos && _store.photos.length) {
        self.photos = _store.photos;
      }

      if (_store && _store.photosTags && _store.photosTags.length) {
        self.photosTags = _store.photosTags;

        //add tags to photos
        self.photos.forEach((photo) => {
          const pTags = self.photosTags.find(pt => pt.photoKey == photo.key);
          if (pTags) {
            photo.tagsMetaData = pTags;

            //check if the current user had tags photos
            const myEmojiTag = pTags.emojiTags.find(et => et.creatorKey === self.appUtils.userKey);
            if (myEmojiTag) {
              photo.myEmojiTagKey = myEmojiTag.emojiTagKey;
            }
          }
        });
      }
      self.displaySpinner = false;
      self.createAlbumModel();
    });

    //update the animation icon
    this.animationStoreSubscription = this.appStoreService._animationStore().subscribe((_store) => {
      if (_store && _store.animation && _store.animation.lastCreationDate) {
        self.hasAnimation = true;
      }
    });
  }

  ngOnDestroy() {
    //unregister to events
    this.photoStoreSubscription.unsubscribe();
    this.animationStoreSubscription.unsubscribe();
    this.unregisterToEvent(PhotoActions.photoTagged);
  }

  createAlbumModel() {

    this.photosGridModel = [];

    let index = 0;
    let data: any[] = [];
    const photos = this.photos.slice(0);
    while (photos.length) {
      const photo = photos.pop();
      if (photo.fileThumbnailURL) {
        data.push({photo});

        index++;
        index %= 3;
        if (index == 0) {
          this.photosGridModel.push(data);
          data = [];
        }
      }
    }

    if (data.length) {
      this.photosGridModel.push(data);
    }
    this.logger.log('album model recalculated');
    this.logger.log(this.photosGridModel);
  }

  onViewAnimation() {
    this.navCtrl.push(EventAlbumAnimationPage, {event: this.event});
  }

  onAddNewPhoto() {
    this.appPermission
      .getPermissions([this.appConst.permissions.CAMERA,
        this.appConst.permissions.READ_EXTERNAL_STORAGE])
      .then(result => {
        const options: CameraOptions = {
          quality: 100,
          destinationType: this.camera.DestinationType.DATA_URL,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE
        };

        this.camera.getPicture(options).then((imageData: string) => {
          // imageData is either a base64 encoded string or a file URI
          // If it's base64:
          const photo = new Photo();
          photo.base64ImageData = 'data:image/png;base64,' + imageData;

          //navigate to photo page with the data
          this.navCtrl.push(EventAlbumPhotoPage, {photo, event: this.event});

        }, (err) => {
          // Handle error
          this.logger.log(err);
        });

      });
  }

  registerToEvents() {
    const self = this;
    this.registerToEvent(PhotoActions.photoTagged).subscribe(photo => {

      //only when added a new tag
      if (photo.isNewTag) {
        //increment tags counters
        self.eventDispatcherService.emit({
          type: AnimationActions.updateEventAnimationCounters, payload: {
            eventKey: photo.eventKey,
            tagsIncrement: 1
          }
        });
        photo.isNewTag = false;
      }
    });
  }

  onSelectPhoto(photo: Photo) {
    //navigate to photo page
    this.navCtrl.push(EventAlbumPhotoPage, {photo});
  }

}
