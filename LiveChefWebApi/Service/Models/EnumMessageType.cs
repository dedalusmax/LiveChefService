using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LiveChefService.Models
{
    [Flags]
    public enum EnumMessageType : byte
    {
        START = 0x0,
        DATA = 0x1,
        END = 0x2
    }
}