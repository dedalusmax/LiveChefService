using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LiveChefWebApi.Models
{
    public class User
    {
        public int UserID { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}