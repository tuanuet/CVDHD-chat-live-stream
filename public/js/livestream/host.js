$(() => {
  const myvideo = document.getElementById('video');
  const socket = io('/livestream', { transports: ['websocket'] });

  const TIMEMAIN = 2000;
  const TIMEPIPELINE = 0.5 * TIMEMAIN;
  const count = 0;

  function mainRecord(stream) {
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.onstart = function (e) {
      this.chunks = [];
    };
    mediaRecorder.ondataavailable = function (e) {
      this.chunks.push(e.data);
    };
    mediaRecorder.onstop = function (e) {
      const blob = new Blob(this.chunks, { type: 'video/webm' });
      socket.emit('streaming', blob);
      mediaRecorder.start();
    };

    mediaRecorder.start();
    // Stop recording after 3 seconds and broadcast it to server
    setInterval(() => {
      mediaRecorder.stop();
    }, TIMEMAIN);
  }

  const TYPE = 'video/webm; codecs="vorbis,vp8"';
  function pipelineRecord(stream) {
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.onstart = function (e) {
      this.chunks = [];
    };
    mediaRecorder.ondataavailable = function (e) {
      this.chunks.push(e.data);
    };
    mediaRecorder.onstop = function (e) {
      const blob = new Blob(this.chunks, { type: TYPE });
      socket.emit('streaming', blob);
      mediaRecorder.start();
    };


    // Stop recording after 3 seconds and broadcast it to server
    setTimeout(() => {
      mediaRecorder.start();
      setInterval(() => {
        mediaRecorder.stop();
        setTimeout(() => {
          console.log('do\'nt do nothing');
        }, TIMEPIPELINE);
      }, TIMEPIPELINE);
    }, TIMEMAIN - 0.5 * TIMEPIPELINE);
  }
  function loadCam(stream) {
    console.log('Load camera success');
    const src = window.URL.createObjectURL(stream);
    myvideo.src = src;

    mainRecord(stream);
    // pipelineRecord(stream)
  }
  function loadCamErr(err) {
    console.log('Load camera failure: ', err);
  }
  socket.emit('join', {
    roomId: window.DATA_RENDER.roomId,
  }, (ack) => {
    console.log('JOIN: Server on recived message: ', ack);
  });

  navigator.getUserMedia = (navigator.getUserMedia || navigator.webkirGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msgGetUserMedia);
  if (navigator.getUserMedia) {
    navigator.getUserMedia({ video: true, audio: true }, loadCam, loadCamErr);
  }
});
