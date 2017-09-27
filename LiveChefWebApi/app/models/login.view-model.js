var LoginViewModel = function (element) {
    var self = this;

    self.userName = ko.observable();
    self.password = ko.observable();
    self.showMainScreen = ko.observable(false);

    self.loginUser = function () {
        AjaxService.loginUser(self.userName(), self.password(),
            function (response) {
                var data = response;
                showMainScreen = true;
                console.log("response: " + data.Username);
            },
            function (error) {
                console.log("Error");
            });
    };
}