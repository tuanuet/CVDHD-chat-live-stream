'use strict';

var ss = require('socket.io-stream');

module.exports = function (io) {
  io.of('/livestream').on('connection', function (socket) {
    console.log('Event connection: ', socket.id);

    socket.on('join', function (data, cb) {
      socket.join(data.roomId, function (err) {
        if (err) return cb(false);

        socket.roomId = data.roomId;
        return cb(true);
      });
    });
    socket.on('streaming', function (blob) {
      console.log('Event streaming: ', blob);
      // let sockets = io.nsps['/livestream'].connected;
      // for(var i in sockets) {
      //   //don't send the stream back to the initiator
      //   if (sockets[i].id != socket.id){
      //     var socketTo = sockets[i];
      //     console.log(socketTo.id)
      //     ss(socketTo).emit('server-broadcast-livestream',stream,data)
      //   }
      // }
      socket.broadcast.to(socket.roomId).emit('server-broadcast-livestream', blob);
    });
  });
};
//# sourceMappingURL=socketEvent.js.map