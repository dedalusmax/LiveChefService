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
        #region WebRTC related methods

        public void RequestForJoin(int userId, MediaAction action, int userIdToConnect)
        {
            this.Clients.Group(userIdToConnect.ToString()).joinRequested(action, userId);
        }

        public void SendRtcMessage(int userId, string message)
        {
            this.Clients.Group(userId.ToString()).rtcMessageReceived(message);
        }

        public void RequestRtcDataTransfer(int userId, string filename, int size)
        {
            this.Clients.Group(userId.ToString()).rtcDataTransferRequested(filename, size);
        }

        #endregion

        #region Data related methods

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

        public void NeedHelpInCooking(int cookingId, bool isHelpNeeded)
        {
            var cooking = WebApiApplication.CookingRepository.GetById(cookingId);
            if (cooking != null)
            {
                cooking.Status = CookingStatus.NeedHelp;
                WebApiApplication.CookingRepository.Change(cooking);
                this.Clients.Others.cookingUpdated(cooking);
            }
        }

        public void FinishCooking(int cookingId, Snapshot[] snapshots)
        {
            var cooking = WebApiApplication.CookingRepository.GetById(cookingId);
            if (cooking != null)
            {
                cooking.Status = CookingStatus.Finished;
                cooking.FinishedTime = DateTime.Now;

                var e = snapshots.GetEnumerator();
                while (e.MoveNext())
                {
                    cooking.Snapshots.Add(e.Current as Snapshot);
                }

                WebApiApplication.CookingRepository.Change(cooking);
                this.Clients.All.cookingUpdated(cooking);
                this.Clients.Others.leaveFromCooking(cookingId);
            }
        }

        public void AbortCooking(int cookingId)
        {
            WebApiApplication.CookingRepository.Remove(cookingId);
            this.Clients.Others.leaveFromCooking(cookingId);
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

        #endregion

        #region SignalR related methods

        public void Join(int userId)
        {
            this.Groups.Add(this.Context.ConnectionId, userId.ToString());
        }

        public void SendChatMessage(int cookingId, string sender, string text)
        {
            this.Clients.Others.chatMessageReceived(cookingId, sender, text);
        }

        public override Task OnConnected()
        {
            this.Clients.Caller.usersInitiated(WebApiApplication.UserRepository.GetAll());
            this.Clients.Caller.cookingsInitiated(WebApiApplication.CookingRepository.GetActiveCookings());
            this.Clients.Caller.recipesInitiated(WebApiApplication.RecipeRepository.GetAll());
            this.Clients.Caller.recordedCookingsInitiated(WebApiApplication.CookingRepository.GetFinishedCookings());

            return base.OnConnected();
        }

        // disconnected
        public override Task OnDisconnected(bool stopCalled)
        {
            // wipe out all started cookings
            WebApiApplication.CookingRepository.RemoveAllStarted();

            return base.OnDisconnected(stopCalled);
        }

        #endregion
    }
}