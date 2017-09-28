var NewCookingViewModel = function (parent) {
    var self = this;
    self.parent = parent;


    self.returnToMain = function () {
        self.parent.showScreen(Screen.Main);
    };

};