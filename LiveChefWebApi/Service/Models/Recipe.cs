namespace LiveChefService.Models
{
    public class Recipe : IModel
    {
        public int Id { get; set; }
        public string Ingredients { get; set; }
        public int Quantity { get; set; }
        public string QuantityType { get; set; }
    }
}