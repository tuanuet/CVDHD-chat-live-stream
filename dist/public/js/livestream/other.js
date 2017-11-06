'use strict';

var video = document.getElementById('video');
var socket = io('/livestream', { transports: ['websocket'] });

var TYPE = 'video/webm; codecs="vorbis,vp8"';

$(function () {

  socket.emit('join', {
    roomId: window.DATA_RENDER.roomId
  }, function (ack) {
    console.log('JOIN: Server on recived message: ', ack);
  });

  socket.on('server-broadcast-livestream', function (arrayBuffer) {
    video.src = window.URL.createObjectURL(new Blob([arrayBuffer], { type: TYPE }));
  });
});
//# sourceMappingURL=other.js.map