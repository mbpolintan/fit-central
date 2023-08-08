using DataAccess.Contexts;
using DataAccess.Enums;
using DataAccess.Models;
using DataAccess.ViewModels;
using DataService.Constants.Policy;
using DataService.Services.Interfaces;
using DataService.Utilities;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Internal.Website
{
    [BindProperties]
    [Authorize(Policy = GroupPolicy.AllUsers)]
    public class MembersCommsModel : PageModel
    {
        private readonly StudioCentralContext _context;
        private readonly ICommunicationService _commsService;
        private readonly IStudioService _studioService;
        private readonly ILogger<MembersCommsModel> _logger;
        private readonly IMemoryCache _cache;
        //private readonly IOutlookMailService _mail;
        private readonly IAzureActiveDirectoryService _azureActiveDirectoryService;


        public MembersCommsModel(StudioCentralContext context,
                                ICommunicationService commsService,
                                IStudioService studioService,
                                ILogger<MembersCommsModel> logger,
                                IMemoryCache cache,
                                //IOutlookMailService mail,
                                IAzureActiveDirectoryService azureActiveDirectoryService)
        {
            _logger = logger;
            _context = context;
            _commsService = commsService;
            _cache = cache;
            _studioService = studioService;
            //_mail = mail;
            _azureActiveDirectoryService = azureActiveDirectoryService;
        }

        [BindProperty]
        public IEnumerable<MemberViewModel> Members { get; set; }
        [BindProperty]
        public IEnumerable<MessageListViewModel> MessageList { get; set; }
        [BindProperty]
        public IEnumerable<MessageDetailViewModel> MessageDetail { get; set; }
        [BindProperty]
        public IEnumerable<Studio> Studios { get; set; }

        [BindProperty]
        public CustomEmailViewModel CustomEmail { get; set; }
        [BindProperty]
        public Studio SelectedStudio { get; set; }

        public async Task OnGetAsync()
        {
            try
            {
                var groupId = UserUtility.GetGroupId(User);
                var userId = UserUtility.GetUserId(User);

                Studios = _studioService.GetStudios(groupId, userId);

                if (_cache.Get<Studio>($"{User.Identity.Name}_Studio") == null)
                {
                    var Studio = Studios.FirstOrDefault();
                    SelectedStudio = Studio;

                    _cache.Set<Studio>($"{User.Identity.Name}_Studio", Studio);
                }
                else
                {
                    var studio = _cache.Get<Studio>($"{User.Identity.Name}_Studio");
                    SelectedStudio = studio;
                }

                _cache.Set<MemberStatus>($"{ User.Identity.Name}_Status", null);
                if (_cache.Get<MemberStatus>($"{ User.Identity.Name}_Status") == null)
                {
                    var Status = await _context.MemberStatus
                        .Where(x => x.MemberStatusId == (int)MemberStatuses.ActiveSuspended)
                        .Select(x => new MemberStatus()
                        {
                            MemberStatusId = x.MemberStatusId,
                            Status = x.Status
                        }).FirstOrDefaultAsync();

                    _cache.Set<MemberStatus>($"{ User.Identity.Name}_Status", Status);
                }

                //await _azureActiveDirectoryService.GetAllUsers();
                //await _mail.GetEmails();

                await PopulateListAsync(groupId, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
        }

        private async Task PopulateListAsync(int groupId, int userId)
        {
            try
            {
                var loc = _cache.Get<Studio>($"{User.Identity.Name}_Studio");
                var studioId = loc.StudioId;

                ViewData["members"] = await _context.Member.Where(x => x.StudioId == studioId).ToListAsync();
                ViewData["messageType"] = await _context.MessageType.ToListAsync();
                ViewData["status"] = await _context.MemberStatus.OrderBy(x => x.StatusOrder).Select(x => new MemberStatus
                {
                    MemberStatusId = x.MemberStatusId,
                    Status = x.Status
                }).ToListAsync();
                ViewData["Studios"] = _studioService.GetStudios(groupId, userId);
            }
            catch (Exception ex)
            {
                var error = ex.Message;
            }

        }


        //public JsonResult OnPostReadReadMembers(int studioId, [DataSourceRequest] DataSourceRequest request)
        //{
        //    try
        //    {

        //        studioId = _studioService.GetStudioId(studioId, User.Identity.Name);

        //        Members = _context.Member.Where(x => x.StudioId == studioId)
        //            .Select(x => new MemberViewModel
        //            {
        //                DisplayName = x.DisplayName,
        //                MobilePhone = x.MobilePhone,
        //                Email = x.Email,
        //                MemberId = x.MemberId,
        //                PhotoUrl = x.PhotoUrl ?? (x.Image == null ? "/images//images.jfif" : string.Format("data:image/jpg;base64,{0}", Convert.ToBase64String(x.Image)))
        //            }).ToList();             
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex.Message);
        //    }
        //    return new JsonResult(Members.ToDataSourceResult(request));
        //}


        public JsonResult OnPostReadInbox(int studioId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {

                studioId = _studioService.GetStudioId(studioId, User.Identity.Name);

                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetMessageList"; //sp name
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    List<SqlParameter> param = new List<SqlParameter>()
                    {
                        new SqlParameter("@StudioId", SqlDbType.Int) { Value = studioId },
                        new SqlParameter("@MessageClassification", SqlDbType.NVarChar) {Value = "Inbox"}
                    };
                    cmd.Parameters.AddRange(param.ToArray());
                    _context.Database.OpenConnection();
                    using (var result = cmd.ExecuteReader())
                    {
                        if (result.HasRows)

                            MessageList = _context.MapToList<MessageListViewModel>(result);

                        MessageList = MessageList.Select(x => new MessageListViewModel
                        {
                            Subject = x.Subject,
                            MessageTypeId = x.MessageTypeId,
                            BodyContent = x.BodyContent,                          
                            IsAnonymousSender = x.IsAnonymousSender,                       
                            Name = x.Name,
                            SenderMobilePhone = x.SenderMobilePhone,
                            EmailAddress = x.EmailAddress,                           
                            DisplayName = x.DisplayName,
                            NewMessage = x.NewMessage,
                            Classification = x.Classification,
                            PhotoUrl = x.PhotoUrl ?? (x.Image == null ? "/images//images.jfif" : string.Format("data:image/jpg;base64,{0}", Convert.ToBase64String(x.Image))),
                        }).ToList();
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(MessageList.ToDataSourceResult(request));
        }

        public JsonResult OnPostReadSentItems(int studioId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                studioId = _studioService.GetStudioId(studioId, User.Identity.Name);
                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetMessageList"; //sp name
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    List<SqlParameter> param = new List<SqlParameter>()
                    {
                        new SqlParameter("@StudioId", SqlDbType.Int) { Value = studioId },
                        new SqlParameter("@MessageClassification", SqlDbType.NVarChar) {Value = "SentItems"}
                    };
                    cmd.Parameters.AddRange(param.ToArray());
                    _context.Database.OpenConnection();
                    using (var result = cmd.ExecuteReader())
                    {
                        if (result.HasRows)
                            MessageList = _context.MapToList<MessageListViewModel>(result);

                        MessageList = MessageList.Select(x => new MessageListViewModel
                        {
                            Subject = x.Subject,
                            MessageTypeId = x.MessageTypeId,
                            BodyContent = x.BodyContent,                          
                            IsAnonymousSender = x.IsAnonymousSender,                       
                            Name = x.Name,
                            SenderMobilePhone = x.SenderMobilePhone,
                            EmailAddress = x.EmailAddress,                           
                            DisplayName = x.DisplayName,
                            NewMessage = x.NewMessage,
                            Classification = x.Classification,
                            PhotoUrl = x.PhotoUrl ?? (x.Image == null ? "/images//images.jfif" : string.Format("data:image/jpg;base64,{0}", Convert.ToBase64String(x.Image))),
                        }).ToList();
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(MessageList.ToDataSourceResult(request));
        }

        public JsonResult OnPostReadMessageThread(int studioId, string senderName, int classification, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                studioId = _studioService.GetStudioId(studioId, User.Identity.Name);
                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetMessageThread"; //sp name
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    List<SqlParameter> param = new List<SqlParameter>()
                                {
                                    new SqlParameter("@SenderName", SqlDbType.NVarChar) {Value = senderName},
                                    new SqlParameter("@StudioId", SqlDbType.Int) { Value = studioId },
                                    new SqlParameter("@Classification", SqlDbType.Int) { Value = classification }
                                };
                    cmd.Parameters.AddRange(param.ToArray());
                    _context.Database.OpenConnection();
                    using (var result = cmd.ExecuteReader())
                    {
                        if (result.HasRows)
                            MessageDetail = _context.MapToList<MessageDetailViewModel>(result);

                        MessageDetail = MessageDetail.Select(x => new MessageDetailViewModel
                        {
                            Subject = x.Subject ?? "SMS Message",
                            MessageTypeId = x.MessageTypeId,
                            BodyContent = x.BodyContent,
                            IsRead = x.IsRead,
                            IsAnonymousSender = x.IsAnonymousSender,
                            MessageDateTime = x.MessageDateTime,
                            MessageTime = x.MessageTime,
                            Name = x.Name,
                            EmailAddress = x.EmailAddress,
                            MobilePhone = x.MobilePhone,
                            DisplayName = x.DisplayName,
                            IsAdmin = x.IsAdmin,
                            PhotoUrl = x.PhotoUrl ?? (x.Image == null ? "/images//images.jfif" : string.Format("data:image/jpg;base64,{0}", Convert.ToBase64String(x.Image))),
                        }).ToList();
                    }
                }                     
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(MessageDetail.ToDataSourceResult(request));
        }

        public async Task<JsonResult> OnPostSendMessage(SendMessageViewModel sendMessage)
        {
            var statusId = sendMessage.StatusId;
            List<Member> members = new List<Member>();
            List<string> sendToMobileNumber = new List<string>();
            List<string> sendToEmails = new List<string>();
            var success = false;
            var message = string.Empty;

            sendMessage.SenderUserId = UserUtility.GetUserId(User);

            switch (sendMessage.RecipientType)
            {
                case "Custom":
                    members = await _context.Member.Where(x => x.StudioId == sendMessage.StudioId
                         && sendMessage.MemberIds.Contains(x.MemberId)).ToListAsync();
                    break;
                case "via Status":
                    int[] memberStatusIds = (statusId == (int)MemberStatuses.ActiveSuspended)
                          ? new int[] { (int)MemberStatuses.Active, (int)MemberStatuses.Suspended }
                          : (statusId == (int)MemberStatuses.All)
                          ? new int[]
                          { (int)MemberStatuses.Active,
                            (int)MemberStatuses.Expired,
                            (int)MemberStatuses.Terminated,
                            (int)MemberStatuses.NonMember,
                            (int)MemberStatuses.Suspended,
                            (int)MemberStatuses.Declined
                          }
                          : new int[] { statusId.Value };
                    members = await _context.Member.Where(x => x.StudioId == sendMessage.StudioId
                          && memberStatusIds.Contains(x.MemberStatusId)).ToListAsync();
                    break;
                default:
                    break;
            }

            foreach (var member in members)
            {
                if (member.Email != null)
                    sendToEmails.Add(member.Email);
                if (member.MobilePhone != null)
                    sendToMobileNumber.Add(member.MobilePhone);
            }

            switch (sendMessage.MessageType)
            {
                case "SMS":
                    try
                    {
                        var smsDetails = await _context.SmsSetting.Where(x => x.StudioId == sendMessage.StudioId)
                            .Select(x => new SmsSettingViewModel
                            {

                                StudioId = x.StudioId,
                                AccountSid = x.AccountSid,
                                AuthToken = x.AuthToken,
                                Number = x.Number,
                                Message = sendMessage.Message
                            })
                            .FirstOrDefaultAsync();

                        await _commsService.SendSMSMessage(smsDetails, sendToMobileNumber);
                        sendMessage.Subject = "SMS Message";
                        await SaveSentItem(sendMessage, members, "text");
                        success = true;
                        message = "SMS sent";
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex.Message + " =======> send sms");
                        message = ex.Message;
                    }

                    break;
                case "Email":
                    try
                    {
                        await _commsService.SendEmailMessage(sendMessage.Message, sendMessage.Subject, sendToEmails, sendMessage.StudioId);
                        await SaveSentItem(sendMessage, members, "html");
                        success = true;
                        message = "Email sent";
                    }
                    catch (Exception ex)
                    {
                        message = ex.Message;
                        _logger.LogError(message + " =======> send email");
                    }
                    break;
            }
            return new JsonResult(new { success, message });
        }

        public async Task<JsonResult> OnPostSendReplyMessage(SendReplyMessageViewModel sendMessage)
        {
            List<string> sendToMobileNumber = new List<string>();
            List<string> sendToEmails = new List<string>();

            var success = false;
            var message = string.Empty;

            sendMessage.SenderUserId = UserUtility.GetUserId(User);

            switch (sendMessage.MessageTypeId)
            {
                case 1: // SMS
                    try
                    {
                        var smsDetails = await _context.SmsSetting.Where(x => x.StudioId == sendMessage.StudioId)
                            .Select(x => new SmsSettingViewModel
                            {
                                StudioId = x.StudioId,
                                AccountSid = x.AccountSid,
                                AuthToken = x.AuthToken,
                                Number = x.Number,
                                Message = sendMessage.Message
                            })
                            .FirstOrDefaultAsync();
                        sendToMobileNumber.Add(sendMessage.SendTo);
                        await _commsService.SendSMSMessage(smsDetails, sendToMobileNumber);

                        sendMessage.Subject = "SMS Message";

                        await SaveReplySentItem(sendMessage, "text");
                        success = true;
                        message = "SMS sent";
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex.Message + " =======> send sms");
                        message = ex.Message;
                    }

                    break;
                case 2: // EMAIL
                    try
                    {
                        sendToEmails.Add(sendMessage.SendTo);
                        await _commsService.SendEmailMessage(sendMessage.Message, sendMessage.Subject, sendToEmails, sendMessage.StudioId);
                        await SaveReplySentItem(sendMessage, "html");
                        success = true;
                        message = "Email sent";
                    }
                    catch (Exception ex)
                    {
                        message = ex.Message;
                        _logger.LogError(message + " =======> send email");
                    }
                    break;
            }
            return new JsonResult(new { success, message });
        }

        public async Task SaveSentItem(SendMessageViewModel sendMessage, List<Member> members, string bodyContentType)
        {
            try
            {
                SentItem sendItem = new SentItem()
                {
                    StudioId = sendMessage.StudioId,
                    MessageTypeId = sendMessage.MessageTypeId,
                    Subject = sendMessage.Subject,
                    BodyContentType = bodyContentType,
                    BodyContent = sendMessage.Message,
                    SenderUserId = UserUtility.GetUserId(User),
                    DateCreated = DateTime.Now                   
                };
                await _context.SentItem.AddAsync(sendItem);
                await _context.SaveChangesAsync(User.Identity.Name);

                foreach (var member in members)
                {
                    Recipient recipient = new Recipient()
                    {
                        SentItemId = sendItem.SentItemId,
                        Name = member.DisplayName,
                        EmailAddress = member.Email,
                        MobilePhone = member.MobilePhone,
                        DateCreated = DateTime.Now
                    };
                    await _context.Recipient.AddAsync(recipient);
                }

                await _context.SaveChangesAsync(User.Identity.Name);
            }
            catch (Exception ex)
            {
                var message = ex.Message;
            }

        }
        public async Task SaveReplySentItem(SendReplyMessageViewModel sendMessage, string bodyContentType)
        {
            try
            {
                SentItem sendItem = new SentItem()
                {
                    StudioId = sendMessage.StudioId,
                    MessageTypeId = sendMessage.MessageTypeId,
                    Subject = sendMessage.Subject,
                    BodyContentType = bodyContentType,
                    BodyContent = sendMessage.Message,
                    SenderUserId = UserUtility.GetUserId(User),
                    DateCreated = DateTime.Now
                };
                await _context.SentItem.AddAsync(sendItem);
                await _context.SaveChangesAsync(User.Identity.Name);

                Recipient recipient = new Recipient()
                {
                    SentItemId = sendItem.SentItemId,
                    Name = sendMessage.DisplayName,
                    EmailAddress = sendMessage.MessageTypeId == 2 ? sendMessage.SendTo : null,
                    MobilePhone = sendMessage.MessageTypeId == 1 ? sendMessage.SendTo : null,
                    DateCreated = DateTime.Now
                };
                await _context.Recipient.AddAsync(recipient);
                await _context.SaveChangesAsync(User.Identity.Name);
            }
            catch (Exception ex)
            {
                var message = ex.Message;
            }
        }
    }
}