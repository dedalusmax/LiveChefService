using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LiveChefService.Models
{
    public class User
    {
        public int UserID { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public bool IsLoggedIn { get; set; }
        public bool IsGuest { get; set; }
    }
}