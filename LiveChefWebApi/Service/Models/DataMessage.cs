using System;
using System.Collections.Generic;

namespace LiveChefService.Models
{
    public class DataMessage
    {
        public int Id { get; set; }
        public EnumMessageType Type { get; set; }
        public int Size { get; set; }

        //public string Data { get; set; }
        public byte[] Data { get; set; }
    }
}