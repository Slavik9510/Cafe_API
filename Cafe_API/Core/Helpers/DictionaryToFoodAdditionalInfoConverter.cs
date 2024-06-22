using Cafe_API.Core.Entities;

namespace Cafe_API.Core.Helpers
{
    public class DictionaryToFoodAdditionalInfoConverter
    {
        private static int currentId = 1;
        public static ICollection<FoodAdditionalInfo> Convert(int foodId, Dictionary<string, string> dictionary)
        {
            var foodAdditionalInfos = new List<FoodAdditionalInfo>();

            foreach (var kvp in dictionary)
            {
                var foodAdditionalInfo = new FoodAdditionalInfo
                {
                    Id = currentId++,
                    FoodId = foodId,
                    Key = kvp.Key,
                    Value = kvp.Value
                };
                foodAdditionalInfos.Add(foodAdditionalInfo);
            }

            return foodAdditionalInfos;
        }
    }
}
