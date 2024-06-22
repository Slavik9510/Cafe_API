using Newtonsoft.Json;

namespace Cafe_API.Core.Helpers
{
    public static class JsonFileIO
    {
        public static async Task SerializeToFile<T>(T entity, string filePath)
        {
            string json = JsonConvert.SerializeObject(entity, Formatting.Indented);
            await File.WriteAllTextAsync(filePath, json);
        }

        public static async Task<T?> DeserializeFromFile<T>(string filePath)
        {
            string json = await File.ReadAllTextAsync(filePath);
            return JsonConvert.DeserializeObject<T>(json);
        }
    }
}
