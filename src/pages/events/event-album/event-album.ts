import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Event, HeaderButton, Photo} from "../../../api/common/appTypes";
import {EventAlbumAnimationPage} from "../event-album-animation/event-album-animation";
import {EventAlbumPhotoPage} from "../event-album-photo/event-album-photo";
import {BaseComponent} from "../../../api/common/baseComponent/baseComponent";
import {EventDispatcherService} from "../../../api/dispatcher/appEventDispathcer.service";
//import {AppDispatchTypes} from "../../../api/common/dispatchTypes";
import {Camera, CameraOptions} from '@ionic-native/camera';
import {AppStoreService} from "../../../api/store/appStore.service";
import {AppPermission} from "../../../api/utilities/appPermission.service";

@Component({
  selector: 'page-event-album',
  templateUrl: 'event-album.html',
  providers: [Camera]
})
export class EventAlbumPage extends BaseComponent implements OnInit {

  event: Event;
  headerButtons: HeaderButton[];
  photos: Photo[];
  photosGridModel: any[];
  photoStoreSubscription: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public camera: Camera,
              public appStoreService: AppStoreService,
              public appPermission: AppPermission,
              public eventDispatcherService: EventDispatcherService) {
    super(eventDispatcherService);

    this.event = this.navParams.get('event');
    const animationBtn = new HeaderButton('film', this.onViewAnimation.bind(this), !this.event.hasAnimation);
    const newPhotoBtn = new HeaderButton('camera', this.onAddNewPhoto.bind(this), !this.event.isActive);
    this.headerButtons = [
      animationBtn,
      newPhotoBtn
    ];
    this.photos = [];
    this.photosGridModel = [];
  }

  ngOnInit() {

    //update the calender each time the store has been changed
    this.photoStoreSubscription = this.appStoreService._photoStore().subscribe((_store) => {
      if (_store && _store.photos && _store.photos.length) {
        this.photos = _store.photos;
        this.createAlbumModel();
      }
    });

    //set album events
    this.registerToEvents();

  }

  createAlbumModel() {

    this.photosGridModel = [];

    let index = 0;
    let data: any[] = [];
    while (this.photos.length) {
      const photo = this.photos.pop();
      if(photo.fileThumbnailURL){
        data.push({
          photo: photo,
          class: 'col-image', //`${index == 0 ? 'left w32' : 'right w34'}`,
          hasEmoji: !!photo.myEmojiTagKey
        });

        index++;
        index %= 3;
        if (index == 0) {
          this.photosGridModel.push(data);
          data = [];
        }
      }
    }

    if(data.length){
      this.photosGridModel.push(data);
    }
    this.logger.log('album model recalculated');
    this.logger.log(this.photosGridModel);
  }

  onViewAnimation() {
    this.navCtrl.push(EventAlbumAnimationPage, {event: this.event});
  }

  onAddNewPhoto() {
    this.appPermission.getPermission(this.appConst.permissions.CAMERA).then(result => {
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
    //menu page close button click - ????we have back buttons
    /*    this.registerToEvent(AppDispatchTypes.album.onAddNewPhotoClose).subscribe(() => {
          this.navCtrl.pop();
        });

        this.registerToEvent(AppDispatchTypes.album.onViewAnimationClose).subscribe(() => {
          this.navCtrl.pop();
        });*/
  }

  onSelectPhoto(photo: Photo) {
    //navigate to photo page
    this.navCtrl.push(EventAlbumPhotoPage, {photo});
  }

}
