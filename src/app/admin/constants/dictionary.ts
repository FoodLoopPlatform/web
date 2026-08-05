export interface AdminDictionary {
  // Navigation & General
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  filter: string;
  all: string;
  actionsCol: string;
  noData: string;
  uuid: string;
  exportCsv: string;

  // Tabs
  consumers: string;
  stores: string;
  charities: string;
  tickets: string;
  reviews: string;

  // Columns & Badges
  detailsCol: string;
  idCol: string;
  locationCol: string;
  statusCol: string;
  joinedDateCol: string;
  lastActiveCol: string;
  automationCol: string;
  verifiedCol: string;
  ticketCol: string;
  senderCol: string;
  priorityCol: string;
  dateCol: string;
  userCol: string;
  storeCol: string;
  ratingCol: string;
  commentCol: string;
  flagReasonCol: string;

  // Status & Priority Translations
  active: string;
  pending: string;
  suspended: string;
  open: string;
  closed: string;
  high: string;
  medium: string;
  low: string;
  filterPriority: string;

  // Dispute & Ticket Translations
  totalDisputes: string;
  openDisputes: string;
  resolvedDisputes: string;
  deleteReview: string;
  dismissFlag: string;
  smartTitle: string;
  drawerTitle: string;
  drawerSubject: string;
  drawerDescription: string;
  drawerStatus: string;
  drawerReplies: string;
  drawerSend: string;
  drawerPlaceholder: string;
  drawerClose: string;
  drawerResolve: string;

  // User Stats & Actions
  totalUsers: string;
  activeStores: string;
  activeCharities: string;
  pendingApproval: string;
  searchReviewsPlaceholder: string;
  auditLogsTitle: string;
  recentActivity: string;

  // Account Actions
  activate: string;
  suspend: string;
  verify: string;
  viewLogs: string;

  // Settings Keys
  settingsTitle: string;
  settingsSubtitle: string;
  systemFeatures: string;
  systemFeaturesSub: string;
  autoVerifyLabel: string;
  autoVerifySub: string;
  instapayLabel: string;
  instapaySub: string;
  bulkLabel: string;
  bulkSub: string;
  operationalParams: string;
  operationalParamsSub: string;
  commissionLabel: string;
  rateLimitLabel: string;
  saveBtn: string;
  authorizedAdmins: string;
  authorizedAdminsSub: string;
  adminNameCol: string;
  adminEmailCol: string;
  adminRoleCol: string;
  adminStatusCol: string;
  dbTool: string;
  dbToolTitle: string;
  dbToolDesc: string;
  dbResetBtn: string;
  settingsLog: string;
  confirmReset: string;
  resetSuccess: string;
  saveSuccess: string;
  featureUpdateSuccess: string;
  mainController: string;
  sarahAdmin: string;
  mikeAdmin: string;
  seniorControllerRole: string;
  controllerRole: string;
  opsRole: string;

  // Analytics Keys
  wasteReduced: string;
  co2Saved: string;
  valueSaved: string;
  disputesRate: string;
  wasteTrendTitle: string;
  wasteTrendSub: string;
  topStores: string;
  topCharities: string;
  demandSupply: string;
  bakeryOpportunity: string;
  bakeryDesc: string;
  adjustSettings: string;
  systemReports: string;
  tons: string;
  egp: string;
  month3: string;
  month4: string;
  month5: string;
  month6: string;
  month7: string;
  treeEquivalent: string;
  vsLastMonth: string;
  savingsSub: string;
  safetyLimit: string;
  foodBags: string;
  recoveryRate: string;
  foodBoxes: string;
  reason: string;

  // Moderation Keys
  adminConsole: string;
  regionalLead: string;
  navModeration: string;
  searchModerationPlaceholder: string;
  overviewEyebrow: string;
  contentModerationTitle: string;
  pendingItemsCount: string;
  aiConfidenceBadge: string;
  approveBtn: string;
  rejectBtn: string;
  requestChangesBtn: string;
  flagUserReport: string;
  flagUnverifiedOrigin: string;
  flagLowAiConfidence: string;
  flagDuplicateListing: string;
  emptyHeading: string;
  emptyBody: string;
  refreshQueueBtn: string;
  lastSync: string;
  footerQueueStatus: string;
  footerPercentClear: string;
  footerTotalReviewed: string;
  footerActiveModerators: string;
  filterBtn: string;
  requestChangesModalTitle: string;
  requestChangesPlaceholder: string;
  confirmApproveTitle: string;
  confirmApproveMsg: string;
  confirmRejectTitle: string;
  confirmRejectMsg: string;
}

export const adminDictionary: Record<"ar" | "en", AdminDictionary> = {
  ar: {
    title: "إدارة مستخدمي المنصة",
    subtitle: "متابعة وإدارة حسابات المستهلكين، المتاجر الشريكة والجمعيات الخيرية.",
    searchPlaceholder: "ابحث بالاسم، البريد الإلكتروني، أو المعرف...",
    filter: "تصفية حسب الحالة",
    all: "الكل",
    actionsCol: "الإجراءات",
    noData: "لا توجد بيانات مطابقة للتصفية الحالية.",
    uuid: "المعرف الفريد",
    exportCsv: "تصدير CSV",

    // Tabs
    consumers: "المستهلكون",
    stores: "المتاجر الشريكة",
    charities: "الجمعيات الخيرية",
    tickets: "تذاكر الدعم",
    reviews: "التقييمات المبلغ عنها",

    // Columns
    detailsCol: "تفاصيل المستخدم",
    idCol: "المعرف",
    locationCol: "الموقع",
    statusCol: "الحالة",
    joinedDateCol: "تاريخ الانضمام",
    lastActiveCol: "آخر نشاط",
    automationCol: "نمط القبول",
    verifiedCol: "حالة التوثيق",
    ticketCol: "التذكرة والموضوع",
    senderCol: "المرسل",
    priorityCol: "الأولوية",
    dateCol: "تاريخ الإنشاء",
    userCol: "المستخدم",
    storeCol: "المتجر",
    ratingCol: "التقييم",
    commentCol: "التعليق",
    flagReasonCol: "سبب البلاغ",

    // Status & Priority
    active: "نشط",
    pending: "معلق",
    suspended: "معطل",
    open: "مفتوحة",
    closed: "مغلقة",
    high: "عالية",
    medium: "متوسطة",
    low: "منخفضة",
    filterPriority: "تصفية حسب الأولوية",

    // Disputes
    totalDisputes: "إجمالي النزاعات",
    openDisputes: "النزاعات المفتوحة",
    resolvedDisputes: "النزاعات التي تم حلها",
    deleteReview: "حذف التقييم",
    dismissFlag: "تجاهل البلاغ",
    smartTitle: "توصية التدقيق",
    drawerTitle: "تفاصيل تذكرة الدعم",
    drawerSubject: "الموضوع",
    drawerDescription: "الوصف",
    drawerStatus: "الحالة",
    drawerReplies: "الردود والرسائل السابقة",
    drawerSend: "إرسال رد إداري",
    drawerPlaceholder: "اكتب تفاصيل الرد الرسمي هنا...",
    drawerClose: "إغلاق اللوحة",
    drawerResolve: "حل وإغلاق التذكرة",

    // Users Stats
    totalUsers: "إجمالي الحسابات المسجلة",
    activeStores: "المتاجر النشطة",
    activeCharities: "الجمعيات الموثقة",
    pendingApproval: "طلبات الانضمام المعلقة",
    searchReviewsPlaceholder: "ابحث في التقييمات باسم المستخدم أو المتجر...",
    auditLogsTitle: "سجل الأنشطة الإدارية",
    recentActivity: "أحدث العمليات والتغييرات",

    // Actions
    activate: "تنشيط الحساب",
    suspend: "تعطيل الحساب",
    verify: "توثيق",
    viewLogs: "عرض سجل الأنشطة",

    // Settings
    settingsTitle: "إعدادات النظام",
    settingsSubtitle: "تهيئة المعايير والقيود التشغيلية للمنصة، وإدارة صلاحيات المجموعات الإدارية.",
    systemFeatures: "ميزات النظام النشطة",
    systemFeaturesSub: "تبديل الميزات التجريبية والخدمات الصغيرة للمنصة على المستوى العالمي",
    autoVerifyLabel: "توثيق تلقائي للمتاجر الشريكة",
    autoVerifySub: "عند التفعيل، تتخطى المتاجر الجديدة قائمة مراجعة الإدارة وتوثق تلقائياً",
    instapayLabel: "دمج تسوية المدفوعات عبر InstaPay",
    instapaySub: "إجراء تسوية مالية فورية مباشرة من محفظة العميل إلى الحساب المصرفي للمتجر",
    bulkLabel: "رفع المنتجات بالجملة (Excel)",
    bulkSub: "السماح للمتاجر الشريكة برفع وتحديث كشوف مخزونها وملفاتها مباشرة",
    operationalParams: "المعايير التشغيلية للنظام",
    operationalParamsSub: "تحديد قيود عمولات المنصة وحدود الطلبات",
    commissionLabel: "عمولة المنصة (%)",
    rateLimitLabel: "حد معدل طلبات الـ API (طلب/دقيقة)",
    saveBtn: "حفظ التغييرات الإعدادية",
    authorizedAdmins: "الحسابات الإدارية المصرحة",
    authorizedAdminsSub: "التحكم في وصول فريق العمل الداخلي لإدارة منصة FoodLoop",
    adminNameCol: "الاسم",
    adminEmailCol: "البريد الإلكتروني",
    adminRoleCol: "الدور / الصلاحية",
    adminStatusCol: "الحالة",
    dbTool: "أداة قاعدة البيانات",
    dbToolTitle: "البدء بصفحة نظيفة",
    dbToolDesc: "استخدم هذه الأداة لمسح كافة تعديلات وسجلات اختبارات المحاكاة وإعادة ضبط المنصة إلى الحالة الافتراضية.",
    dbResetBtn: "إعادة ضبط قاعدة البيانات",
    settingsLog: "سجل التغييرات الإعدادية",
    confirmReset: "سيؤدي هذا إلى إعادة ضبط كافة تعديلات المستخدم، الردود، المتاجر الموثقة، وسجل الأنشطة إلى الحالة الافتراضية. هل تريد المتابعة؟",
    resetSuccess: "اكتملت إعادة تعيين قاعدة البيانات المحلية! جاري إعادة تحميل الصفحة...",
    saveSuccess: "تم حفظ التكوينات والمعايير التشغيلية بنجاح!",
    featureUpdateSuccess: "تم تحديث ميزة '{flag}' بنجاح",
    mainController: "المراقب الرئيسي",
    sarahAdmin: "أدمن سارة",
    mikeAdmin: "أدمن مايك",
    seniorControllerRole: "مراقب أول",
    controllerRole: "مراقب",
    opsRole: "عمليات",

    // Analytics
    wasteReduced: "هدر طعام تم منعه",
    co2Saved: "انبعاثات CO2 المحفوظة",
    valueSaved: "القيمة المستردة (جنيه)",
    disputesRate: "معدل النزاعات والشكاوى",
    wasteTrendTitle: "الحد من الهدر بمرور الوقت",
    wasteTrendSub: "كمية الطعام الفائض التي تم إنقاذها شهرياً من مقالب القمامة (كجم)",
    topStores: "أكثر المتاجر الشريكة نشاطاً",
    topCharities: "أكثر الجمعيات الخيرية استقبالاً",
    demandSupply: "إدارة الطلب والعرض",
    bakeryOpportunity: "فرصة لتفادي هدر المخبوزات",
    bakeryDesc: "تشير التحليلات إلى أن 12% من حقائب طعام المخابز المعروضة تنتهي صلاحيتها صباح كل ثلاثاء. يُنصح بتنبيه مديري المتاجر لتعديل أوقات تغليف وتجهيز العروض.",
    adjustSettings: "ضبط الإعدادات التشغيلية",
    systemReports: "سجل تقارير النظام",
    tons: "كجم",
    egp: "جنيه",
    month3: "مارس",
    month4: "أبريل",
    month5: "مايو",
    month6: "يونيو",
    month7: "يوليو (متوقع)",
    treeEquivalent: "🌳 تعادل زراعة {count} شجرة",
    vsLastMonth: "↑ 12.5% مقارنة بالشهر الماضي",
    savingsSub: "وفورات مالية مباشرة للمستهلك",
    safetyLimit: "● أقل بكثير من حد الأمان 2%",
    foodBags: "حقيبة طعام",
    recoveryRate: "نسبة الاسترداد",
    foodBoxes: "صندوق طعام",
    reason: "السبب",

    // Moderation Keys
    adminConsole: "لوحة التحكم",
    regionalLead: "مسؤول إقليمي",
    navModeration: "مراجعة القوائم",
    searchModerationPlaceholder: "ابحث في قائمة المراجعة...",
    overviewEyebrow: "نظرة عامة",
    contentModerationTitle: "مراجعة قوائم المنتجات",
    pendingItemsCount: "{count} عنصرًا قيد المراجعة",
    aiConfidenceBadge: "الذكاء الاصطناعي: ثقة {percent}٪",
    approveBtn: "موافقة",
    rejectBtn: "رفض",
    requestChangesBtn: "طلب تعديلات",
    flagUserReport: "بلاغ من مستخدم",
    flagUnverifiedOrigin: "مصدر غير موثق",
    flagLowAiConfidence: "ثقة منخفضة من الذكاء الاصطناعي",
    flagDuplicateListing: "قائمة مكررة؟",
    emptyHeading: "لا توجد قوائم بانتظار المراجعة",
    emptyBody: "عمل رائع! قائمة المراجعة فارغة تمامًا. جميع المنتجات المضافة تم فحصها بنجاح وهي معروضة الآن للمستخدمين.",
    refreshQueueBtn: "تحديث القائمة",
    lastSync: "آخر تحديث: {time}",
    footerQueueStatus: "حالة القائمة",
    footerPercentClear: "{percent}٪ خالية",
    footerTotalReviewed: "إجمالي المراجعات اليوم",
    footerActiveModerators: "المشرفون النشطون",
    filterBtn: "تصفية",
    requestChangesModalTitle: "طلب تعديلات على المنتجات المرفوعة",
    requestChangesPlaceholder: "اكتب ملاحظات التعديل المطلوبة للمتجر...",
    confirmApproveTitle: "موافقة واعتماد القائمة",
    confirmApproveMsg: "هل أنت متأكد من النشر والاعتماد النهائي لهذه القائمة على المنصة؟",
    confirmRejectTitle: "رفض واستبعاد القائمة",
    confirmRejectMsg: "هل أنت متأكد من رفض هذه القائمة وحذفها من المراجعة؟",
  },
  en: {
    title: "User Management",
    subtitle: "Monitor and manage consumer accounts, partner stores, and charities.",
    searchPlaceholder: "Search by name, email, or ID...",
    filter: "Filter by Status",
    all: "All",
    actionsCol: "Actions",
    noData: "No data matches the current filter criteria.",
    uuid: "Unique ID",
    exportCsv: "Export CSV",

    // Tabs
    consumers: "Consumers",
    stores: "Partner Stores",
    charities: "Charities",
    tickets: "Support Tickets",
    reviews: "Flagged Reviews",

    // Columns
    detailsCol: "User Details",
    idCol: "ID",
    locationCol: "Location",
    statusCol: "Status",
    joinedDateCol: "Joined Date",
    lastActiveCol: "Last Active",
    automationCol: "Automation Mode",
    verifiedCol: "Verification Status",
    ticketCol: "Ticket & Subject",
    senderCol: "Sender",
    priorityCol: "Priority",
    dateCol: "Created Date",
    userCol: "User",
    storeCol: "Store",
    ratingCol: "Rating",
    commentCol: "Comment",
    flagReasonCol: "Flag Reason",

    // Status & Priority
    active: "Active",
    pending: "Pending",
    suspended: "Suspended",
    open: "Open",
    closed: "Closed",
    high: "High",
    medium: "Medium",
    low: "Low",
    filterPriority: "Filter by Priority",

    // Disputes
    totalDisputes: "Total Disputes",
    openDisputes: "Open Disputes",
    resolvedDisputes: "Resolved Disputes",
    deleteReview: "Delete Review",
    dismissFlag: "Dismiss Flag",
    smartTitle: "Audit Insight",
    drawerTitle: "Support Ticket Details",
    drawerSubject: "Subject",
    drawerDescription: "Description",
    drawerStatus: "Status",
    drawerReplies: "Previous Replies",
    drawerSend: "Send Official Response",
    drawerPlaceholder: "Type details of your response here...",
    drawerClose: "Close Panel",
    drawerResolve: "Resolve & Close Ticket",

    // Users Stats
    totalUsers: "Total Registered Accounts",
    activeStores: "Active Partner Stores",
    activeCharities: "Verified Charities",
    pendingApproval: "Pending Applications",
    searchReviewsPlaceholder: "Search reviews by user or store...",
    auditLogsTitle: "Admin Activity Logs",
    recentActivity: "Recent System Operations",

    // Actions
    activate: "Activate Account",
    suspend: "Suspend Account",
    verify: "Verify",
    viewLogs: "View Audit Logs",

    // Settings
    settingsTitle: "System Settings",
    settingsSubtitle: "Configure parameters, operational limits, administrative access levels, and toggle feature flags.",
    systemFeatures: "Active System Features",
    systemFeaturesSub: "Toggle global microservices and system configurations",
    autoVerifyLabel: "Auto-Verify Partner Stores",
    autoVerifySub: "When enabled, newly registered stores bypass the manual admin review queue",
    instapayLabel: "InstaPay Settlements Integration",
    instapaySub: "Process direct real-time settlements from consumer wallets to store accounts",
    bulkLabel: "Bulk Product Upload (Excel)",
    bulkSub: "Allow partner stores to upload and update inventory catalogs in bulk",
    operationalParams: "Operational Parameters",
    operationalParamsSub: "Set platform commission rates and rate-limiting limits",
    commissionLabel: "Platform Commission (%)",
    rateLimitLabel: "API Request Rate Limit (req/min)",
    saveBtn: "Save Operational Configurations",
    authorizedAdmins: "Authorized Administrative Accounts",
    authorizedAdminsSub: "Control internal operations staff access to the FoodLoop management portal",
    adminNameCol: "Name",
    adminEmailCol: "Email",
    adminRoleCol: "Role / Permission",
    adminStatusCol: "Status",
    dbTool: "Database Utility",
    dbToolTitle: "Clean Start Utility",
    dbToolDesc: "Use this tool to wipe all local storage mock changes, support replies, and reset to the default state.",
    dbResetBtn: "Reset Local DB",
    settingsLog: "Configuration Audit Log",
    confirmReset: "This will restore all actors, verification states, replies, and logs to factory defaults. Continue?",
    resetSuccess: "Local database reset successfully! Reloading page...",
    saveSuccess: "Operational configurations saved successfully!",
    featureUpdateSuccess: "Successfully updated feature flag '{flag}'",
    mainController: "Main Controller",
    sarahAdmin: "Admin Sarah",
    mikeAdmin: "Admin Mike",
    seniorControllerRole: "Senior Controller",
    controllerRole: "Controller",
    opsRole: "Operations",

    // Analytics
    wasteReduced: "Food Waste Prevented",
    co2Saved: "CO2 Emissions Saved",
    valueSaved: "Recovered Value (EGP)",
    disputesRate: "Dispute & Complaint Rate",
    wasteTrendTitle: "Waste Reduction Over Time",
    wasteTrendSub: "Amount of surplus food saved monthly from landfills (kg)",
    topStores: "Most Active Partner Stores",
    topCharities: "Top Recipient Charities",
    demandSupply: "Demand & Supply Management",
    bakeryOpportunity: "Bakery Waste Mitigation Opportunity",
    bakeryDesc: "Analytics indicate that 12% of bakery food bags expire on Tuesday mornings. We recommend alerting store managers to adjust packing times.",
    adjustSettings: "Configure Operations",
    systemReports: "System Operations Log",
    tons: "kg",
    egp: "EGP",
    month3: "Mar",
    month4: "Apr",
    month5: "May",
    month6: "Jun",
    month7: "Jul (Forecast)",
    treeEquivalent: "🌳 Eq. to planting {count} trees",
    vsLastMonth: "↑ 12.5% vs last month",
    savingsSub: "Direct financial savings for consumers",
    safetyLimit: "● Well below 2% safety threshold",
    foodBags: "food bags",
    recoveryRate: "recovery rate",
    foodBoxes: "food boxes",
    reason: "Reason",

    // Moderation Keys
    adminConsole: "Admin Console",
    regionalLead: "Regional Lead",
    navModeration: "Moderation",
    searchModerationPlaceholder: "Search moderation queue...",
    overviewEyebrow: "Overview",
    contentModerationTitle: "Content Moderation",
    pendingItemsCount: "{count} Pending Items",
    aiConfidenceBadge: "AI: {percent}% Confidence",
    approveBtn: "Approve",
    rejectBtn: "Reject",
    requestChangesBtn: "Request Changes",
    flagUserReport: "User Report",
    flagUnverifiedOrigin: "Unverified Origin",
    flagLowAiConfidence: "Low AI Confidence",
    flagDuplicateListing: "Duplicate Listing?",
    emptyHeading: "No listings pending review",
    emptyBody: "Great job! The moderation queue is clear. All listings have been successfully vetted and are currently active for the community.",
    refreshQueueBtn: "Refresh Queue",
    lastSync: "Last sync: {time}",
    footerQueueStatus: "Queue Status",
    footerPercentClear: "{percent}% Clear",
    footerTotalReviewed: "Total Reviewed Today",
    footerActiveModerators: "Active Moderators",
    filterBtn: "Filter",
    requestChangesModalTitle: "Request Changes for Product Listing",
    requestChangesPlaceholder: "Enter feedback notes for the store...",
    confirmApproveTitle: "Approve & Publish Listing",
    confirmApproveMsg: "Are you sure you want to approve and publish this product listing to the platform?",
    confirmRejectTitle: "Reject Listing",
    confirmRejectMsg: "Are you sure you want to reject and remove this product listing?",
  }
};
