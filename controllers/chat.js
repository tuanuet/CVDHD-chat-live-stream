import Room from '../models/Room';
import * as TypeRoom from '../constants/TypeRoom';

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

  //todo: checkdb that user is host ?
  // if host => render livechat/host
  // else render livechat/other
  let isHost = await Room.compareHost(user.id,roomId,TypeRoom.LIVECHAT);

  if(isHost){
      return res.render('livechat/host');
  }
  return res.render('livechat/other');;
};

//===============================================
export const getLiveStream = (req,res) => {
  res.render('livestream');
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

  //todo: checkdb that user is host ?
  // if host => render livechat/host
  // else render livechat/other
  let isHost = await Room.compareHost(user.id,roomId,TypeRoom.LIVESTREAM);

  if(isHost){
      return res.render('livestream/host');
  }
  return res.render('livestream/other');;
};
