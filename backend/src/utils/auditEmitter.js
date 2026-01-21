import { getIO } from '../socket.js';

export const emitAuditEvent = (payload) => {
  const io = getIO();
  io.to('ADMIN_AUDIT_ROOM').emit('audit_event', payload);
};
