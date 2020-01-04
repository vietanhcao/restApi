import socket from 'socket.io';

let io;

export default {
	init: (httpServer) => {
		io = socket(httpServer);
		return io;
  },
  getIo: () => {
    if(!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io
  }
};
