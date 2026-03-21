import { io } from 'socket.io-client';

const socket = io('/', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
  timeout: 10000,
});

socket.on('connect', () => {
  console.log('[Socket] Connected');
});

socket.on('disconnect', (reason) => {
  console.log('[Socket] Disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.error('[Socket] Connection Error:', error);
});

export default socket;
