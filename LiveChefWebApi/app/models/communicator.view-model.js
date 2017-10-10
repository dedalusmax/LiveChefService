var MediaAction = {
    VideoCall: 1,
    AudioCall: 2,
    Chat: 3
};

var CommunicatorViewModel = function (data) {
    var self = this;

    self.connected = ko.observable(false);
    self.isStreaming = ko.observable(false);

    self.localStream = null;
    self.connection = null;

    self.intendedAction = ko.observable(null);
    self.userIdToConnect = ko.observable(null);
    self.requestedConnection = false;

    self.localAudio = null;
    self.localVideo = null;
    self.remoteAudio = null;
    self.remoteVideo = null;

    self.file = ko.observable(null);
    self.receivedFileData = null;

    self.sendChannel = null;
    self.receiveChannel = null;

    self.startVideoCall = function (user) {

        self.intendedAction(MediaAction.VideoCall);
        self.setElements('#localVideo', '#remoteVideo', null, null);
        self.userIdToConnect(user.id);

        self.startLocalStream();
    }

    self.startAudioCall = function (user) {

        self.intendedAction(MediaAction.AudioCall);
        self.setElements(null, null, '#localAudio', '#remoteAudio');
        self.userIdToConnect(user.id);

        self.startLocalStream();
    }

    self.stopCall = function (user) {
        self.closeConnectionAndStreams();
    }

    self.sendFile = function (user) {
        self.fileInput = $('input#fileInput');
        self.fileInput.val('');
        self.fileInput.click();
    }

    self.handleFileInputChange = function () {
        self.file(self.fileInput[0].files[0]);
        if (!self.file()) {
            console.log('No file chosen');
        } else {
            self.createDataChannel(self.file());
        }
    }

    self.stopLocalStream = function () {
        self.stopMediaStream(self.localStream, self.localVideo, self.localAudio);
    }

    self.stopRemoteStream = function () {
        self.stopMediaStream(self.remoteStream, self.remoteVideo, self.remoteAudio);
    }
}

CommunicatorViewModel.prototype.setElements = function (localVideoElement, remoteVideoElement, localAudioElement, remoteAudioElement) {
    var self = this;

    self.localVideo = localVideoElement;
    self.remoteVideo = remoteVideoElement;
    self.localAudio = localAudioElement;
    self.remoteAudio = remoteAudioElement;
}

CommunicatorViewModel.prototype.startLocalStream = function () {
    var self = this;

    // obtains and displays video and audio streams from the local webcam
    var constraints = {
        audio: true,
        video: (self.intendedAction() == MediaAction.VideoCall)
    };

    navigator.mediaDevices.getUserMedia(constraints).
        then(self.mediaRetrieved.bind(self)).catch(self.mediaError.bind(self));
}

CommunicatorViewModel.prototype.startCommunication = function () {
    var self = this;

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
            root.hub.server.sendRtcMessage(self.userIdToConnect(), JSON.stringify({ "sdp": desc }));
        });
    });
}

CommunicatorViewModel.prototype.closeConnectionAndStreams = function () {
    var self = this;

    // turn off connection
    if (self.connection) {
        self.connection.close();
        self.connection = null;
    }

    // turn off media streams
    self.stopRemoteStream();
    self.stopLocalStream();

    if (self.sendChannel) {
        self.sendChannel.close();
        self.sendChannel = null;
    }
    if (self.receiveChannel) {
        self.receiveChannel.close();
        self.receiveChannel = null;
    }

    // clear local variables
    self.clear();
}

CommunicatorViewModel.prototype.clear = function () {
    var self = this;

    // clear local variables
    self.isStreaming(false);
    self.intendedAction(null);
    self.userIdToConnect(null);
    self.requestedConnection = false;

    self.localAudio = null;
    self.localVideo = null;
    self.remoteAudio = null;
    self.remoteVideo = null;

    self.file(null);
    self.receivedFileData = null;
}

CommunicatorViewModel.prototype.stopMediaStream = function (stream, videoElement, audioElement) {
    var self = this;

    if (stream) {
        for (let track of stream.getTracks()) {
            track.stop();
            console.log('Stopped streaming ' + track.kind + ' track from getUserMedia.');
        }
    }

    var video = document.querySelector(videoElement);
    if (video) video.srcObject = null;

    var audio = document.querySelector(audioElement);
    if (audio) audio.srcObject = null;
}

CommunicatorViewModel.prototype.stopLocalMediaStream = function () {
    var self = this;

    self.stopMediaStream(self.localStream, self.localVideo, self.localAudio);

    if (stream) {
        for (let track of stream.getTracks()) {
            track.stop();
            console.log('Stopped streaming ' + track.kind + ' track from getUserMedia.');
        }
    }

    var video = document.querySelector(videoElement);
    if (video) video.srcObject = null;

    var audio = document.querySelector(audioElement);
    if (audio) audio.srcObject = null;
}

CommunicatorViewModel.prototype.mediaRetrieved = function (stream) {
    var self = this;

    self.isStreaming(true);
    self.localStream = stream;

    console.log('Started streaming from getUserMedia.');
    if (self.intendedAction() == MediaAction.VideoCall) {
        var localVideo = document.querySelector(self.localVideo);
        localVideo.srcObject = stream;
    } else if (self.intendedAction() == MediaAction.AudioCall) {
        var audioTracks = stream.getAudioTracks();
        console.log('Using audio device: ' + audioTracks[0].label);
        var localAudio = document.querySelector(self.localAudio);
        localAudio.srcObject = stream;
    }

    stream.oninactive = function () {
        console.log('Stream ended');
    };

    if (self.requestedConnection) {
        self.startCommunication();
    } else {
        root.hub.server.requestForJoin(root.user.id, self.intendedAction(), self.userIdToConnect());
    }
}

CommunicatorViewModel.prototype.mediaError = function (error) {
    var self = this;

    self.isStreaming(false);
    self.requestedConnection = false;

    console.log('navigator.mediaDevices.getUserMedia error: ', error);
}

CommunicatorViewModel.prototype.joinRequested = function (action, userIdToConnect) {
    // a caller sent a message through SignalR that he wants to start communicating with me
    var self = this;

    self.requestedConnection = true;

    self.intendedAction(action);
    self.setElements('#localVideo', '#remoteVideo', '#localAudio', '#remoteAudio');
    self.userIdToConnect(userIdToConnect);

    self.startLocalStream();
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
            root.hub.server.sendRtcMessage(self.userIdToConnect(), JSON.stringify({ "candidate": event.candidate }));
        }
    };

    // New remote media stream was added
    connection.onaddstream = function (event) {
        console.log('connection.onaddstream');

        self.remoteStream = event.stream;

        if (self.intendedAction() == MediaAction.VideoCall) {
            var remoteVideo = document.querySelector(self.remoteVideo);
            remoteVideo.srcObject = event.stream;
        } else {
            var remoteAudio = document.querySelector(self.remoteAudio);
            remoteAudio.srcObject = event.stream;
        }
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
            self.closeConnectionAndStreams();
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

    connection.ondatachannel = function (event) {
        console.log('Receive Channel Callback');

        self.receiveChannel = event.channel;
        //self.receiveChannel.onopen = self.dataChannelOpened;
        //self.receiveChannel.onclose = self.dataChannelClosed;
        self.receiveChannel.onmessage = self.receiveChannelMessageArrived;
    }

    return connection;
}

CommunicatorViewModel.prototype.rtcMessageReceived = function (data) {
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
                        root.hub.server.sendRtcMessage(self.userIdToConnect(), JSON.stringify({ 'sdp': self.connection.localDescription }));
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

CommunicatorViewModel.prototype.createDataChannel = function (file) {
    var self = this;

    //self.sendChannel = self.connection.createDataChannel('sendDataChannel', {
    //    ordered: false, // do not guarantee order
    //    maxRetransmitTime: 3000, // in milliseconds
    //});
    self.sendChannel = self.connection.createDataChannel('sendDataChannel');
    console.log('Created send data channel');

    // when the channel exists we call method for send 
    self.sendChannel.onopen = self.sendChannelOpened;
    self.sendChannel.onclose = self.sendChannelClosed;
    //self.sendChannel.onmessage = self.sendChannelMessageArrived;

    // we must inform other party of the incoming message transfer
    root.hub.server.requestRtcDataTransfer(self.userIdToConnect(), file.name, file.size);
}

CommunicatorViewModel.prototype.rtcDataTransferRequested = function (filename, size) {
    var self = this;

    // signalr returns us the information about the file that has been transferred
    self.receivedFileData = { filename: filename, size: size };
}

CommunicatorViewModel.prototype.sendChannelOpened = function () {
    var self = this;
    console.log('Data channel opened');

    // send file over the WebRTC data channel:

    var file = self.file();

    var chunkSize = 16384; // 16 KB
    var sliceFile = function (offset) {
        var reader = new window.FileReader();
        reader.onload = (function () {
            return function (e) {
                self.sendChannel.send(e.target.result);
                if (file.size > offset + e.target.result.byteLength) {
                    window.setTimeout(sliceFile, 0, offset + chunkSize);
                }
                //sendProgress.value = offset + e.target.result.byteLength;
            };
        })(file);
        var slice = file.slice(offset, offset + chunkSize);
        reader.readAsArrayBuffer(slice);
    };
    sliceFile(0);

    self.sendChannel.close();
    self.sendChannel = null;
};

CommunicatorViewModel.prototype.sendChannelClosed = function (event) {
    var self = this;
    console.log('Data channel closed');
};

CommunicatorViewModel.prototype.receiveChannelMessageArrived = function (event) {
    var self = this;
    console.log('Data channel message arrived');

    if (self.file) {

        var receiveBuffer = [];
        receiveBuffer.push(event.data);
        var received = new window.Blob(receiveBuffer);
        receiveBuffer = [];

        var downloadAnchor = document.querySelector('#downloadAnchor');
        downloadAnchor.href = URL.createObjectURL(received);
        downloadAnchor.download = self.receivedFileData.filename;

        self.receiveChannel.close();
        self.receiveChannel = null;
        
    } else {
        console.log('Data about the file not arrived!');
    }
};