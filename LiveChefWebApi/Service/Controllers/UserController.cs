using LiveChefService.Models;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LiveChefService.Controllers
{
    public class UserController : ApiController
    {
        [HttpGet]
        [ActionName("GetAll")]
        public IEnumerable<User> GetAll()
        {
            return WebApiApplication.UserRepository.GetAll();
        }

        [HttpGet]
        [ActionName("Get")]
        public User Get(int userId)
        {
            return WebApiApplication.UserRepository.Get(userId);
        }

        [HttpPost]
        [ActionName("Login")]
        public HttpResponseMessage Login(User item)
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<ChefHub>();

            User found = WebApiApplication.UserRepository.GetAll().Where(u => u.Username == item.Username && u.Password == item.Password).FirstOrDefault();
            if (found != null)
            {
                if (found.IsLoggedIn)
                {
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Forbidden, "User is already logged in!");
                    return response;
                }

                found.IsLoggedIn = true;
                WebApiApplication.UserRepository.Change(found);

                context.Clients.All.userLoggedIn(found);

                return PrepareResponse<User>(found);
            }
            else
            {
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Forbidden, "Your username and/or password is incorrect!");
                return response;
            }
        }

        [HttpPost]
        [ActionName("LoginAsGuest")]
        public HttpResponseMessage LoginAsGuest(User item)
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<ChefHub>();
            item.IsLoggedIn = true;
            item.IsGuest = true;

            WebApiApplication.UserRepository.Add(item);
            context.Clients.All.userLoggedIn(item);

            return PrepareResponse(item);

        }

        [HttpPost]
        [ActionName("Logout")]
        public HttpResponseMessage Logout(User user)
        {
            User found = WebApiApplication.UserRepository.GetAll().Where(u => u.Id == user.Id).FirstOrDefault();
            if (found != null)
            {
                if (found.IsGuest)
                {
                    WebApiApplication.UserRepository.Remove(user.Id);
                }
                else
                {
                    found.IsLoggedIn = false;
                    WebApiApplication.UserRepository.Change(found);
                }

                IHubContext context = GlobalHost.ConnectionManager.GetHubContext<ChefHub>();
                context.Clients.All.userLoggedOut(found);

                return PrepareResponse<User>(found);
            }
            else
            {
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.NotFound, "User doesn't exist");
                return response;
            }
        }

        private HttpResponseMessage PrepareResponse<T>(T item)
        {
            var jsonSettings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };

            string responseJson = JsonConvert.SerializeObject(item, jsonSettings);

            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, responseJson);
            return response;
        }
    }
}
