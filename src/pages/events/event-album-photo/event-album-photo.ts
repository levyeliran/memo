import {Component, OnInit, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {BaseComponent} from "../../../api/common/baseComponent/baseComponent";
import {EventDispatcherService} from "../../../api/dispatcher/appEventDispathcer.service";
import {Event, HeaderButton, Photo} from "../../../api/common/appTypes";
import {PhotoCrud} from "../../../api/store/photos/photoCrud.service";
import {PhotoActions} from "../../../api/store/photos/photoActions";


@Component({
  selector: 'page-event-album-photo',
  templateUrl: 'event-album-photo.html',
})
export class EventAlbumPhotoPage extends BaseComponent implements OnInit {

  screenHeight: number;
  event: Event;
  photo: Photo;
  photoCanvas:any;
  isNewPhoto: boolean;
  isDisplayHeartAnimation = false;
  headerButtons: HeaderButton[];

  //get reference to photo canvas view
  @ViewChild('photoPreviewCanvas') canvasRef: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public photoCrud: PhotoCrud,
              public eventDispatcherService: EventDispatcherService) {
    super(eventDispatcherService);
    this.event = this.navParams.get('event');
    this.photo = this.navParams.get('photo');
    this.screenHeight = window.screen.height * 0.6;
    //extract params

  }

  //!!!!!!!!!!!!!! - should be on the photo object
  //display "heart" icon if the user liked the image or "tag" icon if he did something else
  //display all emoticons on full page


  ngOnInit() {
    //set photo events
    this.registerToEvents();

    //tag photo
    if (this.photo.key) {

    }
    //design photo
    else {
      const addPhotoBtn = new HeaderButton('checkmark', this.onAddPhoto.bind(this), false);
      this.headerButtons = [
        addPhotoBtn
      ];

      //https://stackoverflow.com/questions/4409445/base64-png-data-to-html5-canvas
      //https://stackoverflow.com/questions/37873043/how-to-draw-on-image-angular2-ionic2
      this.isNewPhoto = true;
      this.photoCanvas = this.canvasRef.nativeElement;
      let ctx = this.photoCanvas.getContext("2d");
      this.photo.photoImage = new Image();
      const img = this.photo.photoImage;
      img.onload = () =>{
        ctx.drawImage(img,
          0, 0, img.width, img.height,// source rectangle
          0, 0, this.photoCanvas.width, this.photoCanvas.height); // destination rectangle
      };
      this.photo.photoImage.src = this.photo.base64ImageData;
    }
  }

  registerToEvents() {
    this.registerToEvent(PhotoActions.uploadEventPhoto).subscribe(() => {
      //save the photo to the album
      this.photoCrud.addPhotoToAlbum(this.photo);
    });

    this.registerToEvent(PhotoActions.uploadEventPhotoFailed).subscribe(() => {
      //display error
    });

    this.registerToEvent(PhotoActions.saveEventPhoto).subscribe(() => {
      //navigate back to the album
      this.navCtrl.pop();

    });
  }

  onAddPhoto() {
    this.photo.fileName = `${this.event.key}_${this.appUtils.userKey}.png`;
    this.photo.eventKey = this.event.key;
    this.photoCrud.savePhotoToStorage(this.photo);
  }


  onPhotoPress() {
  //toggle the emoji icons menu
    this.isDisplayHeartAnimation = true;
    console.log('photo pressed');
  }

  onPhotoDblClick() {
  //toogle like emoji to this image (display "heart" on top)
    this.isDisplayHeartAnimation = true;
    console.log('photo dbl clicked');
  }


}
