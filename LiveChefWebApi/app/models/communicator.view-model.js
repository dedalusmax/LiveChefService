var CommunicatorViewModel = function (data) {
    var self = this;

    self.connected = ko.observable(false);

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

    self.endVideoCall = function () {
        // turn off media stream
        if (self.localStream) {
            for (let track of self.localStream.getTracks()) {
                track.stop();
                console.log('Stopped streaming ' + track.kind + ' track from getUserMedia.');
            }
        }
        // turn off connection
        if (self.connection) {
            self.connection.close();
            self.connection = null;
        }
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
    var connection = new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    "turn:173.194.72.127:19305?transport=udp",
                    "turn:[2404:6800:4008:C01::7F]:19305?transport=udp",
                    "turn:173.194.72.127:443?transport=tcp",
                    "turn:[2404:6800:4008:C01::7F]:443?transport=tcp"
                ],
                username: "CKjCuLwFEgahxNRjuTAYzc/s6OMT",
                credential: "u1SQDR/SQsPQIxXNWQT7czc/G4c="
            },
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:stun.services.mozilla.com",
                    "stun:stun.skyway.io:3478",
                    "stun:stun.stunprotocol.org:3478"
                ]
            }
        ]
    });
    console.log('Created new peer connection.');

    connection.onicecandidate = function (event) {
        if (event.candidate) {
            console.log('connection.onicecandidate: ', event.candidate.candidate);

            // each time the client finds a new candidate, it will send it over to the remote peer
            root.hub.server.send(JSON.stringify({ "candidate": event.candidate }));
        }
    };

    // New remote media stream was added
    connection.onaddstream = function (event) {
        console.log('connection.onaddstream');

        var remoteVideo = document.querySelector('#remoteVideo');
        self.remoteStream = event.stream;
        remoteVideo.srcObject = event.stream;
    };

    connection.oniceconnectionstatechange = function (event) {
        console.log('connection.oniceconnectionstatechange: ', event.target.iceConnectionState);

        if (event.target.iceConnectionState == 'connected' || event.target.iceConnectionState == 'completed') {
            self.connected(true);
        } else {
            self.connected(false);
        }

        // turn off remote video  
        if (event.target.iceConnectionState == 'disconnected') {

            // turn off media stream
            if (self.remoteStream) {
                for (let track of self.remoteStream.getTracks()) {
                    track.stop();
                    console.log('Stopped streaming ' + track.kind + ' track from getUserMedia.');
                }
            }

            // turn off connection
            conn.close();
            conn = null;
        }
    }

    connection.onicegatheringstatechange = function (event) {
        console.log('connection.oniceconnectionstatechange: ', event.target.iceGatheringState);
    }

    connection.onnegotiationneeded = function (event) {
        console.log('connection.onnegotiationneeded.');
    }

    connection.onsignalingstatechange = function (event) {
        console.log('connection.onsignalingstatechange: ', event.target.signalingState);

        // notify selected user to turn on camera
        if (event.target.signalingState == 'have-remote-offer') {
            console.log('Someone is calling you..');
        }
        // calling someone
        if (event.target.signalingState == 'have-local-offer') {
            console.log('Calling..')
        }

        // hang up
        if (event.target.signalingState == 'closed') {
            console.log('Call ended..');
        }
    }

    // media stream was closed
    connection.onremovestream = function (event) {
        console.log('connection.onremovestream: ' + event);

        if (self.remoteStream) {
            for (let track of self.remoteStream.getTracks()) {
                track.stop();
                console.log('Stopped streaming ' + track.kind + ' track from getUserMedia.');
            }
        }
    }

    return connection;
}

CommunicatorViewModel.prototype.newMessage = function (data) {
    var self = this;

    var message = JSON.parse(data);
    self.connection = self.connection || self.createConnection();

    // An SDP message contains connection and media information, and is either an 'offer' or an 'answer'
    if (message.sdp) {
        self.connection.setRemoteDescription(new RTCSessionDescription(message.sdp), function () {
            if (self.connection.remoteDescription.type == 'offer') {
                console.log('received offer, sending answer...');

                // Add our stream to the connection to be shared
                self.connection.addStream(self.localStream);

                // Create an SDP response
                self.connection.createAnswer(function (desc) {

                    // Which becomes our local session description
                    self.connection.setLocalDescription(desc, function () {

                        // And send it to the originator, where it will become their RemoteDescription
                        root.hub.server.send(JSON.stringify({ 'sdp': self.connection.localDescription }));
                    });
                }, function (error) { console.log('Error creating session description: ' + error); });
            } else if (self.connection.remoteDescription.type == 'answer') {
                console.log('got an answer');
            }
        });
    } else if (message.candidate) {
        // to set ice candidate there has to be remote connection
        if (!self.connection || self.connection.remoteDescription.type) {
            console.log('adding ice candidate...');
            self.connection.addIceCandidate(new RTCIceCandidate(message.candidate));
        }
    }
};
