var ss = require('socket.io-stream');
let rooms = {};
module.exports = (io) => {
  io.on('connection',(socket) => {
    console.log('Event connection: ',socket.id);

    socket.on('join',(data,cb) => {
      socket.join(data.roomId,(err) => {
        if(err) return cb(false);

        socket.roomId = data.roomId;
        rooms[data.roomId] = rooms[data.roomId] || [];
        return cb(true);
      })

    })
    socket.on('streaming', function(blob) {
      if(rooms[socket.roomId])
        rooms[socket.roomId].push(blob);

    });


    setInterval(() => {
      if(socket.roomId ){
        let room = rooms[socket.roomId];
        if(room && room.length >= 3){
          console.log('Event streaming: ',rooms[socket.roomId]);
          socket.broadcast.to(socket.roomId).emit('server-broadcast-livestream',rooms[socket.roomId].pop())
        } else {
          console.log(room.length);
        }


      }
    },2000)
  });
}
