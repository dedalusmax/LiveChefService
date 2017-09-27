var Screen = {
    Login: 1,
    Main: 2,
    Cooking: 3
};

var MainViewModel = function () {
    self = this;

    self.showScreen = ko.observable(Screen.Login);

    self.login = ko.observable(new LoginViewModel(self));
    self.newCooking = ko.observable(new CookingViewModel());

    
};