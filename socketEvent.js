var ss = require('socket.io-stream');
import fs from 'fs';
import path from 'path';
var ffmpeg = require('fluent-ffmpeg');
module.exports = (io) => {
  io.of('/livestream').on('connection',(socket) => {
    console.log('Event connection: ',socket.id);

    socket.on('join',(data,cb) => {
      socket.join(data.roomId,(err) => {
        if(err) return cb(false);
        try{
            let pathDirectory = `${__dirname}/uploads/${data.roomId}/`
            let pathEncode = `${__dirname}/encodes/${data.roomId}/`
            let existFolder = fs.existsSync(pathDirectory);
            let existFolderEncode = fs.existsSync(pathEncode);
            if(!existFolder) {
                fs.mkdirSync(pathDirectory);
            }

            if(!existFolderEncode) {
                fs.mkdirSync(pathEncode);
            }

            let countSegment = fs.readdirSync(pathDirectory).length;
            socket.buffers = [];
            socket.roomId = data.roomId;
            socket.countSegment = countSegment;
            return cb(true);
        } catch (err) {
            return cb(false);
        }

      })
    })

    socket.on('streaming', async (blob) => {
      try{
        if(!socket.roomId && !socket.countSegment) throw new Error('socket not join room')
        let countSegment = ++socket.countSegment;
        let pathSegment = path.join(__dirname,`/uploads/${socket.roomId}/blob-${countSegment}.webm`);
        let pathSend = path.join(__dirname,`/encodes/${socket.roomId}/blob-${countSegment}.mp4`)

        socket.buffers.push(blob);
        await writeFileMp4(pathSegment,blob);
        // TODO: emit data ??

        ffmpeg(pathSegment)
          .videoCodec('libx264')
          .audioCodec('libmp3lame')
          .size('320x240')
          .on('error', function(err) {
            console.log('An error occurred: ' + err.message);
          })
          .on('end', function() {
            console.log('Processing finished !');
            let data = fs.readFileSync(pathSend);
            socket.broadcast.to(socket.roomId).emit('server-broadcast-livestream',data)
          })
          .save(pathSend);


        //=================

      } catch ( err ) {
        console.log(err.message);
      }
    });

    let writeFileMp4 = (path,buffer) => new Promise((resolve,reject) => {
      // open the file in writing mode, adding a callback function where we do the actual writing
      fs.open(path, 'w', function(err, fd) {
          if (err) reject(err)
          // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
          fs.write(fd, buffer, 0, buffer.length, null, function(err) {
              if (err) throw 'error writing file: ' + err;
              fs.close(fd, function() {
                  resolve(true);
              });
          });
      });
    });
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
