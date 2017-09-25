$(document).ready(function () {

    var hub = $.connection.chefHub;

    hub.client.cookingAdded = function (cooking) {

    };

    // hub.server.send(message);

    hub.client.cookingsUpdated = function (cookings) {

        //$("#cookings").remove();

        cookings.forEach(function (cooking) {
            $("#cookings").append('<li>' + cooking.DishName + '</li>');
        });
    }

    $.connection.hub.start().done(function () {



    });

});