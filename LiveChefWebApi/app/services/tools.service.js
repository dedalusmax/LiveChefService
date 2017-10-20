function getCurrentTime() {
    /// <summary>Gets the current time, formated as h:m:s.ms</summary>

    var now = new Date();
    return now.getUTCHours() + ':' + now.getUTCMinutes() + ':' + now.getUTCSeconds() + '.' + now.getUTCMilliseconds();
}

function setCookie(name, value) {
    var d = new Date();
    var expiryDays = 365; // whole year
    d.setTime(d.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
    var expires = 'expires=' + d.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
}

function getCookie(name) {
    var name = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

function formatTimeFromDate(date) {

    var mins = date.getMinutes();
    var secs = date.getSeconds();
    if (mins < 10) mins = '0' + mins;
    if (secs < 10) secs = '0' + secs;
    return date.getHours() + ':' + mins + ':' + secs;
}

ko.bindingHandlers.toggle = {

    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        // This will be called when the binding is first applied to an element
        // Set up any initial state, event handlers, etc. here

        if (valueAccessor()()) {
            $(element).addClass('active');
        }

        ko.utils.registerEventHandler(element, "click", function (event) {
            var checked = $(event.target).hasClass('active');
            valueAccessor()(!checked);
        });
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        // This will be called once when the binding is first applied to an element,
        // and again whenever any observables/computeds that are accessed change
        // Update the DOM element based on the supplied values here.
    }
};
