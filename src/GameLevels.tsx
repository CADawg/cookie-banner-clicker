import {COMPANIES_WITH_PURPOSE} from "./Constant";
import {PURPOSES} from "./Constant";
import {useState} from "react";

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
    let opacity = props.opacity ? props.opacity : 70;

    return (
        <div className={"olay-" + opacity}>
            {props.children}
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
        <div className={"bottom-panel"}>
            <h1>We Care about your privacy</h1>
            <p>Here at giant mega corp inc, we really care about your privacy, so here we are giving you choices. (Totally not because we're forced to)</p>
            <div className={"choices"}>
                {PURPOSES.map((purpose, index) => {
                    if (checked[purpose.id] === undefined && purpose.alwaysShow) setChecked({...checked, [purpose.id]: true});
                    return purpose.alwaysShow ? <div className={"choice"} key={index}>
                        <input id={purpose.id} type={"checkbox"} disabled={purpose.required} checked={checked[purpose.id]} onChange={e => setChecked({...checked, [purpose.id]: e.target.checked})} />
                        <label htmlFor={purpose.id}>{purpose.name[0]}</label>
                    </div> : null
                })}
                <div className={"spacer"}></div>
                <div className={"choices-buttons"}>
                    <button onClick={() => isDeclinedAllOptional(true, checked, nextLevel, failed)}>Accept All Cookies</button>
                    <button className={"grey"} onClick={() => isDeclinedAllOptional(false, checked, nextLevel, failed)}>Accept Selected</button>
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
        <div className={"bottom-panel"}>
            <h1>We Care about your privacy</h1>
            <p>Here at giant mega corp inc, we really care about your privacy, so here we are giving you choices. (Totally not because we're forced to)</p>
            <div className={"choices"}>
                {PURPOSES.map((purpose, index) => {
                    if (checked[purpose.id] === undefined) setChecked({...checked, [purpose.id]: true});
                    return <div className={"choice"} key={index}>
                        <input id={purpose.id} type={"checkbox"} disabled={purpose.required} checked={checked[purpose.id]} onChange={e => setChecked({...checked, [purpose.id]: e.target.checked})} />
                        <label htmlFor={purpose.id}>{purpose.name[0]}</label>
                    </div>
                })}
                <div className={"spacer"}></div>
                <div className={"choices-buttons"}>
                    <button className={"grey"} onClick={() => isDeclinedAllOptional(true, checked, nextLevel, failed)}>Accept All Cookies</button>
                    <button onClick={() => isDeclinedAllOptional(false, checked, nextLevel, failed)}>Accept Selected</button>
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
        <div className={"middle-panel"}>
            <h1>We Care about your privacy</h1>
            <p className={"header-text"}>Really, we do. Now accept our damn cookies (they're tasty) &gt;:)</p>
            <div className={"choices"}>
                {COMPANIES_WITH_PURPOSE.map((companies) => {
                    let html = [<div className={"company"} key={companies.id}><p>{companies.name}</p></div>]
                    if (checked[companies.id] === undefined) checked[companies.id] = {};


                    html = [...html, ...(companies.cookies.map((cookie) => {
                        // if checked[company.id][cookie.id] is undefined, set it to true
                        if (checked[companies.id][cookie.id] === undefined) setChecked({...checked, [companies.id]: {...checked[companies.id], [cookie.id]: true}});

                        return <div className={"choice"} key={cookie.id}>
                            <input id={cookie.id} type={"checkbox"} disabled={cookie.purpose.required} checked={checked[companies.id][cookie.id]} onChange={e => setChecked({...checked, [companies.id]: {...checked[companies.id], [cookie.id]: e.target.checked}})} />
                            <label htmlFor={cookie.id}>{cookie.name}</label>
                            <p className={"description"}>{cookie.description}</p>
                        </div>
                    }))];

                    return html;
                })}
                <div className={"spacer"}></div>
                <div className={"choices-buttons"}>
                    <button className={"grey"} onClick={() => isDeclinedAllOptionalCompaniesWithPurpose(true, checked, nextLevel, failed)}>Accept All Cookies</button>
                    <button onClick={() => isDeclinedAllOptionalCompaniesWithPurpose(false, checked, nextLevel, failed)}>Accept Selected</button>
                </div>
            </div>
        </div>
    </LevelOverlay>;
}

export default GameLevel;