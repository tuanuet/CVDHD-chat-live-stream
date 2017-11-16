import Room from '../models/Room';
import * as TypeRoom from '../constants/TypeRoom';
import _ from 'lodash';

export const getLiveChat = (req, res) => {
  res.render('livechat');
};


export const getCreateLiveChat = (req, res) => {
  res.render('livechat/create');
};

export const postCreateLiveChat = (req, res) => {
  const newRoom = new Room({
    name: req.body.roomName,
    description: req.body.roomDescription,
    hostId: req.user.id,
    type: TypeRoom.LIVECHAT,
  });
  newRoom.save((err, room) => {
    if (err) {
      console.log(err.message);
      return;
    }

    res.redirect(`/livechat/room/${room.id}`);
  });
};


/**
  * Dungf chung cho 2 route người xem va nguoi host
  */
export const getLiveChatOnline = async (req, res) => {
  const roomId = req.params.roomId;
  const user = req.user;

  return res.render('livechat/other');
};

//= ==============================================
export const getLiveStream = async (req, res) => {
  const io = req.io;
  const rooms = io.of('/livestream').adapter.rooms;
  const keyRooms = Object.keys(rooms);
  const promises = _(keyRooms)
    .filter(key => !_(key).startsWith('/livestream'))
    .map(async (roomId) => {
      const room = await Room.findRoomAndUser(roomId);
      return {
        roomId,
        email: room.hostId.email,
        roomName: room.name,
        description: room.description
      };
    })
    .value();
  const data = await Promise.all(promises);

  console.log('room ID:', data);
  res.render('livestream', { data });
};


export const getCreateLiveStream = (req, res) => {
  res.render('livestream/create');
};


export const postCreateLiveStream = (req, res) => {
  const newRoom = new Room({
    name: req.body.roomName,
    description: req.body.roomDescription,
    hostId: req.user.id,
    type: TypeRoom.LIVESTREAM,
  });
  newRoom.save((err, room) => {
    if (err) {
      console.log(err.message);
      return;
    }

    res.redirect(`/livestream/room/${room.id}`);
  });
};

/**
  * Dungf chung cho 2 route người xem va nguoi host
  */
export const getLiveStreamOnline = async (req, res) => {
  const roomId = req.params.roomId;
  const user = req.user;
  console.log(user);
  // todo: checkdb that user is host ?
  // if host => render livechat/host
  // else render livechat/other
  const isHost = await Room.compareHost(user.id, roomId, TypeRoom.LIVESTREAM);

  if (isHost) {
    return res.render('livestream/host', { roomId, user });
  }
  return res.render('livestream/other', { roomId, user });
};
