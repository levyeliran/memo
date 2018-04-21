export class HeaderButton {
  disabled:boolean = false;
  onClick:any;
  iconName:string;
  constructor(iconName:string,onClick:any, disabled?:boolean){
    this.iconName = iconName;
    this.onClick = onClick;
    this.disabled = disabled;
  }
}

//////////////////////////////////////////////////////////
export class EventStore{
  events: Event[] = [];
  currentEvent: Event;
}
export class EventParticipant{
  id:string;
  name:string;
  phone:string;
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
  isPast:boolean;
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
  key:string;
  photosCount: number;
  tagsCount: number;
  requiredStatus: boolean;
  lastCreationDate: any;

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
  emojiTagKey:string;
  creatorKey:string;
  creatorName:string;
}
export class Photo{
  key:any;
  eventKey:any;
  creatorKey:any;
  creatorName:string;
  creationDate:any;
  fileName:string;
  width:number;
  height:number;
  size:number;
  fileURL:string;
  fileThumbnailURL:string;
  storageMetadata:any;
  tagsMetaData:PhotoTagsMetaData;
  myEmojiTagKey:string;
  isNewTag:boolean;
  base64ImageData:string;
  photoImage:any;
}

//consts
export const emojiMepper = {
  like:{
    title: "Like",
    iconClass: ""
  },
  tearsOfJoy:{
    title: "Tears Of Joy",
    iconClass: ""
  },
  blowingAKiss:{
    title: "Blowing A Kiss",
    iconClass: ""
  },
  heartEyes:{
    title: "Heart Eyes",
    iconClass: ""
  },
  crazy:{
    title: "Crazy",
    iconClass: ""
  },
  shushing:{
    title: "Shushing",
    iconClass: ""
  },
  winking:{
    title:  "Winking",
    iconClass: ""
  },
  sunglasses:{
    title: "Sunglasses",
    iconClass: ""
  },
  grimacing:{
    title: "Grimacing",
    iconClass: ""
  },
  angry:{
    title: "Angry",
    iconClass: ""
  },
  dizzy:{
    title: "Dizzy",
    iconClass: ""
  },
  sleeping:{
    title: "Sleeping",
    iconClass: ""
  },
  smilingWithHorns:{
    title: "Smiling With Horns",
    iconClass: ""
  },
  pileOfPoo:{
    title: "Pile Of Poo",
    iconClass: ""
  }
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
