using System.Collections.Generic;

namespace LiveChefService.Models
{
    public abstract class BaseRepository<T> where T : IModel
    {
        protected List<T> items = new List<T>();
        protected int idCounter = 1;

        public T Get(int id)
        {
            return this.items.Find(f => f.Id == id);
        }

        public IEnumerable<T> GetAll()
        {
            return this.items;
        }

        public T Add(T item)
        {
            item.Id = idCounter++;
            items.Add(item);
            return item;
        }

        public void Change(T item)
        {
            T found = this.items.Find(f => f.Id == item.Id);
            found = item;
        }

        public void Remove(int id)
        {
            this.items.RemoveAll(u => u.Id == id);
        }
    }
}