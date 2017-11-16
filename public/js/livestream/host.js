

$(function() {
    var myvideo = document.getElementById('video');
    // var socket = io('/livestream');
    var socket = io('/livestream');

    var TIMEMAIN = 2000;
    var TIMEPIPELINE = 0.5 * TIMEMAIN;
    var count = 0;


    function mainRecord(stream) {
        var mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.onstart = function(e) {
            this.chunks = [];
        };
        mediaRecorder.ondataavailable = function(e) {
            this.chunks.push(e.data);
        };
        mediaRecorder.onstop = function(e) {
            var blob = new Blob(this.chunks, { 'type' : 'video/webm' });
            socket.emit('streaming', blob);
            mediaRecorder.start();
        };

        mediaRecorder.start();
        // Stop recording after 3 seconds and broadcast it to server
        setInterval(function() {
            mediaRecorder.stop()
        }, TIMEMAIN);
    }


    function pipelineRecord(stream) {
        var mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.onstart = function(e) {
            console.log(this.chunks ? this.chunks.length : 0);
            this.chunks = [];
        };
        mediaRecorder.ondataavailable = function(e) {
            this.chunks.push(e.data);
        };
        mediaRecorder.onstop = function(e) {
            var blob = new Blob(this.chunks, { 'type' : 'video/webm' });
            socket.emit('streaming', blob);
            mediaRecorder.start();
        };


        // Stop recording after 3 seconds and broadcast it to server
        setTimeout(function () {
            mediaRecorder.start();
            setInterval(function() {
                mediaRecorder.stop()
                setTimeout(function () {
                    console.log('do\'nt do nothing')
                },TIMEPIPELINE)
            }, TIMEPIPELINE);
        },TIMEMAIN - 0.5 * TIMEPIPELINE)

    }
    function loadCam(stream) {
        console.log('Load camera success');
        let src = window.URL.createObjectURL(stream);
        myvideo.src = src;

        mainRecord(stream)
        // pipelineRecord(stream)


    }
    function loadCamErr(err) {
        console.log('Load camera failure: ',err);
    }

    socket.emit('join',{
    roomId : window.DATA_RENDER.roomId,
    },function (ack) {
    console.log('JOIN: Server on recived message: ',ack)
    })

    navigator.getUserMedia = (navigator.getUserMedia || navigator.webkirGetUserMedia||
            navigator.mozGetUserMedia || navigator.msgGetUserMedia);
    if(navigator.getUserMedia){
    navigator.getUserMedia({video : true,audio : true},loadCam,loadCamErr)
    }

});
