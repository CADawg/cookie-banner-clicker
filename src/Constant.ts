interface ICookie {
    id: string;
    name: string;
    description: string;
    https: boolean;
    duration: string;
    purpose_id: string;
}

// extend ICookie with the purpose_id
interface ICookieWithPurpose extends ICookie {
    purpose: IPurpose;
}

interface ICompany {
    id: string;
    name: string;
    cookies: ICookie[];
}

// ICompany with ICookieWithPurpose
interface ICompanyWithPurpose extends ICompany {
    cookies: ICookieWithPurpose[];
}

const COMPANIES: ICompany[] = [
    {id: "intersussy", name: "InterSussy Studios", cookies: [{purpose_id: "marketing", id: "amogus", name: "X-Amogus", description: "Stores whether you have played the hit game Amogus", https: true, duration: "1 decade"}]},
    {id: "goofy_analytics", name: "Goofy Analytics", cookies: [{purpose_id: "statistics", id: "ga-ui", name: "User ID", description: "A persistent ID which tracks the user across the web", https: true, duration: "1 year"}, {purpose_id: "statistics", id: "ga-ua", name: "Goofy Analytics User Agent", description: "The user agent used by Goofy Analytics", https: true, duration: "1 year"}]},
    {id: "goofy_advertising", name: "Goofy Advertising", cookies: [{purpose_id: "goofy_personalisation", id: "ga-ui", name: "User ID", description: "A persistent ID which tracks the user across the web", https: true, duration: "1 year"}, {purpose_id: "marketing", id: "ga-ua", name: "Goofy Advertising User Agent", description: "The user agent used by Goofy Advertising", https: true, duration: "1 year"}]},
    {id: "ian", name: "Integrated Ads Network", cookies: [{purpose_id: "marketing", id: "ian-user", name: "User ID", description: "A persistent ID which tracks the user across the web", https: true, duration: "1 year"}]},
    {id: "hjeatmap", name: "Hjeatmap", cookies: [{purpose_id: "statistics", id: "hjeatmap-id", name: "Session ID", description: "An ID to report user clicks to Hjeatmap", https: true, duration: "Session"}]},
    {id: "configgur", name: "Configgur", cookies: [{purpose_id: "other", id: "configgur-id", name: "Session ID", description: "An ID to identify users for A/B testing of configuration values", https: true, duration: "Session"}]},
    {id: "php_session", name: "PHP Session", cookies: [{purpose_id: "functional", id: "PHPSESSID", name: "Session ID", description: "Remembers User Logins", https: true, duration: "1 month"}]},
];

interface IPurpose {
    id: string;
    name: string[];
    description: string[];
    required: boolean;
    alwaysShow: boolean;
}

const PURPOSES: IPurpose[] = [
    {id: "necessary", name: ["Necessary", "Information Storage and Access"], description: ["Cookies Required for the display and security of the website."], required: true, alwaysShow: true},
    {id: "functional", name: ["Functional"], description: ["Cookies Required for full functioning of the website."], required: true, alwaysShow: false},
    {id: "preferences", name: ["Preferences", "Personalisation"], description: ["Cookies used to store your preferences"], required: false, alwaysShow: true},
    {id: "statistics", name: ["Statistics", "Measurement"], description: ["Cookies used to track visits and visitors to our website"], required: false, alwaysShow: true},
    {id: "goofy_personalisation", name: ["Goofy Personalisation"], description: ["Personalisation by the Goofy Company"], required: false, alwaysShow: false},
    {id: "marketing", name: ["Marketing", "Ad Selection"], description: ["Cookies used to serve you advertisements."], required: false, alwaysShow: true},
    {id: "other", name: ["Other", "Third Party"], description: ["Other cookies"], required: false, alwaysShow: false}
]

// convert cookies to their purpose via their purpose_id
const COMPANIES_WITH_PURPOSE: ICompanyWithPurpose[] = COMPANIES.map(company => {
    // @ts-ignore
    const cookiesWithPurpose: ICookieWithPurpose[] = company.cookies.map(cookie => {
        const purpose = PURPOSES.find(purpose => purpose.id === cookie.purpose_id);
        return {...cookie, purpose};
    }
    );
    return {...company, cookies: cookiesWithPurpose};
});

const PURPOSES_DICTIONARY: {[key: string]: IPurpose} = PURPOSES.reduce((acc, cur) => {
    // @ts-ignore
    acc[cur.id] = cur;
    return acc;
}, {});

console.log(PURPOSES_DICTIONARY)
console.log(COMPANIES_WITH_PURPOSE)

export { COMPANIES, PURPOSES, PURPOSES_DICTIONARY, COMPANIES_WITH_PURPOSE };
export type { ICookie, ICompany, IPurpose };