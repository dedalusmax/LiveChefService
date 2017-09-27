using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using LiveChefService.Models;

namespace LiveChefService
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
        internal void SendUserLoggedOut(User user)
        {
            this.Clients.All.userLoggedOut(user);
        }

        public override Task OnConnected()
        {
            this.Clients.Caller.cookingsUpdated(WebApiApplication.CookingRepository.GetAll());

            return base.OnConnected();
        }

    }
}