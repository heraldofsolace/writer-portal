import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {

    // Display the welcome page
    return (
        <div className={styles.container}>
            <Head>
                <title>Draft.dev Writer Portal</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Draft.dev Writer Portal</h1>
                <p>Contact <a href="mailto:editor@draft.dev">editor@draft.dev</a> for access.</p>
            </main>
        </div>
    )
}
