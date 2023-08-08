﻿namespace DataAccess.ViewModels
{
    public class ScanImageViewModel
    {
        public string BeforeFront { get; set; }
        public string BeforeSide { get; set; }
        public string BeforeBack { get; set; }
        public string AfterFront { get; set; }
        public string AfterSide { get; set; }
        public string AfterBack { get; set; }
        public int ImageScore { get; set; }
        public int MaxScore { get; set; }
    }
}
