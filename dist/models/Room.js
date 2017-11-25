'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var roomSchema = new mongoose.Schema({
  name: String,
  description: String,
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: String
}, { timestamps: true });

roomSchema.statics.compareHost = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(userId, roomId, type) {
    var room;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return this.findById(roomId);

          case 2:
            room = _context.sent;

            if (room) {
              _context.next = 5;
              break;
            }

            return _context.abrupt('return', false);

          case 5:
            return _context.abrupt('return', room.hostId == userId && room.type === type);

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

roomSchema.statics.findRoomAndUser = function (roomId) {
  return this.findById(roomId).populate('hostId');
};

var Room = mongoose.model('Room', roomSchema);
module.exports = Room;
//# sourceMappingURL=Room.js.map