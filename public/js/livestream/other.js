

$(function() {

    var video = document.querySelector('video');

    // var assetURL = '/livestream/room/'+window.DATA_RENDER.roomId+'/segment';
    var assetURL = '/'+window.DATA_RENDER.roomId+'/blob-125.mp4';

    // var assetURL = 'http://nickdesaulniers.github.io/netfix/demo/frag_bunny.mp4'
    // var mimeCodec = 'video/webm; codecs="vp8, vorbis"';
    var mimeCodec = 'video/mp4; codecs="avc1.64001E, mp4a.40.2"';

    if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
        var mediaSource = new MediaSource;
        video.src = URL.createObjectURL(mediaSource);
        mediaSource.addEventListener('sourceopen', sourceOpen, false);
    } else {
        console.error('Unsupported MIME type or codec: ', mimeCodec);
    }

    function sourceOpen (_) {
        let mediaSource = this;

        var sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
        var count = 0;
        sourceBuffer.addEventListener('updateend', function (_) {
            count++;
            console.log(mediaSource);
            sourceBuffer.timestampOffset = 3*count;
        },false);

        fetchAB(assetURL, function (buf) {
            video.play();
            console.log(sourceBuffer);
            sourceBuffer.appendBuffer(buf);
            console.log(sourceBuffer);
        });
    };

    function fetchAB (url, cb) {
        console.log(url);
        var xhr = new XMLHttpRequest;
        xhr.open('get', url);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () {
            cb(xhr.response);
        };
        xhr.send();
    }
});
