﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LiveChefWebApi.Models
{
    public class Recipe
    {
        public int Id { get; set; }
        public string Ingredients { get; set; }
        public int Quantity { get; set; }
        public string QuantityType { get; set; }
    }
}