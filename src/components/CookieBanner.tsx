import { useState, useEffect } from 'preact/hooks';
import { JSX } from 'preact';
import type { ILevelConfig, ICompanyWithPurpose, IPurpose, IButtonConfig } from '../types/GameTypes';
import { COMPANIES_WITH_PURPOSE, PURPOSES, REQUIRED_PURPOSES } from '../data/GameData';

interface ICookieBannerProps {
    levelConfig: ILevelConfig;
    onSuccess: () => void;
    onFailure: () => void;
}

interface IChoices {
    [key: string]: boolean | { [key: string]: boolean };
}

export default function CookieBanner({ levelConfig, onSuccess, onFailure }: ICookieBannerProps): JSX.Element {
    const [activeTab, setActiveTab] = useState(levelConfig.tabs[0]?.id || 'consent');
    const [consentChoices, setConsentChoices] = useState<IChoices>({});
    const [legitimateChoices, setLegitimateChoices] = useState<IChoices>({});

    // Reset tab and initialize choices when level config changes
    useEffect(() => {
        setActiveTab(levelConfig.tabs[0]?.id || 'consent');
        initializeChoices();
    }, [levelConfig]);

    const initializeChoices = () => {
        const initialConsent: IChoices = {};
        const initialLegitimate: IChoices = {};

        if (levelConfig.displayMode === 'per_company') {
            // Initialize company-based choices
            COMPANIES_WITH_PURPOSE.forEach(company => {
                if (!levelConfig.companyFilter || levelConfig.companyFilter.includes(company.id)) {
                    initialConsent[company.id] = {};
                    initialLegitimate[company.id] = {};
                    
                    company.cookies.forEach(cookie => {
                        (initialConsent[company.id] as {[key: string]: boolean})[cookie.id] = levelConfig.defaultChecked;
                        (initialLegitimate[company.id] as {[key: string]: boolean})[cookie.id] = levelConfig.defaultChecked;
                    });
                }
            });
        } else {
            // Initialize purpose-based choices
            const filteredPurposes = getFilteredPurposes();
            filteredPurposes.forEach(purpose => {
                initialConsent[purpose.id] = levelConfig.defaultChecked;
                initialLegitimate[purpose.id] = levelConfig.legitimateInterestDefaultChecked ?? levelConfig.defaultChecked;
            });
        }

        setConsentChoices(initialConsent);
        setLegitimateChoices(initialLegitimate);
    };

    const getFilteredPurposes = (): IPurpose[] => {
        if (levelConfig.purposeFilter) {
            return PURPOSES.filter(p => levelConfig.purposeFilter!.includes(p.id));
        }
        return PURPOSES;
    };

    const getFilteredCompanies = (): ICompanyWithPurpose[] => {
        if (levelConfig.companyFilter) {
            return COMPANIES_WITH_PURPOSE.filter(c => levelConfig.companyFilter!.includes(c.id));
        }
        return COMPANIES_WITH_PURPOSE;
    };

    const validateChoices = (acceptAll: boolean): boolean => {
        if (acceptAll) return false; // Always fail if accepting all

        if (levelConfig.displayMode === 'per_company') {
            return validateCompanyChoices();
        } else {
            return validatePurposeChoices();
        }
    };

    const validatePurposeChoices = (): boolean => {
        const currentChoices = activeTab === 'consent' ? consentChoices : legitimateChoices;
        const filteredPurposes = getFilteredPurposes();
        
        // Only validate choices for purposes that are actually displayed
        for (const purpose of filteredPurposes) {
            if (levelConfig.showOnlyRequired && !purpose.required) continue;
            if (!purpose.alwaysShow && levelConfig.displayMode === 'simple') continue;
            
            if (currentChoices[purpose.id]) {
                if (!REQUIRED_PURPOSES.includes(purpose.id)) {
                    return false; // Failed - accepted non-required purpose
                }
            }
        }
        return true;
    };

    const validateCompanyChoices = (): boolean => {
        const currentChoices = activeTab === 'consent' ? consentChoices : legitimateChoices;
        
        for (const companyId in currentChoices) {
            const companyChoices = currentChoices[companyId] as { [key: string]: boolean };
            
            for (const cookieId in companyChoices) {
                if (companyChoices[cookieId]) {
                    const company = COMPANIES_WITH_PURPOSE.find(c => c.id === companyId);
                    const cookie = company?.cookies.find(c => c.id === cookieId);
                    
                    if (cookie && !cookie.purpose.required) {
                        return false; // Failed - accepted non-required cookie
                    }
                }
            }
        }
        return true;
    };

    const handleSubmit = (button: IButtonConfig) => {
        if (button.alwaysPass || validateChoices(button.acceptsAll)) {
            onSuccess();
        } else {
            onFailure();
        }
    };

    const handlePurposeChange = (purposeId: string, checked: boolean, isLegitimate: boolean = false) => {
        const setter = isLegitimate ? setLegitimateChoices : setConsentChoices;
        const currentChoices = isLegitimate ? legitimateChoices : consentChoices;
        
        setter({
            ...currentChoices,
            [purposeId]: checked
        });
    };

    const handleCookieChange = (companyId: string, cookieId: string, checked: boolean, isLegitimate: boolean = false) => {
        const setter = isLegitimate ? setLegitimateChoices : setConsentChoices;
        const currentChoices = isLegitimate ? legitimateChoices : consentChoices;
        
        setter({
            ...currentChoices,
            [companyId]: {
                ...(currentChoices[companyId] as { [key: string]: boolean }),
                [cookieId]: checked
            }
        });
    };

    const renderPurposesContent = (isLegitimate: boolean = false) => {
        const filteredPurposes = getFilteredPurposes();
        const currentChoices = isLegitimate ? legitimateChoices : consentChoices;
        const gridClass = levelConfig.gridLayout === 'triple' ? 'lg:grid-cols-3' : 
                          levelConfig.gridLayout === 'double' ? 'sm:grid-cols-2' : '';

        return (
            <div className={`grid grid-cols-1 ${gridClass} gap-3`}>
                {filteredPurposes.map((purpose) => {
                    if (levelConfig.showOnlyRequired && !purpose.required) return null;
                    if (!purpose.alwaysShow && levelConfig.displayMode === 'simple') return null;

                    const isChecked = currentChoices[purpose.id] as boolean ?? levelConfig.defaultChecked;

                    return (
                        <div className="flex items-center space-x-2" key={purpose.id}>
                            <input 
                                id={`${purpose.id}-${isLegitimate ? 'leg' : 'con'}`}
                                type="checkbox" 
                                disabled={purpose.required} 
                                checked={isChecked}
                                onChange={(e: JSX.TargetedEvent<HTMLInputElement>) => 
                                    handlePurposeChange(purpose.id, (e.target as HTMLInputElement).checked, isLegitimate)
                                }
                                className="w-4 h-4"
                            />
                            <label htmlFor={`${purpose.id}-${isLegitimate ? 'leg' : 'con'}`} className="text-sm sm:text-base">
                                {purpose.name[0]}
                            </label>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderCompaniesContent = (isLegitimate: boolean = false) => {
        const filteredCompanies = getFilteredCompanies();
        const currentChoices = isLegitimate ? legitimateChoices : consentChoices;

        return (
            <div className="space-y-6">
                {filteredCompanies.map((company) => {
                    const companyChoices = (currentChoices[company.id] as { [key: string]: boolean }) || {};
                    
                    return (
                        <div key={company.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                            <div className="font-bold text-base sm:text-lg mb-3">{company.name}</div>
                            <div className="space-y-3">
                                {company.cookies.map((cookie) => {
                                    const isChecked = companyChoices[cookie.id] ?? levelConfig.defaultChecked;

                                    return (
                                        <div className="flex items-start space-x-3" key={cookie.id}>
                                            <input 
                                                id={`${cookie.id}-${isLegitimate ? 'leg' : 'con'}`}
                                                type="checkbox" 
                                                disabled={cookie.purpose.required} 
                                                checked={isChecked}
                                                onChange={(e: JSX.TargetedEvent<HTMLInputElement>) => 
                                                    handleCookieChange(company.id, cookie.id, (e.target as HTMLInputElement).checked, isLegitimate)
                                                }
                                                className="w-4 h-4 mt-1 flex-shrink-0"
                                            />
                                            <div className="flex-1">
                                                <label htmlFor={`${cookie.id}-${isLegitimate ? 'leg' : 'con'}`} className="text-sm sm:text-base font-medium cursor-pointer">
                                                    {cookie.name}
                                                </label>
                                                <p className="text-xs sm:text-sm text-gray-600 mt-1">{cookie.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderTabContent = () => {
        const currentTab = levelConfig.tabs.find(tab => tab.id === activeTab);
        if (!currentTab) return null;

        const isLegitimate = currentTab.type === 'legitimate_interest';

        if (currentTab.content === 'purposes') {
            return renderPurposesContent(isLegitimate);
        } else {
            return renderCompaniesContent(isLegitimate);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-end justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-4xl max-h-full overflow-y-auto">
                <div className="bg-white p-4 select-none rounded-lg max-h-[80vh] overflow-y-auto">
                    <h1 className="text-xl sm:text-2xl font-bold mb-2">{levelConfig.title}</h1>
                    <p className="mb-4 text-sm sm:text-base">{levelConfig.description}</p>
                    
                    {/* Render tabs if more than one */}
                    {levelConfig.tabs.length > 1 && (
                        <div className="mb-4">
                            <div className="flex border-b border-gray-300">
                                {levelConfig.tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-3 px-6 font-medium text-sm relative ${
                                            activeTab === tab.id
                                                ? 'bg-white text-blue-600 border-l border-r border-t border-gray-300 rounded-t-lg -mb-px'
                                                : 'bg-gray-50 text-gray-700 hover:text-gray-900 hover:bg-gray-100 border-b border-gray-300'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                                {/* Fill remaining space with border */}
                                <div className="flex-1 border-b border-gray-300"></div>
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        {renderTabContent()}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                        {levelConfig.buttons.map((button, index) => (
                            <button 
                                key={index}
                                onClick={() => handleSubmit(button)}
                                className={`px-4 py-2 text-sm sm:text-base font-medium flex-1 sm:flex-none ${
                                    button.style === 'primary'
                                        ? 'bg-green-500 hover:bg-green-600 text-white'
                                        : 'bg-transparent text-gray-800 underline'
                                }`}
                            >
                                {button.text}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}