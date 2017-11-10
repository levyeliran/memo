export class AppUtils{

  static isPassedDate(date, countHour = false) : boolean{
    if(!date){
      return false;
    }
    return (new Date()) - (new Date(date)) > 0;
  }

  static isCurrentDate(date, countHour = false) : boolean{
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

  static isFutureDate(date, countHour = false) : boolean{
    if(!date){
      return false;
    }
    return !this.isPassedDate(date, countHour) && !this.isCurrentDate(date, countHour);
  }

  static getFutureDate(months:number = 0){
    if(months){
      return this.addMonthsDoDate(new Date(), months);
    }
    return new Date();
  }

  static addMonthsDoDate(date, months:number = 0){
    if(!date){
      return date;
    }
    return new Date(date.setMonth(date.getMonth() + months));
  }

}
