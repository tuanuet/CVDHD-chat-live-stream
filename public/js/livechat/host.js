/** CONFIG **/
var SIGNALING_SERVER = "/";
var USE_AUDIO = true;
var USE_VIDEO = true;
var DEFAULT_CHANNEL = 'some-global-channel-name';
var MUTE_AUDIO_BY_DEFAULT = false;

/** You should probably use a different stun server doing commercial stuff **/
/** Also see: https://gist.github.com/zziuni/3741933 **/
var ICE_SERVERS = [
    {url:"stun:stun.l.google.com:19302"}
];



/***********************/
/** Local media stuff **/
/***********************/
function setup_local_media(callback, errorback) {
    if (local_media_stream != null) {  /* ie, if we've already been initialized */
        if (callback) callback();
        return;
    }
    /* Ask user for permission to use the computers microphone and/or camera,
     * attach it to an <audio> or <video> tag if they give us access. */
    console.log("Requesting access to local audio / video inputs");


    navigator.getUserMedia = ( navigator.getUserMedia ||
           navigator.webkitGetUserMedia ||
           navigator.mozGetUserMedia ||
           navigator.msGetUserMedia);

    var attachMediaStream = function(element, stream) {
        console.log('DEPRECATED, attachMediaStream will soon be removed.');
        element.srcObject = stream;
     };

    navigator.getUserMedia({"audio":USE_AUDIO, "video":USE_VIDEO},
        function(stream) { /* user accepted access to a/v */
            console.log("Access granted to audio/video");
            local_media_stream = stream;
            var local_media = USE_VIDEO ? $("<video>") : $("<audio>");
            local_media.attr("autoplay", "autoplay");
            local_media.attr("muted", "true"); /* always mute ourselves by default */
            local_media.attr("controls", "");
            $('#video').append(local_media);
            attachMediaStream(local_media[0], stream);

            if (callback) callback();
        },
        function() { /* user denied access to a/v */
            console.log("Access denied for audio/video");
            alert("You chose not to provide access to the camera/microphone, demo will not work.");
            if (errorback) errorback();
        });
}
setup_local_media(function() {
    /* once the user has given us access to their
     * microphone/camcorder, join the channel and start peering up */
    //join_chat_channel(DEFAULT_CHANNEL, {'whatever-you-want-here': 'stuff'});
});
