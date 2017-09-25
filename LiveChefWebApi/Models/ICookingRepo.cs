using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LiveChefWebApi.Models
{
    interface ICookingRepo
    {
        IEnumerable<Cooking> GetAll();
        Cooking Add(Cooking item);
        Cooking Get(int id);
        Cooking Remove(int id);
        Cooking Update(Cooking item);
    }
}
