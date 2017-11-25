'use strict';

$(function () {

    var video = document.querySelector('video');

    var assetURL = '/livestream/room/' + window.DATA_RENDER.roomId + '/segment';

    var mimeCodec = 'video/webm; codecs="vp8, vorbis"';

    if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
        var mediaSource = new MediaSource();
        video.src = URL.createObjectURL(mediaSource);
        mediaSource.addEventListener('sourceopen', sourceOpen, false);
    } else {
        console.error('Unsupported MIME type or codec: ', mimeCodec);
    }

    function sourceOpen(_) {
        var mediaSource = this;
        console.log(mediaSource.readyState);
        var sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
        console.log(mediaSource);
        var count = 0;
        sourceBuffer.addEventListener('updateend', function (_) {
            count++;
            console.log(mediaSource.sourceBuffers);
            mediaSource.sourceBuffers[0].timestampOffset = 3 * count;
        }, false);

        fetchAB(assetURL, function (buf) {
            video.play();
            console.log(buf);
            mediaSource.sourceBuffers[0].appendBuffer(buf);
        });
    };

    function fetchAB(url, cb) {
        console.log(url);
        var xhr = new XMLHttpRequest();
        xhr.open('get', url);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () {
            cb(xhr.response);
        };
        xhr.send();
    }
});
//# sourceMappingURL=other.js.map