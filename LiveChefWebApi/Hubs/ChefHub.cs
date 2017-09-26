using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using LiveChefWebApi.Models;

namespace LiveChefWebApi
{
    public class ChefHub : Hub
    {
        public void AddCooking(Cooking item)
        {            
            WebApiApplication.CookingRepository.Add(item);
            this.Clients.All.cookingAdded(item);
        }

        internal void SendUserLoggedIn(User user)
        {
            this.Clients.All.userLoggedIn(user);
        }

        public override Task OnConnected()
        {
            this.Clients.Caller.cookingsUpdated(WebApiApplication.CookingRepository.GetAll());

            return base.OnConnected();
        }

    }
}