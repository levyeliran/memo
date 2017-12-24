export class EventStore{
  events: Event[] = [];
  currentEvent: Event;
}
export class Event{
  key:any;
  typeKey:any;
  creatorKey:any;
  typeName:string;
  creatorName:string;
  title:string;
  initials:string; //Y&R for example
  description:string;
  location:any;
  startDate:any;
  endDate:any;
  creationDate:any;
  updateDate:any;
  introPhotoUrl:string;
  numOfParticipates:number;
  status:number;
  isActive:boolean;
  isPassed:boolean;
}
export const EventStatus = {
  own: 1,
  invited: 2,
  rejected: 3,
  joined: 4
};



/////////////////////////////////////////////////////////

export class PhotoStore{
};
export class Photo{
  key:any;
  typeKey:any;
  creatorKey:any;
  creatorName:string;
  creationDate:any;
  fileName:string;
  blob:any;
};
