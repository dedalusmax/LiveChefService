using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LiveChefWebApi.Models
{
    public class BaseRepository<T>
    {
        protected List<T> items = new List<T>();
        protected int idCounter = 1;

        //public Cooking Add(Cooking item)
        //{
        //    item.Id = idCounter++;
        //    cooks.Add(item);
        //    return item;
        //}
        //public Cooking Get(int cookingId)
        //{
        //    return this.items.Find(f => f.Id == cookingId);
        //}

        public IEnumerable<T> GetAll()
        {
            return items;
        }

        //public Cooking Remove(int id)
        //{
        //    throw new NotImplementedException();
        //}

        //public Cooking Update(Cooking item)
        //{
        //    throw new NotImplementedException();
        //}
    }
}