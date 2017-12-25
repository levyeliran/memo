import {Component, Input} from '@angular/core';
import {EventDispatcherService} from "../../api/dispatcher/appEventDispathcer.service";
import {BaseComponent} from "../../api/common/baseComponent/baseComponent";
import {HeaderButton} from "../../api/common/appTypes";

@Component({
  selector: 'page-header',
  template: `
  <ion-header class="pageHeader">
    <ion-navbar hideBackButton="false">
        <button *ngIf="isDisplayMenu" ion-button icon-only menuToggle>
          <ion-icon name='menu'></ion-icon>
        </button>
        <ion-title>{{pageTitle}}</ion-title>
      <div class="header-buttons-wrapper">
        <button *ngFor="let btn of buttons" class="headerButton" (click)="btn.onClick()" [disabled]="btn.disabled">
          <ion-icon  name="{{btn.iconName}}"></ion-icon>
        </button>
      </div>
    </ion-navbar>
  </ion-header>
  `
})
export class PageHeaderComponent extends  BaseComponent{
  @Input() pageTitle: string = 'Memo App';
  @Input() isDisplayMenu: boolean = false;
  @Input() buttons:HeaderButton[] = [];

  constructor(public eventDispatcherService:EventDispatcherService) {
    super(eventDispatcherService);
  }

}
