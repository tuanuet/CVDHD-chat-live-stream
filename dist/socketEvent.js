'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var ss = require('socket.io-stream');

var fs = require('fs');

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

    socket.on('streaming', function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(buffer) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                try {
                  socket.broadcast.to(socket.roomId).emit('server-broadcast-livestream', buffer);
                } catch (err) {
                  // console.log(err.message);
                }

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  });
};
//# sourceMappingURL=socketEvent.js.map