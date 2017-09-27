function getCurrentTime() {
    /// <summary>Gets the current time, formated as h:m:s.ms</summary>

    var now = new Date();
    return now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '.' + now.getMilliseconds();
}