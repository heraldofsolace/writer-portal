import "purecss";
import "../styles/globals.css";
import Layout from "../components/layout";
import LogRocket from 'logrocket';
LogRocket.init('cm06dj/writer-portal');

function MyApp({ Component, pageProps }) {
  try {
    if (typeof localStorage !== 'undefined' && localStorage && localStorage.getItem("COTTER_USER") !== null) {
      LogRocket.identify(JSON.parse(localStorage.getItem("COTTER_USER")).identifier);
    }
  } catch (e) {
    console.error(e);
  }
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
