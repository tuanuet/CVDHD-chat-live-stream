'use strict';

module.exports = function (io) {
  io.of('/livechat').on('connection', function (socket) {
    console.log('Event connection: ', socket.id);

    socket.on('join', function (data, cb) {
      socket.join(data.roomId, function (err) {
        if (err) return cb(false);

        socket.roomId = data.roomId;
        socket.broadcast.to(data.roomId).emit('server-broadcast-livechat', data);

        return cb(true);
      });
    });
  });
};
//# sourceMappingURL=livechat.socket.js.map