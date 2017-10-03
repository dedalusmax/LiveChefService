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
        internal static readonly UserRepository UserRepository = new UserRepository();
        internal static readonly RecipeRepository RecipeRepository = new RecipeRepository();
        internal static readonly CookingRepository CookingRepository = new CookingRepository();

        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}
