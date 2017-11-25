'use strict';

var socket = io('/livechat');
function openStream() {
  var config = { audio: true, video: true };
  return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
  var video = document.getElementById(idVideoTag);
  video.srcObject = stream;
  video.play();
}
var peer = new Peer({ key: 'peerjs', host: 'uet-video-call-peer.herokuapp.com', secure: true, port: 443 });
peer.on('open', function (id) {
  socket.emit('join', { roomId: window.DATA_RENDER.roomId, idPeer: id }, function (ack) {
    console.log('MyId:', id);
  });
});
openStream().then(function (stream) {
  createVideo('localStream', 400);
  playStream('localStream', stream);

  socket.on('new-member-join-room', function (idPeer) {
    var call = peer.call(idPeer, stream);
    createVideo(idPeer, 200);
    call.on('stream', function (remoteStream) {
      return playStream(idPeer, remoteStream);
    });
  });
});

socket.on('member-quit-room', function (idPeer) {
  removeVideo(idPeer);
});

peer.on('call', function (call) {
  openStream().then(function (stream) {
    call.answer(stream);
    createVideo(call.peer, 200);
    call.on('stream', function (remoteStream) {
      return playStream(call.peer, remoteStream);
    });
  });
});

var createVideo = function createVideo(id, size) {
  $('#div-chat').append('<video id=' + id + ' controls width="' + size + '"></video>');
};
var removeVideo = function removeVideo(id) {
  $('#' + id).remove();
};
//# sourceMappingURL=host.js.map