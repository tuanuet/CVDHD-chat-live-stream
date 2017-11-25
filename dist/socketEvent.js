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
        try {
          var pathDirectory = __dirname + '/uploads/' + data.roomId + '/';
          var existFolder = fs.existsSync(pathDirectory);
          if (!existFolder) {
            fs.mkdirSync(pathDirectory);
          }
          var countSegment = fs.readdirSync(pathDirectory).length;
          socket.buffers = [];
          socket.roomId = data.roomId;
          socket.countSegment = countSegment;
          return cb(true);
        } catch (err) {
          return cb(false);
        }
      });
    });
    socket.on('streaming', function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(blob) {
        var url;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;

                if (!(!socket.roomId && !socket.countSegment)) {
                  _context.next = 3;
                  break;
                }

                throw new Error('socket not join room');

              case 3:
                url = __dirname + '/uploads/' + socket.roomId + '/blob-' + ++socket.countSegment + '.webm';

                socket.buffers.push(blob);
                _context.next = 7;
                return writeFileMp4(url, blob);

              case 7:
                _context.next = 12;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context['catch'](0);

                console.log(_context.t0.message);

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined, [[0, 9]]);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());

    var writeFileMp4 = function writeFileMp4(path, buffer) {
      return new Promise(function (resolve, reject) {
        // open the file in writing mode, adding a callback function where we do the actual writing
        fs.open(path, 'w', function (err, fd) {
          if (err) reject(err);
          // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
          fs.write(fd, buffer, 0, buffer.length, null, function (err) {
            if (err) throw 'error writing file: ' + err;
            fs.close(fd, function () {
              resolve(true);
            });
          });
        });
      });
    };

    io.of('/livechat').on('connection', function (socket) {
      socket.on('join', function (data, cb) {
        socket.idPeer = data.idPeer;
        socket.join(data.roomId, function (err) {
          if (err) return cb(false);
          socket.roomId = data.roomId;
          socket.broadcast.to(socket.roomId).emit('new-member-join-room', data.idPeer);
          return cb(true);
        });
      });
      socket.on('disconnect', function () {
        socket.broadcast.to(socket.roomId).emit('member-quit-room', socket.idPeer);
      });
    });
  });
};
//# sourceMappingURL=socketEvent.js.map