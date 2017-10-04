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

    var hub = root.hub;

    self.giveUp = function () {

        self.stopStream(window.stream);

        hub.server.abortCooking(self.id).done(function () {
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

            navigator.mediaDevices.getUserMedia(constraints).
                then(self.mediaRetrieved).catch(self.mediaError);
        }
    });
};

CookingPresenterViewModel.prototype.mediaRetrieved = function (stream) {

    console.log('Started streaming from getUserMedia.');
    var video = document.querySelector('video');
    window.stream = stream; // make stream available to browser console
    video.srcObject = stream;
}

CookingPresenterViewModel.prototype.mediaError = function (error) {

    console.log('navigator.mediaDevices.getUserMedia error: ', error);
}

CookingPresenterViewModel.prototype.stopStream = function (stream) {

    for (let track of stream.getTracks()) {
        track.stop();
        console.log('Stopped streaming ' + track.kind + ' track from getUserMedia.');
    }
}