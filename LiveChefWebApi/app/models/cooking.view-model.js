var CookingViewModel = function () {
    var self = this;

    self.show = ko.observable(false);

    connector.subscribe('userLoggedIn', function (user) {
        console.log('User logged-in: ' + user.Username);
    });

    connector.subscribe('cookingsUpdated', function (cookings) {
        cookings.forEach(function (cooking) {
            console.log('Cooking updated: ' + cooking.DishName);
        });
    });

    connector.init();
};