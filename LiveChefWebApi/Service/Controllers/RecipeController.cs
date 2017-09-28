using System.Collections.Generic;
using System.Web.Http;
using LiveChefService.Models;

namespace LiveChefService.Controllers
{
    public class RecipeController : ApiController
    {
        [HttpGet]
        [ActionName("GetAll")]
        public IEnumerable<Recipe> GetAll()
        {
            return WebApiApplication.RecipeRepository.GetAll();
        }

        [HttpGet]
        [ActionName("Get")]
        public Recipe Get(int recipeId)
        {
            return WebApiApplication.RecipeRepository.Get(recipeId);
        }

    }
}
