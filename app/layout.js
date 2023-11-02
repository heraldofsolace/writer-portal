import { ClerkProvider } from "@clerk/nextjs";
import "./styles/global.css";
import ErrorBoundary from "../components/error-boundary";
import Sidebar from "../components/sidebar";
import React from "react";
import { AxiomWebVitals } from "next-axiom";
import { Header } from "../components/header";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <AxiomWebVitals />
        <body>
          <div className="flex flex-col h-screen">
            <Header />
            <Sidebar>
              <ErrorBoundary>{children}</ErrorBoundary>
            </Sidebar>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
