﻿var CookingViewModel = function (data, chefIsMe) {
    var self = this;

    // take over the data from the model
    $.extend(self, data);

    // add new fields to the model
    self.dish = new RecipeViewModel(data.dish, true);
    self.chefIsMe = chefIsMe || false;

    self.timeStarted = moment(data.startedTime);
    self.timeStartedText = self.timeStarted.format('HH:mm:ss');

    self.currentTime = ko.observable('');

    self.status = ko.observable(data.status);
    self.statusText = ko.computed(function () {
        switch (self.status()) {
            case 1:
                return 'Just started';
            case 2:
                return 'Ongoing';
            case 3:
                return 'Help needed!';
            case 4:
                return 'Finished';
        }
    });

    if (self.status() == 4) {
        self.timeFinishedText = moment(data.timeFinished).format('HH:mm:ss');
    }

    self.chattingHistory = ko.observableArray();
    self.chatMessage = ko.observable('');
    self.chatMessageFocused = ko.observable(true);

    self.addChatMessage = function (sender, text, time) {

        self.chattingHistory.push(new ChatViewModel(sender, text, time));
        self.chattingHistory.valueHasMutated();
    };

    self.sendChatMessage = function () {

        var messageText = self.chatMessage();
        if (chefIsMe) var message = new ChatViewModel('Chef', messageText, moment().format('HH:mm:ss'));
        if (!chefIsMe) var message = new ChatViewModel('Me', messageText, moment().format('HH:mm:ss'));

        self.chattingHistory.push(message);

        root.hub.server.sendChatMessage(self.id, root.user.displayName, messageText, moment().format('HH:mm:ss')).done(function () {
            self.chatMessage('');
            self.chatMessageFocused(true);
            console.log('Chat message sent to others in cooking:' + self.id);
        });
    };

    self.open = function () {
        if (self.status() == 4) {
            console.log('Extending cooking with recorded.');
            $.extend(self, new CookingRecordedViewModel(self));
           
        } else {
            if (self.chefIsMe) {
                console.log('Extending cooking with presenter.');
                $.extend(self, new CookingPresenterViewModel(self));
            } else {
                console.log('Extending cooking with viewer.');
                $.extend(self, new CookingViewerViewModel(self));
            }
        }
    }

    self.leave = function () {
        alert('The cook has finished the cooking. The cooking session will be closed.');
        self.close();
    };

    self.close = function () {
        console.log("Cooking closed: " + self.id);
        root.cooking(null);
        root.showScreen(Screen.Main);
    };

    self.refreshTime = function (now) {
        var diff = moment(now).from(self.timeStarted);
        self.currentTime(diff);
    }
    // TODO: new html for video 
    self.helpNeeded = ko.observable();
    self.sendHelp = function () {
    }
};
