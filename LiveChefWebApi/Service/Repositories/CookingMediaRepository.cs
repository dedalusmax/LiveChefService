
using System;
using System.Collections.Generic;

namespace LiveChefService.Models
{
    public class CookingMediaRepository : BaseRepository<CookingMedia>
    {
        internal CookingMedia GetByCookingId(int cookingId)
        {
            return this.items.Find(c => c.CookingId == cookingId);
        }

    }
}