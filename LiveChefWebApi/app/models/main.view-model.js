var MainViewModel = function (parent) {
    var self = this;
    self.parent = parent;

    self.cookingTitle = ko.observable('Live chef');
    self.guestsTitle = ko.observable('Guests');
    self.userName = ko.observable('');

    if (self.parent.user.IsGuest == false){
        self.userName = self.parent.user.Username;
    } else {
        self.userName = 'Guest';
    }

    self.cookingData = ko.observableArray([
        { DishName: 'Pasta', Id: 1, Status: 'Started', Username: 'Pero' },
        { DishName: 'BBQ Sauce', Id: 2, Status: 'NeedHelp', Username: 'Štef' },
        { DishName: 'Bolognese', Id: 3, Status: 'Ongoing', Username: 'Josip' },
        { DishName: 'Baked potatoes', Id: 4, Status: 'NeedHelp', Username: 'Barica' }
    ]);

    connector.subscribe('userLoggedIn', function (user) {
        console.log('User logged-in: ' + user.Username);
    });

    connector.subscribe('cookingsUpdated', function (cookings) {
        cookings.forEach(function (cooking) {
            console.log('Cooking updated: ' + cooking.DishName);
        });
    });

    connector.init();

    self.logout = function () {
        ajax.logout(self.parent.user, self.logoutSucceeded.bind(self));
    };

    self.cookingDetails = function () {
        self.parent.cooking = new CookingViewModel(self);
        self.parent.showScreen(Screen.Cooking);
    };

    self.addNewCooking = function () {
     //   self.parent.newCooking = new NewCookingViewModel(self);
        self.parent.showScreen(Screen.NewCooking);
    }
};

MainViewModel.prototype.logoutSucceeded = function (user) {
    var self = this;
    self.parent.user = null;
    self.parent.showScreen(Screen.Login);
};
