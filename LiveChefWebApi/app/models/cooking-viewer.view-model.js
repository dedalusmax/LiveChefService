﻿var CookingViewerViewModel = function (data) {
    var self = data;

    self.snapshots = ko.observableArray();

    self.helpNeeded = ko.computed(function () {
        return self.status();
    });

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

    self.sendHelp = function () {

        var messageText = 'I want to help you!';

        var timeNowText = moment().format('HH:mm:ss');
        
        var message = new ChatViewModel('Me', messageText, timeNowText);
        self.chatHistory.push(message);

        root.hub.server.sendChatMessage(self.id, root.user.displayName, messageText, timeNowText).done(function () {
            console.log(messageText);
        });
    };
};