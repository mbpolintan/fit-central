﻿using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class Scan
    {
        public Scan()
        {
            ChallengeMemberEndScan = new HashSet<ChallengeMember>();
            ChallengeMemberMidScan = new HashSet<ChallengeMember>();
            ChallengeMemberStartScan = new HashSet<ChallengeMember>();
        }

        public int ScanId { get; set; }
        public int ScansImportId { get; set; }
        public int? MemberId { get; set; }
        public string MobileNumber { get; set; }
        public decimal? Height { get; set; }
        public int? GenderId { get; set; }
        public int? Age { get; set; }
        public DateTime? TestDateTime { get; set; }
        public decimal? Weight { get; set; }
        public decimal? LlweightNormalRange { get; set; }
        public decimal? UlweightNormalRange { get; set; }
        public decimal? Tbw { get; set; }
        public decimal? Lltbw { get; set; }
        public decimal? Ultbw { get; set; }
        public decimal? Icw { get; set; }
        public decimal? Llicw { get; set; }
        public decimal? Ulicw { get; set; }
        public decimal? Ecw { get; set; }
        public decimal? Llecw { get; set; }
        public decimal? Ulecw { get; set; }
        public decimal? Protein { get; set; }
        public decimal? Llprotein { get; set; }
        public decimal? Ulprotein { get; set; }
        public decimal? Minerals { get; set; }
        public decimal? Llminerals { get; set; }
        public decimal? Ulminerals { get; set; }
        public decimal? Bfm { get; set; }
        public decimal? Llbfm { get; set; }
        public decimal? Ulbfm { get; set; }
        public decimal? Slm { get; set; }
        public decimal? Llslm { get; set; }
        public decimal? Ulslm { get; set; }
        public decimal? Ffm { get; set; }
        public decimal? Llffm { get; set; }
        public decimal? Ulffm { get; set; }
        public decimal? Smm { get; set; }
        public decimal? Llsmm { get; set; }
        public decimal? Ulsmm { get; set; }
        public decimal? Bmi { get; set; }
        public decimal? Llbmi { get; set; }
        public decimal? Ulbmi { get; set; }
        public decimal? Pbf { get; set; }
        public decimal? Llpbf { get; set; }
        public decimal? Ulpbf { get; set; }
        public decimal? FfmrightArm { get; set; }
        public decimal? LlffmrightArm { get; set; }
        public decimal? UlffmrightArm { get; set; }
        public decimal? FfmpercRightArm { get; set; }
        public decimal? FfmleftArm { get; set; }
        public decimal? LlffmleftArm { get; set; }
        public decimal? UlffmleftArm { get; set; }
        public decimal? FfmpercLeftArm { get; set; }
        public decimal? Ffmtrunk { get; set; }
        public decimal? Llffmtrunk { get; set; }
        public decimal? Ulffmtrunk { get; set; }
        public decimal? FfmpercTrunk { get; set; }
        public decimal? FfmrightLeg { get; set; }
        public decimal? LlffmrightLeg { get; set; }
        public decimal? UlffmrightLeg { get; set; }
        public decimal? FfmpercRightLeg { get; set; }
        public decimal? FfmleftLeg { get; set; }
        public decimal? LlffmleftLeg { get; set; }
        public decimal? UlffmleftLeg { get; set; }
        public decimal? FfmpercLeftLeg { get; set; }
        public decimal? Ecwtbw { get; set; }
        public decimal? BfmrightArm { get; set; }
        public decimal? BfmpercRightArm { get; set; }
        public decimal? BfmleftArm { get; set; }
        public decimal? BfmpercLeftArm { get; set; }
        public decimal? Bfmtrunk { get; set; }
        public decimal? BfmpercTrunk { get; set; }
        public decimal? BfmrightLeg { get; set; }
        public decimal? BfmpercRightLeg { get; set; }
        public decimal? BfmleftLeg { get; set; }
        public decimal? BfmpercLeftLeg { get; set; }
        public decimal? InBodyScore { get; set; }
        public decimal? TargetWeight { get; set; }
        public decimal? WeightControl { get; set; }
        public decimal? Bfmcontrol { get; set; }
        public decimal? Ffmcontrol { get; set; }
        public decimal? Bmr { get; set; }
        public decimal? Whr { get; set; }
        public decimal? Llwhr { get; set; }
        public decimal? Ulwhr { get; set; }
        public int? Vfl { get; set; }
        public decimal? ObesityDegree { get; set; }
        public decimal? LlobesityDegree { get; set; }
        public decimal? UlobesityDegree { get; set; }
        public decimal? Bcm { get; set; }
        public decimal? Llbcm { get; set; }
        public decimal? Ulbcm { get; set; }
        public decimal? Ac { get; set; }
        public decimal? Amc { get; set; }
        public decimal? Bmc { get; set; }
        public decimal? Llbmc { get; set; }
        public decimal? Ulbmc { get; set; }
        public decimal? _5kHzRaimpedance { get; set; }
        public decimal? _5kHzLaimpedance { get; set; }
        public decimal? _5kHzTrimpedance { get; set; }
        public decimal? _5kHzRlimpedance { get; set; }
        public decimal? _5kHzLlimpedance { get; set; }
        public decimal? _50kHzRaimpedance { get; set; }
        public decimal? _50kHzLaimpedance { get; set; }
        public decimal? _50kHzTrimpedance { get; set; }
        public decimal? _50kHzRlimpedance { get; set; }
        public decimal? _50kHzLlimpedance { get; set; }
        public decimal? _500kHzRaimpedance { get; set; }
        public decimal? _500kHzLaimpedance { get; set; }
        public decimal? _500kHzTrimpedance { get; set; }
        public decimal? _500kHzRlimpedance { get; set; }
        public decimal? _500kHzLlimpedance { get; set; }
        public decimal? Mcneck { get; set; }
        public decimal? Mcchest { get; set; }
        public decimal? Mcabdomen { get; set; }
        public decimal? Mchip { get; set; }
        public decimal? McrightArm { get; set; }
        public decimal? McleftArm { get; set; }
        public decimal? McrightThigh { get; set; }
        public decimal? McleftThigh { get; set; }
        public decimal? GrowthScore { get; set; }
        public decimal? ObesityDegreeChild { get; set; }
        public decimal? LlobesityDegreeChildNormalRange { get; set; }
        public decimal? UlobesityDegreeChildNormalRange { get; set; }
        public decimal? Systolic { get; set; }
        public decimal? Diastolic { get; set; }
        public decimal? Pulse { get; set; }
        public decimal? MeanArteryPressure { get; set; }
        public decimal? PulsePressure { get; set; }
        public decimal? RatePressureProduct { get; set; }
        public decimal? Smi { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }
        public bool IsHidden { get; set; }
        public byte BillStatus { get; set; }

        public virtual AppUser CreatedBy { get; set; }
        public virtual Gender Gender { get; set; }
        public virtual Member Member { get; set; }
        public virtual AppUser ModifiedBy { get; set; }
        public virtual ScansImport ScansImport { get; set; }
        public virtual ICollection<ChallengeMember> ChallengeMemberEndScan { get; set; }
        public virtual ICollection<ChallengeMember> ChallengeMemberMidScan { get; set; }
        public virtual ICollection<ChallengeMember> ChallengeMemberStartScan { get; set; }
    }
}