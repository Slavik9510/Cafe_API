using Cafe_API.Core.Entities;

namespace Cafe_API.Core.Helpers
{
    public class FoodPriceComparer : IComparer<Food>
    {
        public int Compare(Food x, Food y)
        {
            decimal lowerPriceX = x.FoodItems.Min(x => x.Price);
            decimal lowerPriceY = y.FoodItems.Min(y => y.Price);

            return lowerPriceX.CompareTo(lowerPriceY);
        }
    }
}
