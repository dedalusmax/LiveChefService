var CookingViewModel = function (parent) {
    var self = this;
    self.parent = parent;


    self.cookingDetailsTitle = ko.observable("Cooking details");
    self.recipeName = ko.observable("name of recipe")
    self.recipeDetails = ko.observable("recipe details")

    self.returnToMain = function () {
        root.showScreen(Screen.Main);
    };

};