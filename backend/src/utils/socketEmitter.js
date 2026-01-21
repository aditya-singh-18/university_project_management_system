import { getIO } from '../socket.js';

export const emitNotification = (userKey, payload) => {
  try {
    const io = getIO();
    io.to(userKey).emit('notification', payload);
  } catch (err) {
    console.error('Socket emit failed:', err.message);
  }
};
