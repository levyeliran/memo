import {Component, Input} from '@angular/core';

@Component({
  selector: 'page-header',
  template: `
<ion-header>
  <ion-navbar >
      <button *ngIf="isDisplayMenu" ion-button icon-only menuToggle>
        <ion-icon name='menu'></ion-icon>
      </button>
      <ion-title>{{pageTitle}}</ion-title>
  </ion-navbar>
</ion-header>
`
})
export class PageHeaderComponent {
  @Input()  pageTitle:string = 'Memo App';
  @Input()  isDisplayMenu:boolean = true;

  constructor() {
  }

}
