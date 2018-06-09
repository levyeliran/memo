export class HeaderButton {
  disabled:boolean = false;
  onClick:any;
  iconName:string;
  constructor(iconName:string,onClick:any, disabled?:boolean){
    this.iconName = iconName;
    this.onClick = onClick;
    this.disabled = disabled;
  }

  changeIcon(iconName:string){
    this.iconName = iconName;
  }

  changeStatus(isDisable:boolean){
    this.disabled = isDisable;
  }
}

//////////////////////////////////////////////////////////
export class EventStore{
  events: Event[] = [];
  eventTypes: EventType[] = [];
  currentEvent: Event;
}
export class EventParticipant{
  id:string;
  name:string;
  phone:string;
  isVip:boolean;
  isSelected:boolean;
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
  location:EventLocation;
  startDate:any;
  startDateStr:string;
  endDate:any;
  creationDate:any;
  updateDate:any;
  introPhotoURL:string;
  defaultIntroPhotoURL:string;
  participatesDetails:EventParticipant[];
  status:number;
  isActive:boolean;
  hasAnimation:boolean;
  isVipUser:boolean;
  isPast:boolean;
}
export class EventType{
  key:any;
  description:string;
}
export class EventLocation{
  key:string;
  placeId: string;
  placeDescription: string;
  reference: string;
  terms: any[];
  types: any[];
  place: string;
  lng:number;
  lat:number;
  address:any;
}

//consts
export const EventStatus = {
  own: 1,
  invited: 2,
  rejected: 3,
  joined: 4
};


/////////////////////////////////////////////////////////
export class AnimationStore{
  animation: EventAnimation;
}
export class EventAnimation{
  eventKey:string;
  event:Event;
  photos:Photo[];
  photosCount: number = 0;
  PhotoWithMinTagsCount: number = 0;
  creationDate: any;
}

/////////////////////////////////////////////////////////

export class PhotoStore{
  photos:Photo[] = [];
  photosTags: PhotoTagsMetaData[] = [];
}
export class PhotoTagsMetaData {
  photoKey:string;
  emojiTags:EmojiTagData[] = [];
}
export class EmojiTagData {
  eventKey:string;
  photoKey:string;
  emojiTagKey:string;
  emojiTagCategoryKey:string;
  isVipUser:boolean;
  creatorKey:string;
  creatorName:string;
  creationDate:string;
}
export class Photo{
  key:any;
  eventKey:any;
  creatorKey:any;
  creatorName:string;
  isVipUser:boolean;
  creationDate:any;
  fileName:string;
  width:number;
  height:number;
  size:number;
  fileURL:string;
  fileThumbnailURL:string;
  storageMetadata:any;
  selectedEffects:any;
  tagsMetaData:PhotoTagsMetaData;
  myEmojiTagKey:string;
  isNewTag:boolean;
  base64ImageData:string;
  photoImage:any;
}

//consts
export const emojiCategories = {
  love: 1,
  sweet: 2,
  fun: 3,
  party: 4,
  sad: 5,
  touching: 6,
  wow: 7,
  shock:8,
  bad: 9
};

//////////////////////////////////////////////////////////

export class ProfileStore{
  profile: UserProfile;
}
export class UserProfile {
  key:string;
  fullName:string;
  phone:string;
  email:string;
  password:string;
  creationDate:any;
}


/////////////////////////////////////////////////////////
export class AppSettingsStore{
  settings: AppSettings;
}
export class AppSettings{
  key:string;
  userKey:string;
  saveFilesToDevice:boolean;
  scheduleAnimationHourly:boolean;
  acceptNotifications:boolean;
  creationDate:any;
}
