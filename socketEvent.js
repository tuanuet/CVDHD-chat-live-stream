var ss = require('socket.io-stream');

module.exports = (io) => {
  io.of('/livestream').on('connection',(socket) => {
    console.log('Event connection: ',socket.id);

    socket.on('join',(data,cb) => {
      socket.join(data.roomId,(err) => {
        if(err) return cb(false);
        let numberPeople = io.nsps['/livestream'].adapter.rooms[data.roomId].length
        socket.broadcast.to(data.roomId).emit('number-people-in-room',numberPeople)
        socket.roomId = data.roomId;
        return cb(true);
      })

    })
    socket.on('streaming', function(blob) {
      console.log('Event streaming: ',blob);

      socket.broadcast.to(socket.roomId).emit('server-broadcast-livestream',blob)

    });
    socket.on('disconnect',function () {
      let numberPeople = io.nsps['/livestream'].adapter.rooms[socket.roomId].length
      socket.broadcast.to(data.roomId).emit('number-people-in-room',numberPeople)
    })
  });

  io.of('/livechat').on('connection',(socket) => {
    console.log('Event connection: ',socket.id);

    socket.on('join',(data,cb) => {
      socket.idPeer = data.idPeer;
      socket.join(data.roomId,(err) => {
        if(err) return cb(false);
        socket.roomId = data.roomId;
        socket.broadcast.to(socket.roomId).emit('new-member-join-room',data.idPeer)
        return cb(true);
      })

    })
    socket.on('disconnect',() => {
      socket.broadcast.to(socket.roomId).emit('member-quit-room',socket.idPeer)
    })
  });
}
