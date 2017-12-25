import {Component, OnInit} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Event, HeaderButton, Photo} from "../../../api/common/appTypes";
import {EventAlbumAnimationPage} from "../event-album-animation/event-album-animation";
import {EventAlbumPhotoPage} from "../event-album-photo/event-album-photo";
import {BaseComponent} from "../../../api/common/baseComponent/baseComponent";
import {EventDispatcherService} from "../../../api/dispatcher/appEventDispathcer.service";
//import {AppDispatchTypes} from "../../../api/common/dispatchTypes";
import { Camera, CameraOptions } from '@ionic-native/camera';
import {AppStoreService} from "../../../api/store/appStore.service";

@Component({
  selector: 'page-event-album',
  templateUrl: 'event-album.html',
})
export class EventAlbumPage extends BaseComponent implements OnInit {

  event:Event;
  headerButtons:HeaderButton[];
  photos:Photo[];
  photosGridModel:any[];
  photoStoreSubscription: any;
  flexStyle:any = [{
                    flex:[1]
                  },{
                    flex:[1,3]
                  },{
                    flex:[3,1]
                  },{
                    flex:[1,1,1]
                  },{
                    flex:[2,3,2]
                  },{
                    flex:[2,2,3]
                  },{
                    flex:[3,2,2]
                  }];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public camera:Camera,
              public appStoreService: AppStoreService,
              public eventDispatcherService: EventDispatcherService) {
    super(eventDispatcherService);

    this.event = this.navParams.get('event');
    const animationBtn = new HeaderButton('film',this.omViewAnimation(), true);
    const newPhotoBtn = new HeaderButton('camera',this.omAddNewPhoto(), true);
    this.headerButtons = [
      animationBtn,
      newPhotoBtn
    ];
  }

  ngOnInit() {

    //update the calender each time the store has been changed
    this.photoStoreSubscription = this.appStoreService._photoStore().subscribe((_store)=>{
      if(_store){
        this.photos = _store.photos;
        this.createAlbumModel();
      }
    });

    this.photos = [];
    this.photosGridModel = [];

    //set album events
    this.registerToEvents();

  }

  createAlbumModel(){

    const flexRange = this.flexStyle.length;
    let row = 0;
    while(this.photos.length){
      row++;
      if(row === 1 || row === 7 || row === 16 || row === 25){
        this.photosGridModel.push([{
          photo: this.photos.pop(),
          count: 1,
          class:"flexBig"
        }]);
      }
      else {
        const rowFlex = this.flexStyle[Math.floor((Math.random() * flexRange) + 1)].flex;
        let data:any[] = [];
        let rowLength = this.photos.length >= rowFlex.length ? rowFlex.length : this.photos.length;
        for(let i=0; i< rowLength; i ++){
          data.push({
            photo: this.photos.pop(),
            count: rowFlex.length,
            class:`flex${rowFlex[i]}`
          });
        }
        this.photosGridModel.push(data);
      }
    }
  }

  omViewAnimation(){
    this.navCtrl.push(EventAlbumAnimationPage, {event: this.event});
  }

  omAddNewPhoto(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;

      //save the image - create thumnail - add it to photos list
      //this will refresh the photos gallery




    }, (err) => {
      // Handle error
    });
  }

  registerToEvents(){
    //menu page close button click - ????we have back buttons
/*    this.registerToEvent(AppDispatchTypes.album.onAddNewPhotoClose).subscribe(() => {
      this.navCtrl.pop();
    });

    this.registerToEvent(AppDispatchTypes.album.onViewAnimationClose).subscribe(() => {
      this.navCtrl.pop();
    });*/
  }

  onPhotoClick(photo:Photo){
    //navigate to photo page
    this.navCtrl.push(EventAlbumPhotoPage, {photo});
  }

}
