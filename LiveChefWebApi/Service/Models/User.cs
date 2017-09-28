namespace LiveChefService.Models
{
    public class User: IModel
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public bool IsLoggedIn { get; set; }
        public bool IsGuest { get; set; }
    }
}