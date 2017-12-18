import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class AppLocalStorage {

  constructor(private storage: Storage) { }

  readKey(key:string): Promise<any>{
    return this.storage.get(key);
  }

  readObject(key:any): Promise<any>{

    return this.readKey(key).then(value => {
      return Promise.resolve(JSON.parse(value));
    });



    /*const props = Object.keys(object);
    //count down the number of received Promises and return the filled object via new Promise
    let propCount = props.length;
    for (const prop of props) {
      if (object.hasOwnProperty(prop)) {
         await this.readKey(prop).then((val)=>{
          //check if the value found - and assigned it
          if(val !== null){
            object[prop] = val;
          }
          console.log(prop);
          //decrease the number of async calls to local storage and retrieve the object via Promise
          //propCount--;
          //if(propCount == 0){
          //  return Promise.resolve(object);
          //}
        });
      }
    }
    return Promise.resolve(object);*/
  }

  setKey(key:string, value:any): void{
    this.storage.set(key, value);
  }

  setObject(key:string, object:any): void{
    this.setKey(key, JSON.stringify(object));


    /*const properties = Object.keys(object);
    for (let prop in properties) {
      if (object.hasOwnProperty(prop) && object[prop] != null) {
        this.setKey(prop, object[prop]);
      }
    }*/
  }

  removeKey(key:string): Promise<any>{
    return this.storage.remove(key);
  }

  clearStorage(): Promise<any>{
    return this.storage.clear().then((val)=>{
     return new Promise((resolve)=>{
       resolve(val);
     });
    })
  }
}
