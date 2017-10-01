using System.Collections.Generic;

namespace LiveChefService.Models
{
    public class RecipeRepository : BaseRepository<Recipe>
    {
        public RecipeRepository()
        {
            var description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non felis tortor. Pellentesque scelerisque at risus vel pretium. Maecenas quis nulla a massa volutpat pretium.";

            var ingredients = new List<Ingredient>
            {
                new Ingredient { Name = "Tortilla", Quantity = 4, QuantityType = "pcs" },
                new Ingredient { Name = "Gouda Cheese", Quantity = 120, QuantityType = "g" },
                new Ingredient { Name = "Fish", Quantity = 500, QuantityType = "g" },
                new Ingredient { Name = "Lemon juice", Quantity = 1, QuantityType = "pc" },
                new Ingredient { Name = "Flour", Quantity = 70, QuantityType = "g" },
                new Ingredient { Name = "Potatoes", Quantity = 500, QuantityType = "g" },
                new Ingredient { Name = "Onion", Quantity = 1, QuantityType = "pc" },
                new Ingredient { Name = "Pickles", Quantity = 100, QuantityType = "g" },
                new Ingredient { Name = "Cherry tomatoes", Quantity = 100, QuantityType = "g" }
            };

            Add(new Recipe { Id = 1, Name = "Fish and Chips", Description = description, DifficultyLevel = Difficulty.Intermediate, Time = 30, Ingredients = ingredients, Image = "./Content/images/recipes/page1-img1.jpg" });

            ingredients = new List<Ingredient>
            {
                new Ingredient { Name = "Eggs", Quantity = 2, QuantityType = "pcs" },
                new Ingredient { Name = "Flour", Quantity = 2, QuantityType = "cups" },
                new Ingredient { Name = "Baking powder", Quantity = 1, QuantityType = "pc" },
                new Ingredient { Name = "Milk", Quantity = 2, QuantityType = "cups" },
                new Ingredient { Name = "Oil", Quantity = 10, QuantityType = "ml" },
                new Ingredient { Name = "Sugar", Quantity = 50, QuantityType = "g" },
                new Ingredient { Name = "Salt", Quantity = 1, QuantityType = "teaspoon" }
            };

            Add(new Recipe { Id = 2, Name = "Pancakes", Description = description, DifficultyLevel = Difficulty.Beginner, Time = 90, Ingredients = ingredients, Image = "./Content/images/recipes/page1-img4.jpg" });

            ingredients = new List<Ingredient>
            {
                new Ingredient { Name = "Spaghetti", Quantity = 350, QuantityType = "g" },
                new Ingredient { Name = "Tomato sauce", Quantity = 2, QuantityType = "dl" },
                new Ingredient { Name = "Red Wine", Quantity = 50, QuantityType = "ml" },
                new Ingredient { Name = "Parsley", Quantity = 3, QuantityType = "pcs" },
                new Ingredient { Name = "Parmesan", Quantity = 50, QuantityType = "g" },
                new Ingredient { Name = "Salt", Quantity = 1, QuantityType = "teaspoon" }
            };

            Add(new Recipe { Id = 3, Name = "Lasagne bolognese", Description = description, DifficultyLevel = Difficulty.Beginner, Time = 90, Ingredients = ingredients, Image = "./Content/images/recipes/page1-img3.jpg" });

            ingredients = new List<Ingredient>
            {
                new Ingredient { Name = "Sugar", Quantity = 50, QuantityType = "g" },
                new Ingredient { Name = "Powdered Sugar", Quantity = 10, QuantityType = "g" },
                new Ingredient { Name = "Butter ", Quantity = 100, QuantityType = "g" },
                new Ingredient { Name = "Eggs", Quantity = 1, QuantityType = "pc" },
                new Ingredient { Name = "Milk", Quantity = 2, QuantityType = "dl" },
                new Ingredient { Name = "Cocoa", Quantity = 2, QuantityType = "tablespoon" },
                new Ingredient { Name = "Flour", Quantity = 100, QuantityType = "g" },
                new Ingredient { Name = "Chopped hazelnuts", Quantity = 50, QuantityType = "g" },
                new Ingredient { Name = "Chocolate", Quantity = 200, QuantityType = "g" }
            };

            Add(new Recipe { Id = 4, Name = "Chocolate Muffins", Description = description, DifficultyLevel = Difficulty.Beginner, Time = 90, Ingredients = ingredients, Image = "./Content/images/recipes/page1-img2.jpg" });
        }
    }
}