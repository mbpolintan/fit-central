namespace DataAccess.ViewModels
{
    public class CustomEmailViewModel
    {

        public bool SendCustomEmail { get; set; }

        public string Message { get; set; }

        public string[] Recipients { get; set; }

        public string[] RecipientEmails { get; set; }

        //public string[] RecipientsToArray()
        //{
        //    return Recipients.Split(";");
        //}

        public bool IsRecipientsEmailValid()
        {
            bool retVal = false;
            //var emailValidator = new EmailAddressAttribute();
            //foreach (var email in Recipients.Split(";"))
            //{
            //    retVal = emailValidator.IsValid(email);
            //    if (!retVal) { break; } // found an invalid email, break out of loop
            //}
            return retVal;
        }
    }
}
