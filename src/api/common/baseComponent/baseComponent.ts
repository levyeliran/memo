import {EventDispatcherService} from "../../dispatcher/appEventDispathcer.service";
import {Observable} from "rxjs/Rx";
import { AppConstants } from "../appConstants";
import {AppUtils} from "../../utilities/appUtils";
import {Action} from "@ngrx/store";

export class BaseComponent {

  public appConst = AppConstants;
  public appUtils = AppUtils;

  //constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private screenOrientation: ScreenOrientation) {
  constructor(public eventDispatcherService: EventDispatcherService) {
  }

  registerToEvent(eventName:string): Observable<any>{
    return this.eventDispatcherService.on(eventName);
  }

  dispatchAnEvent(action:Action): void{
    return this.eventDispatcherService.emit(action);
  }

}
