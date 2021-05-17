import Head from 'next/head'
import styles from '../styles/Home.module.css'
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
            .catch(err => console.log(err));
    }, []);

    // Sets local isLoggedIn variable
    useEffect(() => {
        if (localStorage.getItem("ACCESS_TOKEN") != null) {
            setIsLoggedIn(true);
        }
    }, []);

    // Deletes Access Token and logs user out
    const logOut = () => {
        localStorage.removeItem("ACCESS_TOKEN");
        setIsLoggedIn(false);
    };

    // Display the login page
    return (
        <div className={styles.container}>
            <Head>
                <title>Draft.dev Writer Portal</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Draft.dev Writer Portal</h1>
                <div id="cotter-form-container" style={{ width: 300, height: 200 }} />
            </main>
        </div>
    )
}
