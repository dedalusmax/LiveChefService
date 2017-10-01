var RecipeViewModel = function (data) {
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
}