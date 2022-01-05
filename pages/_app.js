import "purecss";
import "../styles/globals.css";
import Layout from "../components/layout";
import LogRocket from 'logrocket';
import { ClerkProvider } from '@clerk/nextjs';

LogRocket.init('cm06dj/writer-portal');

function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ClerkProvider>
  );
}

export default MyApp;
