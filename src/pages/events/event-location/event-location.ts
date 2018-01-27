/*
import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
/!*  CameraPosition,
  MarkerOptions,
  Marker*!/
} from '@ionic-native/google-maps';
import {HeaderButton} from "../../../api/common/appTypes";


@Component({
  selector: 'page-event-location',
  templateUrl: 'event-location.html',
})
export class EventLocationPage {

  //https://ionicframework.com/docs/native/google-maps/
  //https://github.com/mapsplugin/cordova-plugin-googlemaps
  map: GoogleMap;
  headerButtons: HeaderButton[];
  selectedLocation:any;

  //get reference to map element in the view
  @ViewChild('mapContainer') mapRef: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public googleMaps:GoogleMaps) {

    const addLocationBtn = new HeaderButton('checkmark', this.onAddLocation, !this.selectedLocation);
    this.headerButtons = [
      addLocationBtn
    ];
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {

    //set initiate location for the map (AFEKA address)
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 32.11351,
          lng: 34.818186
        },
        zoom: 18,
        tilt: 30
      }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);
    //this.mapRef.append(this.map);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        this.logger.log('Map is ready!');



       // Now you can use all methods safely.
        this.map.addMarker({
          title: 'Ionic',
          icon: 'blue',
          animation: 'DROP',
          position: {
            lat: 32.11351,
            lng: 34.818186
          }
        })
          .then(marker => {
            marker.on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe(() => {
                alert('clicked');
              });
          });

      });
  }

  onAddLocation(){
    //the selected location will be passed as query param - we extract it on back
      this.navCtrl.pop(this.selectedLocation);
  }

  handleSelectedAddress(data:any){

  }

}
*/
