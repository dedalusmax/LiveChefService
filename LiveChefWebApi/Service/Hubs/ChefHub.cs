using LiveChefService.Models;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;

namespace LiveChefService
{
    public class ChefHub : Hub
    {
        public void AddCooking(Cooking item)
        {            
            WebApiApplication.CookingRepository.Add(item);
            this.Clients.All.cookingAdded(item);
        }

        public void UpdateCooking(Cooking item)
        {
            WebApiApplication.CookingRepository.Change(item);
            this.Clients.All.cookingUpdated(item);
        }

        public void RemoveCooking(Cooking item)
        {
            WebApiApplication.CookingRepository.Remove(item.Id);
            this.Clients.All.cookingRemoved(item);
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
            this.Clients.Caller.usersInitiated(WebApiApplication.UserRepository.GetActiveUsers());
            this.Clients.Caller.cookingsInitiated(WebApiApplication.CookingRepository.GetAll());

            return base.OnConnected();
        }
    }
}