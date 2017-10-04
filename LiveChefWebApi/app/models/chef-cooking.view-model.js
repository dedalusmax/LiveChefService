'use strict';

var ChefCookingViewModel = function (data) {
    var self = data;

    $(document).ready(function () {

        var leftVideo = document.querySelector('video#leftVideo');
        var rightVideo = document.querySelector('video#rightVideo');

        if (leftVideo != null && rightVideo != null) {
            var stream;

            var pc1;
            var pc2;
            var offerOptions = {
                offerToReceiveAudio: 1,
                offerToReceiveVideo: 1
            };

            var startTime;

            function maybeCreateStream() {
                if (stream) {
                    return;
                }
                if (leftVideo.captureStream) {
                    stream = leftVideo.captureStream();
                    console.log('Captured stream from leftVideo with captureStream',
                        stream);
                    call();
                } else if (leftVideo.mozCaptureStream) {
                    stream = leftVideo.mozCaptureStream();
                    console.log('Captured stream from leftVideo with mozCaptureStream()',
                        stream);
                    call();
                } else {
                    console.log('captureStream() not supported');
                }
            }

            // Video tag capture must be set up after video tracks are enumerated.
            leftVideo.oncanplay = maybeCreateStream;
            if (leftVideo.readyState >= 0) {  // HAVE_FUTURE_DATA
                // Video is already ready to play, call maybeCreateStream in case oncanplay
                // fired before we registered the event handler.
                maybeCreateStream();
            }

            leftVideo.play();

            rightVideo.onloadedmetadata = function () {
                console.log('Remote video videoWidth: ' + this.videoWidth +
                    'px,  videoHeight: ' + this.videoHeight + 'px');
            };

            rightVideo.onresize = function () {
                console.log('Remote video size changed to ' +
                    rightVideo.videoWidth + 'x' + rightVideo.videoHeight);
                // We'll use the first onresize callback as an indication that
                // video has started playing out.
                if (startTime) {
                    var elapsedTime = window.performance.now() - startTime;
                    console.log('Setup time: ' + elapsedTime.toFixed(3) + 'ms');
                    startTime = null;
                }
            };

            function call() {
                console.log('Starting call');
                startTime = window.performance.now();
                var videoTracks = stream.getVideoTracks();
                var audioTracks = stream.getAudioTracks();
                if (videoTracks.length > 0) {
                    console.log('Using video device: ' + videoTracks[0].label);
                }
                if (audioTracks.length > 0) {
                    console.log('Using audio device: ' + audioTracks[0].label);
                }
                var servers = null;
                pc1 = new RTCPeerConnection(servers);
                console.log('Created local peer connection object pc1');
                pc1.onicecandidate = function (e) {
                    onIceCandidate(pc1, e);
                };
                pc2 = new RTCPeerConnection(servers);
                console.log('Created remote peer connection object pc2');
                pc2.onicecandidate = function (e) {
                    onIceCandidate(pc2, e);
                };
                pc1.oniceconnectionstatechange = function (e) {
                    onIceStateChange(pc1, e);
                };
                pc2.oniceconnectionstatechange = function (e) {
                    onIceStateChange(pc2, e);
                };
                pc2.ontrack = gotRemoteStream;

                stream.getTracks().forEach(
                    function (track) {
                        pc1.addTrack(
                            track,
                            stream
                        );
                    }
                );
                console.log('Added local stream to pc1');

                console.log('pc1 createOffer start');
                pc1.createOffer(onCreateOfferSuccess, onCreateSessionDescriptionError,
                    offerOptions);
            }

            function onCreateSessionDescriptionError(error) {
                console.log('Failed to create session description: ' + error.toString());
            }

            function onCreateOfferSuccess(desc) {
                console.log('Offer from pc1\n' + desc.sdp);
                console.log('pc1 setLocalDescription start');
                pc1.setLocalDescription(desc, function () {
                    onSetLocalSuccess(pc1);
                }, onSetSessionDescriptionError);
                console.log('pc2 setRemoteDescription start');
                pc2.setRemoteDescription(desc, function () {
                    onSetRemoteSuccess(pc2);
                }, onSetSessionDescriptionError);
                console.log('pc2 createAnswer start');
                // Since the 'remote' side has no media stream we need
                // to pass in the right constraints in order for it to
                // accept the incoming offer of audio and video.
                pc2.createAnswer(onCreateAnswerSuccess, onCreateSessionDescriptionError);
            }

            function onSetLocalSuccess(pc) {
                console.log(getName(pc) + ' setLocalDescription complete');
            }

            function onSetRemoteSuccess(pc) {
                console.log(getName(pc) + ' setRemoteDescription complete');
            }

            function onSetSessionDescriptionError(error) {
                console.log('Failed to set session description: ' + error.toString());
            }

            function gotRemoteStream(event) {
                if (rightVideo.srcObject !== event.streams[0]) {
                    rightVideo.srcObject = event.streams[0];
                    console.log('pc2 received remote stream', event);
                }
            }

            function onCreateAnswerSuccess(desc) {
                cosnole.log('Answer from pc2:\n' + desc.sdp);
                cosnole.log('pc2 setLocalDescription start');
                pc2.setLocalDescription(desc, function () {
                    onSetLocalSuccess(pc2);
                }, onSetSessionDescriptionError);
                cosnole.log('pc1 setRemoteDescription start');
                pc1.setRemoteDescription(desc, function () {
                    onSetRemoteSuccess(pc1);
                }, onSetSessionDescriptionError);
            }

            function onIceCandidate(pc, event) {
                getOtherPc(pc).addIceCandidate(event.candidate)
                    .then(
                    function () {
                        onAddIceCandidateSuccess(pc);
                    },
                    function (err) {
                        onAddIceCandidateError(pc, err);
                    }
                    );
                cosnole.log(getName(pc) + ' ICE candidate: \n' + (event.candidate ?
                    event.candidate.candidate : '(null)'));
            }

            function onAddIceCandidateSuccess(pc) {
                cosnole.log(getName(pc) + ' addIceCandidate success');
            }

            function onAddIceCandidateError(pc, error) {
                console.log(getName(pc) + ' failed to add ICE Candidate: ' + error.toString());
            }

            function onIceStateChange(pc, event) {
                if (pc) {
                    console.log(getName(pc) + ' ICE state: ' + pc.iceConnectionState);
                    console.log('ICE state change event: ', event);
                }
            }

            function getName(pc) {
                return (pc === pc1) ? 'pc1' : 'pc2';
            }

            function getOtherPc(pc) {
                return (pc === pc1) ? pc2 : pc1;
            }
        }
    });
}