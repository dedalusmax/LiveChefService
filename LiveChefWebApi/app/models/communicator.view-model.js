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

    connection.oniceconnectionstatechange = function () {

        var conn = self.connection ? self.connection : this;
        console.log('ICE connection state change: ' + conn.iceConnectionState);

        if (conn.iceConnectionState == 'connected' || conn.iceConnectionState == 'completed') {
            self.connected(true);
        } else {
            self.connected(false);
        }

        // turn off remote video  
        if (conn.iceConnectionState == 'disconnected') {

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

    connection.onicegatheringstatechange = function () {

        console.log('ICE gathering state change.');
    }

    connection.onnegotiationneeded = function () {

        console.log('Negotiation needed.');
    }

    connection.onsignalingstatechange = function () {

        // notify selected user to turn on camera
        if (this.signalingState == 'have-remote-offer') {
            alert('Someone is calling you..');
        }
        // calling someone
        if (this.signalingState == 'have-local-offer') {
            alert('Calling..')
        }

        // hang up
        if (this.signalingState == 'closed') {
            alert('Call ended..');
        }
        console.log('Signaling state change: ' + this.signalingState + ', ' + this.readyState);
    }

    // media stream was closed
    //connection.onremovestream = function (event) {
    //    console.log('Stopped streaming from remote media stream.');

    //    if (self.remoteStream) {
    //        for (let track of self.remoteStream.getTracks()) {
    //            track.stop();
    //            console.log('Stopped streaming ' + track.kind + ' track from getUserMedia.');
    //        }
    //    }
    //}

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
        // to set ice candidate there has to be remote connection
        if (!connection || connection.remoteDescription.type) {
            console.log('adding ice candidate...');
            connection.addIceCandidate(new RTCIceCandidate(message.candidate));
        }
    }
};
