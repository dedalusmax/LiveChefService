using System.Collections.Generic;
using System.Web.Http;
using LiveChefWebApi.Models;

namespace LiveChefWebApi.Controllers
{
    public class RecipeController : ApiController
    {
        static readonly IRecipeRepo repository = new RecipeRepository();

        [HttpGet]
        [ActionName("GetAll")]
        public IEnumerable<Recipe> GetAll()
        {
            return repository.GetAll();
        }

        [HttpGet]
        [ActionName("Get")]
        public Recipe Get(int recipeId)
        {
            return repository.Get(recipeId);
        }

    }
}
