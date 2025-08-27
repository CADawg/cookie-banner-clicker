import {COMPANIES_WITH_PURPOSE} from "./Constant";
import {PURPOSES} from "./Constant";
import {useState} from "preact/hooks";
import { JSX } from 'preact';

// define level props
interface ILevelProps {
    level: number;
    setLevel: (level: number) => void;
    setFailed: (failed: boolean) => void;
}

function GameLevel(props: ILevelProps): JSX.Element | null {
    switch(props.level) {
        case 1:
            return <Level1 {...props} />;
        case 2:
            return <Level2 {...props} />;
        case 3:
            return <Level3 {...props} />;
        case 4:
            props.setFailed(true);
            return null;
        default:
            return null;
    }
}

function LevelOverlay(props: {children: JSX.Element | null, opacity?: number}) {
    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-end justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-4xl max-h-full overflow-y-auto">
                {props.children}
            </div>
        </div>
    );
}

// array of purpose_ids that are required (generated from PURPOSES)
const REQUIRED_PURPOSES = PURPOSES.filter(purpose => purpose.required).map(purpose => purpose.id);

function isDeclinedAllOptional(acceptAll: boolean, choices: {[id: string] : boolean}, nextLevel: () => void, failed: () => void) {
    let valid = true;
    if (acceptAll) valid = false;

    for (let k in choices) {
        if (choices[k]) {
            // check if k is NOT in REQUIRED_PURPOSES
            if (!REQUIRED_PURPOSES.includes(k)) {
                valid = false;
            }
        }
    }

    if (valid) {
        nextLevel();
    } else {
        failed();
    }

    return valid;
}

function Level1(props: ILevelProps): JSX.Element {
    const [checked, setChecked] = useState<any>({});

    function failed() {
        props.setFailed(true);
    }

    function nextLevel() {
        props.setLevel(2);
    }

    return <LevelOverlay>
        <div className="bg-white p-4 select-none rounded-t-lg">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">We Care about your privacy</h1>
            <p className="mb-4 text-sm sm:text-base">Here at giant mega corp inc, we really care about your privacy, so here we are giving you choices. (Totally not because we're forced to)</p>
            <div className="border border-black">
                <div className="flex flex-col sm:flex-row p-4 gap-4">
                    <div className="flex-1 space-y-3">
                        {PURPOSES.map((purpose, index) => {
                            if (checked[purpose.id] === undefined && purpose.alwaysShow) setChecked({...checked, [purpose.id]: true});
                            return purpose.alwaysShow ? <div className="flex items-center space-x-2" key={index}>
                                <input 
                                    id={purpose.id} 
                                    type="checkbox" 
                                    disabled={purpose.required} 
                                    checked={checked[purpose.id]} 
                                    onChange={(e: JSX.TargetedEvent<HTMLInputElement>) => setChecked({...checked, [purpose.id]: (e.target as HTMLInputElement).checked})}
                                    className="w-4 h-4"
                                />
                                <label htmlFor={purpose.id} className="text-sm sm:text-base">{purpose.name[0]}</label>
                            </div> : null
                        })}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:ml-4">
                        <button 
                            onClick={() => isDeclinedAllOptional(true, checked, nextLevel, failed)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm sm:text-base font-medium"
                        >
                            Accept All Cookies
                        </button>
                        <button 
                            onClick={() => isDeclinedAllOptional(false, checked, nextLevel, failed)}
                            className="bg-transparent text-gray-800 underline px-4 py-2 text-sm sm:text-base"
                        >
                            Accept Selected
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </LevelOverlay>;
}

function Level2(props: ILevelProps): JSX.Element {
    const [checked, setChecked] = useState<any>({});

    function failed() {
        props.setFailed(true);
    }

    function nextLevel() {
        props.setLevel(3);
    }

    return <LevelOverlay>
        <div className="bg-white p-4 select-none rounded-t-lg">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">We Care about your privacy</h1>
            <p className="mb-4 text-sm sm:text-base">Here at giant mega corp inc, we really care about your privacy, so here we are giving you choices. (Totally not because we're forced to)</p>
            <div className="border border-black">
                <div className="flex flex-col sm:flex-row p-4 gap-4">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {PURPOSES.map((purpose, index) => {
                            if (checked[purpose.id] === undefined) setChecked({...checked, [purpose.id]: true});
                            return <div className="flex items-center space-x-2" key={index}>
                                <input 
                                    id={purpose.id} 
                                    type="checkbox" 
                                    disabled={purpose.required} 
                                    checked={checked[purpose.id]} 
                                    onChange={(e: JSX.TargetedEvent<HTMLInputElement>) => setChecked({...checked, [purpose.id]: (e.target as HTMLInputElement).checked})}
                                    className="w-4 h-4"
                                />
                                <label htmlFor={purpose.id} className="text-sm sm:text-base">{purpose.name[0]}</label>
                            </div>
                        })}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:ml-4">
                        <button 
                            onClick={() => isDeclinedAllOptional(true, checked, nextLevel, failed)}
                            className="bg-transparent text-gray-800 underline px-4 py-2 text-sm sm:text-base"
                        >
                            Accept All Cookies
                        </button>
                        <button 
                            onClick={() => isDeclinedAllOptional(false, checked, nextLevel, failed)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm sm:text-base font-medium"
                        >
                            Accept Selected
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </LevelOverlay>;
}

// Check acceptall, if true, then accept all, if false, then accept selected
// Choices:
// Loop through companies
// loop through cookies
// with cookie, look up purpose of that cookie
// if cookie is required, check if cookie is accepted
// if so, fail
// else continue loop
function isDeclinedAllOptionalCompaniesWithPurpose(acceptAll: boolean, choices: {[company: string] : {[cookieId: string] : boolean}}, nextLevel: () => void, failed: () => void) {
    let valid = true;
    if (acceptAll) valid = false;

    for (let company in choices) {
        for (let cookieId in choices[company]) {
            if (choices[company][cookieId]) {
                // find company by id in COMPANIES_WITH_PURPOSE
                let companyWithPurpose = COMPANIES_WITH_PURPOSE.find(e => e.id === company);

                // find cookie inside companyWithPurpose by cookieId
                let cookie = companyWithPurpose!.cookies.find(cookie => cookie.id === cookieId);


                if (!cookie!.purpose.required) {
                    valid = false;
                }
            }
        }
    }

    if (valid) {
        //console.log("valid", choices)
        nextLevel();
    } else {
        //console.log("failed", choices)
        failed();
    }

    return valid;
}

function Level3(props: ILevelProps): JSX.Element {
    const [checked, setChecked] = useState<any>({});

    function failed() {
        props.setFailed(true);
    }

    function nextLevel() {
        props.setLevel(4);
    }

    return <LevelOverlay>
        <div className="bg-white p-4 select-none rounded-lg max-h-[80vh] overflow-y-auto">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">We Care about your privacy</h1>
            <p className="mb-4 text-sm sm:text-base">Really, we do. Now accept our damn cookies (they're tasty) &gt;:)</p>
            <div className="space-y-6">
                {COMPANIES_WITH_PURPOSE.map((companies) => {
                    if (checked[companies.id] === undefined) checked[companies.id] = {};
                    
                    return (
                        <div key={companies.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                            <div className="font-bold text-base sm:text-lg mb-3">{companies.name}</div>
                            <div className="space-y-3">
                                {companies.cookies.map((cookie) => {
                                    if (checked[companies.id][cookie.id] === undefined) {
                                        setChecked({...checked, [companies.id]: {...checked[companies.id], [cookie.id]: true}});
                                    }

                                    return <div className="flex items-start space-x-3" key={cookie.id}>
                                        <input 
                                            id={cookie.id} 
                                            type="checkbox" 
                                            disabled={cookie.purpose.required} 
                                            checked={checked[companies.id][cookie.id]} 
                                            onChange={(e: JSX.TargetedEvent<HTMLInputElement>) => setChecked({...checked, [companies.id]: {...checked[companies.id], [cookie.id]: (e.target as HTMLInputElement).checked}})}
                                            className="w-4 h-4 mt-1 flex-shrink-0"
                                        />
                                        <div className="flex-1">
                                            <label htmlFor={cookie.id} className="text-sm sm:text-base font-medium cursor-pointer">{cookie.name}</label>
                                            <p className="text-xs sm:text-sm text-gray-600 mt-1">{cookie.description}</p>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    );
                })}
                
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <button 
                        onClick={() => isDeclinedAllOptionalCompaniesWithPurpose(true, checked, nextLevel, failed)}
                        className="bg-transparent text-gray-800 underline px-4 py-2 text-sm sm:text-base flex-1 sm:flex-none"
                    >
                        Accept All Cookies
                    </button>
                    <button 
                        onClick={() => isDeclinedAllOptionalCompaniesWithPurpose(false, checked, nextLevel, failed)}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 text-sm sm:text-base font-medium flex-1 sm:flex-none"
                    >
                        Accept Selected
                    </button>
                </div>
            </div>
        </div>
    </LevelOverlay>;
}

export default GameLevel;