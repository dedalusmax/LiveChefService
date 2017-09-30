'use strict';

var NewCookingViewModel = function (parent) {
    var self = this;
    self.parent = parent;

    self.cookie = '';

    self.useMicrophone = ko.observable(false)
    self.useCamera = ko.observable(false);
    self.useChat = ko.observable(false);

    self.returnToMain = function () {
        root.showScreen(Screen.Main);
    };

    self.startCooking = function () {
        root.cooking(new CookingViewModel(self));
        root.showScreen(Screen.Cooking);
    };

    var hub = $.connection.chefHub;

    self.recipes = ko.observableArray();
    self.selectedRecipe = ko.observable();
    self.difficultyLevel = ko.observable();
    self.ingredients = ko.observableArray();
    self.time = ko.observable();

    hub.server.getAllRecipes().done(function (recipes) {
        recipes.forEach(function (recipe) {
            self.recipes.push(recipe);
            console.log("Recipe: " + recipe);
        });
    });

   
    self.selectedRecipe.subscribe(function (selectedRecipe) {
        self.ingredients(null);
        self.difficultyLevel(selectedRecipe.difficultyLevel);
        self.ingredients(selectedRecipe.ingredients);
        self.time(selectedRecipe.time);
    })

    $(document).ready(function () {
        var self = this;
        self.videoElement = document.querySelector('video');
        self.audioInputSelect = document.querySelector('select#audioSource');
        self.audioOutputSelect = document.querySelector('select#audioOutput');
        self.videoSelect = document.querySelector('select#videoSource');
        self.selectors = [self.audioInputSelect, self.audioOutputSelect, self.videoSelect];
        function gotDevices(deviceInfos) {
            // Handles being called several times to update labels. Preserve values.
            if (self.selectors) {
                var values = self.selectors.map(function (select) {
                    return select.value;
                });
                self.selectors.forEach(function (select) {
                    while (select.firstChild) {
                        select.removeChild(select.firstChild);
                    }
                });
                for (var i = 0; i !== deviceInfos.length; ++i) {
                    var deviceInfo = deviceInfos[i];
                    var option = document.createElement('option');
                    option.value = deviceInfo.deviceId;
                    if (deviceInfo.kind === 'audioinput') {
                        option.text = deviceInfo.label ||
                            'microphone ' + (self.audioInputSelect.length + 1);
                        self.audioInputSelect.appendChild(option);
                    } else if (deviceInfo.kind === 'audiooutput') {
                        option.text = deviceInfo.label || 'speaker ' +
                            (self.audioOutputSelect.length + 1);
                        self.audioOutputSelect.appendChild(option);
                    } else if (deviceInfo.kind === 'videoinput') {
                        option.text = deviceInfo.label || 'camera ' + (self.videoSelect.length + 1);
                        self.videoSelect.appendChild(option);
                    } else {
                        console.log('Some other kind of source/device: ', deviceInfo);
                    }
                }
                self.selectors.forEach(function (select, selectorIndex) {
                    if (Array.prototype.slice.call(select.childNodes).some(function (n) {
                        return n.value === values[selectorIndex];
                    })) {
                        select.value = values[selectorIndex];
                    }
                });
            }
        }

        navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

        // Attach audio output device to video element using device/sink ID.
        function attachSinkId(element, sinkId) {
            if (typeof element.sinkId !== 'undefined') {
                element.setSinkId(sinkId)
                    .then(function () {
                        console.log('Success, audio output device attached: ' + sinkId);
                    })
                    .catch(function (error) {
                        var errorMessage = error;
                        if (error.name === 'SecurityError') {
                            errorMessage = 'You need to use HTTPS for selecting audio output ' +
                                'device: ' + error;
                        }
                        console.error(errorMessage);
                        // Jump back to first output device in the list as it's the default.
                        self.audioOutputSelect.selectedIndex = 0;
                    });
            } else {
                console.warn('Browser does not support output device selection.');
            }
        }

        self.changeAudioDestination = function () {
            var audioDestination = self.audioOutputSelect.value;
            attachSinkId(self.videoElement, audioDestination);
        };
        var self = this;
        self.start = function () {
            if (window.stream) {
                window.stream.getTracks().forEach(function (track) {
                    track.stop();
                });
            }
            var audioSource = self.audioInputSelect.value;
            var videoSource = self.videoSelect.value;
            //var constraints = {
            //    audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
            //    video: { deviceId: videoSource ? { exact: videoSource } : undefined }
            //};

            var audio, video;

            if (self.useMicrophone() == true) {
                audio = "audio=" + audioSource + ";";
            }

            if (self.useCamera() == true) {
                video = "video=" + videoSource + ";";
            }
            document.cookie = audio + video;
            console.log("cookie: new-cooking: " + document.cookie);

            self.cookie = document.cookie;
            //navigator.mediaDevices.getUserMedia(constraints).
            //    then(gotStream).then(gotDevices).catch(handleError);
        };

        self.audioInputSelect.onchange = self.start;
        self.audioOutputSelect.onchange = self.changeAudioDestination;
        self.videoSelect.onchange = self.start;

        self.start;

        function handleError(error) {
            console.log('navigator.getUserMedia error: ', error);
        }
    });
};