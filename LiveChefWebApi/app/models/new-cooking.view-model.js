var NewCookingViewModel = function (parent) {
    var self = this;
    self.parent = parent;


    self.returnToMain = function () {
        root.showScreen(Screen.Main);
    };
};