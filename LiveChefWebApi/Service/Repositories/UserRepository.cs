using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace LiveChefService.Models
{
    public class UserRepository : BaseRepository<User>
    {
        public UserRepository()
        {
            Add(new User { Id = 1, Username = "ak", DisplayName = "Anabel", Password = "123", IsLoggedIn = false, IsGuest = false });
            Add(new User { Id = 2, Username = "rc", DisplayName = "Ratko", Password = "123", IsLoggedIn = false, IsGuest = false });
        }
    }
}