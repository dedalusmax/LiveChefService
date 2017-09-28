var MainViewModel = function (parent) {
    var self = this;
    self.parent = parent;

    self.cookingData = ko.observableArray([
        { DishName: 'Pasta', Id: 1, Status: 'Started', Username: 'Pero' },
        { DishName: 'BBQ Sauce', Id: 2, Status: 'NeedHelp', Username: 'Štef' },
        { DishName: 'Bolognese', Id: 3, Status: 'Ongoing', Username: 'Josip' },
        { DishName: 'Baked potatoes', Id: 4, Status: 'NeedHelp', Username: 'Barica' }
    ]);

    self.logout = function () {
        ajax.logout(self.parent.user, self.logoutSucceeded.bind(self));
    };

    var hub = $.connection.chefHub;

    hub.client.cookingAdded = function (cooking) {
        console.log('New cooking added: ' + cooking.DishName);
    };

    hub.client.userLoggedIn = function (user) {
        console.log('User logged-in: ' + user.Username);
    };

    hub.client.usersUpdated = function (users) {

        users.forEach(function (user) {
            console.log('User updated: ' + user.displayName);
        });
    }

    hub.client.cookingsUpdated = function (cookings) {

        cookings.forEach(function (cooking) {
            console.log('Cooking updated: ' + cooking.DishName);
        });
    }

    var connection = $.hubConnection();
    connection.logging = true;

    $.connection.hub.start().done(function () {
        //hub.server.getData();
    });
};

MainViewModel.prototype.logoutSucceeded = function (user) {
    var self = this;
    $.connection.hub.stop();
    location.reload();
};
