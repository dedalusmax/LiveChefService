var CookingViewModel = function (parent) {
    var self = this;
    self.parent = parent;

    self.cookingData = ko.observableArray([
    { DishName: 'Pasta', Id: 1, Status: 'Started', Username: 'Pero' },
    { DishName: 'BBQ Sauce', Id: 2, Status: 'NeedHelp', Username: 'Štef' },
    { DishName: 'Bolognese', Id: 3, Status: 'Ongoing', Username: 'Josip' },
    { DishName: 'Baked potatoes', Id: 4, Status: 'NeedHelp', Username: 'Barica' }
    ]);
  
    connector.subscribe('userLoggedIn', function (user) {
        console.log('User logged-in: ' + user.Username);
    });

    connector.subscribe('cookingsUpdated', function (cookings) {
        cookings.forEach(function (cooking) {
            console.log('Cooking updated: ' + cooking.DishName);
        });
    });

    connector.init();
};