var ss = require('socket.io-stream');
let rooms = {};
const fs = require('fs');

module.exports = (io) => {
  io.of('/livechat').on('connection',(socket) => {
    console.log('Event connection: ',socket.id);

    socket.on('join',(data,cb) => {
      socket.join(data.roomId,(err) => {
        if(err) return cb(false);

        socket.roomId = data.roomId;
        socket.broadcast.to(data.roomId).emit('server-broadcast-livechat',data)
        
        return cb(true);
      })

    })
  });
}
