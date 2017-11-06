'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLiveStreamOnline = exports.postCreateLiveStream = exports.getCreateLiveStream = exports.getLiveStream = exports.getLiveChatOnline = exports.postCreateLiveChat = exports.getCreateLiveChat = exports.getLiveChat = undefined;

var _Room = require('../models/Room');

var _Room2 = _interopRequireDefault(_Room);

var _TypeRoom = require('../constants/TypeRoom');

var TypeRoom = _interopRequireWildcard(_TypeRoom);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var getLiveChat = exports.getLiveChat = function getLiveChat(req, res) {
  res.render('livechat');
};

var getCreateLiveChat = exports.getCreateLiveChat = function getCreateLiveChat(req, res) {
  res.render('livechat/create');
};

var postCreateLiveChat = exports.postCreateLiveChat = function postCreateLiveChat(req, res) {
  var newRoom = new _Room2.default({
    name: req.body.roomName,
    description: req.body.roomDescription,
    hostId: req.user.id,
    type: TypeRoom.LIVECHAT
  });
  newRoom.save(function (err, room) {
    if (err) {
      console.log(err.message);
      return;
    }

    res.redirect('/livechat/room/' + room.id);
  });
};

/**
  * Dungf chung cho 2 route người xem va nguoi host
  */
var getLiveChatOnline = exports.getLiveChatOnline = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var roomId, user, isHost;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            roomId = req.params.roomId;
            user = req.user;

            //todo: checkdb that user is host ?
            // if host => render livechat/host
            // else render livechat/other

            _context.next = 4;
            return _Room2.default.compareHost(user.id, roomId, TypeRoom.LIVECHAT);

          case 4:
            isHost = _context.sent;

            if (!isHost) {
              _context.next = 7;
              break;
            }

            return _context.abrupt('return', res.render('livechat/host'));

          case 7:
            return _context.abrupt('return', res.render('livechat/other'));

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function getLiveChatOnline(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

//===============================================
var getLiveStream = exports.getLiveStream = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var io, rooms, keyRooms, promises, data;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            io = req.io;
            rooms = io.of('/livestream').adapter.rooms;
            keyRooms = Object.keys(rooms);
            promises = (0, _lodash2.default)(keyRooms).filter(function (key) {
              return !(0, _lodash2.default)(key).startsWith('/livestream');
            }).map(function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(roomId) {
                var room;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return _Room2.default.findRoomAndUser(roomId);

                      case 2:
                        room = _context2.sent;
                        return _context2.abrupt('return', {
                          roomId: roomId,
                          email: room.hostId.email,
                          roomName: room.name,
                          description: room.description
                        });

                      case 4:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined);
              }));

              return function (_x5) {
                return _ref3.apply(this, arguments);
              };
            }()).value();
            _context3.next = 6;
            return Promise.all(promises);

          case 6:
            data = _context3.sent;


            console.log('room ID:', data);
            res.render('livestream', { data: data });

          case 9:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function getLiveStream(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var getCreateLiveStream = exports.getCreateLiveStream = function getCreateLiveStream(req, res) {
  res.render('livestream/create');
};

var postCreateLiveStream = exports.postCreateLiveStream = function postCreateLiveStream(req, res) {
  var newRoom = new _Room2.default({
    name: req.body.roomName,
    description: req.body.roomDescription,
    hostId: req.user.id,
    type: TypeRoom.LIVESTREAM
  });
  newRoom.save(function (err, room) {
    if (err) {
      console.log(err.message);
      return;
    }

    res.redirect('/livestream/room/' + room.id);
  });
};

/**
  * Dungf chung cho 2 route người xem va nguoi host
  */
var getLiveStreamOnline = exports.getLiveStreamOnline = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var roomId, user, isHost;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            roomId = req.params.roomId;
            user = req.user;

            console.log(user);
            //todo: checkdb that user is host ?
            // if host => render livechat/host
            // else render livechat/other
            _context4.next = 5;
            return _Room2.default.compareHost(user.id, roomId, TypeRoom.LIVESTREAM);

          case 5:
            isHost = _context4.sent;

            if (!isHost) {
              _context4.next = 8;
              break;
            }

            return _context4.abrupt('return', res.render('livestream/host', { roomId: roomId, user: user }));

          case 8:
            return _context4.abrupt('return', res.render('livestream/other', { roomId: roomId, user: user }));

          case 10:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function getLiveStreamOnline(_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();
//# sourceMappingURL=chat.js.map