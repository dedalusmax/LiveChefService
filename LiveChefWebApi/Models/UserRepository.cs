﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace LiveChefWebApi.Models
{
    public class UserRepository : IUserRepo
    {
        List<User> users = new List<User>();
        private int idCounter = 1;

        public UserRepository()
        {
            Add(new User { UserID = 1, Username = "ak", Password="123", FirstName = "Anabel Li", LastName = "Kečkeš" });
            Add(new User { UserID = 2, Username = "rc", Password = "123", FirstName = "Ratko", LastName = "Ćosić" });
        }
        //TODO autentifikacija
        public User Add(User item)
        {
            item.UserID = idCounter++;
            users.Add(item);
            return item;
        }

        public void Change(User item)
        {
            User found = this.users.Find(f => f.UserID == item.UserID);
            found = item;
        }

        public User Get(int userId)
        {
            return this.users.Find(f => f.UserID == userId);
        }

        public IEnumerable<User> GetAll()
        {
            return users;
        }
    }
}