import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {NavController, NavParams, Select} from 'ionic-angular';
import {BaseComponent} from "../../../api/common/baseComponent/baseComponent";
import {EventDispatcherService} from "../../../api/dispatcher/appEventDispathcer.service";
import {EventParticipant, HeaderButton} from "../../../api/common/appTypes";
import {AlertController} from "ionic-angular";
import {EventActions} from "../../../api/store/events/eventActions";

@Component({
  selector: 'page-select-friends',
  templateUrl: 'select-friends.html',
})
export class SelectFriendsPage extends BaseComponent implements OnInit, OnDestroy  {

  MAX_VIP = 3;
  MAX_FRIENDS = 10;
  contactsList:any;
  invitedFriends:EventParticipant[];
  headerButtons: HeaderButton[];
  @ViewChild('contactListSelect') selectComponent: Select;

  constructor(public navCtrl: NavController,
              public eventDispatcherService: EventDispatcherService,
              public navParams: NavParams,
              public alertCtrl: AlertController) {
    super(eventDispatcherService);
    this.contactsList = this.navParams.get('contactsList').slice();
    this.invitedFriends = [];
    const approveBtn = new HeaderButton('checkmark', this.onApproveSelection.bind(this), true);
    this.headerButtons = [
      approveBtn
    ];
  }


  ngOnInit() {

  }

  ngOnDestroy(){

  }

  hasSelectedFriends(){
    const hasFriends = this.contactsList.filter(c => { return c.isSelected }).length;
    this.headerButtons[0].changeStatus(!hasFriends);
    return hasFriends;
  }

  onApproveSelection(){
    //fix the contact list
    this.invitedFriends = this.contactsList.filter(c => { return c.isSelected });
    //send selected back to previous page
    this.eventDispatcherService.emit({type: EventActions.eventsInvitedFriendsReceived, payload: this.invitedFriends});
    this.navCtrl.pop();
  }


  onInviteFriendsChanged(contact:EventParticipant) {
    contact.isSelected = !contact.isSelected;
    if (this.hasSelectedFriends() >= this.MAX_FRIENDS) {
      this.presentAlert({
        title: 'Max selected friends',
        subTitle:  '',
        message:  `You can invite up to ${this.MAX_FRIENDS} vip friends.`,
        buttons:  ['Ok'],
      });
      contact.isSelected = false;
    }
  }


  onVipFriend(contact:EventParticipant, isVip = false){
    const vipContacts =  this.contactsList.filter(c => c.isVip);
    if(isVip && vipContacts.length >= this.MAX_VIP){
      this.presentAlert({
        title: 'Max VIP friends',
        subTitle:  '',
        message:  `You can flag up to ${this.MAX_VIP} vip friends.`,
        buttons:  ['Ok'],
      });
      return;
    }
    contact.isVip = isVip;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectFriendsPage');
  }

  presentAlert(errorObj: any) {
    const alert = this.alertCtrl.create({
      title: errorObj.title,
      subTitle:  errorObj.subTitle,
      message:  errorObj.message,
      buttons:  errorObj.buttons,
    });
    alert.present();
  }

}
