var Screen = {
    Login: 1,
    Main: 2,
    Cooking: 3
};

var RootViewModel = function () {
    self = this;

    self.user = null;

    self.activeScreen = ko.observable(Screen.Login);

    self.showScreen = function (screen) {
        if (self.activeScreen() != screen) {
            self.activeScreen(screen);
            switch (screen) {
                case Screen.Main:
                    self.main(new MainViewModel(self));
                    break;
            }
        }
    };

    self.login = ko.observable(new LoginViewModel(self));
    self.main = ko.observable();
};