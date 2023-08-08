using DataAccess.Models;
using Kendo.Mvc.UI;
using System;
using System.ComponentModel.DataAnnotations;


namespace DataAccess.ViewModels
{
    public class CalendarEventViewModel : ISchedulerEvent
    {
        public int TaskID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        private DateTime start;
        public DateTime Start
        {
            get
            {
                return start;
            }
            set
            {
                start = value.ToUniversalTime();
            }
        }

        public string StartTimezone { get; set; }

        private DateTime end;
        public DateTime End
        {
            get
            {
                return end;
            }
            set
            {
                end = value.ToUniversalTime();
            }
        }

        public string EndTimezone { get; set; }

        public string RecurrenceRule { get; set; }
        public int? RecurrenceID { get; set; }
        public string RecurrenceException { get; set; }
        public bool IsAllDay { get; set; }
        public int? OwnerID { get; set; }

        public AppointmentData Entity()
        {
            return new AppointmentData
            {
                TaskID = TaskID,
                Title = Title,
                Start = Start,
                StartTimezone = StartTimezone,
                End = End,
                EndTimezone = EndTimezone,
                Description = Description,
                RecurrenceRule = RecurrenceRule,
                RecurrenceException = RecurrenceException,
                RecurrenceID = RecurrenceID,
                IsAllDay = IsAllDay,
                OwnerID = OwnerID
            };
        }
    }

    public class AppointmentData
    {
        public int TaskID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Start { get; set; }

        public string StartTimezone { get; set; }      
        public DateTime End {get; set; }

        public string EndTimezone { get; set; }

        public string RecurrenceRule { get; set; }
        public int? RecurrenceID { get; set; }
        public string RecurrenceException { get; set; }
        public bool IsAllDay { get; set; }
        public int? OwnerID { get; set; }
    }


    //public int EventId { get; set; }
    //[Display(Name = "Customer")]
    //public int? CustomerId { get; set; }
    //[Display(Name = "Site")]
    //public int? CustomerSiteId { get; set; }
    //[Display(Name = "Service Title")]
    //public string Title { get; set; }
    //[Display(Name = "Service Description")]
    //public string Description { get; set; }
    //[Display(Name = "All Day Service")]
    //public bool IsAllDay { get; set; }
    //public string StartTimezone { get; set; }
    //public string EndTimezone { get; set; }
    //[Display(Name = "Recurrence")]
    //public string RecurrenceRule { get; set; }
    //public string RecurrenceException { get; set; }

    //private DateTime start;
    //[Display(Name = "Service Start ")]
    //public DateTime Start
    //{
    //    get { return start; }
    //    set { start = value.ToUniversalTime(); }
    //}

    //private DateTime end;
    //[Display(Name = "Service End")]
    //public DateTime End
    //{
    //    get { return end; }
    //    set { end = value.ToUniversalTime(); }
    //}

    //[Display(Name = "Status")]
    //public int? StatusId { get; set; }
    //public DateTime DateCreated { get; set; }
    //public DateTime LastModified { get; set; }
    //public string CreatedBy { get; set; }
    //public string ModifiedBy { get; set; }
    //public bool SystemIsDeleted { get; set; }
    //public bool NotificationIsSent { get; set; }
    //public bool ReminderIsSent { get; set; }
    //[Display(Name = "Technician")]
    //public int? UserId { get; set; }

    //#region Methods
    //public CalendarEventViewModel() { }

    //public CalendarEventViewModel(CalendarEvent eventItem)
    //{
    //    EventId = eventItem.EventId;
    //    CustomerId = eventItem.CustomerId;
    //    CustomerSiteId = eventItem.CustomerSiteId;
    //    UserId = eventItem.UserId;
    //    Title = eventItem.Title;
    //    Start = DateTime.SpecifyKind(eventItem.Start, DateTimeKind.Utc);
    //    End = DateTime.SpecifyKind(eventItem.End, DateTimeKind.Utc);
    //    StartTimezone = eventItem.StartTimeZone;
    //    EndTimezone = eventItem.EndTimeZone;
    //    Description = eventItem.Description;
    //    IsAllDay = eventItem.IsAllDay;
    //    RecurrenceRule = eventItem.RecurrenceRule;
    //    RecurrenceException = eventItem.RecurrenceException;
    //    StatusId = eventItem.StatusId;
    //    DateCreated = eventItem.DateCreated;
    //    LastModified = eventItem.LastModified;
    //    CreatedBy = eventItem.CreatedBy;
    //    ModifiedBy = eventItem.ModifiedBy;
    //    SystemIsDeleted = eventItem.SystemIsDeleted;
    //    NotificationIsSent = eventItem.NotificationIsSent;
    //    ReminderIsSent = eventItem.ReminderIsSent;
    //}

    //public CalendarEvent ToEntity()
    //{
    //    return new CalendarEvent
    //    {
    //        EventId = EventId,
    //        CustomerId = CustomerId,
    //        CustomerSiteId = CustomerSiteId,
    //        UserId = UserId,
    //        Title = Title,
    //        Start = Start,
    //        StartTimeZone = StartTimezone,
    //        End = Start,
    //        EndTimeZone = StartTimezone,
    //        /*Temporarily Disable this since the requirement doesn't need to enter "End" values
    //        End = End,
    //        EndTimeZone = EndTimezone,
    //        */
    //        Description = Description,
    //        IsAllDay = IsAllDay,
    //        RecurrenceRule = RecurrenceRule,
    //        RecurrenceException = RecurrenceException,
    //        StatusId = StatusId,
    //        DateCreated = DateCreated,
    //        LastModified = LastModified,
    //        CreatedBy = CreatedBy,
    //        ModifiedBy = ModifiedBy,
    //        SystemIsDeleted = SystemIsDeleted,
    //        NotificationIsSent = NotificationIsSent,
    //        ReminderIsSent = ReminderIsSent
    //    };
    //}


//}
}
