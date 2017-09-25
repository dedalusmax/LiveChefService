using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LiveChefWebApi.Models
{
    interface IRecipeRepo
    {
        IEnumerable<Recipe> GetAll();
        Recipe Add(Recipe item);
        Recipe Get(int recipeId);

    }
}
