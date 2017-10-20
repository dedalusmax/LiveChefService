using System;
using System.Collections.Generic;

namespace LiveChefService.Models
{
    public enum MediaStreamTransfer
    {
        Started = 1,
        Pending = 2,
        Finished = 3
    }

    public class CookingMedia : IModel
    {
        // this is actually a cooking id!
        public int Id { get; set; }
        public int CookingId { get; set; }
        public MediaStreamTransfer Status { get; set; }

        public List<byte[]> Data;

        public CookingMedia()
        {
        }
    }
}