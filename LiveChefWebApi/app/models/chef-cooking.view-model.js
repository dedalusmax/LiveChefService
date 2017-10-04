'use strict';

var ChefCookingViewModel = function (data) {
    var self = this;

    // take over the data from the model
    $.extend(self, data);

    var thisStream;


    if (self.stream != undefined) {
        self.thisStream = self.stream;
    }
    $(document).ready(function () {

      //  var leftVideo = document.querySelector('video#leftVideo');
        var rightVideo = document.querySelector('video#rightVideo');

        var self = this;



        if (rightVideo != null) {
            var stream;

            var pc1;
            var pc2;
            var offerOptions = {
                offerToReceiveAudio: 1,
                offerToReceiveVideo: 1
            };

            function maybeCreateStream() {
                if (stream) {
                    return;
                }

                //var constraints = {
                //    audio: false,
                //    video: true
                //};

                //function handleSuccess(stream) {
                //    window.stream = stream; // make stream available to browser console
                //    leftVideo.srcObject = stream;
                //  //  setCookie('stream', JSON.stringify(leftVideo.srcObject));
                //    self.thisStream = leftVideo.srcObject;
                //}

                //function handleError(error) {
                //    console.log('navigator.getUserMedia error: ', error);
                //}

                //navigator.mediaDevices.getUserMedia(constraints).
                //    then(handleSuccess).catch(handleError);


                call();         
            }
            
           maybeCreateStream();           

           function call() {

                var servers = null;
                pc1 = new RTCPeerConnection(servers);
                pc1.onicecandidate = function (e) {
                    onIceCandidate(pc1, e);
                };
                pc2 = new RTCPeerConnection(servers);
                pc2.onicecandidate = function (e) {
                    onIceCandidate(pc2, e);
                };
                pc1.oniceconnectionstatechange = function (e) {
                    onIceStateChange(pc1, e);
                };
                pc2.oniceconnectionstatechange = function (e) {
                    onIceStateChange(pc2, e);
                };

                gotRemoteStream();
                console.log('Added local stream to pc1');

                console.log('pc1 createOffer start');
                pc1.createOffer(onCreateOfferSuccess, onCreateSessionDescriptionError,
                    offerOptions);
            }

            function onCreateSessionDescriptionError(error) {
                console.log('Failed to create session description: ' + error.toString());
            }

            function onCreateOfferSuccess(desc) {

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

            function gotRemoteStream() {
                if (rightVideo.srcObject !== undefined && self.thisStream != undefined) {
                    rightVideo.srcObject = self.thisStream;
                    
                }
            }

            function onCreateAnswerSuccess(desc) {
                pc2.setLocalDescription(desc, function () {
                    onSetLocalSuccess(pc2);
                }, onSetSessionDescriptionError);
                console.log('pc1 setRemoteDescription start');
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
                console.log(getName(pc) + ' ICE candidate: \n' + (event.candidate ?
                    event.candidate.candidate : '(null)'));
            }

            function onAddIceCandidateSuccess(pc) {
                console.log(getName(pc) + ' addIceCandidate success');
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