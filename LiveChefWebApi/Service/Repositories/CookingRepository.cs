using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LiveChefService.Models
{
    public class CookingRepository : BaseRepository<Cooking>
    {
        public CookingRepository()
        {
            Add(new Cooking { Id = 1, Username = "Pero", Status = CookingStatus.Started, DishName = "Pasta" });
            Add(new Cooking { Id = 2, Username = "Štef", Status = CookingStatus.NeedHelp, DishName = "BBQ Sauce" });
            Add(new Cooking { Id = 3, Username = "Josip", Status = CookingStatus.Ongoing, DishName = "Bolognese"});
            Add(new Cooking { Id = 4, Username = "Barica", Status = CookingStatus.NeedHelp, DishName = "Baked potatoes" });
        }
    }
}