namespace LiveChefService.Models
{
    public enum CookingStatus
    {
        Started = 1,
        Ongoing,
        NeedHelp,
        Finished
    }

    public class Cooking : IModel
    {
        public int Id { get; set; }
        public User Chef { get; set; }
        public Recipe Dish { get; set; }
        public CookingStatus Status { get; set; }
    }
}