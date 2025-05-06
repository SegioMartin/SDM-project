import api from './index';

export const getEvents = () => api.get('/events');
export const getEventById = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post('/events', data);
export const updateEvent = (id, data) => api.patch(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);