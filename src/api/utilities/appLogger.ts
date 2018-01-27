import { AppConstants } from '../common/appConstants'
export class AppLogger {

  appConst = AppConstants;

  log(params:any){
    if(this.appConst.displayLogs){
      if(this.appConst.isProdMode){
        console.log(JSON.stringify(params));
      }
      else {
        console.log(params);
      }
    }
  }
}
