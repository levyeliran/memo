import {Component, OnInit, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {BaseComponent} from "../../../api/common/baseComponent/baseComponent";
import {EventDispatcherService} from "../../../api/dispatcher/appEventDispathcer.service";
import {Event, HeaderButton, Photo} from "../../../api/common/appTypes";
import {PhotoActions} from "../../../api/store/photos/photoActions";


@Component({
  selector: 'page-event-album-photo',
  templateUrl: 'event-album-photo.html',
})
export class EventAlbumPhotoPage extends BaseComponent implements OnInit {

  event: Event;
  photo: Photo;
  emojis: any[];
  selectedEmoji:any;
  photoCanvas: any;
  isNewPhoto: boolean;
  headerButtons: HeaderButton[];

  //get reference to photo canvas view
  @ViewChild('photoPreviewCanvas') canvasRef: any;
  @ViewChild('photoPreview') imgRef: any;
  @ViewChild('toolsBar') toolsBarRef: any;
  @ViewChild('pageWrapper') pageWrapperRef: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public eventDispatcherService: EventDispatcherService) {
    super(eventDispatcherService);
    this.event = this.navParams.get('event');
    this.photo = this.navParams.get('photo');
    //this.screenHeight = window.screen.height * 0.6;
    //extract params

    this.isNewPhoto = !this.photo.key
  }

  getEmojis(){
    return [
      {imagePath:'assets/images/emoji/1.png', key: '1'},
      {imagePath:'assets/images/emoji/2.png', key: '2'},
      {imagePath:'assets/images/emoji/3.png', key: '3'},
      {imagePath:'assets/images/emoji/4.png', key: '4'},
      {imagePath:'assets/images/emoji/5.png', key: '5'},
      {imagePath:'assets/images/emoji/6.png', key: '6'},
      {imagePath:'assets/images/emoji/7.png', key: '7'}
    ];
  }

  ngOnInit() {
    //set photo events
    this.registerToEvents();
    this.emojis = this.getEmojis();
    const imageWidth = window.screen.width;
    const imageHeight = window.screen.width * 0.8;
    //calculate the
    const toolsHeight =
      this.pageWrapperRef
        .getElementRef()
        .nativeElement
        .clientHeight - imageHeight - this.appConst.appTopMenuHeight;

    //tag photo
    if (this.photo.key) {
      const img = this.imgRef.nativeElement;
      img.width = imageWidth;
      img.height = imageHeight;
    }
    //design photo
    else {
      const addPhotoBtn = new HeaderButton('checkmark', this.onAddPhoto.bind(this), false);
      this.headerButtons = [
        addPhotoBtn
      ];

      //https://stackoverflow.com/questions/4409445/base64-png-data-to-html5-canvas
      //https://stackoverflow.com/questions/37873043/how-to-draw-on-image-angular2-ionic2
      this.photoCanvas = this.canvasRef.nativeElement;
      this.photoCanvas.width = imageWidth;
      this.photoCanvas.height = imageHeight;
      let ctx = this.photoCanvas.getContext("2d");
      this.photo.photoImage = new Image();
      const img = this.photo.photoImage;
      img.onload = () => {
        ctx.drawImage(img,
          0, 0, img.width, img.height,// source rectangle
          0, 0, this.photoCanvas.width, this.photoCanvas.height); // destination rectangle
      };
      this.photo.photoImage.src = this.photo.base64ImageData;
    }


    //set tolls bar styling
    const toolsBar = this.toolsBarRef.nativeElement;
    toolsBar.setAttribute("style", `width:${imageWidth}px; height:${toolsHeight}px;`);
  }

  registerToEvents() {
    this.registerToEvent(PhotoActions.eventPhotoUploaded).subscribe(() => {
      //save the photo to the album
      this.eventDispatcherService.emit({type: PhotoActions.addPhotoToAlbum, payload: this.photo});
    });

    this.registerToEvent(PhotoActions.eventPhotoUploadFailed).subscribe(() => {
      //display error
    });

    this.registerToEvent(PhotoActions.eventPhotoSaved).subscribe(() => {
      //navigate back to the album
      this.navCtrl.pop();
    });
  }

  onAddPhoto() {
    this.photo.fileName = `${this.event.key}_${this.appUtils.userKey}_RND${Math.floor((Math.random() * 10000) + 1)}.png`;
    this.photo.eventKey = this.event.key;
    this.eventDispatcherService.emit({type: PhotoActions.savePhotoToStorage, payload: this.photo});
  }

  onEmojiClick(emoji:any){
    if(this.isDoubleClick()){
      this.selectedEmoji = emoji;
      emoji.selected = !emoji.selected;
      this.logger.log(`Emoji ${JSON.stringify(emoji)}} was ${emoji.selected ? 'selected' : 'unSelected'}`);
    }
  }


  ionViewDidLeave(){
    //set the selected emoji tag to the photo on page leave.
    if(this.selectedEmoji){
      this.eventDispatcherService.emit({type: PhotoActions.tagPhoto, payload: {
        photo: this.photo,
        emojiKey: this.selectedEmoji.key
      }});
    }

    //reset the selected emoji
    this.selectedEmoji = null;
  }


}
