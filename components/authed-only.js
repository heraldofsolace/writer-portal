import Cotter from "cotter";
import {useEffect, useState} from "react";
import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

const cotterApiKeyId = process.env.NEXT_PUBLIC_COTTER_API_KEY_ID;

export default function AuthedOnly({children}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Shows the Cotter Login form and sets Access Token when authenticated
    useEffect(() => {
        const cotter = new Cotter({ApiKeyID: cotterApiKeyId, ContainerID: "cotter-form-container-form_default"});
        cotter
            .withFormID("form_default")
            .signInWithOTP()
            .showEmailForm()
            .then(payload => {
                localStorage.setItem("ACCESS_TOKEN", payload.oauth_token.access_token);
                setIsLoggedIn(true);
                window.location.reload(false);
            })
            .catch((err) => console.log(err));
    }, []);

    // Sets local isLoggedIn variable
    useEffect(() => {
        if (localStorage.getItem("ACCESS_TOKEN") !== null) {
            setIsLoggedIn(true);
        }
    }, []);

    // Deletes Access Token and logs user out
    const logOut = () => {
        localStorage.removeItem("ACCESS_TOKEN");
        setIsLoggedIn(false);
        window.location.reload();
    };

    // Display the login page
    return (
        <main>
            {isLoggedIn ? (
                <div>
                    {children}
                    <p><a href="#" onClick={logOut}>Log out</a></p>
                </div>
            ) : (
                <div style={{textAlign: 'center'}}>
                    <h1>Writer Portal</h1>
                    <p>This portal is exclusively for <a href="https://draft.dev/">Draft.dev</a> writers.</p>
                    <p>Log in to view your assignments.</p>
                    <div id="cotter-form-container-form_default" style={{width: 300, height: 200, margin: '1rem auto'}}></div>
                </div>
            )}
        </main>
    );
}
