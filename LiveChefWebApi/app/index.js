var root;

$(document).ready(function () {

    root = new RootViewModel();
    ko.applyBindings(root);
});

window.onunload = function () {
    if (root.user) {
        ajax.logout(root.user);
    }
}