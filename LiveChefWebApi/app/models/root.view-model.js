var Screen = {
    Login: 1,
    Main: 2,
    Cooking: 3,
    NewCooking: 4
};

var RootViewModel = function () {
    self = this;

    self.user = null;
    self.hub = $.connection.chefHub;

    self.activeScreen = ko.observable(Screen.Login);

    self.showScreen = function (screen) {
        if (self.activeScreen() != screen) {
            self.activeScreen(screen);
        }
    };

    self.login = ko.observable(new LoginViewModel(self));
    self.main = ko.observable();
    self.cooking = ko.observable();
    self.newCooking = ko.observable();
};