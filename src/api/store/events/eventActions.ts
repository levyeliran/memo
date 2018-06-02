export const EventActions = {
  //store + crud events
  getEvent:'getEvent',
  getEvents:'getEvents',
  createEvent:'createEvent',
  updateEvent:'updateEvent',
  joinEvent:'joinEvent',
  leaveEvent:'leaveEvent',
  inviteToEvent:'inviteToEvent',
  activateEvent:'activateEvent',
  lockEvent:'lockEvent',

  //ack events
  eventUpdated: 'eventUpdated',
  eventCreated: 'eventCreated',
  eventReceived: 'eventReceived',
  eventsReceived: 'eventsReceived',
  eventsInvitedFriendsReceived: 'eventsInvitedFriendsReceived',
};
