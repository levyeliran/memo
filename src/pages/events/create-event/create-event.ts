import {Component, OnInit, ViewChild} from '@angular/core';
import {NavController, NavParams, Slides} from 'ionic-angular';
import {Event, EventLocation, EventParticipant} from "../../../api/common/appTypes";
import {EventActions} from "../../../api/store/events/eventActions";
import {BaseComponent} from "../../../api/common/baseComponent/baseComponent";
import {EventDispatcherService} from "../../../api/dispatcher/appEventDispathcer.service";
import {AppLocalStorage} from "../../../api/utilities/appLocalStorage.service";
import {googlemaps} from "googlemaps";
import {Contacts} from "@ionic-native/contacts";

@Component({
  selector: 'page-create-event',
  templateUrl: 'create-event.html',
})
export class CreateEventPage extends BaseComponent implements OnInit {

  event: Event;
  contactsList:any[];
  invitedFriends: EventParticipant[];
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
              public contacts: Contacts) {

    super(eventDispatcherService);
    this.event = this.navParams.get('event');
    this.selectedDate = this.navParams.get('selectedDate');
    this.event.location = new EventLocation();
    this.invitedFriends = [];
    this.contactsList = [];
    this.eventStartHour = "12:00";
  }

  ngOnInit() {
    const self = this;
    this.event.description = '';
    this.acService = new google.maps.places.AutocompleteService();
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
    this.contacts.find(
      ['displayName', 'phoneNumbers'],
      {filter: "", multiple: true})
      .then( contacts => {
      self.contactsList = contacts.map(c=>{
        const phone = c.phoneNumbers.filter(ph => ph.type === "mobile");
        if(phone.length){
          const number = phone[0].value
          const ef:EventParticipant = {
            id: number
              .replace('(','')
              .replace(')', '')
              .replace('-', '')
              .replace(' ', ''), //id should be only the digits
            name: c.displayName,
            phone: number
          };
          return ef;
        }
        return null;
      }).filter(c => c);
      self.logger.log(self.contactsList);
    });
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

    const self = this;
    this.prepareForSave();

    //lock the create button
    this.eventDispatcherService.emit({type: EventActions.createEvent, payload: this.event});

    //event was created successfully
    this.registerToEvent(EventActions.eventCreated).subscribe(() => {
      //navigate "back"
      self.navCtrl.pop();
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
    this.event.startDate = startDate.toString();
    this.event.endDate = (new Date(this.selectedDate).setHours(24, 0, 0)).toString();
    this.event.participatesDetails = this.invitedFriends;
  }

}
