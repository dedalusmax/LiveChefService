var root;

$(document).ready(function () {

    root = new RootViewModel();
    ko.applyBindings(root);
});

window.onunload = function () {
    ajax.logout(root.user);
}