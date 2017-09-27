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

            if (item.IsGuest)
            {
                item.IsLoggedIn = true;
                item.Username = "Guest";

                WebApiApplication.UserRepository.Add(item);
                context.Clients.All.userLoggedIn(item);

                var serializer = new JavaScriptSerializer();
                var responseJson = serializer.ConvertToType<User>(item);
                var response = Request.CreateResponse(HttpStatusCode.OK, responseJson);
                return response;
            }

            if (CheckCredentials(item.Username, item.Password))
            {
                item.IsLoggedIn = true;
                WebApiApplication.UserRepository.Change(item);
                
                context.Clients.All.userLoggedIn(item);

                var serializer = new JavaScriptSerializer();
                var responseJson = serializer.ConvertToType<User>(item);
                var response = Request.CreateResponse(HttpStatusCode.OK, responseJson);
                return response;
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
        [ActionName("Logout")]
        public HttpResponseMessage Logout(User item)
        {
            
            if (LogoutUser(item.Username, item.Password, item.IsLoggedIn))
            {
                item.IsLoggedIn = false;
                WebApiApplication.UserRepository.Change(item);

                IHubContext context = GlobalHost.ConnectionManager.GetHubContext<ChefHub>();
                context.Clients.All.userLoggedOut(item);

                var serializer = new JavaScriptSerializer();
                var responseJson = serializer.ConvertToType<User>(item);
                var response = Request.CreateResponse(HttpStatusCode.OK, responseJson);
                return response;
            }
            else
            {
                var response = Request.CreateResponse(HttpStatusCode.Forbidden, "Your username and/or password is incorrect!");
                return response;
            }
        }
        private bool LogoutUser(string username, string password, bool loggedIn)
        {
            User found = WebApiApplication.UserRepository.GetAll().Where(u => u.Username == username && u.Password == password).FirstOrDefault();
            return (found != null);
        }

    }
}
