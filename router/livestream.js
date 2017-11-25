var express = require('express');
var router = express.Router();
const chatController = require('../controllers/chat');

router.get('/',chatController.getLiveStream);
// create room livechat
router.route('/create')
  .get(chatController.getCreateLiveStream)
  .post(chatController.postCreateLiveStream);

// view online
router.get('/room/:roomId',chatController.getLiveStreamOnline);


router.get('/room/:roomId/segment',chatController.getLiveStreamSegment);
module.exports = router;
