import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Event} from "../../../api/common/appTypes";

@Component({
  selector: 'page-event-album',
  templateUrl: 'event-album.html',
})
export class EventAlbumPage {

  event:Event;
  photos:any[];
  photosModel:any[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.event = this.navParams.get('event');
  }

  //!!!!!!!!!!!!!! - should be on the photo object
  //display "heart" icon if the user liked the image or "tag" icon if he did something else
  //display all emoticons on full page


  createAlbumModel(){

    const flexStyle = [{
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

    const flexRange = flexStyle.length;
    let row = 0;
    while(this.photos.length){
      row++;
      if(row === 1 || row === 7 || row === 16 || row === 25){
        this.photosModel.push([{
          photo: this.photos.pop(),
          count: 1,
          class:"flexBig"
        }]);
      }
      else {
        const rowFlex = flexStyle[Math.floor((Math.random() * flexRange) + 1)].flex;
        let data:any[] = [];
        let rowLength = this.photos.length >= rowFlex.length ? rowFlex.length : this.photos.length;
        for(let i=0; i< rowLength; i ++){
          data.push({
            photo: this.photos.pop(),
            count: rowFlex.length,
            class:`flex${rowFlex[i]}`
          });
        }
        this.photosModel.push(data);
      }
    }

  }

  onImageClick(photo:any){

  }

  //display on full page
  onImagePress(photo:any){
    //toggle the emoji icons menu
  }

  //display on full page
  onImageDblClick(photo:any){
    //toogle like emoji to this image (display "heart" on top)
  }
}
