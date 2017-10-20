var baseUri = 'api/';

var ajax = function () {
    var self = this;

    var sendRequest = function (uri, type, data, successCallback, errorCallback, binary) {

        $.ajax({
            url: uri,
            type: type,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: !binary ? JSON.stringify(data) : data,
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

    self.postData = function (id, type, size, data, successCallback, errorCallback) {

        var data = {
            Id: id,
            Type: type,
            Size: size,
            Data: data
        };

        var dataBuffer = JSON.stringify(data, function (k, v) {
            if (v instanceof Uint8Array) {
                return Array.apply([], v);
            }
            return v;
        });

        sendRequest(baseUri + 'data', 'POST', dataBuffer, successCallback, errorCallback, true);
    };

    return {
        login: login,
        loginAsGuest: loginAsGuest,
        logout: logout,
        postData: postData
    };
}();