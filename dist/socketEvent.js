'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var ss = require('socket.io-stream');
var rooms = {};
var fs = require('fs');

module.exports = function (io) {
  io.of('/livestream').on('connection', function (socket) {
    console.log('Event connection: ', socket.id);

    socket.on('join', function (data, cb) {
      socket.join(data.roomId, function (err) {
        if (err) return cb(false);
        var existFolder = fs.existsSync(__dirname + '/uploads/' + data.roomId + '/');
        if (!existFolder) {
          fs.mkdirSync(__dirname + '/uploads/' + data.roomId + '/');
        }
        socket.roomId = data.roomId;
        rooms[data.roomId] = rooms[data.roomId] || {};
        rooms[data.roomId].array = rooms[data.roomId].array || [];
        rooms[data.roomId].count = rooms[data.roomId].count || 0;
        return cb(true);
      });
    });
    socket.on('streaming', function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(buffer) {
        var url;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;

                // console.log(`Streaming_${rooms[socket.roomId].count}: `);
                // console.log(buffer);
                rooms[socket.roomId].socketId = socket.id;

                url = __dirname + '/uploads/' + socket.roomId + '/blob-' + rooms[socket.roomId].count + '.mp4';
                _context.next = 5;
                return writeFileMp4(url, buffer);

              case 5:
                rooms[socket.roomId].count++;

                if (rooms[socket.roomId].array) rooms[socket.roomId].array.push(buffer);

                emitToOther(socket);

                _context.next = 12;
                break;

              case 10:
                _context.prev = 10;
                _context.t0 = _context['catch'](0);

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 10]]);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }()
    // console.log(err.message);
    );

    var emitToOther = function emitToOther(socket) {
      if (rooms[socket.roomId].array.length >= 3) {
        var url = __dirname + '/uploads/' + socket.roomId + '/blob-' + (rooms[socket.roomId].count - 2) + '.mp4';
        var data = fs.readFileSync(url);
        socket.broadcast.to(socket.roomId).emit('server-broadcast-livestream', data);
      }
    };

    var writeFileMp4 = function writeFileMp4(path, buffer) {
      return new Promise(function (resolve, reject) {
        // open the file in writing mode, adding a callback function where we do the actual writing
        fs.open(path, 'w', function (err, fd) {
          if (err) {
            reject(err);
          }
          // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
          fs.write(fd, buffer, 0, buffer.length, null, function (err) {
            if (err) throw 'error writing file: ' + err;
            fs.close(fd, function () {
              console.log('wrote the file successfully');
              resolve(true);
            });
          });
        });
      });
    };

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
};
//# sourceMappingURL=socketEvent.js.map