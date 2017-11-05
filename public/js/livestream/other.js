var myvideo = document.getElementById('video');
var socket = io('https://34.207.67.188/',{transports: ['websocket']});

var TYPE = 'video/webm; codecs="vorbis,vp8"';
// video.src = window.URL.createObjectURL(ms);
// var ms = new MediaSource();
$(function() {

  socket.on('connection',function(arg){
    console.log('socket connection!',arg);
  })
  socket.on('disconnect',function(err){
    console.log('socket disconnect',err);
  })
  socket.emit('join',{
    roomId : window.DATA_RENDER.roomId,
  },function (ack) {
    console.log('JOIN: Server on recived message: ',ack)
  })

  ms.addEventListener('sourceopen', function(e) {

    var sourceBuffer = ms.addSourceBuffer(TYPE);

    socket.on('server-broadcast-livestream', function (arrayBuffer) {
      var blob = new Blob([arrayBuffer], { 'type' : TYPE });
      myvideo.src = window.URL.createObjectURL(blob);

    })
  }, false);


});
