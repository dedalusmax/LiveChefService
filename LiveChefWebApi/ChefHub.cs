using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LiveChefWebApi
{
    public class ChefHub : Hub
    {
        public void UpdateCooking(int cookingId, string cookingUsername, string cookingDish, string cookingStatus)
        {
            Clients.All.broadcastCooking(cookingId, cookingUsername, cookingDish, cookingStatus);
        }
    }
}