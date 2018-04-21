import {Injectable} from "@angular/core";
import {EventDispatcherService} from "../../dispatcher/appEventDispathcer.service";
import {Store} from "@ngrx/store";
import {AngularFireDatabase} from "angularfire2/database";
import {AppStore} from "../appStore.interface";
import {AppUtils} from "../../utilities/appUtils";
import {Action} from '@ngrx/store';
import {AppLogger} from "../../utilities/appLogger";
import {AppSettingsActions} from "./appSettingsActions";
import {AppSettings} from "../../common/appTypes";

@Injectable()
export class AppSettingsCrud{

  logger: AppLogger;
  appSettingsCrudSubscriptions: any[];

  constructor(public eventDispatcherService: EventDispatcherService,
              public store: Store<AppStore>,
              public db: AngularFireDatabase) {
    this.appSettingsCrudSubscriptions = [];
    this.logger = new AppLogger();
  }

  registerToEvents() {
    this.logger.log("AppSettingsCrud OnInit");

    const getAppSettingsSub = this.eventDispatcherService.on(AppSettingsActions.getAppSettings);
    getAppSettingsSub.subscribe(this.getAppSettings.bind(this));

    const updateAppSettingsSub = this.eventDispatcherService.on(AppSettingsActions.updateAppSettings);
    updateAppSettingsSub.subscribe(this.updateAppSettings);

    //add all subjects to list - we unsubscribe to them when close the app
    this.appSettingsCrudSubscriptions.push(getAppSettingsSub);
    this.appSettingsCrudSubscriptions.push(updateAppSettingsSub);
  }

  unsubscribeEvents() {
    this.logger.log("AppSettingsCrud OnDestroy");
    this.appSettingsCrudSubscriptions.forEach(s => s.unsubscribe());
  }

  private getAppSettings() {
    this.db.list<Event>(`appSettings/${AppUtils.userKey}`).valueChanges().subscribe((payload) => {
      //update the store with the retrieved event
      this.store.dispatch({type: AppSettingsActions.getAppSettings, payload});

      //dispatch an ack
      this.dispatchAck({type: AppSettingsActions.appSettingsReceived});
    });
  }

  private updateAppSettings(settings: AppSettings){
    settings = this.removeUIProperties(settings);
    this.db.list<AppSettings>('appSettings')
      .update(settings.userKey, settings)
      .then((settings) => {
        //dispatch an ack
        this.dispatchAck({type: AppSettingsActions.appSettingsUpdated});
      });
  }

  private removeUIProperties(settings: AppSettings) {
    settings.creationDate = null;
    return settings;
  }

  private dispatchAck(action: Action) {
    //dispatch an ack
    this.eventDispatcherService.emit(action);
  }

}
