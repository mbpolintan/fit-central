using DataAccess.Contexts;
using DataAccess.Models;
using DataService.ServiceModels;
using DataService.Services.Interfaces;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DataService.Services
{
    public class EmailService : IEmailService
    {
        //private readonly StudioCentralContext _context;
        private readonly EmailSettings _emailSettings;
        private readonly IHostEnvironment _env;

        public EmailService(IHostEnvironment env, IOptions<EmailSettings> emailSettings, StudioCentralContext context)
        {
            _env = env;
            _emailSettings = emailSettings.Value;
            //_context = context;
        }

        public async Task SendEmail(string[] emailTo, string emailSubject, string message, int studioId)
        {
            EmailSetting EmailSetting = new EmailSetting();
            try
            {
                var mimeMessage = new MimeMessage();
                //EmailSetting = await _context.EmailSetting.Where(x => x.StudioId == studioId).FirstOrDefaultAsync();
                mimeMessage.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.Sender));

                for (int i = 0; i < emailTo.Length; i++)
                {
                    mimeMessage.To.Add(new MailboxAddress(emailTo[i]));
                }

                mimeMessage.Subject = emailSubject;
                mimeMessage.Body = new TextPart("html")
                {
                    Text = message
                };

                using (var client = new SmtpClient())
                {
                    // For demo-purposes, accept all SSL certificates (in case the server supports STARTTLS)
                    client.ServerCertificateValidationCallback = (s, c, h, e) => true;

                    if (_env.IsDevelopment())
                    {
                        // The third parameter is useSSL (true if the client should make an SSL-wrapped
                        // connection to the server; otherwise, false).
                        //await client.ConnectAsync(_emailSettings.MailServer, _emailSettings.MailPort, false);
                        await client.ConnectAsync(_emailSettings.MailServer, _emailSettings.MailPort, false);
                    }
                    else
                    {
                        await client.ConnectAsync(_emailSettings.MailServer);
                    }

                    // Note: only needed if the SMTP server requires authentication
                    await client.AuthenticateAsync(_emailSettings.SenderName, _emailSettings.Password);

                    await client.SendAsync(mimeMessage);

                    await client.DisconnectAsync(true);
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task SendConfimationEmailAsync(string emailTo, string emailSubject, string message)
        {
            try
            {
                var mimeMessage = new MimeMessage();
                //mimeMessage.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.Sender));
                mimeMessage.From.Add(new MailboxAddress("Studio XCentral", _emailSettings.Sender));
                mimeMessage.To.Add(new MailboxAddress(emailTo));
                mimeMessage.Subject = emailSubject;
                mimeMessage.Body = new TextPart("html")
                {
                    Text = message
                };

                using (var client = new SmtpClient())
                {
                    // For demo-purposes, accept all SSL certificates (in case the server supports STARTTLS)
                    client.ServerCertificateValidationCallback = (s, c, h, e) => true;

                    if (_env.IsDevelopment())
                    {
                        // The third parameter is useSSL (true if the client should make an SSL-wrapped
                        // connection to the server; otherwise, false).
                        await client.ConnectAsync(_emailSettings.MailServer, _emailSettings.MailPort, false);
                    }
                    else
                    {
                        await client.ConnectAsync(_emailSettings.MailServer);
                    }

                    // Note: only needed if the SMTP server requires authentication
                    await client.AuthenticateAsync(_emailSettings.SenderName, _emailSettings.Password);

                    await client.SendAsync(mimeMessage);

                    await client.DisconnectAsync(true);
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #region Helper
        public string MapValuesToTemplate(Dictionary<string, string> mapping, string htmlTemplate)
        {
            string result = htmlTemplate;
            foreach (var item in mapping)
            {
                result = result.Replace(item.Key, item.Value);
            }
            return result;
        }
        #endregion

    }
}
