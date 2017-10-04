'use strict';

var NewCookingViewModel = function () {
    var self = this;

    var hub = root.hub;

    var noPages = 2;
    self.activePage = ko.observable(1);
    self.activatePage = function (moveStep) {
        var newPage = self.activePage() + moveStep;
        if (newPage < 1) {
            newPage = noPages;
        } else if (newPage > noPages) {
            newPage = 1;
        }
        self.activePage(newPage);
    };

    // list of recipes loaded from the server
    self.recipes = ko.observableArray();
    self.selectedRecipe = ko.observable(null);
    self.selectRecipe = function (recipe) {
        self.selectedRecipe(recipe);
    }

    // settings
    self.useMicrophone = ko.observable(true);
    self.useCamera = ko.observable(true);
    self.useChat = ko.observable(true);
    self.allowHelp = ko.observable(true);

    self.audioInputs = ko.observableArray();
    self.audioOutputs = ko.observableArray();
    self.videoInputs = ko.observableArray();

    self.selectedAudioInput = ko.observable();
    self.selectedAudioOutput = ko.observable();
    self.selectedVideoInput = ko.observable();

    self.returnToMain = function () {
        root.showScreen(Screen.Main);
    };

    self.startCooking = function () {

        var newCooking = {
            chef: root.user, dish: self.selectedRecipe(),
            settings: {
                useMicrophone: self.useMicrophone(),
                useCamera: self.useCamera(),
                useChat: self.useChat(),
                allowHelp: self.allowHelp()
            }
        };

        hub.server.addCooking(newCooking).done(function (cooking) {
            console.log("Cooking added: " + cooking.dish.name);

            // save selected devices into cookies
            setCookie('audioInput', JSON.stringify(self.selectedAudioInput()));
            setCookie('audioOutput', JSON.stringify(self.selectedAudioOutput()));
            setCookie('videoInput', JSON.stringify(self.selectedVideoInput()));

            var model = new CookingViewModel(cooking, true);
            model.open();
            root.cooking(model);
            root.showScreen(Screen.Cooking);
        });
    };

    hub.server.getAllRecipes().done(function (recipes) {
        recipes.forEach(function (recipe) {
            self.recipes.push(new RecipeViewModel(recipe, true));
            console.log("Recipe loaded: " + recipe.name);
        });
    });

    navigator.mediaDevices.enumerateDevices().then(self.devicesRetrieved.bind(self)).catch(self.devicesError);
};

NewCookingViewModel.prototype.devicesRetrieved = function (devices) {
    var self = this;

    self.audioInputs.removeAll();
    self.audioOutputs.removeAll();
    self.videoInputs.removeAll();

    devices.forEach(function(device) {
        switch (device.kind) {
            case 'audioinput':
                self.audioInputs.push(device);
                break;
            case 'audiooutput':
                self.audioOutputs.push(device);
               break;
            case 'videoinput':
                self.videoInputs.push(device);
               break;
            default:
                console.log('Some other kind of source/device: ', deviceInfo);
        }
    });
}

NewCookingViewModel.prototype.devicesError = function (error) {
    console.log('navigator.getUserMedia error: ', error);
}