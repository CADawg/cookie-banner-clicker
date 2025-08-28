export interface ICookie {
    id: string;
    name: string;
    description: string;
    https: boolean;
    duration: string;
    purpose_id: string;
}

export interface ICookieWithPurpose extends ICookie {
    purpose: IPurpose;
}

export interface ICompany {
    id: string;
    name: string;
    cookies: ICookie[];
}

export interface ICompanyWithPurpose extends ICompany {
    cookies: ICookieWithPurpose[];
}

export interface IPurpose {
    id: string;
    name: string[];
    description: string[];
    required: boolean;
    alwaysShow: boolean;
}

export interface IButtonConfig {
    text: string;
    style: 'primary' | 'secondary';
    acceptsAll: boolean;
    alwaysPass?: boolean; // For "Reject All" buttons that should always pass
}

export interface ITabConfig {
    id: string;
    label: string;
    type: 'consent' | 'legitimate_interest';
    content: 'purposes' | 'companies_detailed';
}

export interface ILevelConfig {
    id: number;
    title: string;
    description: string;
    tabs: ITabConfig[];
    buttons: IButtonConfig[];
    displayMode: 'simple' | 'detailed' | 'per_company';
    showOnlyRequired?: boolean;
    showOnlyCategories?: string[];
    defaultChecked: boolean;
    legitimateInterestDefaultChecked?: boolean;
    companyFilter?: string[];
    purposeFilter?: string[];
    flipButtonOrder?: boolean;
    maxVisiblePurposes?: number;
    gridLayout?: 'single' | 'double' | 'triple';
    // Advanced dark pattern options
    confusingLanguage?: boolean;
    hideRejectButton?: boolean;
    requireScroll?: boolean;
    timePressure?: number; // seconds
    confirmShaming?: boolean;
    multiStep?: boolean;
    maxHeight?: string;
}