var baseUri = 'api/user/login';

var AjaxService = function () {
    var self = this;

    self.login = function (username, password, successCallback, errorCallback) {

        var data = { Username: username, Password: password };
        var header = $.ajax({
            url: baseUri,
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(data),
            success: successCallback,
            error: errorCallback
        });
    };
    return {
        loginUser: login
    };
}();