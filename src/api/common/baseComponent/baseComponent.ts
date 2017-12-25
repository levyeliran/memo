import {EventDispatcherService} from "../../dispatcher/appEventDispathcer.service";
import {Observable} from "rxjs/Rx";
import { AppConstants } from "../appConstants";

export class BaseComponent {

  public appConst = AppConstants;

  //constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private screenOrientation: ScreenOrientation) {
  constructor(public eventDispatcherService: EventDispatcherService) {
  }

  registerToEvent(eventName:string): Observable<any>{
    return this.eventDispatcherService.on(eventName);
  }

  dispatchAnEvent(payload:any): void{
    return this.eventDispatcherService.emit(payload)
  }

}
