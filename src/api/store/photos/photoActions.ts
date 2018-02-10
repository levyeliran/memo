export const PhotoActions = {
  //store + crud events
  getEventPhotos: 'getEventPhotos',
  addPhotoToAlbum: 'addPhotoToAlbum',
  tagPhoto: 'tagPhoto',

  //save to FB storage
  savePhotoToStorage: 'savePhotoToStorage',

  /////////////////////////////////////////////////////


  //store + crud events ACK
  photoTagged: 'photoTagged',
  eventPhotoSaved: 'eventPhotoSaved',
  eventPhotosReceived: 'eventPhotosReceived',

  //save to FB storage ACK
  photoUploadedToStorage: 'photoUploadedToStorage',
  photoUploadToStorageFailed: 'photoUploadToStorageFailed'

};
