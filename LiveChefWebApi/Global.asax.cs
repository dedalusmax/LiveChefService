using LiveChefService.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;

namespace LiveChefService
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        internal static readonly BaseRepository<Cooking> CookingRepository = new CookingRepository();
        internal static readonly BaseRepository<User> UserRepository = new UserRepository();
        internal static readonly BaseRepository<Recipe> RecipeRepository = new RecipeRepository();

        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}
