
using System.Collections.Generic;

namespace LiveChefService.Models
{
    public class CookingRepository : BaseRepository<Cooking>
    {
        public CookingRepository()
        {
            User newChef = new User();
            newChef.DisplayName = "Pero";
            newChef.Username = "pr";
            newChef.Password = "123";
            newChef.IsLoggedIn = true;
            newChef.IsGuest = false;

            Recipe newDish = new Recipe();
            newDish.Name = "Fish and Chips";
            newDish.Time = 30;

            var ingredients = new List<Ingredient>();
            ingredients.Add(new Ingredient { Name = "Tortilla", Quantity = 4, QuantityType = "pcs" });
            ingredients.Add(new Ingredient { Name = "Gouda Cheese", Quantity = 120, QuantityType = "g" });
            ingredients.Add(new Ingredient { Name = "Fish", Quantity = 500, QuantityType = "g" });
            ingredients.Add(new Ingredient { Name = "Lemon juice", Quantity = 1, QuantityType = "pc" });
            ingredients.Add(new Ingredient { Name = "Flour", Quantity = 70, QuantityType = "g" });
            ingredients.Add(new Ingredient { Name = "Potatoes", Quantity = 500, QuantityType = "g" });
            ingredients.Add(new Ingredient { Name = "Onion", Quantity = 1, QuantityType = "pc" });
            ingredients.Add(new Ingredient { Name = "Pickles", Quantity = 100, QuantityType = "g" });
            ingredients.Add(new Ingredient { Name = "Cherry tomatoes", Quantity = 100, QuantityType = "g" });
            
            newDish.Ingredients = ingredients;
            Add(new Cooking { Id = 1, Chef = newChef, Status = CookingStatus.Started, Dish = newDish });
            ingredients.Clear();

            newChef = new User();
            newChef.DisplayName = "Štef";
            newChef.Username = "šf";
            newChef.Password = "123";
            newChef.IsLoggedIn = true;
            newChef.IsGuest = false;

            newDish = new Recipe();
            newDish.Name = "Pancakes";
            ingredients.Add(new Ingredient { Name = "Eggs", Quantity = 2, QuantityType = "pcs" });
            ingredients.Add(new Ingredient { Name = "Flour", Quantity = 2, QuantityType = "cups" });
            ingredients.Add(new Ingredient { Name = "Baking powder", Quantity = 1, QuantityType = "pc" });
            ingredients.Add(new Ingredient { Name = "Milk", Quantity = 2, QuantityType = "cups" });
            ingredients.Add(new Ingredient { Name = "Oil", Quantity = 10, QuantityType = "ml" });
            ingredients.Add(new Ingredient { Name = "Sugar", Quantity = 50, QuantityType = "g" });
            ingredients.Add(new Ingredient { Name = "Salt", Quantity = 1, QuantityType = "teaspoon" });
                        
            newDish.Ingredients = ingredients;
            Add(new Cooking { Id = 2, Chef = newChef, Status = CookingStatus.NeedHelp, Dish = newDish });
            ingredients.Clear();

            newChef = new User();
            newChef.DisplayName = "Đuro";
            newChef.Username = "đr";
            newChef.Password = "123";
            newChef.IsLoggedIn = true;
            newChef.IsGuest = false;

            newDish = new Recipe();
            newDish.Name = "Spaghetti bolognese";

            ingredients.Add(new Ingredient { Name = "Spaghetti", Quantity = 350, QuantityType = "g" });
            ingredients.Add(new Ingredient { Name = "Tomato sauce", Quantity = 2, QuantityType = "dl" });
            ingredients.Add(new Ingredient { Name = "Red Wine", Quantity = 50, QuantityType = "ml" });
            ingredients.Add(new Ingredient { Name = "Parsley", Quantity = 3, QuantityType = "pcs" });
            ingredients.Add(new Ingredient { Name = "Parmesan", Quantity = 50, QuantityType = "g" });
            ingredients.Add(new Ingredient { Name = "Salt", Quantity = 1, QuantityType = "teaspoon" });

            
            newDish.Ingredients = ingredients;
            Add(new Cooking { Id = 3, Chef = newChef, Status = CookingStatus.Ongoing, Dish = newDish });
            ingredients.Clear();

            newChef = new User();
            newChef.DisplayName = "Jura";
            newChef.Username = "jr";
            newChef.Password = "123";
            newChef.IsLoggedIn = true;
            newChef.IsGuest = false;

            newDish = new Recipe();
            newDish.Name = "Chocolate muffins";

            ingredients.Add(new Ingredient { Name = "Sugar", Quantity = 50, QuantityType = "g" });
            ingredients.Add(new Ingredient { Name = "Powdered Sugar", Quantity = 10, QuantityType = "g" });
            ingredients.Add(new Ingredient { Name = "Butter ", Quantity = 100, QuantityType = "g" });
            ingredients.Add(new Ingredient { Name = "Eggs", Quantity = 1, QuantityType = "pc" });
            ingredients.Add(new Ingredient { Name = "Milk", Quantity = 2, QuantityType = "dl" });
            ingredients.Add(new Ingredient { Name = "Cocoa", Quantity = 2, QuantityType = "tablespoon" });
            ingredients.Add(new Ingredient { Name = "Flour", Quantity = 100, QuantityType = "g" });
            ingredients.Add(new Ingredient { Name = "Chopped hazelnuts", Quantity = 50, QuantityType = "g" });
            ingredients.Add(new Ingredient { Name = "Chocolate", Quantity = 200, QuantityType = "g" });

            
            newDish.Ingredients = ingredients;
            Add(new Cooking { Id = 4, Chef = newChef, Status = CookingStatus.NeedHelp, Dish = newDish });
        }
    }
}