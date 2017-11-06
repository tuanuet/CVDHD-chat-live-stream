var ss = require('socket.io-stream');
let rooms = {};
const fs = require('fs');

module.exports = (io) => {
  io.of('/livestream').on('connection',(socket) => {
    console.log('Event connection: ',socket.id);

    socket.on('join',(data,cb) => {
      socket.join(data.roomId,(err) => {
        if(err) return cb(false);
        let existFolder = fs.existsSync(`${__dirname}/uploads/${data.roomId}/`);
        if(!existFolder) {
          fs.mkdirSync(`${__dirname}/uploads/${data.roomId}/`)
        }
        socket.roomId = data.roomId;
        rooms[data.roomId] = rooms[data.roomId] || {};
        rooms[data.roomId].array = rooms[data.roomId].array || [];
        rooms[data.roomId].count = rooms[data.roomId].count || 0;
        return cb(true);
      })

    })
    socket.on('streaming',async function(buffer) {
      try{
        // console.log(`Streaming_${rooms[socket.roomId].count}: `);
        // console.log(buffer);
        rooms[socket.roomId].socketId = socket.id;

        let url = `${__dirname}/uploads/${socket.roomId}/blob-${rooms[socket.roomId].count}.mp4`;
        await writeFileMp4(url,buffer);
        rooms[socket.roomId].count++;

        if(rooms[socket.roomId].array)
          rooms[socket.roomId].array.push(buffer);

        emitToOther(socket);

      } catch (err) {
        // console.log(err.message);
      }
    });

    let emitToOther = (socket) => {
      if(rooms[socket.roomId].array.length >= 3){
        let url = `${__dirname}/uploads/${socket.roomId}/blob-${rooms[socket.roomId].count - 2}.mp4`;
        let data = fs.readFileSync(url);
        socket.broadcast.to(socket.roomId).emit('server-broadcast-livestream',data)
      }
    }

    let writeFileMp4 = (path,buffer) => new Promise((resolve,reject) => {
      // open the file in writing mode, adding a callback function where we do the actual writing
      fs.open(path, 'w', function(err, fd) {
          if (err) {
              reject(err)
          }
          // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
          fs.write(fd, buffer, 0, buffer.length, null, function(err) {
              if (err) throw 'error writing file: ' + err;
              fs.close(fd, function() {
                  console.log('wrote the file successfully');
                  resolve(true);
              });
          });
      });
    })

    // setInterval(() => {
    //   try {
    //     Object.keys(rooms).map(roomId => {
    //       console.log('RoomId:',roomId);
    //       let room = rooms[roomId];
    //       if(room && room.array.length >= 3){
    //         let socketInRooms = io.of('/livestream').adapter.rooms[roomId];
    //         // console.log('socket in room:',socketInRooms);
    //
    //         let path = `${__dirname}/uploads/${roomId}/blob-${room.count - 2}.mp4`;
    //         let data = fs.readFileSync(path);
    //         if(room.socketId){
    //             console.log(room.socketId);
    //             let host = io.nsps['/livestream'].connected[room.socketId];
    //             host.broadcast.to(room.roomId).emit('server-broadcast-livestream',data)
    //         }
    //       }
    //     })
    //   } catch (err) {
    //     console.log(err);
    //   }},2000)
  });
}
