'use strict';

var CookingViewModel = function (parent) {
    var self = this;
    self.parent = parent;

    $(document).ready(function () {
        self.videoElement = document.querySelector('video');
    });
    self.cookingDetailsTitle = ko.observable("Cooking details");
    self.recipeName = ko.observable("name of recipe")
    self.recipeDetails = ko.observable("")
    self.videoSource = ko.observable(self.readCookie("audio="));
    self.audioSource = ko.observable(self.readCookie("video="));
    self.useChat = ko.observable(self.parent.useChat());
    self.useCamera = ko.observable(self.parent.useCamera());
    self.useMicrophone = ko.observable(self.parent.useMicrophone());

    self.returnToMain = function () {
        root.showScreen(Screen.Main);
    };

    if (audioSource != null) {
        self.recipeDetails("audio: " + self.audioSource() + "evo i video" + self.videoSource());
    }

    function gotStream(stream) {
        window.stream = stream; // make stream available to console
        self.videoElement.srcObject = stream;
        // Refresh button list in case labels have become available
        return navigator.mediaDevices.enumerateDevices();
    }

    var constraints = {
        audio: self.useMicrophone() == true ?{ deviceId: self.audioSource() ? { exact: audioSource } : undefined }: false,
        video: self.useCamera() == true ? { deviceId: self.videoSource() ? { exact: videoSource } : undefined } : false
    };

    navigator.mediaDevices.getUserMedia(constraints).
        then(gotStream).then(self.parent.gotDevices).catch(self.parent.handleError);
};

CookingViewModel.prototype.readCookie = function (name) {
    var self = this;
    var ca = self.parent.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        if (c.indexOf(name) == 1) return c.substring(name.length, c.length);

    }
    return null;
};
