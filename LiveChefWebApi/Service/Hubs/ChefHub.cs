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

        public void GetAllRecipes()
        {
            this.Clients.Caller.getAllRecipes(WebApiApplication.CookingRepository.GetAll());
        }

        public void GetRecipe(Recipe item)
        {
            this.Clients.Caller.getRecipe(WebApiApplication.RecipeRepository.Get(item.Id));
        }
        
        public void AddNewRecipe(Recipe item)
        {
            this.Clients.Caller.addRecipe(WebApiApplication.RecipeRepository.Add(item));
        }

        // stored cookings
        public void GetStoredCookings()
        {
            this.Clients.Caller.getStoredCookings(WebApiApplication.CookingRepository.GetFinishedCookings());
        }
        public override Task OnConnected()
        {
            this.Clients.Caller.usersInitiated(WebApiApplication.UserRepository.GetActiveUsers());

            this.Clients.Caller.cookingsInitiated(WebApiApplication.CookingRepository.GetActiveCookings());

            return base.OnConnected();
        }

        // disconnected
        public override Task OnDisconnected(bool stopCalled)
        {
            return base.OnDisconnected(stopCalled);
        }
    }
}