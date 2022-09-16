import "purecss";
import "../styles/globals.css";
import Layout from "../components/layout";
import LogRocket from "logrocket";
import { ClerkProvider } from "@clerk/nextjs";
import { HiMenu } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import AuthedOnly from "../components/authed-only";
import Sidebar from "../components/sidebar";
import { Header } from "../components/header";

LogRocket.init("cm06dj/writer-portal");
const publicPages = ["/writers/[writerId]"];
function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const isPublicPage = publicPages.includes(router.pathname);
  return (
    <ClerkProvider {...pageProps}>
      <Layout>
        {isPublicPage ? (
          <Component {...pageProps} />
        ) : (
          <AuthedOnly>
            <div className="flex flex-col h-screen">
              <Header />
              <Sidebar>
                <Component {...pageProps} />
              </Sidebar>
            </div>{" "}
          </AuthedOnly>
        )}
      </Layout>
    </ClerkProvider>
  );
}

export default MyApp;
