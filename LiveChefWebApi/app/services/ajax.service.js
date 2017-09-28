var baseUri = 'api/';

var ajax = function () {
    var self = this;

    var sendRequest = function (uri, type, data, successCallback, errorCallback) {

        $.ajax({
            url: uri,
            type: type,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(data),
            success: function (response) {
                var model = JSON.parse(response);
                successCallback.call(this, model);
            },
            error: errorCallback
        });
    }

    self.login = function (username, password, successCallback, errorCallback) {

        var data = { Username: username, Password: password };
        sendRequest(baseUri + 'user/login', 'POST', data, successCallback, errorCallback);
    };

    self.loginAsGuest = function (successCallback, errorCallback) {

        var data = {};
        sendRequest(baseUri + 'user/loginAsGuest', 'POST', data, successCallback, errorCallback);
    };

    self.logout = function (user, successCallback, errorCallback) {

        var data = user;
        sendRequest(baseUri + 'user/logout', 'POST', data, successCallback, errorCallback);
    };

    return {
        login: login,
        loginAsGuest: loginAsGuest,
        logout: logout
    };
}();