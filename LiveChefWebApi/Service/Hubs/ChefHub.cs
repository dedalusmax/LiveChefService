using LiveChefService.Models;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LiveChefService
{
    public class ChefHub : Hub
    {
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

        public void StartTransmission(int cookingId, string sdp)
        {
            var cooking = WebApiApplication.CookingRepository.GetById(cookingId);
            cooking.Transmission.SDP = sdp;
            WebApiApplication.CookingRepository.Change(cooking);

            this.Clients.Others.transmissionStarted(cookingId, sdp);
        }

        public void SetRdp(int cookingId, string sdp)
        {
            var cooking = WebApiApplication.CookingRepository.GetById(cookingId);
            cooking.Transmission.SDP = sdp;
            WebApiApplication.CookingRepository.Change(cooking);

            this.Clients.Others.cookingUpdated(cooking);
        }

        public void SetIceCandidate(int cookingId, string candidate)
        {
            var cooking = WebApiApplication.CookingRepository.GetById(cookingId);
            cooking.Transmission.ICECandidate = candidate;
            WebApiApplication.CookingRepository.Change(cooking);

            this.Clients.Others.cookingUpdated(cooking);
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
            this.Clients.Caller.usersInitiated(WebApiApplication.UserRepository.GetActiveUsers());
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