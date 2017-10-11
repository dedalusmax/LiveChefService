var CookingViewModel = function (data, chefIsMe) {
    var self = this;

    // take over the data from the model
    $.extend(self, data);

    // add new fields to the model
    self.dish = new RecipeViewModel(data.dish, true);
    self.chefIsMe = chefIsMe || false;

    self.timeStarted = new Date(data.startedTime);
    self.timeStartedText = formatTimeFromDate(self.timeStarted);

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

    self.snapshots = ko.observableArray();

    self.chatHistory = ko.observableArray();
    self.chatMessage = ko.observable('');
    self.chatMessageFocused = ko.observable(true);

    self.addChatMessage = function (sender, text) {

        self.chatHistory.push({
            sender: sender,
            text: text
        });
    };

    self.sendChatMessage = function () {

        var message = {
            sender: 'Me',
            text: self.chatMessage()
        }

        self.chatHistory.push(message);

        root.hub.server.sendChatMessage(self.id, message.sender, message.text).done(function () {
            self.chatMessage('');
            self.chatMessageFocused(true);
            console.log('Chat message sent to others.');
        });
    };

    self.open = function() {
        if (self.chefIsMe) {
            $.extend(self, new CookingPresenterViewModel(self));
        } else {
            $.extend(self, new CookingViewerViewModel(self));
        }
    }

    self.leave = function () {
        alert('The cook has finished the cooking. The cooking session will be closed.');
        self.returnToMain();
    };

    self.returnToMain = function () {
        console.log("Cooking closed: " + self.id);
        root.showScreen(Screen.Main);
    };

    self.refreshTime = function (now) {
        var diff = Math.abs(now - self.timeStarted);
        self.currentTime(formatTimeFromDate(new Date(diff)));
    }
};
