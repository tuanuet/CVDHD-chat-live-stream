const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name : String,
  description : String,
  hostId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  },
  type : String,
}, { timestamps: true });

roomSchema.statics.compareHost = async function (userId,roomId, type) {
  let room = await this.findById(roomId)
  if(!room)
     return false;
  return room.hostId == userId && room.type === type;
}

const Room = mongoose.model('Room', roomSchema);



module.exports = Room;
