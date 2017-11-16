const ss = require('socket.io-stream');


const fs = require('fs');

module.exports = (io) => {
  io.of('/livestream').on('connection', (socket) => {
    console.log('Event connection: ', socket.id);

    socket.on('join', (data, cb) => {
      socket.join(data.roomId, (err) => {
        if (err) return cb(false);
        socket.roomId = data.roomId;

        return cb(true);
      });
    });

    socket.on('streaming', async (buffer) => {
      try {
        socket.broadcast.to(socket.roomId).emit('server-broadcast-livestream', buffer);
      } catch (err) {
        // console.log(err.message);
      }
    });
  });
};
