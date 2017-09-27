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
        internal static readonly ICookingRepo CookingRepository = new CookingRepository();
        internal static readonly IUserRepo UserRepository = new UserRepository();

        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}
