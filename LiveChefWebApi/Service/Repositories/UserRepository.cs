using System.Collections.Generic;

namespace LiveChefService.Models
{
    public class UserRepository : BaseRepository<User>
    {
        public UserRepository()
        {
            Add(new User { Id = 1, Username = "anabel", Password = "123", DisplayName = "Anabel Li Kečkeš" });
            Add(new User { Id = 2, Username = "ratko", Password = "123", DisplayName = "Ratko Ćosić" });
            Add(new User { Id = 3, Username = "pero", Password = "123", DisplayName = "Pero Papričica" });
            Add(new User { Id = 4, Username = "stefica", Password = "123", DisplayName = "Štefica Jambrek" });
            Add(new User { Id = 5, Username = "mico", Password = "123", DisplayName = "Mićo Skuhani" });
            Add(new User { Id = 6, Username = "jura", Password = "123", DisplayName = "Jura Mutikaša" });
        }

        public IEnumerable<User> GetActiveUsers()
        {
            return this.items.FindAll(u => u.IsLoggedIn == true);
        }
    }
}