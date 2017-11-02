var express = require('express');
var router = express.Router();
const chatController = require('../controllers/chat');

// index
router.get('/',chatController.getLiveChat);

// create room livechat
router.route('/create')
  .get(chatController.getCreateLiveChat)
  .post(chatController.postCreateLiveChat);

// view online
router.get('/room/:roomId',chatController.getLiveChatOnline);

module.exports = router;
