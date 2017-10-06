var UserViewModel = function (data) {
    var self = this;

    $.extend(self, data);

    self.isLoggedIn = ko.observable(data.isLoggedIn);

    self.startVideoCall = function () {
        alert('start!');
    }
}