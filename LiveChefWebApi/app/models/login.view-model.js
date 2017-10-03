var LoginViewModel = function (parent) {
    var self = this;
    self.parent = parent;

    self.userName = ko.observable(getCookie('username'));
    self.password = ko.observable(getCookie('password'));
     
    self.error = ko.observable(null);

    self.loginUser = function () {
        ajax.login(self.userName(), self.password(), self.loginSucceeded.bind(self), self.loginFailed.bind(self));
    };

    self.loginAsGuest = function () {
        ajax.loginAsGuest(self.loginSucceeded.bind(self), self.loginFailed.bind(self));
    };
}

LoginViewModel.prototype.loginSucceeded = function (user) {
    var self = this;
    self.parent.user = user;

    if (!user.isGuest) {
        setCookie('username', user.username);
        setCookie('password', user.password);
    }

    self.parent.main(new MainViewModel(self.parent));
    self.parent.showScreen(Screen.Main);
    self.error(null);
};

LoginViewModel.prototype.loginFailed = function (error) {
    var self = this;
    self.error(error.responseJSON);
};