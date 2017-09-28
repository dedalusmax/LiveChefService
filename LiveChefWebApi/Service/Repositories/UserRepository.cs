using System.Collections.Generic;

namespace LiveChefService.Models
{
    public class UserRepository : BaseRepository<User>
    {
        public UserRepository()
        {
            Add(new User { Id = 1, Username = "ak", Password = "123", DisplayName = "Anabel Li Kečkeš", IsLoggedIn = false, IsGuest = false });
            Add(new User { Id = 2, Username = "rc", Password = "123", DisplayName = "Ratko Ćosić", IsLoggedIn = false, IsGuest = false });
        }

        public IEnumerable<User> GetActiveUsers()
        {
            return this.items.FindAll(u => u.IsLoggedIn == true);
        }
    }
}