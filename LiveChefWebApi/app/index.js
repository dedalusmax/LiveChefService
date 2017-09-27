var logEl;
var root;

$(document).ready(function () {

    root = new MainViewModel();
    ko.applyBindings(root);
    //return;

    logEl = $("#log");
    var hub = $.connection.chefHub;

    hub.client.cookingAdded = function (cooking) {
        log('New cooking added: ' + cooking.DishName);
    };

    hub.client.userLoggedIn = function (user) {
        log('User logged-in: ' + user.Username);
    };

    hub.client.cookingsUpdated = function (cookings) {

        cookings.forEach(function (cooking) {
            log('Cooking updated: ' + cooking.DishName);
        });
    };

    $.connection.hub.start().done(function () {
        $("#sendCooking").click(function () {
            var username = $("#username").val();
            var dishname = $("#dishname").val();
            var status = $("#status").val();
            var data = { Username: username, DishName: dishname, Status: status };

            hub.server.addCooking(data);
        });
    });
});

function log(message) {

    logEl.append('<li>' + message + '</li>');
}