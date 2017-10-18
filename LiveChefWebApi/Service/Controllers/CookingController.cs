using LiveChefService.Models;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Script.Serialization;

namespace LiveChefService.Controllers
{
    public class CookingController : ApiController
    {
        [HttpGet]
        [ActionName("GetAll")]
        public IEnumerable<Cooking> GetAll()
        {
            return WebApiApplication.CookingRepository.GetAll();
        }

        [HttpPost]
        [ActionName("Post")]
        public HttpResponseMessage Post(Cooking item)
        {
            item = WebApiApplication.CookingRepository.Add(item);

            var serializer = new JavaScriptSerializer();
            var responseJson = serializer.Serialize(item);
            var response = Request.CreateResponse(HttpStatusCode.Created, responseJson);
            return response;
        }




    }
}
