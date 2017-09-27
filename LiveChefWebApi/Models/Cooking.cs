using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LiveChefService.Models
{
    public enum CookingStatus
    {
        Started = 1,
        Ongoing,
        NeedHelp,
        Finished
    }

    public class Cooking
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string DishName { get; set; }
        public CookingStatus Status { get; set; }
    }
}