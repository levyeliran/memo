export class EventStore{
  events: Event[] = [];
  currentEvent: Event;
};

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
  introPicUrl:string;
  numOfParticipates:number;
  isActive:boolean;
};
