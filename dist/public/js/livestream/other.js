'use strict';

$(function () {

    var myvideo = document.getElementById('video');
    // var socket = io('/livestream');
    var socket = io('wss://34.207.67.188/livechat');

    function loadCam(localStream) {
        console.log('Load camera success');
        socket.on('server-broadcast-livestream', function (blob) {
            myvideo.srcObj = stream;
        });
    }
    function loadCamErr(err) {
        console.log('Load camera failure: ', err);
    }
    socket.emit('join', {
        roomId: window.DATA_RENDER.roomId
    }, function (ack) {
        console.log('JOIN: Server on recived message: ', ack);
    });

    socket.on('server-broadcast-livestream', function (arrayBuffer) {
        var blob = new Blob([arrayBuffer], { 'type': 'video/webm' });
        myvideo.src = window.URL.createObjectURL(blob);
    });
});
//# sourceMappingURL=other.js.map