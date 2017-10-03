var MyCookingViewModel = function (data) {
    var self = data;

    self.selectedAudioInput = null;
    self.selectedAudioOutput = null;
    self.selectedVideoInput = null;

    if (self.settings.useMicrophone || self.settings.useCamera) {
        self.selectedAudioInput = JSON.parse(getCookie('audioInput'));
        self.selectedAudioOutput = JSON.parse(getCookie('audioOutput'));
        self.selectedVideoInput = JSON.parse(getCookie('videoInput'));
    }

    var hub = root.hub;

    self.giveUp = function () {

        hub.server.abortCooking(self.id).done(function () {
            console.log("Cooking aborted: " + self.id);
            root.showScreen(Screen.Main);
        });
    };

    // chat implementation
    $(document).ready(function () {

        if (self.settings.useMicrophone || self.settings.useCamera) {

            var video = document.querySelector('video');

            var audioSource = self.selectedAudioInput.deviceId;
            var videoSource = self.selectedVideoInput.deviceId;

            var constraints = {
                audio: self.settings.useMicrophone ? { deviceId: audioSource } : false,
                video: self.settings.useCamera ? { deviceId: videoSource } : false
            };

            function handleSuccess(stream) {
                window.stream = stream; // make stream available to browser console
                video.srcObject = stream;
            }

            function handleError(error) {
                console.log('navigator.getUserMedia error: ', error);
            }

            navigator.mediaDevices.getUserMedia(constraints).
                then(handleSuccess).catch(handleError);

        }

        var localConnection, remoteConnection, sendChannel, receiveChannel, pcConstraint, dataConstraint;
        var dataChannelSend = document.querySelector('textarea#dataChannelSend');
        var dataChannelReceive = document.querySelector('textarea#dataChannelReceive');
        var startButton = document.querySelector('button#startButton');
        var sendButton = document.querySelector('button#sendButton');
        var closeButton = document.querySelector('button#closeButton');

        startButton.onclick = createConnection;
        sendButton.onclick = sendData;
        closeButton.onclick = closeDataChannels;

        function enableStartButton() {
            startButton.disabled = false;
        }

        function disableSendButton() {
            sendButton.disabled = true;
        }

        function createConnection() {
            dataChannelSend.placeholder = '';
            var servers = null;
            pcConstraint = null;
            dataConstraint = null;
            console.log('Using SCTP based data channels');
            // SCTP is supported from Chrome 31 and is supported in FF.
            // No need to pass DTLS constraint as it is on by default in Chrome 31.
            // For SCTP, reliable and ordered is true by default.
            // Add localConnection to global scope to make it visible
            // from the browser console.
            window.localConnection = localConnection =
                new RTCPeerConnection(servers, pcConstraint);
            console.log('Created local peer connection object localConnection');

            sendChannel = localConnection.createDataChannel('sendDataChannel',
                dataConstraint);
            console.log('Created send data channel');

            localConnection.onicecandidate = function (e) {
                onIceCandidate(localConnection, e);
            };
            sendChannel.onopen = onSendChannelStateChange;
            sendChannel.onclose = onSendChannelStateChange;

            // Add remoteConnection to global scope to make it visible
            // from the browser console.
            window.remoteConnection = remoteConnection =
                new RTCPeerConnection(servers, pcConstraint);
            console.log('Created remote peer connection object remoteConnection');

            remoteConnection.onicecandidate = function (e) {
                onIceCandidate(remoteConnection, e);
            };
            remoteConnection.ondatachannel = receiveChannelCallback;

            localConnection.createOffer().then(
                gotDescription1,
                onCreateSessionDescriptionError
            );
            startButton.disabled = true;
            closeButton.disabled = false;
        }

        function onCreateSessionDescriptionError(error) {
            console.log('Failed to create session description: ' + error.toString());
        }

        function sendData() {
            var data = dataChannelSend.value;
            sendChannel.send(data);
            console.log('Sent Data: ' + data);
        }

        function closeDataChannels() {
            console.log('Closing data channels');
            sendChannel.close();
            console.log('Closed data channel with label: ' + sendChannel.label);
            receiveChannel.close();
            console.log('Closed data channel with label: ' + receiveChannel.label);
            localConnection.close();
            remoteConnection.close();
            localConnection = null;
            remoteConnection = null;
            console.log('Closed peer connections');
            startButton.disabled = false;
            sendButton.disabled = true;
            closeButton.disabled = true;
            dataChannelSend.value = '';
            dataChannelReceive.value = '';
            dataChannelSend.disabled = true;
            disableSendButton();
            enableStartButton();
        }

        function gotDescription1(desc) {
            localConnection.setLocalDescription(desc);
            console.log('Offer from localConnection \n' + desc.sdp);
            remoteConnection.setRemoteDescription(desc);
            remoteConnection.createAnswer().then(
                gotDescription2,
                onCreateSessionDescriptionError
            );
        }

        function gotDescription2(desc) {
            remoteConnection.setLocalDescription(desc);
            console.log('Answer from remoteConnection \n' + desc.sdp);
            localConnection.setRemoteDescription(desc);
        }

        function getOtherPc(pc) {
            return (pc === localConnection) ? remoteConnection : localConnection;
        }

        function getName(pc) {
            return (pc === localConnection) ? 'localPeerConnection' :
                'remotePeerConnection';
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

        function onAddIceCandidateSuccess() {
            console.log('AddIceCandidate success.');
        }

        function onAddIceCandidateError(error) {
            console.log('Failed to add Ice Candidate: ' + error.toString());
        }

        function receiveChannelCallback(event) {
            console.log('Receive Channel Callback');
            receiveChannel = event.channel;
            receiveChannel.onmessage = onReceiveMessageCallback;
            receiveChannel.onopen = onReceiveChannelStateChange;
            receiveChannel.onclose = onReceiveChannelStateChange;
        }

        function onReceiveMessageCallback(event) {
            console.log('Received Message');
            dataChannelReceive.value = event.data;
        }

        function onSendChannelStateChange() {
            var readyState = sendChannel.readyState;
            console.log('Send channel state is: ' + readyState);
            if (readyState === 'open') {
                dataChannelSend.disabled = false;
                dataChannelSend.focus();
                sendButton.disabled = false;
                closeButton.disabled = false;
            } else {
                dataChannelSend.disabled = true;
                sendButton.disabled = true;
                closeButton.disabled = true;
            }
        }

        function onReceiveChannelStateChange() {
            var readyState = receiveChannel.readyState;
            console.log('Receive channel state is: ' + readyState);
        }
    });
};

MyCookingViewModel.prototype.mediaRetrieved = function (stream) {
    var self = this;
    window.stream = stream; // make stream available to console
    //self.videoElement.srcObject = stream;
}

MyCookingViewModel.prototype.mediaError = function (error) {
    console.log('navigator.mediaDevices.getUserMedia error: ', error);
}
