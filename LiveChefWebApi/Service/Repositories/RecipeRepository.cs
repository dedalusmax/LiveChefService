using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LiveChefService.Models
{
    public class RecipeRepository : BaseRepository<Recipe>
    {
        public RecipeRepository()
        {
            Add(new Recipe { Id = 1, Ingredients = "Flour", Quantity = 2, QuantityType = "kg" });
            Add(new Recipe { Id = 2, Ingredients = "Eggs", Quantity = 4, QuantityType = "pcs" });
        }
    }
}