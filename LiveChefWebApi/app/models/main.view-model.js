﻿var MainViewModel = function (parent) {
    var self = this;
    self.parent = parent;

    self.activeTab = ko.observable(1);
    self.activateTab = function (tabId) {
        self.activeTab(tabId);  
        self.closeNavbar();
    };

    // these are the responsive lists of important data
    self.cookings = ko.observableArray(); 
    self.recipes = ko.observableArray();
    self.recordedCookings = ko.observableArray(); 
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

    hub.client.rtcMessageReceived = function (message) {
        self.communicator.rtcMessageReceived(message);
    };

    hub.client.joinRequested = function (action, userIdToConnect) {
        console.log('Join requested. Media: ' + action + ' user to connect: ' + userIdToConnect);
        self.activateTab(4); // immediately jump to the Users tab
        self.communicator.joinRequested(action, userIdToConnect);
    };

    hub.client.rtcDataTransferRequested = function (filename, size) {
        self.communicator.rtcDataTransferRequested(filename, size);
    };

    hub.client.usersInitiated = function (users) {
        users.forEach(function (user) {
            self.users.push(new UserViewModel(user));
            console.log('User updated: ' + user.displayName);
        });
    };

    hub.client.recipesInitiated = function (recipes) {
        recipes.forEach(function (recipe) {
            self.recipes.push(new RecipeViewModel(recipe));
            console.log('Recipe initiated: ' + recipe.name);
        });
    };

    hub.client.cookingAdded = function (cooking) {
        self.cookings.push(new CookingViewModel(cooking));
        console.log('New cooking added: ' + cooking.dish.name);
    };

    hub.client.cookingUpdated = function (cooking) {
        var found = self.cookings().find(c => c.id == cooking.id);
        if (found) {
            if (cooking.status == 4) {
                // remove from live cooking
                self.cookings.remove(function (c) {
                    return c.id == cooking.id;
                });
                // and add it to recorded cookings
                self.recordedCookings.push(new CookingViewModel(cooking));
                console.log('Recorded cooking added: ' + cooking.dish.name);
            } else {
                found.status(cooking.status);
                console.log('Cooking updated: ' + cooking.id + ' status: ' + found.statusText());
            }
            // TODO: update active cooking too!
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
    };

    hub.client.recordedCookingsInitiated = function (cookings) {
        cookings.forEach(function (cooking) {
            self.recordedCookings.push(new CookingViewModel(cooking));
            console.log('Recorded cooking initiated: ' + cooking.dish.name);
        });
    };

    hub.client.leaveFromCooking = function (cookingId) {
        // report to any possible viewers that the cooking is removed!!
        if (root.cooking() && root.cooking().id == cookingId) {
            root.cooking().leave();
            console.log('Left cooking: ' + cookingId);
        }
    };

    hub.client.chatMessageReceived = function (cookingId, sender, text, time) {
        // relay message only to active cooking that is that one
        if (root.cooking() && root.cooking().id == cookingId) {
            root.cooking().addChatMessage(sender, text, time);
            console.log('Chat message received for cooking : ' + cookingId + ' from: ' + sender + ' with text: ' + text);
        }
    };

    hub.client.cookingMediaTransferStarted = function (cookingId) {
        if (root.cooking() && root.cooking().id == cookingId) {
            console.log('cookingMediaTransferStarted: ' + cookingId);
            root.cooking().cookingMediaTransferStarted(cookingId);
        }
    };

    hub.client.cookingMediaTransferSend = function (cookingId, blob) {
        if (root.cooking() && root.cooking().id == cookingId) {
            console.log('cookingMediaTransferSend: ' + cookingId);
            root.cooking().cookingMediaTransferSend(cookingId, blob);
        }
    };

    hub.client.cookingMediaTransferEnded = function (cookingId) {
        if (root.cooking() && root.cooking().id == cookingId) {
            console.log('cookingMediaTransferStarted: ' + cookingId);
            root.cooking().cookingMediaTransferEnded(cookingId);
        }
    };

    var connection = $.hubConnection();
    connection.logging = true;

    $.connection.hub.start().done(function () {

        // inform signalr about me as a new hub group
        hub.server.join(root.user.id);
    });

    //#endregion

    self.viewCooking = function (cooking) {
        //var model = new CookingViewModel(cooking);
        console.log('Entering cooking: ' + cooking.id);
        cooking.open();
        root.cooking(cooking);
        self.parent.showScreen(Screen.Cooking);
    };

    self.addNewCooking = function () {
        self.parent.newCooking(new NewCookingViewModel());
        self.parent.showScreen(Screen.NewCooking);
        self.closeNavbar();
    };

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

MainViewModel.prototype.closeNavbar = function () {
    var navbarToogle = document.querySelector('.navbar-toggle');
    if ($(navbarToogle).is(':visible')) {
        navbarToogle.click();
    }
};


