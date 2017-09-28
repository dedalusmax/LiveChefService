var MainViewModel = function (parent) {
    var self = this;
    self.parent = parent;

    if (self.parent.user.isGuest == false){
        self.displayName = self.parent.user.displayName;
    } else {
        self.displayName = 'Guest';
    }

    self.cookings = ko.observableArray(); 
    // [
    //    { DishName: 'Pasta', Id: 1, Status: 'Started', Username: 'Pero' },
    //    { DishName: 'BBQ Sauce', Id: 2, Status: 'NeedHelp', Username: 'Štef' },
    //    { DishName: 'Bolognese', Id: 3, Status: 'Ongoing', Username: 'Josip' },
    //    { DishName: 'Baked potatoes', Id: 4, Status: 'NeedHelp', Username: 'Barica' }
    //]);

    self.logout = function () {
        ajax.logout(self.parent.user, self.logoutSucceeded.bind(self));
    };

    var hub = $.connection.chefHub;

    hub.client.cookingAdded = function (cooking) {
        self.cookings.push(cooking);
        console.log('New cooking added: ' + cooking.dishName);
    };

    hub.client.userLoggedIn = function (user) {
        console.log('User logged-in: ' + user.username);
    };

    hub.client.usersUpdated = function (users) {

        users.forEach(function (user) {
            console.log('User updated: ' + user.displayName);
        });
    }

    hub.client.cookingsUpdated = function (cookings) {
        cookings.forEach(function (cooking) {
            self.cookings.push(cooking);
            console.log('Cooking updated: ' + cooking.dishName);
        });
    }

    var connection = $.hubConnection();
    connection.logging = true;

    $.connection.hub.start().done(function () {
    });

    self.cookingDetails = function () {
        self.parent.cooking(new CookingViewModel(self));
        self.parent.showScreen(Screen.Cooking);
    };

    self.addNewCooking = function () {
        self.parent.newCooking(new NewCookingViewModel(self));
        self.parent.showScreen(Screen.NewCooking);
    }
};

MainViewModel.prototype.logoutSucceeded = function (user) {
    var self = this;
    $.connection.hub.stop();
    location.reload();
};
