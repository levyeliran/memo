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
  private clickTime:any;

  //constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private screenOrientation: ScreenOrientation) {
  constructor(public eventDispatcherService: EventDispatcherService) {
    this.logger = new AppLogger();
  }

  registerToEvent(eventName:string): Observable<any>{
    return this.eventDispatcherService.on(eventName);
  }

  unregisterToEvent(eventName:string): void{
    this.eventDispatcherService.remove(eventName);
  }

  dispatchAnEvent(action:Action): void{
    this.logger.log(action);
    return this.eventDispatcherService.emit(action);
  }

  isDoubleClick(){
    const now = (new Date()).getTime();
    if(!this.clickTime){
      this.clickTime = now;
      return false;
    }

    if((now - this.clickTime) < 250){
      this.clickTime = null;
      return true;
    }
    this.clickTime = now;
    return false;
  }

}
