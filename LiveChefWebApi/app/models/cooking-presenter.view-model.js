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

    self.startRecording = function () {

        //communicator.stopLocalStream();
        //communicator.clear();
    };

    self.stopRecording = function () {

        //communicator.stopLocalStream();
        //communicator.clear();
    };

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

    var canvas = document.querySelector('#canvas' + snapshot.snapshotId);

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
