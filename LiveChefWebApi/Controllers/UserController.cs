using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using LiveChefWebApi.Models;
using System.Web.Script.Serialization;
using Microsoft.AspNet.SignalR;

namespace LiveChefWebApi.Controllers
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
            if (CheckCredentials(item.Username, item.Password))
            {
                item.IsLoggedIn = true;
                WebApiApplication.UserRepository.Change(item);

                IHubContext context = GlobalHost.ConnectionManager.GetHubContext<ChefHub>();
                context.Clients.All.userLoggedIn(item);

                var serializer = new JavaScriptSerializer();
                var responseJson = serializer.Serialize(item);
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
    }
}
