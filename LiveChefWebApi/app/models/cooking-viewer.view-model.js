﻿var CookingViewerViewModel = function (data) {
    var self = data;

    var communicator = root.main().communicator;

    self.localVideo = '#viewerVideo';
    self.remoteVideo = '#presenterVideo';
    self.localAudio = '#viewerAudio';
    self.remoteAudio = '#presenterAudio';

    $(document).ready(function () {

        communicator.isConference = true;

        communicator.setElements(null, self.remoteVideo, null, self.remoteAudio);
        if (self.settings.useCamera) {
            communicator.intendedAction(MediaAction.VideoCall);
        } else if (self.settings.useMicrophone) {
            communicator.intendedAction(MediaAction.AudioCall);
        }

        communicator.userIdToConnect(self.chef.id);

        console.log('Request for join, caller: ' + root.user.id + ' callee: ' + self.chef.id);
        root.hub.server.requestForJoin(root.user.id, communicator.intendedAction(), self.chef.id);
    });
}