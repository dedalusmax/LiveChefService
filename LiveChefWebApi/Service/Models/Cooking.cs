using System;

namespace LiveChefService.Models
{
    public enum CookingStatus
    {
        Started = 1,
        Ongoing,
        NeedHelp,
        Finished
    }

    public class CookingSettings
    {
        public bool UseMicrophone { get; set; }
        public bool UseCamera { get; set; }
        public bool UseChat { get; set; }
        public bool AllowHelp { get; set; }
        public Object stream { get; set; }

        public CookingSettings(bool useMicrophone, bool useCamera, bool useChat, bool allowHelp, Object stream)
        {
            this.UseMicrophone = useMicrophone;
            this.UseCamera = useCamera;
            this.UseChat = useChat;
            this.AllowHelp = allowHelp;
            this.stream = stream;
        }
    }

    public class Cooking : IModel
    {
        public int Id { get; set; }
        public User Chef { get; set; }
        public Recipe Dish { get; set; }
        public CookingSettings Settings { get; set; }
        public CookingStatus Status { get; set; }
        public DateTime StartedTime { get; set; }
        public DateTime Finishedtime { get; set; }
    }
}