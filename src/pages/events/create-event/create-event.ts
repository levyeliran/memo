import {Component, OnInit, ViewChild} from '@angular/core';
import {NavController, NavParams, Slides} from 'ionic-angular';
import {Event, EventLocation} from "../../../api/common/appTypes";
import {EventCrud} from "../../../api/store/events/eventCrud.service";
import {EventActions} from "../../../api/store/events/eventActions";
import {BaseComponent} from "../../../api/common/baseComponent/baseComponent";
import {EventDispatcherService} from "../../../api/dispatcher/appEventDispathcer.service";
import {AppLocalStorage} from "../../../api/utilities/appLocalStorage.service";
import {googlemaps} from "googlemaps";

@Component({
  selector: 'page-create-event',
  templateUrl: 'create-event.html',
})
export class CreateEventPage extends BaseComponent implements OnInit {

  event: Event;
  invitedFriends: any[];
  eventStartHour: any = "12:00";
  selectedDate: any;
  autocompleteItems: any = [];
  autocomplete: any = {};
  acService: any;

  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public eventDispatcherService: EventDispatcherService,
              public appLocalStorage: AppLocalStorage,
              public eventCrud: EventCrud) {

    super(eventDispatcherService);
    this.event = this.navParams.get('event');
    this.selectedDate = this.navParams.get('selectedDate');
    this.event.location = new EventLocation();
    this.invitedFriends = [];
    this.eventStartHour = "12:00";
  }

  ngOnInit() {
    this.event.description = '';
    this.acService = new google.maps.places.AutocompleteService();
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  onUpdateSearchPlace() {
    this.logger.log('modal > updateSearch');
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let config = {
      input: this.autocomplete.query,//types:  ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'
      componentRestrictions: {}
    };
    this.acService.getPlacePredictions(config, (predictions, status) => {
      this.logger.log(`modal > getPlacePredictions > status > ${status}`);
      this.autocompleteItems = [];
      if (predictions) {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      }
    });
  }

  onCancelPlaceItem() {
    this.event.location = new EventLocation();
  }

  onSelectPlaceItem(item: any) {
    this.logger.log(item);
    this.autocomplete.query = item.description;
    this.event.location.placeId = item.description;
    this.event.location.placeDescription = item.description;
    this.event.location.reference = item.reference;
    this.event.location.terms = item.terms;
    this.event.location.types = item.types;
    this.event.location.place = item.structured_formatting.main_text;
    this.autocompleteItems = [];
  }

  onInviteFriendsChanged() {
    if (this.invitedFriends.length > 10) {
      //alert here
      this.invitedFriends.pop();
    }
  }

  onUploadEventCard() {

  }

  validateEvent(): Boolean {
    return !(this.event.title &&
      this.event.initials &&
      this.event.typeKey &&
      this.event.startDate &&
      this.event.description &&
      this.event.location.placeId
    );
  }

  onCreateEvent() {

    this.prepareForSave();

    //lock the create button
    this.eventCrud.createEvent(this.event);

    //event was created successfully
    this.registerToEvent(EventActions.createEvent).subscribe(() => {
      //navigate "back"
      this.navCtrl.pop();
    });
  }

  prepareForSave() {
    const h = this.eventStartHour.split(":");
    let startDate: any;
    if (!h.length) {
      startDate = new Date(this.selectedDate).setHours(12, 0, 0);
    }
    else {
      startDate = new Date(this.selectedDate).setHours(h[0], h[1], 0);
    }
    this.event.startDate = startDate;
    this.event.endDate = new Date(this.selectedDate).setHours(24, 0, 0);
    this.appLocalStorage.readKey(this.appConst.userDetails.name).then((payload) => {
      this.event.creatorName = payload;
    });
    this.event.numOfParticipates = this.invitedFriends.length;
  }

}
