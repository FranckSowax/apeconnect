flowchart TD
  Start[Select Establishment] --> Auth[User Authentication]
  Auth --> RoleDec{User Role}
  RoleDec -->|Parent| ParentDash[Parent Dashboard]
  RoleDec -->|Teacher| TeacherDash[Teacher Dashboard]
  RoleDec -->|Censeur| CenseurDash[Censeur Dashboard]
  RoleDec -->|Admin| AdminDash[Admin Dashboard]
  RoleDec -->|SuperAdmin| SuperAdminDash[Super Admin Dashboard]
  ParentDash --> AbsenceModule[Absence Module]
  ParentDash --> Marketplace[Textbook Marketplace]
  TeacherDash --> AbsenceModule
  CenseurDash --> ApproveAbs[Approve Absence Requests]
  CenseurDash --> ModerateAds[Moderate Ads]
  AdminDash --> PendingAbs[Pending Absences]
  AdminDash --> PendingAds[Pending Ads]
  SuperAdminDash --> Config[Platform Configuration]
  AbsenceModule --> ChannelDec{Input Channel}
  ChannelDec -->|Web Form| WebForm[Absence Web Form]
  ChannelDec -->|WhatsApp Bot| WAAbsence[WhatsApp Bot Submission]
  WebForm --> Upload[Upload Justificatif]
  WAAbsence --> Upload
  Upload --> SupabaseStore[Store In Supabase]
  SupabaseStore --> NotifyAbsWA[Notify Via WhatsApp]
  Marketplace --> PostAd[Post Ad]
  Marketplace --> Browse[Browse Catalog]
  PostAd --> GPTReview[GPT-4o Review]
  GPTReview --> ManualMod[Manual Moderation]
  ManualMod --> AdDecision{Ad Approved}
  AdDecision -->|Yes| PublishAd[Publish Ad]
  AdDecision -->|No| RejectAd[Reject Ad]
  PublishAd --> NotifyAdWA[Notify Via WhatsApp]
  Browse --> BuyWA[Buy Via WhatsApp]
  NotifyAbsWA --> WAIntegration[Whapi cloud]
  NotifyAdWA --> WAIntegration
  BuyWA --> WAIntegration
  ParentDash --> OfflineAccess[Offline History]
  OfflineAccess --> AbsCache[Cache Absence History]