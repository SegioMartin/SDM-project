import api from './index';

export const getAttachmentsByCourse = (courseId) => api.get(`/attachments?course_id=${courseId}`);
export const getAttachmentsByTask = (taskId) => api.get(`/attachments?task_id=${taskId}`);
export const createAttachment = (data) => api.post('/attachments', data);
export const updateAttachment = (id, data) => api.patch(`/attachments/${id}`, data);
export const deleteAttachment = (id) => api.delete(`/attachments/${id}`);
