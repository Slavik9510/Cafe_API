using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Cafe_API.Core.Helpers
{
    public class HashSetStringConverter : ValueConverter<HashSet<string>, string>
    {
        public HashSetStringConverter() : base(
            // Converting a HashSet<string> to a string
            v => string.Join(',', v),
            // Converting a string to HashSet<string>
            v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToHashSet())
        { }
    }
}
