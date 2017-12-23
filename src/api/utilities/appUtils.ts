export class AppUtils{

  static userKey:String;
  static userName:String;

  static isPassedDate(date, countHour = false) : boolean{
    if(!date){
      return false;
    }
    const now = new Date();
    const d = new Date(date);

    if(!countHour){
      now.setHours(0,0,0,0);
      d.setHours(0,0,0,0);
    }
    return (now.getTime()) - (d.getTime()) > 0;
  }

  static isCurrentDate(date, countHour = false) : boolean{
    if(!date){
      return false;
    }

    const now = new Date();
    const d = new Date(date);

    if(!countHour){
      now.setHours(0,0,0,0);
      d.setHours(0,0,0,0);
    }
    return (now.getTime()) - (d.getTime()) == 0;
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

  static getDateStrFormat(date){
    if(date){
      const d = new Date(date)
        return d.toLocaleDateString();
    }
    return '';
  }

}
