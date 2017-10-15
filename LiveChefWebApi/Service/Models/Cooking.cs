using System;
using System.Collections.Generic;

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

        public CookingSettings(bool useMicrophone, bool useCamera, bool useChat, bool allowHelp)
        {
            this.UseMicrophone = useMicrophone;
            this.UseCamera = useCamera;
            this.UseChat = useChat;
            this.AllowHelp = allowHelp;
        }
    }

    public class Snapshot
    {
        public int Id { get; set; }
        public DateTime TimeTaken { get; set; }
        public string Description { get; set; }
        //public Byte[] Image { get; set; }
        public string Image { get; set; }
    }

    public class ChatMessage
    {
        public string Sender { get; set; }
        public string Text { get; set; }

    }

    public class Cooking : IModel
    {
        public int Id { get; set; }
        public User Chef { get; set; }
        public Recipe Dish { get; set; }
        public CookingSettings Settings { get; set; }
        public CookingStatus Status { get; set; }
        public DateTime StartedTime { get; set; }
        public DateTime FinishedTime { get; set; }
        public List<Snapshot> Snapshots { get; set; }
        public List<ChatMessage> ChatHistory { get; set; }

        public Cooking()
        {
            this.Snapshots = new List<Snapshot>();
            this.ChatHistory = new List<ChatMessage>();
        }
    }
}