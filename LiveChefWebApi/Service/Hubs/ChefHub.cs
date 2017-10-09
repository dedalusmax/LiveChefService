using LiveChefService.Models;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LiveChefService
{
    public enum MediaAction
    {
        VideoCall = 1,
        AudioCall = 2,
        Chat = 3
    }

    public class ChefHub : Hub
    {
        public void Join(int userId)
        {
            this.Groups.Add(this.Context.ConnectionId, userId.ToString());
        }

        public void RequestForJoin(int userId, MediaAction action, int userIdToConnect)
        {
            this.Clients.Group(userIdToConnect.ToString()).joinRequested(action, userId);
        }

        public void Send(int userId, string message)
        {
            this.Clients.Group(userId.ToString()).newMessage(message);
        }

        public Cooking AddCooking(Cooking data)
        {
            var cooking = new Cooking
            {
                Chef = data.Chef,
                Dish = data.Dish,
                Settings = data.Settings,
                Status = CookingStatus.Started,
                StartedTime = DateTime.Now
            };

            WebApiApplication.CookingRepository.Add(cooking);
            this.Clients.All.cookingAdded(cooking);

            return cooking;
        }

        public void UpdateCooking(Cooking item)
        {
            WebApiApplication.CookingRepository.Change(item);
            this.Clients.All.cookingUpdated(item);
        }

        public void AbortCooking(int cookingId)
        {
            WebApiApplication.CookingRepository.Remove(cookingId);
            this.Clients.All.cookingRemoved(cookingId);
        }

        public List<Recipe> GetAllRecipes()
        {
            return WebApiApplication.RecipeRepository.GetAll();
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
            this.Clients.Caller.usersInitiated(WebApiApplication.UserRepository.GetAll());
            this.Clients.Caller.cookingsInitiated(WebApiApplication.CookingRepository.GetActiveCookings());
            this.Clients.Caller.recipesInitiated(WebApiApplication.RecipeRepository.GetAll());

            return base.OnConnected();
        }

        // disconnected
        public override Task OnDisconnected(bool stopCalled)
        {
            // wipe out all started cookings
            WebApiApplication.CookingRepository.RemoveAllStarted();

            return base.OnDisconnected(stopCalled);
        }
    }
}