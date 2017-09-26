using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(LiveChefWebApi.Startup))]

namespace LiveChefWebApi
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
            app.MapSignalR();
        }
    }
}
