import client from './client';

const sendNotification = (userId, message) => client.post('/api/sendNotification', { userId, message });

export default {
  sendNotification,
};
