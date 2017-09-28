using System.Collections.Generic;

namespace LiveChefService.Models
{
    public class RecipeRepository : BaseRepository<Recipe>
    {
        public RecipeRepository()
        {
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

            Add(new Recipe { Id = 1, Name = "Fish and Chips", DifficultyLevel = Difficulty.Intermediate, Time = 30, Ingredients = ingredients });

            ingredients.Clear();
            ingredients.Add(new Ingredient { Name = "Eggs", Quantity = 2, QuantityType = "pcs" });
            ingredients.Add(new Ingredient { Name = "Flour", Quantity = 2, QuantityType = "cups" });
            ingredients.Add(new Ingredient { Name = "Baking powder", Quantity = 1, QuantityType = "pc" });
            ingredients.Add(new Ingredient { Name = "Milk", Quantity = 2, QuantityType = "cups" });
            ingredients.Add(new Ingredient { Name = "Oil", Quantity = 10, QuantityType = "ml" });
            ingredients.Add(new Ingredient { Name = "Sugar", Quantity = 50, QuantityType = "g" });
            ingredients.Add(new Ingredient { Name = "Salt", Quantity = 1, QuantityType = "teaspoon" });

            Add(new Recipe { Id = 2, Name = "Pancakes", DifficultyLevel = Difficulty.Beginner, Time= 90, Ingredients = ingredients });

            ingredients.Clear();
            ingredients.Add(new Ingredient { Name = "Spaghetti", Quantity = 350, QuantityType = "g" });
            ingredients.Add(new Ingredient { Name = "Tomato sauce", Quantity = 2, QuantityType = "dl" });
            ingredients.Add(new Ingredient { Name = "Red Wine", Quantity = 50, QuantityType = "ml" });
            ingredients.Add(new Ingredient { Name = "Parsley", Quantity = 3, QuantityType = "pcs" });
            ingredients.Add(new Ingredient { Name = "Parmesan", Quantity = 50, QuantityType = "g" });
            ingredients.Add(new Ingredient { Name = "Salt", Quantity = 1, QuantityType = "teaspoon" });

            Add(new Recipe { Id = 2, Name = "Chocolate Muffins", DifficultyLevel = Difficulty.Beginner, Time = 90, Ingredients = ingredients });

            ingredients.Clear();
            ingredients.Add(new Ingredient { Name = "Sugar", Quantity = 50, QuantityType = "g" });
            ingredients.Add(new Ingredient { Name = "Powdered Sugar", Quantity = 10, QuantityType = "g" });
            ingredients.Add(new Ingredient { Name = "Butter ", Quantity = 100, QuantityType = "g" });
            ingredients.Add(new Ingredient { Name = "Eggs", Quantity = 1, QuantityType = "pc" });
            ingredients.Add(new Ingredient { Name = "Milk", Quantity = 2, QuantityType = "dl" });
            ingredients.Add(new Ingredient { Name = "Cocoa", Quantity = 2, QuantityType = "tablespoon" });
            ingredients.Add(new Ingredient { Name = "Flour", Quantity = 100, QuantityType = "g" });
            ingredients.Add(new Ingredient { Name = "Chopped hazelnuts", Quantity = 50, QuantityType = "g" });
            ingredients.Add(new Ingredient { Name = "Chocolate", Quantity = 200, QuantityType = "g" });

            Add(new Recipe { Id = 2, Name = "Pancakes", DifficultyLevel = Difficulty.Beginner, Time = 90, Ingredients = ingredients });
        }
    }
}