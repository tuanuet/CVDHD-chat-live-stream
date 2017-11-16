'use strict';

$(function () {
  var socket = io('/livechat', { transports: ['websocket'] });

  socket.on('DANH_SACH_ONLINE', function (arrUserInfo) {
    $('#div-chat').show();
    console.log(arrUserInfo);
    arrUserInfo.forEach(function (user) {
      var ten = user.ten,
          peerId = user.peerId;

      $('#ulUser').append('<li id="' + peerId + '">' + ten + '</li>');
    });
    socket.on('CO_NGUOI_DUNG_MOI', function (user) {
      var ten = user.ten,
          peerId = user.peerId;

      $('#ulUser').append('<li id="' + peerId + '">' + ten + '</li>');
    });
    socket.on('AI_DO_NGAT_KET_NOI', function (peerId) {
      $('#' + peerId).remove();
    });
    // openStream().then(stream =>playStream('localStream',stream));
  });
  socket.on('DANG_KY_THAT_BAI', function () {
    return alert('Vuil long chọn username khac');
  });

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
    $('#my-peer').append(id);
    $('#btnSignUp').click(function () {
      var username = $('#txtUsername').val();
      socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: id });
    });
  });

  // Nguoi goi di
  $('#btnCall').click(function () {
    var id = $('#remoteId').val(); // Lay ra Id nguoi duoc goi
    openStream().then(function (stream) {
      playStream('localStream', stream);
      var call = peer.call(id, stream);
      call.on('stream', function (remoteStream) {
        return playStream('remoteStream', remoteStream);
      });
    });
  });
  // Nguoi nhan

  peer.on('call', function (call) {
    openStream().then(function (stream) {
      call.answer(stream); // Tra loi bang cach tra lai stream dang call
      playStream('localStream', stream);
      call.on('stream', function (remoteStream) {
        return playStream('remoteStream', remoteStream);
      });
    });
  });

  $('#ulUser').on('click', 'li', function () {
    var id = $(this).attr('id');
    openStream().then(function (stream) {
      playStream('localStream', stream);
      var call = peer.call(id, stream);
      call.on('stream', function (remoteStream) {
        return playStream('remoteStream', remoteStream);
      });
    });
  });
});
//# sourceMappingURL=other.js.map