using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using LiveChefWebApi.Models;
using System.Web.Script.Serialization;

namespace LiveChefWebApi.Controllers
{
    public class UserController : ApiController
    {
        static readonly IUserRepo repository = new UserRepository();

        [HttpGet]
        [ActionName("GetAll")]
        public IEnumerable<User> GetAll()
        {
            return repository.GetAll();
        }

        [HttpGet]
        [ActionName("Get")]
        public User Get(int userId)
        {
            return repository.Get(userId);
        }

        [HttpPost]
        [ActionName("Login")]        
        public HttpResponseMessage Login(User item)
        {
            item = repository.Add(item);

            var serializer = new JavaScriptSerializer();
            var responseJson = serializer.Serialize(item);
            var response = Request.CreateResponse(HttpStatusCode.Created, responseJson);
            return response;

        }
    }
}
