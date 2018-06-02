export class AppUtils{

  static userKey:string;
  static fullName:string = '';
  static phone:string = '';
  static email:string = '';

  static isPastDate(date, countHour = false) : boolean{
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
    return !this.isPastDate(date, countHour) && !this.isCurrentDate(date, countHour);
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

  static getDateStrFormat(date = null, withHours = false){
    date = date || new Date();
    if(date){
      const d = new Date(date);
      if(withHours){
        return d.toLocaleDateString();
      }
      return d.toLocaleDateString();
    }
    return '';
  }

  static isDateGraterThan(date1 = null, date2 = null){
    if(date1 && date2){
      (new Date(date1)).getTime() > (new Date(date2)).getTime()
    }
    return false;
  }

  static fixPhoneNumber(phone:string =''){
    return phone
      .replace('+','')
      .replace('(','')
      .replace(')', '')
      .replace('-', '')
      .replace(' ', '')
  }

}
