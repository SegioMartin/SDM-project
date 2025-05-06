import api from './index';

export const getGroups = () => api.get('/groups');
export const getGroupById = (id) => api.get(`/groups/${id}`);
export const createGroup = (data) => api.post('/groups', data);
export const updateGroup = (id, data) => api.patch(`/groups/${id}`, data);
export const deleteGroup = (id) => api.delete(`/groups/${id}`);
