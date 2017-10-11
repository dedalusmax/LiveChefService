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

    self.snapshotId = self.snapshots().length;

    var communicator = root.main().communicator;

    self.localVideo = '#myVideo';
    self.localAudio = '#myAudio';

    self.isRecording = ko.observable(false);
    self.helpNeeded = ko.observable(false);

    self.giveUp = function () {

        root.hub.server.abortCooking(self.id).done(function () {
            console.log('Cooking aborted: ' + self.id);
            self.close();
        });
    };

    self.finish = function () {

        // TODO: update cooking on the server!
        root.hub.server.finishCooking(self.id).done(function () {
            console.log('Cooking finished: ' + self.id);
            self.close();
        });
    }

    $(document).ready(function () {

        communicator.setElements(self.localVideo, null, self.localAudio, null);
        if (self.settings.useCamera) {
            communicator.intendedAction(MediaAction.VideoCall);
        } else if (self.settings.useMicrophone) {
            communicator.intendedAction(MediaAction.AudioCall);
        }
        communicator.startLocalStream();
    });

    self.askForHelp = function () {

        root.hub.server.needHelpInCooking(self.id, self.helpNeeded()).done(function () {
            console.log('Ask for help message sent, help needed: ' + self.helpNeeded());
        });
    }

    self.mediaRecorder = null;
    self.recordedBlobs = [];

    self.chatMessage = ko.observable('');
};

CookingPresenterViewModel.prototype.close = function () {
    var self = this;
    var communicator = root.main().communicator;

    if (self.isRecording()) {
        self.stopRecording();
    }

    communicator.stopLocalStream();
    communicator.clear();

    root.showScreen(Screen.Main);
};

CookingPresenterViewModel.prototype.takeSnapshot = function () {
    var self = this;

    var video = document.querySelector(self.localVideo);

    self.snapshotId++;

    var now = new Date();
    var timeTaken = new Date(Math.abs(now - self.timeStarted));

    var snapshot = {
        snapshotId: 'snapshot' + self.snapshotId,
        timeTaken: timeTaken,
        timeTakenText: formatTimeFromDate(timeTaken),
        width: video.videoWidth / 2, // 50% video width
        height: video.videoHeight / 2, // 50% video height,
        description: ko.observable(''),
        editMode: ko.observable(false)
    };

    self.snapshots.push(snapshot);

    var canvas = document.querySelector('#' + snapshot.snapshotId);

    canvas.getContext('2d').
        drawImage(video, 0, 0, canvas.width, canvas.height);
}

CookingPresenterViewModel.prototype.removeSnapshot = function (self, snapshot) {

    self.snapshots.remove(function (s) {
        return s.snapshotId == snapshot.snapshotId;
    });
}

CookingPresenterViewModel.prototype.toggleEditMode = function (self) {

    self.editMode(!self.editMode());
}

CookingPresenterViewModel.prototype.sendChatMessage = function () {
    var self = this;

    var message = {
        sender: 'Me',
        text: self.chatMessage()
    }
    self.chatHistory.push(message);

    root.hub.server.sendChatMessage(self.id, message.sender, message.text).done(function () {
        console.log('Chat message sent to others.');
    });
}

CookingPresenterViewModel.prototype.startRecording = function () {
    var self = this;

    self.recordedBlobs = [];

    var mediaSource = new MediaSource();
    mediaSource.addEventListener('sourceopen', self.handleSourceOpen, false);

    var communicator = root.main().communicator;

    var options = { mimeType: 'video/webm;codecs=vp9' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.log(options.mimeType + ' is not Supported');
        options = { mimeType: 'video/webm;codecs=vp8' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.log(options.mimeType + ' is not Supported');
            options = { mimeType: 'video/webm' };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                console.log(options.mimeType + ' is not Supported');
                options = { mimeType: '' };
            }
        }
    }
    try {
        self.mediaRecorder = new MediaRecorder(communicator.localStream, options);
    } catch (e) {
        console.error('Exception while creating MediaRecorder: ' + e);
        alert('Exception while creating MediaRecorder: '
            + e + '. mimeType: ' + options.mimeType);
        return;
    }
    console.log('Created MediaRecorder', self.mediaRecorder, 'with options', options);

    self.mediaRecorder.start(10); // collect 10ms of data
    console.log('MediaRecorder started', self.mediaRecorder);
    self.isRecording(true);

    self.mediaRecorder.onstop = self.handleStop.bind(self);
    self.mediaRecorder.addEventListener('dataavailable', self.handleDataAvailable.bind(self, event));
};

CookingPresenterViewModel.prototype.handleDataAvailable = function (e) {
    var self = this;

    if (event.data && event.data.size > 0) {
        self.recordedBlobs.push(event.data);
    }
    console.log('Recorded Blobs: ', self.recordedBlobs);
}

CookingPresenterViewModel.prototype.stopRecording = function () {
    var self = this;

    self.mediaRecorder.stop();
    console.log('Recorded Blobs: ', self.recordedBlobs);
}

CookingPresenterViewModel.prototype.handleStop = function () {
    var self = this;

    console.log('Recorder stopped');
    self.isRecording(false);
}

CookingPresenterViewModel.prototype.playRecordedVideo = function () {
    var self = this;

    var superBuffer = new Blob(self.recordedBlobs, { type: 'video/webm' });
    var recordedVideo = document.querySelector('#recordedVideo');
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
}

CookingPresenterViewModel.prototype.downloadVideo = function () {
    var self = this;

    var blob = new Blob(self.recordedBlobs, { type: 'video/webm' });
    var url = window.URL.createObjectURL(blob);

    var downloadAnchor = document.querySelector('a#downloadVideo');

    // clear the anchor tag of previous transfer
    downloadAnchor.removeAttribute('download');
    if (downloadAnchor.href) {
        URL.revokeObjectURL(downloadAnchor.href);
        downloadAnchor.removeAttribute('href');
    }

    downloadAnchor.href = url;
    downloadAnchor.download = 'chefRecord.webm';
    downloadAnchor.style.display = 'none';
    downloadAnchor.click();
}

CookingPresenterViewModel.prototype.handleSourceOpen = function () {
    var self = this;

    console.log('MediaSource opened');
    self.sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
    console.log('Source buffer: ', self.sourceBuffer);
}

