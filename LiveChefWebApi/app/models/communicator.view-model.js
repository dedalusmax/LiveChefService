var CommunicatorViewModel = function (data) {
    var self = this;

    self.localStream = null;
    self.connection = null;

    // chat implementation
    $(document).ready(function () {

        var constraints = {
            audio: true,
            video: true
        };

        // obtains and displays video and audio streams from the local webcam
        navigator.mediaDevices.getUserMedia(constraints).
            then(self.mediaRetrieved.bind(self)).catch(self.mediaError);
    });

    self.startVideoCall = function () {

        self.connection = self.connection || self.createConnection();

        // adding the stream we received from 'getUserMedia' into the connection object
        self.connection.addStream(self.localStream);
        console.log('Added stream to peer connection.');

        // we need to create and send a WebRTC offer over to the peer we would like to connect with
        self.connection.createOffer(function (desc) {
            console.log('Created offer for the peers.');

            // set the generated SDP to be our local session description
            self.connection.setLocalDescription(desc, function () {
                console.log('Local description set to: ' + desc);

                // store offer description into the cooking itself and send it to all interested parties
                root.hub.server.send(JSON.stringify({ "sdp": desc }));
            });
        });
    }
}

CommunicatorViewModel.prototype.mediaRetrieved = function (stream) {
    var self = this;

    console.log('Started streaming from getUserMedia.');
    var localVideo = document.querySelector('#localVideo');
    self.localStream = stream;
    localVideo.srcObject = stream;
}

CommunicatorViewModel.prototype.mediaError = function (error) {

    console.log('navigator.mediaDevices.getUserMedia error: ', error);
}

CommunicatorViewModel.prototype.createConnection = function () {
    var self = this;

    // peer connection is going to handle negotiating a network connection with another client, 
    // and keep an open session allowing the two to communicate directly
    var connection = new RTCPeerConnection(null);
    console.log('Created new peer connection.');

    connection.onicecandidate = function (event) {
        if (event.candidate) {
            // each time the client finds a new candidate, it will send it over to the remote peer
            root.hub.server.send(JSON.stringify({ "candidate": event.candidate }));
        }
    };

    // New remote media stream was added
    connection.onaddstream = function (event) {

        console.log('Started streaming from remote media stream.');
        var remoteVideo = document.querySelector('#remoteVideo');
        self.remoteStream = event.stream;
        remoteVideo.srcObject = event.stream;
    };

    return connection;
}

CommunicatorViewModel.prototype.newMessage = function (data) {
    var self = this;

    var message = JSON.parse(data);
    var connection = self.connection || self.createConnection();

    // An SDP message contains connection and media information, and is either an 'offer' or an 'answer'
    if (message.sdp) {
        connection.setRemoteDescription(new RTCSessionDescription(message.sdp), function () {
            if (connection.remoteDescription.type == 'offer') {
                console.log('received offer, sending answer...');

                // Add our stream to the connection to be shared
                connection.addStream(self.localStream);

                // Create an SDP response
                connection.createAnswer(function (desc) {

                    // Which becomes our local session description
                    connection.setLocalDescription(desc, function () {

                        // And send it to the originator, where it will become their RemoteDescription
                        root.hub.server.send(JSON.stringify({ 'sdp': connection.localDescription }));
                    });
                }, function (error) { console.log('Error creating session description: ' + error); });
            } else if (connection.remoteDescription.type == 'answer') {
                console.log('got an answer');
            }
        });
    } else if (message.candidate) {
        console.log('adding ice candidate...');
        connection.addIceCandidate(new RTCIceCandidate(message.candidate));
    }
};
