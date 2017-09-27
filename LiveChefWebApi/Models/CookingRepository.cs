using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LiveChefService.Models
{
    public class CookingRepository : ICookingRepo
    {
        List<Cooking> cooks = new List<Cooking>();
        private int idCounter = 1;

        public CookingRepository()
        {
            Add(new Cooking { Id = 1, Username = "Pero", Status = CookingStatus.Started, DishName = "Pasta" });
            Add(new Cooking { Id = 2, Username = "Štef", Status = CookingStatus.NeedHelp, DishName = "BBQ Sauce" });
            Add(new Cooking { Id = 3, Username = "Josip", Status = CookingStatus.Ongoing, DishName = "Bolognese"});
            Add(new Cooking { Id = 4, Username = "Barica", Status = CookingStatus.NeedHelp, DishName = "Baked potatoes" });
        }
        public Cooking Add(Cooking item)
        {
            item.Id = idCounter++;
            cooks.Add(item);
            return item;
        }
        public Cooking Get(int cookingId)
        {
            return this.cooks.Find(f => f.Id == cookingId);
        }

        public IEnumerable<Cooking> GetAll()
        {
            return cooks;
        }

        public Cooking Remove(int id)
        {
            throw new NotImplementedException();
        }

        public Cooking Update(Cooking item)
        {
            throw new NotImplementedException();
        }
    }
}