import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavController, NavParams, Slides} from 'ionic-angular';
import {Event, EventLocation, EventParticipant} from "../../../api/common/appTypes";
import {EventActions} from "../../../api/store/events/eventActions";
import {BaseComponent} from "../../../api/common/baseComponent/baseComponent";
import {EventDispatcherService} from "../../../api/dispatcher/appEventDispathcer.service";
import {AppLocalStorage} from "../../../api/utilities/appLocalStorage.service";
import {googlemaps} from "googlemaps";
import {Contacts} from "@ionic-native/contacts";
import {SelectFriendsPage} from "../select-friends/select-friends";
import {AppStoreService} from "../../../api/store/appStore.service";

@Component({
  selector: 'page-create-event',
  templateUrl: 'create-event.html',
})
export class CreateEventPage extends BaseComponent implements OnInit, OnDestroy {

  event: Event;
  contactsList:any[];
  invitedFriends: EventParticipant[];
  eventStartHour: any = "12:00";
  selectedDate: any;
  eventTypes:any[];
  eventStoreSubscription:any;
  autocompleteItems: any = [];
  autocomplete: any = {};
  acService: any;

  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public eventDispatcherService: EventDispatcherService,
              public appStoreService: AppStoreService,
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
    //update the calender each time the store has been changed
    this.eventStoreSubscription = this.appStoreService._eventStore().subscribe((_store)=>{
      if(_store && _store.eventTypes){
        this.eventTypes = _store.eventTypes;
      }
    });
    this.registerToEvents();
    this.contacts.find(
      ['displayName', 'phoneNumbers'],
      {filter: "", multiple: true})
      .then( contacts => {

      self.contactsList = contacts
        .filter(c => c.phoneNumbers)
        .map(c=>{
        const phone = c.phoneNumbers.filter(ph => ph.type === "mobile");
        if(phone.length){
          const number = this.appUtils.fixPhoneNumber(phone[0].value)
          const ef:EventParticipant = {
            id: number, //id should be only the digits
            name: c.displayName,
            phone: number,
            isVip: false,
            isSelected: false
          };
          return ef;
        }
        return null;
      }).filter(c => c);
      self.logger.log(self.contactsList);
    });
  }

  ngOnDestroy() {
    //unregister to events
    this.eventStoreSubscription.unsubscribe();
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

  onInviteFriends(){
    this.navCtrl.push(SelectFriendsPage, {contactsList: this.contactsList});
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
    this.logger.log(this.invitedFriends);

    //lock the create button
    this.eventDispatcherService.emit({type: EventActions.createEvent, payload: this.event});
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
    this.event.participatesDetails = this.invitedFriends;
    this.event.initials = this.event.initials.toUpperCase();
  }

  registerToEvents() {
    const self = this;
    //event was created successfully
    this.registerToEvent(EventActions.eventCreated).subscribe(() => {

      //unregister to events
      this.unregisterToEvent(EventActions.eventCreated);
      this.unregisterToEvent(EventActions.eventsInvitedFriendsReceived);

      //navigate "back"
      self.navCtrl.pop();
    });

    this.registerToEvent(EventActions.eventsInvitedFriendsReceived).subscribe(invitedFriends => {
      self.invitedFriends = invitedFriends.slice();
    });
  }

}
