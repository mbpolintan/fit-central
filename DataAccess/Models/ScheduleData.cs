using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccess.Models
{  

    public class ScheduleData
    {
        public List<AppointmentData> GetScheduleData()
        {
            List<AppointmentData> appData = new List<AppointmentData>();
            appData.Add(new AppointmentData
            {
                Id = 1,
                Subject = "Explosion of Betelgeuse Star",
                StartTime = new DateTime(2018, 2, 11, 9, 30, 0),
                EndTime = new DateTime(2018, 2, 11, 11, 0, 0),
                OwnerId = 1
            });
            appData.Add(new AppointmentData
            {
                Id = 2,
                Subject = "Thule Air Crash Report",
                StartTime = new DateTime(2018, 2, 12, 12, 0, 0),
                EndTime = new DateTime(2018, 2, 12, 14, 0, 0),
                OwnerId = 2
            });
            appData.Add(new AppointmentData
            {
                Id = 3,
                Subject = "Blue Moon Eclipse",
                StartTime = new DateTime(2018, 2, 13, 9, 30, 0),
                EndTime = new DateTime(2018, 2, 13, 11, 0, 0),
                OwnerId = 1
            });
            appData.Add(new AppointmentData
            {
                Id = 4,
                Subject = "Meteor Showers in 2018",
                StartTime = new DateTime(2018, 2, 14, 13, 0, 0),
                EndTime = new DateTime(2018, 2, 14, 14, 30, 0),
                OwnerId = 2
            });
            appData.Add(new AppointmentData
            {
                Id = 5,
                Subject = "Milky Way as Melting pot",
                StartTime = new DateTime(2018, 2, 15, 12, 0, 0),
                EndTime = new DateTime(2018, 2, 15, 14, 0, 0),
                OwnerId = 1
            });
            return appData;
        }
    }

    public class AppointmentData
    {
        public int Id { get; set; }
        public string Subject { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string StartTimezone { get; set; }
        public string EndTimezone { get; set; }
        public bool IsAllDay { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public string RecurrenceID { get; set; }
        public string RecurrenceRule { get; set; }
        public string RecurrenceException { get; set; }
        public int OwnerId { get; set; }
    }
    public class ResourceDataSourceModel
    {
        public string text { set; get; }
        public int id { set; get; }
        public string color { set; get; }
    }

}
