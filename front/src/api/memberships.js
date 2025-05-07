import api from './index';

export const getAllMemberships = () => api.get('/memberships');
export const createMembership = (data) => api.post('/memberships', data);
export const getMembershipByUserAndGroup = (userId, groupId) => api.get(`/users/${userId}/memberships/${groupId}`);
export const updateMembership = (userId, groupId, data) => api.patch(`/users/${userId}/memberships/${groupId}`, data);
export const deleteMembership = (userId, groupId) => api.delete(`/users/${userId}/memberships/${groupId}`);
