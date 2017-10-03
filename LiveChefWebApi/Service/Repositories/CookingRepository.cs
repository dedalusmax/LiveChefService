
using System;
using System.Collections.Generic;

namespace LiveChefService.Models
{
    public class CookingRepository : BaseRepository<Cooking>
    {
        public CookingRepository()
        {
            List<User> chefs = WebApiApplication.UserRepository.GetAll();
            List<Recipe> recipes = WebApiApplication.RecipeRepository.GetAll();

            TimeSpan started = new TimeSpan(DateTime.Now.Ticks);

            User pero = chefs.Find(u => u.Username == "pero");
            Recipe fishAndChips = recipes.Find(r => r.Id == 1);
            
            Add(new Cooking { Id = 1, Chef = pero, Dish = fishAndChips, Status = CookingStatus.Ongoing, Settings = new CookingSettings(true, false, false, true), TimeStarted = started });

            User stefica = chefs.Find(u => u.Username == "stefica");
            Recipe pancakes = recipes.Find(r => r.Id == 2);
            Add(new Cooking { Id = 2, Chef = stefica, Dish = pancakes, Status = CookingStatus.NeedHelp, Settings = new CookingSettings(true, true, true, true), TimeStarted = started.Subtract(new TimeSpan(0, 15, 0)) });

            User mico = chefs.Find(u => u.Username == "mico");
            Recipe lasagneBolognese = recipes.Find(r => r.Id == 3);
            Add(new Cooking { Id = 3, Chef = mico, Dish = lasagneBolognese, Status = CookingStatus.Ongoing, Settings = new CookingSettings(true, true, false, false), TimeStarted = started.Subtract(new TimeSpan(1, 30, 0)) });

            User jura = chefs.Find(u => u.Username == "jura");
            Recipe chocolateMuffins = recipes.Find(r => r.Id == 4);
            Add(new Cooking { Id = 4, Chef = jura, Dish = chocolateMuffins, Status = CookingStatus.Finished, Settings = new CookingSettings(true, false, false, true), TimeStarted = started.Subtract(new TimeSpan(3, 0, 0)) });
        }

        public IEnumerable<Cooking> GetActiveCookings()
        {
            return this.items.FindAll(c => c.Status != CookingStatus.Finished);
        }

        public IEnumerable<Cooking> GetFinishedCookings()
        {
            return this.items.FindAll(c => c.Status == CookingStatus.Finished);
        }

        internal void RemoveAllStarted()
        {
            this.items.RemoveAll(c => c.Status == CookingStatus.Started);
        }
    }
}