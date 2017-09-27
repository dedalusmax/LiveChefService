using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using LiveChefService.Models;
using System.Web.Script.Serialization;
using Microsoft.AspNet.SignalR;

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


            if (CheckCredentials(item.Username, item.Password))
            {
                item.IsLoggedIn = true;
                WebApiApplication.UserRepository.Change(item);

                context.Clients.All.userLoggedIn(item);

                return PrepareResponse(item);
            }
            else
            {
                var response = Request.CreateResponse(HttpStatusCode.Forbidden, "Your username and/or password is incorrect!");
                return response;
            }
        }
        private bool CheckCredentials(string username, string password)
        {
            User found = WebApiApplication.UserRepository.GetAll().Where(u => u.Username == username && u.Password == password).FirstOrDefault();
            return (found != null);
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
        public HttpResponseMessage Logout(User item)
        {

            //TODO deskriptvnije ime i prebaciti metodu 
            if (LogoutUser(item.Username, item.Password))
            {
                item.IsLoggedIn = false;
                WebApiApplication.UserRepository.Change(item);

                IHubContext context = GlobalHost.ConnectionManager.GetHubContext<ChefHub>();
                context.Clients.All.userLoggedOut(item);

                return PrepareResponse(item);
            }
            else
            {
                var response = Request.CreateResponse(HttpStatusCode.NotFound, "User doesn't exist");
                return response;
            }
        }
        private bool LogoutUser(string username, string password)
        {
            User found = WebApiApplication.UserRepository.GetAll().Where(u => u.Username == username && u.Password == password).FirstOrDefault();
            return (found != null);
        }
        private HttpResponseMessage PrepareResponse(User item)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            User responseJson = serializer.ConvertToType<User>(item);
            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, responseJson);
            return response;
        }
    }
}
