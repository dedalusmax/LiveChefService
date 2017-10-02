
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

            User pero = chefs.Find(u => u.Username == "pero");
            Recipe fishAndChips = recipes.Find(r => r.Id == 1);
            Add(new Cooking { Id = 1, Chef = pero, Dish = fishAndChips, Status = CookingStatus.Ongoing });

            User stefica = chefs.Find(u => u.Username == "stefica");
            Recipe pancakes = recipes.Find(r => r.Id == 2);
            Add(new Cooking { Id = 2, Chef = stefica, Dish = pancakes, Status = CookingStatus.NeedHelp });

            User mico = chefs.Find(u => u.Username == "mico");
            Recipe lasagneBolognese = recipes.Find(r => r.Id == 3);
            Add(new Cooking { Id = 3, Chef = mico, Dish = lasagneBolognese, Status = CookingStatus.Ongoing });

            User jura = chefs.Find(u => u.Username == "jura");
            Recipe chocolateMuffins = recipes.Find(r => r.Id == 4);
            Add(new Cooking { Id = 4, Chef = jura, Dish = chocolateMuffins, Status = CookingStatus.Finished });
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