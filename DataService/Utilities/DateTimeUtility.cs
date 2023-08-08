using System;
namespace DataService.Utilities
{
    public static class DateTimeUtility
    {
        public static DateTime? ParseIfNotNullOrWhiteSpace(string dateTime)
        {
            if (!string.IsNullOrWhiteSpace(dateTime))
            {
                return DateTime.Parse(dateTime);
            }

            return null;
        }

        public static DateTime? ParseIfNotNullOrEmpty(string dateTime)
        {
            if (!string.IsNullOrEmpty(dateTime))
            {
                return DateTime.Parse(dateTime);
            }

            return null;
        }
    }
}
