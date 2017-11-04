/**
 * Created by eli on 04/11/2017.
 */

export class AppUtils{

  static isPassedDate(date:any, countHour = false) : boolean{
    if(!date){
      return false;
    }
    return (new Date()) - (new Date(date)) > 0;
  }

  static isCurrentDate(date:any, countHour = false) : boolean{
    if(!date){
      return false;
    }
    if(countHour){
      return (new Date()) - (new Date(date)) == 0;
    }
    else {
      //remove hours**
      return (new Date()) - (new Date(date)) == 0;
    }

  }

  static isFutureDate(date:any, countHour = false) : boolean{
    if(!date){
      return false;
    }
    return !this.isPassedDate(date, countHour) && !this.isCurrentDate(date, countHour);
  }

  static getFutureDate(months:number = 0): any{
    if(months){
      return this.addMonthsDoDate(new Date(), months);
    }
    return new Date();
  }

  static addMonthsDoDate(date:any, months:number = 0): any{
    if(!date){
      return date;
    }
    return new Date(date.setMonth(date.getMonth() + months));
  }

}
