import {Component, Input} from '@angular/core';
import {EventDispatcherService} from "../../api/dispatcher/appEventDispathcer.service";
import { AppDispatchTypes} from "../../api/common/dispatchTypes";
import {BaseComponent} from "../../api/common/baseComponent/baseComponent";

@Component({
  selector: 'page-header',
  template: `
  <ion-header class="pageHeader">
    <ion-navbar hideBackButton="false">
        <button *ngIf="isDisplayMenu" ion-button icon-only menuToggle>
          <ion-icon name='menu'></ion-icon>
        </button>
        <ion-title>{{pageTitle}}</ion-title>
        <button *ngIf="isDisplayClose" class="closeButton" (click)="onPageCloseClick()">
          <ion-icon  name="close"></ion-icon>
        </button>
    </ion-navbar>
  </ion-header>
  `
})
export class PageHeaderComponent extends  BaseComponent{
  @Input() pageTitle: string = 'Memo App';
  @Input() isDisplayMenu: boolean = false;
  @Input() isDisplayClose: boolean = false;

  constructor(public eventDispatcherService:EventDispatcherService) {
    super(eventDispatcherService);
  }

  onPageCloseClick(){
    this.dispatchAnEvent({
      eventName: AppDispatchTypes.pageHeader.onCloseClick});
  }

}
