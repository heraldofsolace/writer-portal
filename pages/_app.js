import "../styles/globals.css";
import Layout from "../components/layout";
import { ClerkProvider } from "@clerk/nextjs";
import { useRouter } from "next/router";
import React from "react";
import AuthedOnly from "../components/authed-only";
import Sidebar from "../components/sidebar";
import { Header } from "../components/header";
import ErrorBoundary from "../components/error-boundary";
export { reportWebVitals } from "next-axiom";

const publicPages = ["/writers/[writerId]"];
function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const isPublicPage = publicPages.includes(router.pathname);
  return (
    <ClerkProvider {...pageProps}>
      <Layout>
        {isPublicPage ? (
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
        ) : (
          <AuthedOnly>
            <div className="flex flex-col h-screen">
              <Header />
              <Sidebar>
                <ErrorBoundary>
                  <Component {...pageProps} />
                </ErrorBoundary>
              </Sidebar>
            </div>{" "}
          </AuthedOnly>
        )}
      </Layout>
    </ClerkProvider>
  );
}

export default MyApp;
