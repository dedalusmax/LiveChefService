using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LiveChefWebApi.Models
{
    public class RecipeRepository : IRecipeRepo
    {
        private List<Recipe> recipes = new List<Recipe>();
        private int idCounter = 1;

        public RecipeRepository()
        {
            Add(new Recipe { Id = 1, Ingredients = "Flour", Quantity = 2, QuantityType = "kg" });
            Add(new Recipe { Id = 2, Ingredients = "Eggs", Quantity = 4, QuantityType = "pcs" });
        }

        public IEnumerable<Recipe> GetAll()
        {
            return recipes;
        }

        public Recipe Add(Recipe item)
        {
            item.Id = idCounter++;
            recipes.Add(item);
            return item;
        }

        public Recipe Get(int recipeId)
        {
            return this.recipes.Find(f => f.Id == recipeId);
        }
        
    }
}