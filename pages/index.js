import Cotter from "cotter";
import { useEffect, useState } from "react";
const cotterApiKeyId = process.env.NEXT_PUBLIC_COTTER_API_KEY_ID;

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Shows the Cotter Login form and sets Access Token when authenticated
    useEffect(() => {
        const cotter = new Cotter(cotterApiKeyId);
        cotter
            .signInWithOTP()
            .showEmailForm()
            .then(payload => {
                localStorage.setItem("ACCESS_TOKEN", payload.oauth_token.access_token);
                setIsLoggedIn(true);
                // TODO: Get User Data
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
                    <h1 style={{textAlign: 'center'}}>Writer Portal</h1>
                    <p>
                        Your assignments will be available here.{' '}
                        <a href="#" onClick={logOut}>Log out</a>.
                    </p>
                </div>
            ) : (
                <div style={{textAlign: 'center'}}>
                    <h1>Writer Portal</h1>
                    <p>Login to view your assignments.</p>
                    <div id="cotter-form-container" style={{ width: 300, height: 200, margin: '1rem auto' }} />
                </div>
            )}
        </main>
    );
}
