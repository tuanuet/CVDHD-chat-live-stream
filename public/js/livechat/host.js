const socket = io('/livechat');
function openStream(){
  const config = { audio: true, video: true};
  return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream){
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}
const peer = new Peer({key: 'peerjs', host: 'uet-video-call-peer.herokuapp.com', secure: true,  port:443})
peer.on('open', id =>{
   socket.emit('join',{roomId : window.DATA_RENDER.roomId,idPeer : id},function (ack) {
     console.log('MyId:',id)
   })
 });
openStream().then(stream =>{
  createVideo('localStream',400);
  playStream('localStream',stream)

  socket.on('new-member-join-room',function (idPeer) {
    const call = peer.call(idPeer, stream);
    createVideo(idPeer,400);
    call.on('stream', remoteStream => playStream(idPeer, remoteStream));
  })
});

socket.on('member-quit-room',function (idPeer) {
  removeVideo(idPeer);
})

peer.on('call', call => {
  openStream().then( stream => {
    call.answer(stream);
    createVideo(call.peer,400)
    call.on('stream', (remoteStream) => playStream(call.peer,remoteStream));
  });
});

let createVideo = (id,size) => {
  if(id==='localStream'){
      $('#div-chat').append(`<video id=${id} controls width="${size}" muted></video>`)
  }else{
      $('#div-chat').append(`<video id=${id} controls width="${size}"></video>`)
  }

}
let removeVideo = (id) => {
  $(`#${id}`).remove()
}
