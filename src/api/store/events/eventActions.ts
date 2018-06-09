export const EventActions = {
  //store + crud events
  getEvent:'getEvent',
  getEventTypes:'getEventTypes',
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
  eventTypesReceived: 'eventTypesReceived',
  eventsReceived: 'eventsReceived',
  eventsInvitedFriendsReceived: 'eventsInvitedFriendsReceived',
};
