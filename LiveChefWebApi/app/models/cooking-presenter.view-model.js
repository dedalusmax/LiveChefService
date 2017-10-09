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

    self.isBroadcasting = ko.computed(function () {
        return communicator.isStreaming();
    });

    self.giveUp = function () {

        if (self.isBroadcasting()) {
            self.stopBroadcast();
        }

        root.hub.server.abortCooking(self.id).done(function () {
            console.log("Cooking aborted: " + self.id);
            root.showScreen(Screen.Main);
        });
    };

    self.startBroadcast = function () {

        communicator.intendedAction(MediaAction.VideoCall);
        communicator.startLocalStream();
    };

    self.stopBroadcast = function () {

        communicator.stopMediaStream(self.localStream, 'localVideo');
        communicator.clear();
    };
};

CookingPresenterViewModel.prototype.takeSnapshot = function () {
    var self = this;

    var video = document.querySelector('video');

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