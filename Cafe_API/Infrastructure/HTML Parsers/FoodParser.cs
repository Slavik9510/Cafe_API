using Cafe_API.Core.Entities;
using Cafe_API.Core.Helpers;
using HtmlAgilityPack;
using Newtonsoft.Json.Linq;

namespace Cafe_API.Infrastructure.HTML_Parsers
{
    public class FoodParser
    {
        private readonly HttpClient _httpClient;
        private readonly Dictionary<string, string> _categoryMappings = new Dictionary<string, string>
        {
            { "https://kvadratsushi.com/sushi-ta-roli/", "Sushi and Rolls" },
            { "https://kvadratsushi.com/product-category/sushi-burgeri/", "Sushi burgers" },
            { "https://kvadratsushi.com/product-category/asorti/", "Asorti" },
            { "https://kvadratsushi.com/product-category/burgery/", "Burgers" },
            { "https://kvadratsushi.com/product-category/piza/", "Pizza" },
            { "https://kvadratsushi.com/product-category/supi/", "Soups" },
            { "https://kvadratsushi.com/product-category/salati/", "Salads" },
            { "https://kvadratsushi.com/product-category/sneky/", "Snacks" },
            { "https://kvadratsushi.com/product-category/napoi/", "Drinks" },
            { "https://kvadratsushi.com/product-category/dodatki/", "Applications" }
        };

        public FoodParser(HttpClient httpClient)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        }

        public async Task ParseAndSaveAsync(string url, string outputFilePath)
        {
            var html = await _httpClient.GetStringAsync(url);
            var htmlDoc = new HtmlDocument();
            htmlDoc.LoadHtml(html);

            var categoryNodes = htmlDoc.DocumentNode.SelectNodes("//h6[@class='elementor-image-box-title']//a");
            var categoryUrls = GetCategoryUrls(url, categoryNodes);

            var foods = new List<Food>();
            var foodItems = new List<FoodItem>();
            var foodId = 1;

            foreach (var categoryUrl in categoryUrls)
            {
                html = await _httpClient.GetStringAsync(categoryUrl);
                htmlDoc.LoadHtml(html);

                var productUrls = GetProductUrls(htmlDoc);

                foreach (var productUrl in productUrls)
                {
                    html = await _httpClient.GetStringAsync(productUrl);
                    htmlDoc.LoadHtml(html);

                    var food = ParseFoodDetails(htmlDoc, categoryUrl, foodId);
                    foods.Add(food);

                    var foodItem = await ParseFoodItem(htmlDoc, foodId);
                    foodItems.AddRange(foodItem);

                    foodId++;
                }
            }

            await SerializeToJson(foods, Path.Combine(outputFilePath, "food.json"));
            await SerializeToJson(foodItems, Path.Combine(outputFilePath, "foodItems.json"));
        }

        private HashSet<string> GetCategoryUrls(string baseUrl, HtmlNodeCollection categoryNodes)
        {
            var categoryUrls = new HashSet<string>();

            if (categoryNodes != null)
            {
                foreach (var categoryNode in categoryNodes)
                {
                    var href = categoryNode.Attributes["href"].Value;
                    if (href[0] == '/')
                        href = baseUrl + href;
                    categoryUrls.Add(href);
                }
            }

            return categoryUrls;
        }

        private HashSet<string> GetProductUrls(HtmlDocument htmlDoc)
        {
            var productUrls = new HashSet<string>();
            var productNodes = htmlDoc.DocumentNode.SelectNodes("//a[@class='woocommerce-LoopProduct-link woocommerce-loop-product__link']");

            if (productNodes != null)
            {
                foreach (var productNode in productNodes)
                {
                    productUrls.Add(productNode.Attributes["href"].Value);
                }
            }

            return productUrls;
        }

        private Food ParseFoodDetails(HtmlDocument htmlDoc, string categoryUrl, int foodId)
        {
            var titleNode = htmlDoc.DocumentNode.SelectSingleNode("//h1[@class='product_title entry-title']");
            var title = titleNode?.InnerText.Trim() ?? "";

            var ingredientsNode = htmlDoc.DocumentNode.SelectSingleNode("//div[@class='woocommerce-product-details__short-description']//p");
            var ingredients = ingredientsNode?.InnerText?.Replace(", ", ",")?.Trim();

            var attributes = GetAttributes(htmlDoc);

            var category = GetCategoryFromUrl(categoryUrl);

            var food = new Food
            {
                Id = foodId,
                Title = title,
                Category = category,
                Ingredients = ingredients != null ? new HashSetStringConverter().ConvertFromProviderExpression.Compile()(ingredients) : null,
                AdditionalInfo = DictionaryToFoodAdditionalInfoConverter.Convert(foodId, attributes)
            };

            return food;
        }

        private Dictionary<string, string> GetAttributes(HtmlDocument htmlDoc)
        {
            var attributes = new Dictionary<string, string>();
            var tableRowNodes = htmlDoc.DocumentNode.SelectNodes("//table[@class='woocommerce-product-attributes shop_attributes']//tr");

            if (tableRowNodes != null)
            {
                foreach (var row in tableRowNodes)
                {
                    var thNode = row.SelectSingleNode(".//th");
                    var tdNode = row.SelectSingleNode(".//td");
                    var key = thNode?.InnerText.Trim();
                    var value = tdNode?.InnerText.Trim();

                    if (!string.IsNullOrEmpty(key) && !string.IsNullOrEmpty(value))
                    {
                        attributes[key] = value;
                    }
                }
            }

            return attributes;
        }

        private string GetCategoryFromUrl(string url)
        {
            if (_categoryMappings.TryGetValue(url, out var category))
            {
                return category;
            }
            else
            {
                throw new Exception("Category mapping not found for URL: " + url);
            }
        }

        private async Task<IEnumerable<FoodItem>> ParseFoodItem(HtmlDocument htmlDoc, int foodId)
        {
            var foodItems = new List<FoodItem>();

            var variantItemNodes = htmlDoc.DocumentNode.SelectSingleNode("//form[@class='variations_form cart']//select[@id='pa_size']");

            if (variantItemNodes != null)
            {
                var sizes = variantItemNodes.SelectNodes(".//option").Select(x => x.Attributes["value"].Value).Where(x => !string.IsNullOrEmpty(x));
                var scriptNode = htmlDoc.DocumentNode.SelectSingleNode("//script[@type='application/ld+json' and not(@class='aioseo-schema')]");

                if (scriptNode != null)
                {
                    var jsonContent = scriptNode.InnerText.Trim();
                    var jsonObj = JObject.Parse(jsonContent);
                    var offers = jsonObj.SelectToken("$..offers[?(@.@type == 'AggregateOffer')]");
                    var lowPrice = decimal.Parse(offers["lowPrice"]?.ToString() ?? "0");
                    var highPrice = decimal.Parse(offers["highPrice"]?.ToString() ?? "0");

                    foreach (var size in sizes)
                    {
                        var foodItem = new FoodItem
                        {
                            Id = foodItems.Count + 1,
                            FoodId = foodId,
                            Size = byte.TryParse(size.Substring(0, 2), out var sizeNumber) ? sizeNumber : (byte)0,
                            Price = size == sizes.First() ? lowPrice : highPrice
                        };

                        foodItems.Add(foodItem);
                    }
                }
            }
            else
            {
                var priceNode = htmlDoc.DocumentNode.SelectSingleNode("//div[@class='summary entry-summary']//bdi");
                var priceText = priceNode?.InnerText ?? "0";
                var price = decimal.Parse(new string(priceText.TakeWhile(char.IsDigit).ToArray()));

                var foodItem = new FoodItem
                {
                    Id = foodItems.Count + 1,
                    FoodId = foodId,
                    Price = price
                };

                foodItems.Add(foodItem);
            }

            return foodItems;
        }

        private async Task SerializeToJson<T>(IEnumerable<T> items, string filePath)
        {
            await JsonFileIO.SerializeToFile(items.ToList(), filePath);
        }
    }
}
