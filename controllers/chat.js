import Room from '../models/Room';
import * as TypeRoom from '../constants/TypeRoom';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
var ffmpeg = require('fluent-ffmpeg');
export const getLiveChat = (req,res) => {
  res.render('livechat');
}


export const getCreateLiveChat = (req,res) => {
  res.render('livechat/create')
}

export const postCreateLiveChat = (req,res) => {
  let newRoom = new Room({
    name : req.body.roomName,
    description : req.body.roomDescription,
    hostId : req.user.id,
    type : TypeRoom.LIVECHAT,
  })
  newRoom.save((err,room) => {
    if(err) {
      console.log(err.message)
      return;
    }

    res.redirect(`/livechat/room/${room.id}`);
  })

}


/**
  * Dungf chung cho 2 route người xem va nguoi host
  */
export const getLiveChatOnline = async (req,res) => {
  let roomId = req.params.roomId;
  let user = req.user;

  return res.render('livechat/host',{
    roomId,user
  });

};

//===============================================
export const getLiveStream = async (req,res) => {
  let io = req.io;
  let rooms = io.of('/livestream').adapter.rooms;
  let keyRooms = Object.keys(rooms);
  let promises = _(keyRooms)
      .filter(key => !_(key).startsWith('/livestream'))
      .map(async roomId => {
          let room = await Room.findRoomAndUser(roomId);
          return {
              roomId,
              email: room.hostId.email,
              roomName: room.name,
              description: room.description
          }
      })
      .value();
  let data = await Promise.all(promises);

  console.log('room ID:',data);
  res.render('livestream',{data});
}

export const getCreateLiveStream = (req,res) => {
  res.render('livestream/create')
}


export const postCreateLiveStream = (req,res) => {
  let newRoom = new Room({
    name : req.body.roomName,
    description : req.body.roomDescription,
    hostId : req.user.id,
    type : TypeRoom.LIVESTREAM,
  })
  newRoom.save((err,room) => {
    if(err) {
      console.log(err.message)
      return;
    }

    res.redirect(`/livestream/room/${room.id}`);
  })

}

/**
  * Dungf chung cho 2 route người xem va nguoi host
  */
export const getLiveStreamOnline = async (req,res) => {
  let roomId = req.params.roomId;
  let user = req.user;
  console.log(user);
  //todo: checkdb that user is host ?
  // if host => render livechat/host
  // else render livechat/other
  let isHost = await Room.compareHost(user.id,roomId,TypeRoom.LIVESTREAM);

  if(isHost){
      return res.render('livestream/host',{roomId,user});
  }
  return res.render('livestream/other',{roomId,user});;
};

export const getLiveStreamSegment = async (req,res) => {
  try {
      let io = req.io;
      let roomId = req.params.roomId;
      //todo : find socket have roomId = socket.roomId
      let roomAgent = io.of('/livestream').adapter.rooms[roomId];
      if(!roomAgent) throw new Error('room does not exist');
      let socketIdLiveStream = _.concat([],Object.keys(roomAgent.sockets))[0];
      let socketLiveStream = io.nsps['/livestream'].connected[socketIdLiveStream];
      //todo : get segment by count
      let countSegment = socketLiveStream.countSegment;
      console.log(countSegment);
      //todo : read blob segment pip res
      let pathSegment = path.join(__dirname,`../uploads/${roomId}/blob-${countSegment}.webm`)
      let pathSend = path.join(__dirname,`../encodes/${roomId}/blob-${countSegment}.mp4`)

      ffmpeg(pathSegment)
        .videoCodec('libx264')
        .audioCodec('libmp3lame')
        .on('error', function(err) {
          console.log('An error occurred: ' + err.message);
        })
        .on('end', function() {
          console.log('Processing finished !');
          let segmentStream = fs.createReadStream(pathSend);
          // segmentStream = fs.createBlobReadStream(socketLiveStream.buffers.pop())
          segmentStream.pipe(res);
        })
        .save(pathSend);

      // let segmentStream = fs.createReadStream(pathSend);
      // // segmentStream = fs.createBlobReadStream(socketLiveStream.buffers.pop())
      // segmentStream.pipe(res);

  } catch (err) {
      console.log(err.message);
  }

};
