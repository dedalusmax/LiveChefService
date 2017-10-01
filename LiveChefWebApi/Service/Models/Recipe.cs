using System.Collections.Generic;

namespace LiveChefService.Models
{
    public enum Difficulty
    {
        Beginner = 1,
        Intermediate,
        Advanced
    }
    public class Recipe : IModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }

        public Difficulty DifficultyLevel { get; set; }
        public int Time { get; set; }

        public List<Ingredient> Ingredients { get; set; }
    }
}