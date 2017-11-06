var myvideo = document.getElementById('video');
var socket = io('/livestream',{transports: ['websocket']});

var TYPE = 'video/webm; codecs="vorbis,vp8"';
window.MediaSource = window.MediaSource || window.WebKitMediaSource;
if (!!!window.MediaSource) {
  alert('MediaSource API is not available');
}

var mediaSource = new MediaSource();

video.src = window.URL.createObjectURL(mediaSource);
$(function() {

  socket.emit('join',{
    roomId : window.DATA_RENDER.roomId,
  },function (ack) {
    console.log('JOIN: Server on recived message: ',ack)
  })

  mediaSource.addEventListener('sourceopen', function(e) {
    console.log('sourceopen');
    var sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
    socket.on('server-broadcast-livestream', function (arrayBuffer) {
      let uInt8Array = new Uint8Array(arrayBuffer)
      var file = new Blob([uInt8Array], {type: 'video/webm; codecs="vp8"'})
      var reader = new FileReader();
      reader.onload = function(e) {
        sourceBuffer.appendBuffer(new Uint8Array(e.target.result));
      };
      reader.readAsArrayBuffer(file);
    })


    mediaSource.addEventListener('webkitsourceended', function(e) {
      console.log('mediaSource readyState: ' + this.readyState);
    }, false);

  });
});
