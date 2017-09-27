var logEl;
var root;

$(document).ready(function () {

    root = new MainViewModel();
    ko.applyBindings(root);

    //connector.userLoggedIn = function (user) {
    //    log('User logged-in: ' + user.Username);
    //};

    //connector.cookingsUpdated = function (cookings) {

    //    cookings.forEach(function (cooking) {
    //        log('Cooking updated: ' + cooking.DishName);
    //    });
    //};

    //connector.cookingAdded = function (cooking) {
    //    log('New cooking added: ' + cooking.DishName);
    //};

    connector.subscribe('userLoggedIn', function (user) {
        log('User logged-in: ' + user.Username);
    });

    connector.init();
});

function log(message) {

    logEl.append('<li>' + message + '</li>');
}