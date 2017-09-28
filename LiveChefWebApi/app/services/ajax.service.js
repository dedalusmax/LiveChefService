var baseUri = 'api/';

var ajax = function () {
    var self = this;

    self.login = function (username, password, successCallback, errorCallback) {

        var data = { Username: username, Password: password };
        var header = $.ajax({
            url: baseUri + 'user/login',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(data),
            success: successCallback,
            error: errorCallback
            //error: function (error) {
            //    alert(error);
            //}
        });
    };

    self.loginAsGuest = function (successCallback, errorCallback) {

        var data = { };
        var header = $.ajax({
            url: baseUri + 'user/loginAsGuest',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(data),
            success: successCallback,
            error: errorCallback
        });
    };

    self.logout = function (user, successCallback, errorCallback) {

        var data = user;
        var header = $.ajax({
            url: baseUri + 'user/logout',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(data),
            success: successCallback,
            error: errorCallback
        });
    };

    return {
        login: login,
        loginAsGuest: loginAsGuest,
        logout: logout
    };
}();