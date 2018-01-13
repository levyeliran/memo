import {Injectable} from '@angular/core';
import {AndroidPermissions} from "@ionic-native/android-permissions";


@Injectable()
export class AppPermission {
  constructor(private androidPermissions: AndroidPermissions) {
  }

  getPermission(permissionType: string): Promise<any> {
    const permission = this.androidPermissions.PERMISSION[permissionType];
    return this.androidPermissions.checkPermission(permission).then(
      result => {
        console.log(`Has ${permissionType} permission?`, result.hasPermission);
        return Promise.resolve(true);
      },
      err => {
        //this.androidPermissions.PERMISSION.CAMERA
        return this.androidPermissions.requestPermission(permission).then( result =>{
          console.log(`After Request - Has ${permissionType} permission?`, result.hasPermission);
          return Promise.resolve(true);
        }, err => {
          return Promise.reject(false);
        });
      });
  }

}
