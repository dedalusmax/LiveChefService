var CookingPresenterViewModel = function (data) {
    var self = data;

    self.snapshots = ko.observableArray();

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

    self.selectedFilter = ko.observable();

    self.isRecording = ko.observable(false);
    self.helpNeeded = ko.observable(false);
    self.recordingAvailable = ko.observable(false);

    self.giveUp = function () {

        root.hub.server.abortCooking(self.id).done(function () {
            console.log('Cooking aborted: ' + self.id);
            self.close();
        });
    };

    self.finish = function () {

        // shape snapshots for the transmission
        var snapshots = [];
        self.snapshots().forEach(function (snapshot) {

            var canvas = document.querySelector('#' + snapshot.snapshotId);
            var myDataURL = canvas.toDataURL('image/png');// could also be 'image/jpg' format
            var myBase64Data = myDataURL.split(',')[1];// removes everything up to and including first comma

            snapshots.push({
                id: snapshot.id,
                timeTaken: snapshot.timeTaken,
                description: snapshot.description(),
                image: myBase64Data
            });
        });

        if (self.recordedBlobs.length > 0) {

            root.hub.server.startMediaStreamTransfer(self.id).done(function () {
                console.log('Media stream transfer started: ' + self.id);
            }).fail(function (error) {
                console.log(error);
            });

            self.recordedBlobs.forEach(function (blob) {

                root.hub.server.sendMediaStreamTransfer(self.id, blob).done(function () {
                    console.log('Media stream transfer sent: ' + self.id);
                }).fail(function (error) {
                    console.log(error);
                });
            });

            root.hub.server.endMediaStreamTransfer(self.id).done(function () {
                console.log('Media stream transfer ended: ' + self.id);
            }).fail(function (error) {
                console.log(error);
            });
        }

        // TODO: update cooking on the server!
        root.hub.server.finishCooking(self.id, snapshots, self.chattingHistory()).done(function () {
            console.log('Cooking finished: ' + self.id);
            self.close();
        }).fail(function (error) {
            console.log(error);
        });
    };

    $(document).ready(function () {

        communicator.isConference = true;

        communicator.setElements(self.localVideo, null, self.localAudio, null);
        if (self.settings.useCamera) {
            communicator.intendedAction(MediaAction.VideoCall);
        } else if (self.settings.useMicrophone) {
            communicator.intendedAction(MediaAction.AudioCall);
        }
        communicator.startLocalStream();

        var filterSelect = document.querySelector('select#filter');
        var video = document.querySelector(self.localVideo);

        filterSelect.onchange = function () {
            self.selectedFilter(filterSelect.value);
            video.className = self.selectedFilter();
        };
    });

    self.askForHelp = function () {

        if (self.helpNeeded() == true) {
            root.hub.server.needHelpInCooking(self.id, self.helpNeeded()).done(function () {
                console.log('Ask for help message sent, help needed: ' + self.helpNeeded());
            });
        }
        else {
            root.hub.server.helpInCookingAccepted(self.id, self.helpNeeded()).done(function () {
                console.log('Ask for help message sent, help accepted: ' + self.helpNeeded());
            });
        }

    };

    self.mediaRecorder = null;
    self.recordedBlobs = [];
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
        id: self.snapshotId,
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

    canvas.className = self.selectedFilter();

    canvas.getContext('2d').
        drawImage(video, 0, 0, canvas.width, canvas.height);

    root.hub.server.sendChatMessage(self.id, root.user.displayName, 'Chef takes snapshots.', moment().format('HH:mm:ss')).done(function () {
        console.log('Chef takes snapshots.');
    });
};

CookingPresenterViewModel.prototype.removeSnapshot = function (self, snapshot) {

    self.snapshots.remove(function (s) {
        return s.snapshotId == snapshot.snapshotId;
    });

    root.hub.server.sendChatMessage(self.id, root.user.displayName, 'Chef remove snapshot.', moment().format('HH:mm:ss')).done(function () {
        console.log('Chef remove snapshot');
    });
};

CookingPresenterViewModel.prototype.toggleEditMode = function (self) {

    self.editMode(!self.editMode());
};

CookingPresenterViewModel.prototype.startRecording = function () {
    var self = this;

    self.recordedBlobs = [];

    // remove css from video 
    self.selectedFilter('none');
    var video = document.querySelector(self.localVideo);
    video.className = self.selectedFilter();
   
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

    root.hub.server.sendChatMessage(self.id, root.user.displayName, 'Chef starts recording.', moment().format('HH:mm:ss')).done(function () {
        console.log('Chef starts recording.');
    });

    self.mediaRecorder.onstop = self.handleStop.bind(self);
    self.mediaRecorder.addEventListener('dataavailable', self.handleDataAvailable.bind(self, event));
};

CookingPresenterViewModel.prototype.handleDataAvailable = function (e) {
    var self = this;

    if (event.data && event.data.size > 0) {
        self.recordedBlobs.push(event.data);
    }
    console.log('Recorded Blobs: ', self.recordedBlobs);
};

CookingPresenterViewModel.prototype.stopRecording = function () {
    var self = this;

    self.mediaRecorder.stop();
    console.log('Recorded Blobs: ', self.recordedBlobs);

    root.hub.server.sendChatMessage(self.id, root.user.displayName, 'Chef stops recording.', moment().format('HH:mm:ss')).done(function () {
        console.log('Chef stops recording.');
    });
};

CookingPresenterViewModel.prototype.handleStop = function () {
    var self = this;

    console.log('Recorder stopped');
    self.isRecording(false);
    self.recordingAvailable(true);
};

CookingPresenterViewModel.prototype.playRecordedVideo = function () {
    var self = this;

    var superBuffer = new Blob(self.recordedBlobs, { type: 'video/webm' });
    var recordedVideo = document.querySelector('#recordedVideo');
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
};

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
    downloadAnchor.download = 'cooking_'+self.id+'.webm';
    downloadAnchor.style.display = 'none';
    downloadAnchor.click();
};

CookingPresenterViewModel.prototype.handleSourceOpen = function () {
    var self = this;

    console.log('MediaSource opened');
    self.sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
    console.log('Source buffer: ', self.sourceBuffer);
};

