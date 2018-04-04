import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from "rxjs";
import {  Action } from '@ngrx/store';

@Injectable()
export class EventDispatcherService {

  appEvents: any = {};

  public on(eventName: string): Observable<any> {
    if (this.isEventExit(eventName)) {
      this.appEvents[eventName].counter++;
    }
    else {
      this.appEvents[eventName] = {
        subject: new Subject<any>(),
        counter: 1
      };
    }
    return this.appEvents[eventName].subject.asObservable();
  }

  public emit(action:Action): void {
    if (this.isEventExit(action.type)) {
      this.appEvents[action.type].subject.next(action.payload);
    }
  }

  public clearAllAppEvents(){
    const eventsName = Object.keys(this.appEvents);
    eventsName.forEach((eventName)=>{
      this.remove(eventName);
    });
  }

  public remove(eventName: string): void {
    if (this.isEventExit(eventName)) {
      this.appEvents[eventName].subject.unsubscribe();
      this.appEvents[eventName] = null;
      delete this.appEvents[eventName];
    }
  }

  private isEventExit(eventName: string): boolean {
    return this.appEvents[eventName] !== void 0;
  }

}
