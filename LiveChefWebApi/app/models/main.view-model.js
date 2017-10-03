var MainViewModel = function (parent) {
    var self = this;
    self.parent = parent;

    self.activeTab = ko.observable(1);
    self.activateTab = function (tabId) {
        self.activeTab(tabId);
    };

    self.cookings = ko.observableArray(); 
    self.recipes = ko.observableArray(); 

    self.logout = function () {
        ajax.logout(self.parent.user, self.logoutSucceeded.bind(self));
    };

    var hub = self.parent.hub;

    hub.client.userLoggedIn = function (user) {
        console.log('User logged-in: ' + user.username);
    };

    hub.client.usersInitiated = function (users) {
        users.forEach(function (user) {
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
    });

    self.viewCooking = function (cooking) {
        self.parent.cooking(new CookingViewModel(cooking));
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
