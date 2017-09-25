using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;

namespace LiveChefWebApi
{
    public class ChefHub : Hub
    {
        public void UpdateCooking(int cookingId, string cookingUsername, string cookingDish, string cookingStatus)
        {
            this.Clients.All.cookingUpdated(cookingId, cookingUsername, cookingDish, cookingStatus);
        }

        public override Task OnConnected()
        {
            this.Clients.Caller.cookingsUpdated(WebApiApplication.CookingRepository.GetAll());

            return base.OnConnected();
        }

    }
}