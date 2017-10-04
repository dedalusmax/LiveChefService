var CookingPresenterViewModel = function (data) {
    var self = data;

    self.selectedAudioInput = null;
    self.selectedAudioOutput = null;
    self.selectedVideoInput = null;

    if (self.settings.useMicrophone || self.settings.useCamera) {
        self.selectedAudioInput = JSON.parse(getCookie('audioInput'));
        self.selectedAudioOutput = JSON.parse(getCookie('audioOutput'));
        self.selectedVideoInput = JSON.parse(getCookie('videoInput'));
    }

    self.stream = null;
    self.connection = null;

    self.giveUp = function () {

        self.stopStream();

        root.hub.server.abortCooking(self.id).done(function () {
            console.log("Cooking aborted: " + self.id);
            root.showScreen(Screen.Main);
        });
    };

    // chat implementation
    $(document).ready(function () {

        if (self.settings.useMicrophone || self.settings.useCamera) {

            var audioSource = self.selectedAudioInput.deviceId;
            var videoSource = self.selectedVideoInput.deviceId;

            var constraints = {
                audio: self.settings.useMicrophone ? { deviceId: audioSource } : false,
                video: self.settings.useCamera ? { deviceId: videoSource } : false
            };

            // obtains and displays video and audio streams from the local webcam
            navigator.mediaDevices.getUserMedia(constraints).
                then(self.mediaRetrieved.bind(self)).catch(self.mediaError);
        }
    });
};

CookingPresenterViewModel.prototype.mediaRetrieved = function (stream) {
    var self = this;

    console.log('Started streaming from getUserMedia.');
    var video = document.querySelector('video');
    self.stream = stream;
    video.srcObject = stream;

    // peer connection is going to handle negotiating a network connection with another client, 
    // and keep an open session allowing the two to communicate directly
    self.connection = new RTCPeerConnection(null);
    console.log('Created new peer connection.');

    // adding the stream we received from 'getUserMedia' into the connection object
    self.connection.addStream(stream);
    console.log('Added stream to peer connection.');

    self.connection.onicecandidate = function (event) {
        if (event.candidate) {

            // each time the client finds a new candidate, it will send it over to the remote peer
            var candidate = JSON.stringify(event.candidate);
            root.hub.server.setIceCandidate(self.id, candidate).done(function () {
                console.log("ICE candidate send to the server: " + candidate);
            });
        }
    };

    // we need to create and send a WebRTC offer over to the peer we would like to connect with
    self.connection.createOffer(function (desc) {
        console.log('Created offer for the peers.');

        // set the generated SDP to be our local session description
        self.connection.setLocalDescription(desc, function () {
            console.log('Local description set to: ' + desc);

            // store offer description into the cooking itself and send it to all interested parties

            var sdp = JSON.stringify(desc);
            root.hub.server.setRdp(self.id, sdp).done(function () {
                console.log("SDP send to the server: " + sdp);
            });
        });
    });
}

CookingPresenterViewModel.prototype.mediaError = function (error) {

    console.log('navigator.mediaDevices.getUserMedia error: ', error);
}

CookingPresenterViewModel.prototype.stopStream = function () {
    var self = this;

    if (self.stream) {
        for (let track of self.stream.getTracks()) {
            track.stop();
            console.log('Stopped streaming ' + track.kind + ' track from getUserMedia.');
        }
    }

    if (self.connection) {
        self.connection.close();
        console.log('Stopped peer connection.');
    }
}