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

/*
 * Valid options are:
 * - chunk_read_callback: a function that accepts the read chunk
                          as its only argument. If binary option
                          is set to true, this function will receive
                          an instance of ArrayBuffer, otherwise a String
 * - error_callback:      an optional function that accepts an object of type
                          FileReader.error
 * - success:             an optional function invoked as soon as the whole file has been
                          read successfully
 * - binary:              If true chunks will be read through FileReader.readAsArrayBuffer
 *                        otherwise as FileReader.readAsText. Default is false.
 * - chunk_size:          The chunk size to be used, in bytes. Default is 64K.
 */
function parseFile(file, options) {
    var opts = typeof options === 'undefined' ? {} : options;
    var fileSize = file.size;
    var chunkSize = typeof opts['chunk_size'] === 'undefined' ? 64 * 1024 : parseInt(opts['chunk_size']); // bytes
    var binary = typeof opts['binary'] === 'undefined' ? false : opts['binary'] == true;
    var offset = 0;
    var self = this; // we need a reference to the current object
    var readBlock = null;
    var chunkReadCallback = typeof opts['chunk_read_callback'] === 'function' ? opts['chunk_read_callback'] : function () { };
    var chunkErrorCallback = typeof opts['error_callback'] === 'function' ? opts['error_callback'] : function () { };
    var success = typeof opts['success'] === 'function' ? opts['success'] : function () { };

    var onLoadHandler = function (evt) {
        if (evt.target.error == null) {
            offset += evt.target.result.length;
            chunkReadCallback(evt.target.result);
        } else {
            chunkErrorCallback(evt.target.error);
            return;
        }
        if (offset >= fileSize) {
            success(file);
            return;
        }

        readBlock(offset, chunkSize, file);
    }

    readBlock = function (_offset, length, _file) {
        var r = new FileReader();
        var blob = _file.slice(_offset, length + _offset);
        r.onload = onLoadHandler;
        if (binary) {
            r.readAsArrayBuffer(blob);
        } else {
            r.readAsText(blob);
        }
    }

    readBlock(offset, chunkSize, file);
}