using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LiveChefWebApi.Models
{
    interface IUserRepo
    {
        IEnumerable<User> GetAll();
        User Add(User item);
        User Get(int id);
    }
}
