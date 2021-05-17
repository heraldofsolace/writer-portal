import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../../styles/Home.module.css';
import { useEffect, useState } from "react";

export default function Assignment() {
    const router = useRouter()
    const { assignmentId } = router.query
    console.log(assignmentId);
    const [assignment, setAssignment] = useState(null);

    // Gets this client's projects when they're logged in
    const getAssignment = async () => {
        const resp = await fetch(`/api/assignments/${assignmentId}`);
        setAssignment(await resp.json());
    };

    // Get data from the API
    useEffect(() => {
        if (router.isReady) {
            getAssignment();
        }
    }, [router.isReady]);

    // Display the client portal page
    return (
        <div className={styles.container}>
            <Head>
                <title>Client Portal</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Welcome to Your Client Portal</h1>
                <div>
                    {assignment ? (
                        <div className={styles.card} key={assignment.id}>
                            <h3>{assignment.title}</h3>
                        </div>
                    ) : (<p>You currently have no projects attached to this account.</p>)}
                </div>
            </main>
        </div>
    )
}
