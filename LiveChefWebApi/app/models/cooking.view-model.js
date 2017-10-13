var CookingViewModel = function (data, chefIsMe) {
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

    self.chatHistory = ko.observableArray();
    self.chatMessage = ko.observable('');
    self.chatMessageFocused = ko.observable(true);

    self.addChatMessage = function (sender, text) {

        self.chatHistory.push(new ChatViewModel(sender, text));
        self.chatHistory.valueHasMutated();
    };

    self.sendChatMessage = function () {

        var messageText = self.chatMessage();
        var message = new ChatViewModel('Me', messageText);
        self.chatHistory.push(message);

        root.hub.server.sendChatMessage(self.id, root.user.displayName, messageText).done(function () {
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
};
