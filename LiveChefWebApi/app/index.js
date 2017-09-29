var root;

$(document).ready(function () {

    infuser.defaults.templateUrl = "app/templates";

    root = new RootViewModel();
    ko.applyBindings(root);
});

window.onunload = function () {
    if (root.user) {
        ajax.logout(root.user);
    }
}