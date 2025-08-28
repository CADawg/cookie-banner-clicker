import type { 
    ICookie, 
    ICompany, 
    IPurpose, 
    ICompanyWithPurpose, 
    ICookieWithPurpose, 
    ILevelConfig 
} from '../types/GameTypes';

export const COMPANIES: ICompany[] = [
    // Basic companies (levels 1-5)
    {id: "intersussy", name: "InterSussy Studios", cookies: [{purpose_id: "marketing", id: "amogus", name: "X-Amogus", description: "Stores whether you have played the hit game Amogus", https: true, duration: "1 decade"}]},
    {id: "goofy_analytics", name: "Goofy Analytics", cookies: [{purpose_id: "statistics", id: "ga-ui1", name: "User ID", description: "A persistent ID which tracks the user across the web", https: true, duration: "1 year"}, {purpose_id: "statistics", id: "ga-ua-an", name: "Goofy Analytics User Agent", description: "The user agent used by Goofy Analytics", https: true, duration: "1 year"}]},
    {id: "goofy_advertising", name: "Goofy Advertising", cookies: [{purpose_id: "goofy_personalisation", id: "ga-ui2", name: "User ID", description: "A persistent ID which tracks the user across the web", https: true, duration: "1 year"}, {purpose_id: "marketing", id: "ga-ua-ma", name: "Goofy Advertising User Agent", description: "The user agent used by Goofy Advertising", https: true, duration: "1 year"}]},
    {id: "php_session", name: "Essential Services", cookies: [{purpose_id: "functional", id: "PHPSESSID", name: "Session ID", description: "Remembers User Logins", https: true, duration: "1 month"}]},
    {id: "social_media", name: "Social Media Tracker", cookies: [{purpose_id: "marketing", id: "sm-track", name: "Social Tracking", description: "Tracks social media interactions", https: true, duration: "2 years"}]},
    
    // Mid-tier companies (levels 6-12)
    {id: "ian", name: "Integrated Ads Network", cookies: [{purpose_id: "marketing", id: "ian-user", name: "User ID", description: "A persistent ID which tracks the user across the web", https: true, duration: "1 year"}]},
    {id: "hjeatmap", name: "Hjeatmap", cookies: [{purpose_id: "statistics", id: "hjeatmap-id", name: "Session ID", description: "An ID to report user clicks to Hjeatmap", https: true, duration: "Session"}]},
    {id: "video_service", name: "Video Service", cookies: [{purpose_id: "preferences", id: "video-pref", name: "Video Preferences", description: "Remembers video quality settings", https: true, duration: "6 months"}]},
    {id: "chat_widget", name: "Chat Widget Co", cookies: [{purpose_id: "functional", id: "chat-session", name: "Chat Session", description: "Maintains chat conversation state", https: true, duration: "Session"}]},
    {id: "ad_exchange", name: "Global Ad Exchange", cookies: [{purpose_id: "marketing", id: "gax-bid", name: "Bid Request ID", description: "Tracks ad auction participation", https: true, duration: "30 days"}]},
    {id: "payment_processor", name: "Secure Payments Inc", cookies: [{purpose_id: "functional", id: "pay-token", name: "Payment Token", description: "Secures payment transactions", https: true, duration: "1 hour"}]},
    {id: "content_delivery", name: "FastCDN", cookies: [{purpose_id: "performance", id: "cdn-region", name: "CDN Region", description: "Optimizes content delivery speed", https: true, duration: "7 days"}]},
    {id: "fraud_detection", name: "FraudShield", cookies: [{purpose_id: "security", id: "fraud-score", name: "Fraud Risk Score", description: "Prevents fraudulent activity", https: true, duration: "90 days"}]},
    
    // Advanced companies (levels 13-20)
    {id: "behavioral_analytics", name: "BehaviorCorp", cookies: [{purpose_id: "profiling", id: "behavior-pattern", name: "Behavioral Pattern", description: "Analyzes user behavior patterns for insights", https: true, duration: "2 years"}]},
    {id: "location_services", name: "GeoTracker Pro", cookies: [{purpose_id: "location_tracking", id: "geo-precise", name: "Precise Location", description: "Tracks exact GPS coordinates", https: true, duration: "1 year"}]},
    {id: "biometric_auth", name: "BioSecure", cookies: [{purpose_id: "biometric_data", id: "bio-hash", name: "Biometric Hash", description: "Stores fingerprint/face recognition data", https: true, duration: "Permanent"}]},
    {id: "political_profiling", name: "VotePredict", cookies: [{purpose_id: "political_profiling", id: "political-lean", name: "Political Alignment", description: "Predicts voting behavior and political preferences", https: true, duration: "4 years"}]},
    {id: "health_tracking", name: "HealthInsights", cookies: [{purpose_id: "health_data", id: "health-metrics", name: "Health Metrics", description: "Tracks fitness data and health indicators", https: true, duration: "Lifetime"}]},
    {id: "financial_profiling", name: "CreditScope", cookies: [{purpose_id: "financial_data", id: "credit-worthiness", name: "Credit Profile", description: "Assesses financial status and spending power", https: true, duration: "7 years"}]},
    {id: "emotion_detection", name: "MoodSense AI", cookies: [{purpose_id: "emotional_profiling", id: "emotion-state", name: "Emotional State", description: "Detects emotions through device sensors", https: true, duration: "1 year"}]},
    {id: "family_tracking", name: "FamilyGraph", cookies: [{purpose_id: "relationship_mapping", id: "family-tree", name: "Family Connections", description: "Maps family relationships and connections", https: true, duration: "Permanent"}]},
    
    // Overwhelming spam companies (level 20)
    {id: "data_broker_1", name: "DataMart Solutions", cookies: [{purpose_id: "data_brokerage", id: "profile-sale", name: "Profile Resale", description: "Packages and sells user profiles to third parties", https: true, duration: "Unlimited"}]},
    {id: "data_broker_2", name: "InfoHarvester LLC", cookies: [{purpose_id: "data_brokerage", id: "info-compile", name: "Information Compilation", description: "Compiles comprehensive user dossiers", https: true, duration: "Unlimited"}]},
    {id: "surveillance_corp", name: "SurveillanceTech", cookies: [{purpose_id: "surveillance", id: "activity-log", name: "Activity Surveillance", description: "Monitors all online and offline activities", https: true, duration: "Forever"}]},
    {id: "prediction_engine", name: "FutureCast AI", cookies: [{purpose_id: "predictive_analytics", id: "life-prediction", name: "Life Prediction Model", description: "Predicts future life events and decisions", https: true, duration: "Lifetime"}]},
    {id: "manipulation_service", name: "PersuasionMax", cookies: [{purpose_id: "behavioral_manipulation", id: "persuasion-profile", name: "Manipulation Vector", description: "Identifies psychological vulnerabilities for targeted persuasion", https: true, duration: "Forever"}]},
    
    // Generate realistic-sounding tech companies
    ...(() => {
        const techWords = ["data", "cloud", "smart", "tech", "sync", "flow", "link", "net", "web", "digital", "cyber", "micro", "meta", "pixel", "track", "scope", "vision", "pulse", "wave", "shift", "core", "edge", "apex", "prime", "max", "pro", "ultra", "hyper", "nano", "quantum", "neural"];
        const suffixes = ["ly", "ify", "io", "ai", "co", "inc", "corp", "labs", "works", "systems", "solutions", "services", "tech", "soft", "ware", "hub", "nest", "forge", "matrix"];
        const patterns = ["drop_vowels", "tech_suffix", "compound", "shortened"];
        
        const dropVowels = (word: string) => word.replace(/[aeiou]/gi, '');
        const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);
        
        return Array.from({length: 30}, (_, i) => {
            const pattern = patterns[i % patterns.length];
            const word1 = techWords[Math.floor((i * 7) % techWords.length)];
            const word2 = techWords[Math.floor((i * 11) % techWords.length)];
            const suffix = suffixes[Math.floor((i * 13) % suffixes.length)];
            
            let companyName = "";
            switch(pattern) {
                case "drop_vowels":
                    companyName = capitalize(dropVowels(word1)) + capitalize(word2);
                    break;
                case "tech_suffix":
                    companyName = capitalize(word1) + capitalize(suffix);
                    break;
                case "compound":
                    companyName = capitalize(word1) + capitalize(word2);
                    break;
                case "shortened":
                    companyName = capitalize(word1.slice(0, 3)) + capitalize(word2.slice(0, 3));
                    break;
            }
            
            const cookieTypes = ["tracker", "pixel", "beacon", "session", "profile", "analytics", "metrics", "insights"];
            const cookieType = cookieTypes[i % cookieTypes.length];
            
            return {
                id: `generated_${i + 1}`,
                name: companyName,
                cookies: [{
                    purpose_id: i % 3 === 0 ? "marketing" : i % 3 === 1 ? "statistics" : "preferences",
                    id: `${companyName.toLowerCase()}_${cookieType}`,
                    name: `${capitalize(cookieType)} Cookie`,
                    description: `${companyName}'s ${cookieType} for enhanced user experience`,
                    https: true,
                    duration: i % 4 === 0 ? "Session" : i % 4 === 1 ? "30 days" : i % 4 === 2 ? "1 year" : "2 years"
                }]
            };
        });
    })()
];

export const PURPOSES: IPurpose[] = [
    // Basic purposes (levels 1-10)
    {id: "necessary", name: ["Necessary", "Information Storage and Access"], description: ["Cookies Required for the display and security of the website."], required: true, alwaysShow: true},
    {id: "functional", name: ["Functional"], description: ["Cookies Required for full functioning of the website."], required: true, alwaysShow: false},
    {id: "preferences", name: ["Preferences", "Personalisation"], description: ["Cookies used to store your preferences"], required: false, alwaysShow: true},
    {id: "statistics", name: ["Statistics", "Measurement"], description: ["Cookies used to track visits and visitors to our website"], required: false, alwaysShow: true},
    {id: "marketing", name: ["Marketing", "Ad Selection"], description: ["Cookies used to serve you advertisements."], required: false, alwaysShow: true},
    {id: "performance", name: ["Performance"], description: ["Cookies used to improve website performance"], required: false, alwaysShow: true},
    {id: "security", name: ["Security"], description: ["Cookies used for security and fraud prevention"], required: false, alwaysShow: true},
    
    // Advanced purposes (levels 11-20)
    {id: "profiling", name: ["Profiling", "Behavioral Analysis"], description: ["Creating detailed profiles of your behavior and interests"], required: false, alwaysShow: false},
    {id: "location_tracking", name: ["Location Tracking", "Geolocation Services"], description: ["Tracking your precise physical location"], required: false, alwaysShow: false},
    {id: "biometric_data", name: ["Biometric Data Processing"], description: ["Processing fingerprints, face recognition, and other biometric data"], required: false, alwaysShow: false},
    {id: "political_profiling", name: ["Political Profiling"], description: ["Analyzing political preferences and voting behavior"], required: false, alwaysShow: false},
    {id: "health_data", name: ["Health Data Processing"], description: ["Collecting and analyzing health and medical information"], required: false, alwaysShow: false},
    {id: "financial_data", name: ["Financial Profiling"], description: ["Analyzing financial status, credit worthiness, and spending patterns"], required: false, alwaysShow: false},
    {id: "emotional_profiling", name: ["Emotional Profiling"], description: ["Detecting and analyzing emotional states and psychological traits"], required: false, alwaysShow: false},
    {id: "relationship_mapping", name: ["Relationship Mapping"], description: ["Mapping family, friend, and professional relationships"], required: false, alwaysShow: false},
    {id: "data_brokerage", name: ["Data Brokerage"], description: ["Selling your data to third-party companies"], required: false, alwaysShow: false},
    {id: "surveillance", name: ["Surveillance"], description: ["Comprehensive monitoring of all activities"], required: false, alwaysShow: false},
    {id: "predictive_analytics", name: ["Predictive Analytics"], description: ["Predicting future behavior, decisions, and life events"], required: false, alwaysShow: false},
    {id: "behavioral_manipulation", name: ["Behavioral Manipulation"], description: ["Using psychological techniques to influence your decisions"], required: false, alwaysShow: false},
    
    // Hidden/confusing purposes
    {id: "goofy_personalisation", name: ["Goofy Personalisation"], description: ["Personalisation by the Goofy Company"], required: false, alwaysShow: false},
    {id: "other", name: ["Other", "Third Party"], description: ["Other cookies"], required: false, alwaysShow: false}
];

// Convert cookies to their purpose via their purpose_id
export const COMPANIES_WITH_PURPOSE: ICompanyWithPurpose[] = COMPANIES.map(company => {
    const cookiesWithPurpose: ICookieWithPurpose[] = company.cookies.map(cookie => {
        const purpose = PURPOSES.find(purpose => purpose.id === cookie.purpose_id)!;
        return {...cookie, purpose};
    });
    return {...company, cookies: cookiesWithPurpose};
});

export const PURPOSES_DICTIONARY: {[key: string]: IPurpose} = PURPOSES.reduce((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
}, {} as {[key: string]: IPurpose});

// 20-Level Progressive Difficulty System
export const LEVEL_CONFIGS: ILevelConfig[] = [
    // TUTORIAL PHASE (1-3): Learn the basics
    {
        id: 1,
        title: "Welcome! We value your privacy",
        description: "Choose your privacy preferences below. We make it easy!",
        tabs: [{ id: "consent", label: "Consent", type: "consent", content: "purposes" }],
        buttons: [
            { text: "Reject All", style: "secondary", acceptsAll: false, alwaysPass: true },
            { text: "Accept Selected", style: "primary", acceptsAll: false }
        ],
        displayMode: "simple",
        defaultChecked: false,
        gridLayout: "single",
        purposeFilter: ["preferences", "statistics", "marketing"],
        companyFilter: ["intersussy", "goofy_analytics", "social_media"]
    },
    {
        id: 2,
        title: "Cookie Preferences",
        description: "We respect your choices. Please select your preferences below.",
        tabs: [{ id: "consent", label: "Consent", type: "consent", content: "purposes" }],
        buttons: [
            { text: "Accept All Cookies", style: "primary", acceptsAll: true },
            { text: "Accept Selected", style: "secondary", acceptsAll: false }
        ],
        displayMode: "simple",
        defaultChecked: true,
        gridLayout: "double",
        purposeFilter: ["preferences", "statistics", "marketing", "performance"]
    },
    {
        id: 3,
        title: "Enhanced Privacy Controls",
        description: "Granular control over your data. Each company is listed below.",
        tabs: [{ id: "consent", label: "Consent", type: "consent", content: "companies_detailed" }],
        buttons: [
            { text: "Accept All", style: "primary", acceptsAll: true },
            { text: "Accept Selected", style: "secondary", acceptsAll: false }
        ],
        displayMode: "per_company",
        defaultChecked: true,
        companyFilter: ["intersussy", "goofy_analytics", "goofy_advertising", "social_media", "video_service"]
    },

    // LEGITIMATE INTEREST INTRODUCTION (4-6)
    {
        id: 4,
        title: "Cookie & Privacy Settings",
        description: "We value your privacy. Please review both consent and legitimate interest preferences.",
        tabs: [
            { id: "consent", label: "Consent", type: "consent", content: "purposes" },
            { id: "legitimate", label: "Legitimate Interest", type: "legitimate_interest", content: "purposes" }
        ],
        buttons: [
            { text: "Accept All", style: "secondary", acceptsAll: true },
            { text: "Save Preferences", style: "primary", acceptsAll: false }
        ],
        displayMode: "detailed",
        defaultChecked: false,
        legitimateInterestDefaultChecked: true,
        gridLayout: "double",
        purposeFilter: ["preferences", "statistics", "marketing", "performance", "security"]
    },
    {
        id: 5,
        title: "Comprehensive Privacy Dashboard",
        description: "Complete control over all tracking purposes across consent and legitimate interest.",
        tabs: [
            { id: "consent", label: "Consent", type: "consent", content: "purposes" },
            { id: "legitimate", label: "Legitimate Interest", type: "legitimate_interest", content: "purposes" }
        ],
        buttons: [
            { text: "Accept All", style: "secondary", acceptsAll: true },
            { text: "Save Choices", style: "primary", acceptsAll: false }
        ],
        displayMode: "detailed",
        defaultChecked: true,
        legitimateInterestDefaultChecked: true,
        gridLayout: "triple"
    },
    {
        id: 6,
        title: "Partner Network Privacy Settings",
        description: "Our trusted partners need your consent. Review each company's data usage below.",
        tabs: [
            { id: "consent", label: "Consent", type: "consent", content: "companies_detailed" },
            { id: "legitimate", label: "Legitimate Interest", type: "legitimate_interest", content: "companies_detailed" }
        ],
        buttons: [
            { text: "Accept All Partners", style: "primary", acceptsAll: true },
            { text: "Customize Settings", style: "secondary", acceptsAll: false }
        ],
        displayMode: "per_company",
        defaultChecked: false,
        legitimateInterestDefaultChecked: true,
        companyFilter: ["goofy_analytics", "ian", "hjeatmap", "ad_exchange", "payment_processor", "content_delivery"]
    },

    // VISUAL/UI TRICKS PHASE (7-10)
    {
        id: 7,
        title: "Quick Privacy Setup",
        description: "Almost done! Just confirm your privacy choices.",
        tabs: [{ id: "consent", label: "Consent", type: "consent", content: "purposes" }],
        buttons: [
            { text: "Continue with Recommended Settings", style: "primary", acceptsAll: true },
            { text: "Customize", style: "secondary", acceptsAll: false }
        ],
        displayMode: "simple",
        defaultChecked: true,
        gridLayout: "triple",
        purposeFilter: ["preferences", "statistics", "marketing", "performance", "security"],
        hideRejectButton: false // Make customize button smaller/less obvious
    },
    {
        id: 8,
        title: "Essential Services Configuration",
        description: "These partners provide essential functionality. Please review carefully.",
        tabs: [{ id: "consent", label: "Consent", type: "consent", content: "companies_detailed" }],
        buttons: [
            { text: "Save and Continue", style: "primary", acceptsAll: false }, // Trick: this is actually the right choice
            { text: "Accept Recommended", style: "secondary", acceptsAll: true }
        ],
        displayMode: "per_company",
        defaultChecked: true,
        requireScroll: true,
        maxHeight: "400px",
        companyFilter: ["fraud_detection", "payment_processor", "content_delivery", "chat_widget", "video_service", "hjeatmap", "ian", "ad_exchange"]
    },
    {
        id: 9,
        title: "Privacy Experience Optimization",
        description: "Help us improve your experience by sharing preferences below.",
        tabs: [
            { id: "consent", label: "Essential", type: "consent", content: "purposes" },
            { id: "legitimate", label: "Experience Enhancement", type: "legitimate_interest", content: "purposes" }
        ],
        buttons: [
            { text: "Decline Enhanced Experience", style: "secondary", acceptsAll: false }, // Right choice has discouraging language
            { text: "Enable Full Experience", style: "primary", acceptsAll: true }
        ],
        displayMode: "detailed",
        defaultChecked: false,
        legitimateInterestDefaultChecked: true,
        gridLayout: "double",
        confusingLanguage: true
    },
    {
        id: 10,
        title: "Partnership Network Consent",
        description: "Our partners help us provide you with personalized content and services.",
        tabs: [{ id: "consent", label: "Consent", type: "consent", content: "companies_detailed" }],
        buttons: [
            { text: "Accept Essential Partners", style: "primary", acceptsAll: true },
            { text: "Review Each Partner", style: "secondary", acceptsAll: false }
        ],
        displayMode: "per_company",
        defaultChecked: true,
        requireScroll: true,
        maxHeight: "350px",
        companyFilter: Array.from({length: 20}, (_, i) => i < 5 ? ["intersussy", "goofy_analytics", "goofy_advertising", "social_media", "video_service"][i] : `generated_${i - 4}`)
    },

    // COGNITIVE OVERLOAD PHASE (11-15)
    {
        id: 11,
        title: "Data Processing Preferences",
        description: "Configure how your personal information is processed by our systems and partners.",
        tabs: [
            { id: "consent", label: "Data Consent", type: "consent", content: "purposes" },
            { id: "legitimate", label: "Legitimate Processing", type: "legitimate_interest", content: "purposes" }
        ],
        buttons: [
            { text: "Opt out of data enhancement", style: "secondary", acceptsAll: false }, // Confusing double-negative
            { text: "Enable personalized experience", style: "primary", acceptsAll: true }
        ],
        displayMode: "detailed",
        defaultChecked: true,
        legitimateInterestDefaultChecked: true,
        gridLayout: "triple",
        purposeFilter: ["preferences", "statistics", "marketing", "performance", "security", "profiling"],
        confusingLanguage: true
    },
    {
        id: 12,
        title: "Advanced Data Sharing Configuration",
        description: "Comprehensive settings for data sharing with our extensive partner ecosystem.",
        tabs: [
            { id: "consent", label: "Explicit Consent", type: "consent", content: "purposes" },
            { id: "legitimate", label: "Legitimate Interests", type: "legitimate_interest", content: "purposes" }
        ],
        buttons: [
            { text: "Disable advanced features", style: "secondary", acceptsAll: false },
            { text: "Enable all features", style: "primary", acceptsAll: true }
        ],
        displayMode: "detailed",
        defaultChecked: false,
        legitimateInterestDefaultChecked: true,
        gridLayout: "triple",
        purposeFilter: ["preferences", "statistics", "marketing", "performance", "security", "profiling", "location_tracking", "biometric_data"],
        confusingLanguage: true
    },
    {
        id: 13,
        title: "Expanded Partner Network Settings",
        description: "Our growing network of 25+ partners helps deliver enhanced services tailored to you.",
        tabs: [
            { id: "consent", label: "Direct Consent", type: "consent", content: "companies_detailed" },
            { id: "legitimate", label: "Business Interests", type: "legitimate_interest", content: "companies_detailed" }
        ],
        buttons: [
            { text: "Object to partner data sharing", style: "secondary", acceptsAll: false },
            { text: "Allow partner optimization", style: "primary", acceptsAll: true }
        ],
        displayMode: "per_company",
        defaultChecked: true,
        legitimateInterestDefaultChecked: true,
        requireScroll: true,
        maxHeight: "400px",
        confusingLanguage: true
    },
    {
        id: 14,
        title: "Intelligent Personalization System",
        description: "Our AI systems analyze your preferences to provide superior personalized experiences across all touchpoints.",
        tabs: [
            { id: "consent", label: "AI Consent", type: "consent", content: "purposes" },
            { id: "legitimate", label: "Smart Processing", type: "legitimate_interest", content: "purposes" }
        ],
        buttons: [
            { text: "Limit intelligent features", style: "secondary", acceptsAll: false },
            { text: "Enable intelligent experience", style: "primary", acceptsAll: true }
        ],
        displayMode: "detailed",
        defaultChecked: true,
        legitimateInterestDefaultChecked: true,
        gridLayout: "triple",
        purposeFilter: ["statistics", "marketing", "profiling", "location_tracking", "biometric_data", "emotional_profiling", "behavioral_manipulation"],
        confusingLanguage: true
    },
    {
        id: 15,
        title: "Premium Experience Activation",
        description: "Unlock the full potential of our platform by enabling advanced personalization and predictive features.",
        tabs: [
            { id: "consent", label: "Premium Consent", type: "consent", content: "purposes" },
            { id: "legitimate", label: "Enhanced Processing", type: "legitimate_interest", content: "purposes" }
        ],
        buttons: [
            { text: "Use basic experience", style: "secondary", acceptsAll: false },
            { text: "Activate premium features", style: "primary", acceptsAll: true }
        ],
        displayMode: "detailed",
        defaultChecked: false,
        legitimateInterestDefaultChecked: true,
        gridLayout: "double",
        purposeFilter: ["marketing", "profiling", "location_tracking", "emotional_profiling", "predictive_analytics", "behavioral_manipulation"],
        confusingLanguage: true,
        timePressure: 30
    },

    // EXPERT DARK PATTERNS (16-20)
    {
        id: 16,
        title: "Support Free Content",
        description: "Help us keep this service free for everyone by supporting our advertising partners.",
        tabs: [{ id: "consent", label: "Support", type: "consent", content: "purposes" }],
        buttons: [
            { text: "Yes, I want to support free content", style: "primary", acceptsAll: true },
            { text: "No, I'd rather pay for premium", style: "secondary", acceptsAll: false }
        ],
        displayMode: "simple",
        defaultChecked: true,
        gridLayout: "single",
        purposeFilter: ["marketing", "profiling", "behavioral_manipulation"],
        confirmShaming: true
    },
    {
        id: 17,
        title: "Privacy Management Console - Step 1 of 3",
        description: "Welcome to our comprehensive privacy management system. Configure your data sharing preferences.",
        tabs: [{ id: "consent", label: "Data Sharing", type: "consent", content: "purposes" }],
        buttons: [
            { text: "Continue to Step 2", style: "primary", acceptsAll: true },
            { text: "Manage Individual Settings", style: "secondary", acceptsAll: false }
        ],
        displayMode: "simple",
        defaultChecked: true,
        gridLayout: "double",
        multiStep: true,
        purposeFilter: ["marketing", "profiling", "location_tracking", "emotional_profiling"]
    },
    {
        id: 18,
        title: "Comprehensive Privacy Dashboard",
        description: "Final step: Review all settings across our complete partner ecosystem and data processing categories.",
        tabs: [
            { id: "consent", label: "All Consent Settings", type: "consent", content: "companies_detailed" },
            { id: "legitimate", label: "All Legitimate Interests", type: "legitimate_interest", content: "companies_detailed" }
        ],
        buttons: [
            { text: "Finalize All Settings", style: "primary", acceptsAll: true },
            { text: "Object to Everything", style: "secondary", acceptsAll: false }
        ],
        displayMode: "per_company",
        defaultChecked: true,
        legitimateInterestDefaultChecked: true,
        requireScroll: true,
        maxHeight: "300px",
        gridLayout: "triple"
    },
    {
        id: 19,
        title: "Ultimate Privacy Control Center",
        description: "Master level: Navigate our complete privacy ecosystem with every available option, category, and partner.",
        tabs: [
            { id: "consent", label: "Complete Consent Matrix", type: "consent", content: "companies_detailed" },
            { id: "legitimate", label: "Full Legitimate Interest Spectrum", type: "legitimate_interest", content: "companies_detailed" }
        ],
        buttons: [
            { text: "Accept Curated Experience", style: "primary", acceptsAll: true },
            { text: "Manually Configure All", style: "secondary", acceptsAll: false }
        ],
        displayMode: "per_company",
        defaultChecked: true,
        legitimateInterestDefaultChecked: true,
        requireScroll: true,
        maxHeight: "250px",
        timePressure: 60,
        confusingLanguage: true
    },
    {
        id: 20,
        title: "🍪 COOKIE MONSTER FINAL BOSS 🍪",
        description: "You've reached the ultimate cookie banner. This represents every dark pattern used by real websites. Good luck!",
        tabs: [
            { id: "consent", label: "🔒 Consent Matrix", type: "consent", content: "companies_detailed" },
            { id: "legitimate", label: "⚡ Legitimate Interests", type: "legitimate_interest", content: "companies_detailed" }
        ],
        buttons: [
            { text: "🚀 ACTIVATE PREMIUM EXPERIENCE", style: "primary", acceptsAll: true },
            { text: "😔 i'll take the basic experience", style: "secondary", acceptsAll: false }
        ],
        displayMode: "per_company",
        defaultChecked: true,
        legitimateInterestDefaultChecked: true,
        requireScroll: true,
        maxHeight: "200px",
        timePressure: 45,
        confusingLanguage: true,
        confirmShaming: true
    }
];

export const REQUIRED_PURPOSES = PURPOSES.filter(purpose => purpose.required).map(purpose => purpose.id);