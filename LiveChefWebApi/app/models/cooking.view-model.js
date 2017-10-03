var CookingViewModel = function (data, chefIsMe) {
    var self = this;

    // take over the data from the model
    $.extend(self, data);

    // add new fields to the model
    self.dish = new RecipeViewModel(data.dish);
    self.chefIsMe = chefIsMe || false;

    var timeStarted = new Date(data.startedTime);
    self.timeStarted = formatTimeFromDate(timeStarted);

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

    if (self.chefIsMe) {
        $.extend(self, new MyCookingViewModel(self));
    } else {
        $.extend(self, new ChefCookingViewModel(self));
    }

    self.returnToMain = function () {
        console.log("Cooking closed: " + self.id);
        root.showScreen(Screen.Main);
    };

    self.refreshTime = function (now) {
        var diff = Math.abs(now - timeStarted);
        self.currentTime(formatTimeFromDate(new Date(diff)));
    }
};
