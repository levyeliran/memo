import {EventDispatcherService} from "../../dispatcher/appEventDispathcer.service";
import {Observable} from "rxjs/Rx";
import { AppConstants } from "../appConstants";
import {AppUtils} from "../../utilities/appUtils";
import {Action} from "@ngrx/store";
import {AppLogger} from "../../utilities/appLogger";

export class BaseComponent {

  public appConst = AppConstants;
  public appUtils = AppUtils;
  public logger: AppLogger;

  //constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private screenOrientation: ScreenOrientation) {
  constructor(public eventDispatcherService: EventDispatcherService) {
    this.logger = new AppLogger();
  }

  registerToEvent(eventName:string): Observable<any>{
    return this.eventDispatcherService.on(eventName);
  }

  dispatchAnEvent(action:Action): void{
    return this.eventDispatcherService.emit(action);
  }

}
