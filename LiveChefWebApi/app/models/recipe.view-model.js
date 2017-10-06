var RecipeViewModel = function (data, showDetails) {
    var self = this;

    $.extend(self, data);

    switch (data.difficultyLevel) {
        case 1:
            self.difficultyText = 'Beginner';
            break;
        case 2:
            self.difficultyText = 'Intermediate';
            break;
        case 3:
            self.difficultyText = 'Advanced';
            break;
    }

    self.showDetails = ko.observable(showDetails);
}