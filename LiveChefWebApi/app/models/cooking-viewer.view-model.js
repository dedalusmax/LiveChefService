var CookingViewerViewModel = function (data) {
    var self = data;

    var communicator = root.main().communicator;

    self.localVideo = '#viewerVideo';
    self.remoteVideo = '#presenterVideo';
    self.localAudio = '#viewerAudio';
    self.remoteAudio = '#presenterAudio';

    $(document).ready(function () {

        communicator.setElements(self.localVideo, self.remoteVideo, self.localAudio, self.remoteAudio);
        if (self.settings.useCamera) {
            communicator.intendedAction(MediaAction.VideoCall);
        } else if (self.settings.useMicrophone) {
            communicator.intendedAction(MediaAction.AudioCall);
        }

        communicator.userIdToConnect(self.chef.id);

        communicator.startLocalStream();
    });
}