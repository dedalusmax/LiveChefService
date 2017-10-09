var MainViewModel = function (parent) {
    var self = this;
    self.parent = parent;

    self.activeTab = ko.observable(1);
    self.activateTab = function (tabId) {
        self.activeTab(tabId);
    };

    // these are the responsive lists of important data
    self.cookings = ko.observableArray(); 
    self.recipes = ko.observableArray();
    self.users = ko.observableArray(); 

    // this is the view model for communicating via WebRTC
    self.communicator = new CommunicatorViewModel();

    // this is the view of not-myself users (for the chefs online)
    self.usersView = ko.computed(function () {
        return self.users().filter(u => u.id !== root.user.id);
    });

    self.logout = function () {
        ajax.logout(self.parent.user, self.logoutSucceeded.bind(self));
    };

    //#region SignalR initialization and event handlers

    var hub = self.parent.hub;

    hub.client.userLoggedIn = function (user) {
        if (user.isGuest) {
            self.users.push(new UserViewModel(user));           
        } else {
            var found = self.users().find(c => c.id == user.id);
            found.isLoggedIn(true);
        }
        console.log('User logged-in: ' + user.displayName);
    };

    hub.client.userLoggedOut = function (user) {
        var found = self.users().find(c => c.id == user.id);
        if (user.isGuest && found) {
            self.users.remove(found);
        } else if (found) {
            found.isLoggedIn(false);
        }
        console.log('User logged-out: ' + user.displayName);
    };

    hub.client.newMessage = function (message) {
        self.communicator.newMessage(message);
    };

    hub.client.joinRequested = function (action, userIdToConnect) {
        console.log('Join requested. Media: ' + action + ' user to connect: ' + userIdToConnect);
        self.activateTab(4);
        self.communicator.joinRequested(action, userIdToConnect);
    };

    hub.client.usersInitiated = function (users) {
        users.forEach(function (user) {
            self.users.push(new UserViewModel(user));
            console.log('User updated: ' + user.displayName);
        });
    }

    hub.client.recipesInitiated = function (recipes) {
        recipes.forEach(function (recipe) {
            self.recipes.push(new RecipeViewModel(recipe));
            console.log('Recipe initiated: ' + recipe.name);
        });
    }

    hub.client.cookingAdded = function (cooking) {
        self.cookings.push(new CookingViewModel(cooking));
        console.log('New cooking added: ' + cooking.dish.name);
    };

    hub.client.cookingUpdated = function (cooking) {
        var found = self.cookings().find(c => c.id == cooking.id);
        if (found) {
            found.transmission = cooking.transmission;
            console.log('Cooking updated: ' + cooking.id + ' transmission: ' + cooking.transmission);
        }
    };

    hub.client.cookingRemoved = function (cookingId) {
        self.cookings.remove(function (cooking) {
            return cooking.id == cookingId;
        });
        console.log('Cooking removed: ' + cookingId);
    };
    
    hub.client.cookingsInitiated = function (cookings) {
        cookings.forEach(function (cooking) {
            self.cookings.push(new CookingViewModel(cooking));
            console.log('Cooking initiated: ' + cooking.dish.name);
        });
    }

    var connection = $.hubConnection();
    connection.logging = true;

    $.connection.hub.start().done(function () {

        // inform signalr about me as a new hub group
        hub.server.join(root.user.id);
    });

    //#endregion

    self.viewCooking = function (cooking) {
        var model = new CookingViewModel(cooking);
        model.open();
        root.cooking(model);
        self.parent.cooking(model);
        self.parent.showScreen(Screen.Cooking);
    };

    self.addNewCooking = function () {
        self.parent.newCooking(new NewCookingViewModel());
        self.parent.showScreen(Screen.NewCooking);
    }

    var timer = window.setInterval(function () {
        var now = new Date();
        self.cookings().forEach(function (cooking) {
            cooking.refreshTime(now);
        });
    }, 1000);
};

MainViewModel.prototype.logoutSucceeded = function (user) {
    var self = this;
    $.connection.hub.stop();
    location.reload();
};
