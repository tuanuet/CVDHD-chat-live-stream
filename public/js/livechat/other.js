$(() => {
  const socket = io('/livechat', { transports: ['websocket'] });

  socket.on('DANH_SACH_ONLINE', (arrUserInfo) => {
    $('#div-chat').show();
    console.log(arrUserInfo);
    arrUserInfo.forEach((user) => {
      const { ten, peerId } = user;
      $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });
    socket.on('CO_NGUOI_DUNG_MOI', (user) => {
      const { ten, peerId } = user;
      $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });
    socket.on('AI_DO_NGAT_KET_NOI', (peerId) => {
      $(`#${peerId}`).remove();
    });
    // openStream().then(stream =>playStream('localStream',stream));
  });
  socket.on('DANG_KY_THAT_BAI', () => alert('Vuil long chọn username khac'));

  function openStream() {
    const config = { audio: true, video: true };
    return navigator.mediaDevices.getUserMedia(config);
  }


  function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
  }

  const peer = new Peer({ key: 'peerjs', host: 'uet-video-call-peer.herokuapp.com', secure: true, port: 443 });
  peer.on('open', (id) => {
    $('#my-peer').append(id);
    $('#btnSignUp').click(() => {
      const username = $('#txtUsername').val();
      socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: id });
    });
  });

  // Nguoi goi di
  $('#btnCall').click(() => {
    const id = $('#remoteId').val(); // Lay ra Id nguoi duoc goi
    openStream().then((stream) => {
      playStream('localStream', stream);
      const call = peer.call(id, stream);
      call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
  });
  // Nguoi nhan

  peer.on('call', (call) => {
    openStream().then((stream) => {
      call.answer(stream); // Tra loi bang cach tra lai stream dang call
      playStream('localStream', stream);
      call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
  });


  $('#ulUser').on('click', 'li', function () {
    const id = $(this).attr('id');
    openStream().then((stream) => {
      playStream('localStream', stream);
      const call = peer.call(id, stream);
      call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
  });
});

